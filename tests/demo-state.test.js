import test from 'node:test';
import assert from 'node:assert/strict';
import { createDemoState, demoReducer, validateOffer } from '../app/demo-state.js';
import { demoOffer } from '../app/mock-data.js';

const send = (state, type, extra = {}) => demoReducer(state, { type, ...extra });
const route = { from: 'palmesus', to: 'vagsbygd' };
const emma = (state) => state.rides.find((ride) => ride.id === 'emma');

test('reviewing or abandoning a seat does not reserve it; confirming twice reserves only once', () => {
  const initial = createDemoState();
  let state = send(initial, 'start-join', { id: 'emma' });
  assert.equal(emma(state).seats, 3);
  state = send(state, 'close-flow');
  assert.equal(emma(state).joined, undefined);
  state = send(state, 'start-join', { id: 'emma' });
  state = send(state, 'confirm');
  assert.equal(emma(state).seats, 2);
  assert.equal(emma(state).joined, true);
  assert.equal(state.flow.step, 'success');
  assert.equal(emma(state).reference, 'CT-1001');
  assert.equal(send(state, 'confirm'), state);
  assert.equal(send(state, 'start-join', { id: 'emma' }), state);
  assert.equal(emma(initial).seats, 3);
});

test('full and own rides cannot be joined, including availability changes during review', () => {
  const initial = createDemoState();
  const full = { ...initial, rides: initial.rides.map((ride) => ({ ...ride, seats: 0 })) };
  assert.equal(send(full, 'start-join', { id: 'emma' }), full);
  const own = { ...initial, rides: [...initial.rides, { ...demoOffer, ...route }] };
  assert.equal(send(own, 'start-join', { id: 'own-offer' }), own);
  const review = send(initial, 'start-join', { id: 'emma' });
  const noLongerAvailable = { ...review, rides: full.rides };
  assert.equal(send(noLongerAvailable, 'confirm'), noLongerAvailable);
});

test('cancellation restores exactly one seat and allows joining again', () => {
  let state = send(send(createDemoState(), 'start-join', { id: 'emma' }), 'confirm');
  state = send(state, 'start-cancel', { id: 'emma' });
  assert.equal(emma(state).seats, 2);
  state = send(state, 'confirm');
  assert.equal(emma(state).seats, 3);
  assert.equal(emma(state).joined, false);
  assert.equal(send(state, 'confirm'), state);
  assert.equal(send(state, 'start-cancel', { id: 'emma' }), state);
  state = send(send(state, 'start-join', { id: 'emma' }), 'confirm');
  assert.equal(emma(state).seats, 2);
  assert.equal(emma(state).reference, 'CT-1003');
});

test('invalid offer stays in the form and cannot be published', () => {
  let state = send(createDemoState(), 'start-offer', { route });
  state = send(state, 'update-offer', { changes: { to: route.from, price: 0, seats: 5, departure: '' } });
  state = send(state, 'review-offer');
  assert.equal(state.flow.step, 'edit');
  assert.deepEqual(Object.keys(state.flow.errors).sort(), ['departure', 'price', 'route', 'seats']);
  assert.equal(send(state, 'confirm'), state);
  for (const changes of [{ price: 1.5 }, { price: 501 }, { seats: 1.5 }, { departure: '24:00' }]) {
    assert.notDeepEqual(validateOffer({ ...demoOffer, ...route, ...changes }), {});
  }
});

test('offering retains edits, publishes once, and can be withdrawn and replaced', () => {
  let state = send(createDemoState(), 'start-offer', { route });
  state = send(state, 'update-offer', { changes: { departure: '22:15', seats: '4', price: '85' } });
  state = send(state, 'review-offer');
  assert.equal(state.rides.length, 3);
  state = send(state, 'edit-offer');
  assert.equal(state.flow.draft.price, '85');
  state = send(send(state, 'review-offer'), 'confirm');
  assert.equal(state.rides.length, 4);
  assert.equal(state.rides[3].price, 85);
  assert.equal(state.rides[3].seats, 4);
  assert.equal(send(state, 'confirm'), state);
  assert.equal(send(state, 'start-offer', { route }), state);
  state = send(send(state, 'start-withdraw', { id: 'own-offer' }), 'confirm');
  assert.equal(state.rides.length, 3);
  assert.equal(send(state, 'start-offer', { route }).flow.step, 'edit');
});

test('reset returns fresh fixtures without altering the original seed data', () => {
  let state = send(send(createDemoState(), 'start-join', { id: 'emma' }), 'confirm');
  state = send(state, 'reset');
  assert.deepEqual(state, createDemoState());
  assert.equal(emma(state).seats, 3);
});
