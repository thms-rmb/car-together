import { createElement as h } from 'react';
import { demoUser, formatPrice, locationName } from '../mock-data.js';
import Icon from './icon.js';
export default function RideCard({ ride, onJoin, onTrips }) {
  const own = ride.driverId === demoUser.id;
  const disabled = own || ride.joined || ride.seats === 0;
  const label = own ? 'Din demotur' : ride.joined ? 'Du er med – kun demo' : ride.seats === 0 ? 'Fullt' : 'Bli med';
  return h('article', { className: 'ride-card' },
    h('div', { className: 'ride-top' }, h('div', { className: `avatar avatar-${ride.id === 'sofie' ? 'purple' : 'green'}`, 'aria-hidden': true }, ride.initials),
      h('div', { className: 'driver-info' }, h('h3', null, ride.name, own && h('span', { className: 'you-tag' }, ' (deg)')), h('span', { className: 'rating' }, h('span', { 'aria-hidden': true }, '★ '), `${ride.rating.toFixed(1)} · Demovurdering`)),
      h('div', { className: 'ride-price' }, h('strong', null, `${formatPrice(ride.price)} kr`), h('span', null, 'per person'))),
    h('p', { className: 'ride-route' }, locationName(ride.from), h(Icon, { name: 'arrow', size: 16 }), locationName(ride.to)),
    h('div', { className: 'ride-bottom' }, h('div', { className: 'ride-meta' }, h('span', null, h(Icon, { name: 'clock', size: 16 }), ride.departure), h('span', null, h(Icon, { name: 'people', size: 16 }), `${ride.seats} ledige seter`)),
      h('button', { className: `button ${ride.joined ? 'joined-button' : 'button-secondary'} join-button`, disabled, onClick: () => onJoin(ride.id) }, ride.joined && h(Icon, { name: 'check', size: 16 }), label)),
    ride.joined && h('button', { className: 'text-button', onClick: onTrips }, 'Se eller avbestill i Mine turer →'));
}
