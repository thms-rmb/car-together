import { demoOffer, demoUser, locations, seededRides } from './mock-data.js';

export const createDemoState = () => ({
  rides: seededRides.map((ride) => ({ ...ride })),
  flow: null,
  nextReference: 1001,
});

export function validateOffer(draft) {
  const errors = {};
  const validLocations = [draft.from, draft.to].every((id) => locations.some((location) => location.id === id));
  if (!validLocations || draft.from === draft.to) errors.route = 'Velg ulike steder for avreise og ankomst.';
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(draft.departure)) errors.departure = 'Velg et gyldig klokkeslett.';
  if (!Number.isInteger(Number(draft.seats)) || Number(draft.seats) < 1 || Number(draft.seats) > 4) errors.seats = 'Velg mellom 1 og 4 ledige seter.';
  if (!Number.isInteger(Number(draft.price)) || Number(draft.price) < 1 || Number(draft.price) > 500) errors.price = 'Velg en pris fra 1 til 500 kr.';
  return errors;
}

export function demoReducer(state, action) {
  const ride = state.rides.find((item) => item.id === action.id);
  switch (action.type) {
    case 'start-join':
      if (!ride || ride.joined || ride.seats < 1 || ride.driverId === demoUser.id) return state;
      return { ...state, flow: { kind: 'join', step: 'review', ride } };
    case 'start-offer':
      if (state.rides.some((item) => item.driverId === demoUser.id)) return state;
      return { ...state, flow: { kind: 'offer', step: 'edit', draft: { ...demoOffer, ...action.route }, errors: {} } };
    case 'update-offer':
      if (state.flow?.kind !== 'offer' || state.flow.step !== 'edit') return state;
      return { ...state, flow: { ...state.flow, draft: { ...state.flow.draft, ...action.changes }, errors: {} } };
    case 'review-offer': {
      if (state.flow?.kind !== 'offer' || state.flow.step !== 'edit') return state;
      const errors = validateOffer(state.flow.draft);
      return { ...state, flow: { ...state.flow, errors, step: Object.keys(errors).length ? 'edit' : 'review' } };
    }
    case 'edit-offer':
      if (state.flow?.kind !== 'offer' || state.flow.step !== 'review') return state;
      return { ...state, flow: { ...state.flow, step: 'edit' } };
    case 'start-cancel':
    case 'start-withdraw': {
      const own = ride?.driverId === demoUser.id;
      if (!ride || (action.type === 'start-cancel' ? !ride.joined || own : !own)) return state;
      return { ...state, flow: { kind: action.type === 'start-cancel' ? 'cancel' : 'withdraw', step: 'review', ride } };
    }
    case 'confirm': {
      const flow = state.flow;
      if (flow?.step !== 'review') return state;
      const reference = `CT-${state.nextReference}`;
      let rides = state.rides;
      let confirmedRide;
      if (flow.kind === 'offer') {
        if (Object.keys(validateOffer(flow.draft)).length || rides.some((item) => item.driverId === demoUser.id)) return state;
        confirmedRide = { ...flow.draft, seats: Number(flow.draft.seats), price: Number(flow.draft.price), reference };
        rides = [...rides, confirmedRide];
      } else {
        const current = rides.find((item) => item.id === flow.ride.id);
        if (!current) return state;
        if (flow.kind === 'join') {
          if (current.joined || current.seats < 1 || current.driverId === demoUser.id) return state;
          confirmedRide = { ...current, joined: true, seats: current.seats - 1, reference };
          rides = rides.map((item) => item.id === current.id ? confirmedRide : item);
        } else if (flow.kind === 'cancel') {
          if (!current.joined || current.driverId === demoUser.id) return state;
          confirmedRide = current;
          rides = rides.map((item) => item.id === current.id ? { ...item, joined: false, seats: item.seats + 1, reference: undefined } : item);
        } else if (flow.kind === 'withdraw') {
          if (current.driverId !== demoUser.id) return state;
          confirmedRide = current;
          rides = rides.filter((item) => item.id !== current.id);
        } else return state;
      }
      return { ...state, rides, nextReference: state.nextReference + 1, flow: { kind: flow.kind, step: 'success', ride: confirmedRide } };
    }
    case 'close-flow':
      return { ...state, flow: null };
    case 'reset':
      return createDemoState();
    default:
      return state;
  }
}
