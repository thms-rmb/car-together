import { createElement as h } from 'react';
import { demoUser } from '../mock-data.js';
import { RideSummary } from './ride-flow.js';
import Icon from './icon.js';

export default function MyTrips({ rides, onCancel, onWithdraw, onFind }) {
  const trips = rides.filter((ride) => ride.joined || ride.driverId === demoUser.id);
  return h('section', { className: 'my-trips' },
    h('header', { className: 'page-intro' }, h('span', { className: 'eyebrow' }, 'DIN OVERSIKT · KUN DEMO'), h('h1', null, 'Mine turer'),
      h('p', { className: 'intro-copy' }, 'Alle turene du har blitt med på eller tilbudt i denne demoen. Endringene forsvinner når du oppdaterer siden.')),
    trips.length ? h('div', { className: 'my-trips-grid' }, trips.map((ride) => {
      const own = ride.driverId === demoUser.id;
      return h('article', { className: 'flow-card saved-trip', key: ride.id },
        h('div', { className: 'saved-trip-heading' }, h('span', { className: 'trip-status' }, h(Icon, { name: 'check', size: 14 }), own ? 'Du er sjåfør · Demo' : 'Du er med · Demo'), h('span', null, ride.reference)),
        h(RideSummary, { ride, kind: own ? 'offer' : 'join' }),
        h('button', { className: 'button button-secondary', onClick: () => own ? onWithdraw(ride.id) : onCancel(ride.id) }, own ? 'Trekk tilbake demotur' : 'Avbestill demosete'));
    })) : h('div', { className: 'empty-state' }, h(Icon, { name: 'car', size: 36 }), h('h2', null, 'Ingen demoturer ennå'), h('p', null, 'Finn en tur som passer deg, eller tilby et ledig sete. Bekreftede turer dukker opp her.'), h('button', { className: 'button button-primary', onClick: onFind }, 'Finn en demotur', h(Icon, { name: 'arrow', size: 17 }))));
}
