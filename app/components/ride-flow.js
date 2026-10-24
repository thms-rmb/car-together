import { createElement as h, useEffect, useRef } from 'react';
import { formatPrice, locationName } from '../mock-data.js';
import RouteSelector from './route-selector.js';
import Icon from './icon.js';

const flowCopy = {
  join: { review: 'Ta følge med', success: 'Du er med!', action: 'Bekreft demosete', description: 'Se over turen før du reserverer ett demosete.', next: 'Demosetet ditt ligger i Mine turer. Her kan du se detaljene eller avbestille.' },
  offer: { review: 'Klar til å dele turen?', success: 'Turen din er publisert!', action: 'Publiser demotur', description: 'Se over detaljene. Turen blir synlig i demoens turliste når du bekrefter.', next: 'Demoturen vises på ruten du valgte. Du finner den også i Mine turer.' },
  cancel: { review: 'Avbestille demosetet?', success: 'Demosetet er avbestilt', action: 'Avbestill demosete', description: 'Setet blir ledig igjen når du bekrefter. Du kan bli med på nytt senere.', next: 'Setet er tilgjengelig igjen. Finn en annen tur, eller bli med på den samme på nytt.' },
  withdraw: { review: 'Trekke tilbake demoturen?', success: 'Demoturen er trukket tilbake', action: 'Trekk tilbake demotur', description: 'Turen fjernes fra demoens turliste når du bekrefter.', next: 'Turen er fjernet. Du kan nå tilby en ny demotur.' },
};

export function RideSummary({ ride, kind }) {
  const offer = kind === 'offer' || kind === 'withdraw';
  const details = [
    ['Fra', locationName(ride.from)], ['Til', locationName(ride.to)],
    ['Avgang', `${ride.departure} · fast demotid`], ['Sjåfør', offer ? `${ride.name} (deg)` : ride.name],
    [offer ? 'Ledige seter' : 'Passasjerer', offer ? `${ride.seats} seter` : '1 person · Alex'],
  ];
  return h('section', { className: 'ride-summary', 'aria-label': 'Turdetaljer' },
    h('div', { className: 'summary-heading' }, h(Icon, { name: 'car', size: 23 }), h('h2', null, offer ? 'Din demotur' : `Samkjøring med ${ride.name}`)),
    h('dl', null, details.map(([label, value]) => h('div', { className: 'summary-row', key: label }, h('dt', null, label), h('dd', null, value)))),
    h('div', { className: 'summary-total' }, h('span', null, offer ? 'Pris per passasjer' : 'Din demopris'), h('strong', null, `${formatPrice(Number(ride.price))} kr`)),
    h('p', { className: 'fine-print' }, 'Ingen betaling eller ekte bestilling. Tid og pris er kun eksempler.'));
}

function OfferForm({ flow, dispatch, onClose }) {
  const { draft, errors } = flow;
  const errorsRef = useRef(null);
  useEffect(() => {
    if (Object.keys(errors).length) errorsRef.current?.focus();
  }, [errors]);
  const update = (changes) => dispatch({ type: 'update-offer', changes });
  const field = (id, label, type, extra = {}) => h('label', { className: 'offer-field', htmlFor: id }, h('span', { id: `${id}-label` }, label),
    h('input', { id, name: id, type, value: draft[id], required: true, ...extra, onChange: (event) => update({ [id]: event.target.value }), 'aria-labelledby': `${id}-label`, 'aria-invalid': Boolean(errors[id]), 'aria-describedby': errors[id] ? `${id}-error` : undefined }),
    errors[id] && h('span', { id: `${id}-error`, className: 'validation' }, errors[id]));
  return h('section', { className: 'flow-page' },
    h('button', { className: 'back-button', onClick: onClose }, '← Tilbake til Carpool'),
    h('div', { className: 'flow-layout' }, h('div', { className: 'flow-intro' },
      h('span', { className: 'eyebrow' }, 'TILBY EN DEMOTUR · 1 AV 3'), h('h1', null, 'Plass til flere?'),
      h('p', { className: 'intro-copy' }, 'Velg hvor du skal, når du drar og hva det koster å sitte på. Så ser vi over turen sammen.'),
      h('div', { className: 'flow-note' }, h(Icon, { name: 'info' }), h('p', null, 'Du tilbyr turen som Alex, vår faste demobruker. Alle endringer blir i denne nettleserøkten.'))),
    h('form', { className: 'flow-card offer-form', noValidate: true, onSubmit: (event) => { event.preventDefault(); dispatch({ type: 'review-offer' }); } },
      h('h2', null, 'Fortell om turen'),
      Object.keys(errors).length > 0 && h('p', { className: 'form-errors validation', role: 'alert', tabIndex: -1, ref: errorsRef }, 'Sjekk feltene under før du fortsetter.'),
      h(RouteSelector, { from: draft.from, to: draft.to, onRouteChange: (field, value) => update(field === 'swap' ? { from: draft.to, to: draft.from } : { [field]: value }) }),
      h('div', { className: 'offer-fields' }, field('departure', 'Avgang (demotid)', 'time'), field('seats', 'Ledige seter (1–4)', 'number', { min: 1, max: 4, step: 1 }), field('price', 'Pris per person (kr)', 'number', { min: 1, max: 500, step: 1 })),
      h('p', { className: 'fine-print' }, 'Velg 1–4 seter og 1–500 kr per person. Ingen dato eller betaling i demoen.'),
      h('button', { className: 'button button-primary', type: 'submit' }, 'Se over demoturen', h(Icon, { name: 'arrow', size: 17 })))));
}

export default function RideFlow({ flow, dispatch, onConfirm, onClose, onTrips, onFind }) {
  if (flow.step === 'edit') return h(OfferForm, { flow, dispatch, onClose });
  const copy = flowCopy[flow.kind];
  const success = flow.step === 'success';
  const ride = flow.kind === 'offer' && !success ? flow.draft : flow.ride;
  const isRemoval = flow.kind === 'cancel' || flow.kind === 'withdraw';
  const back = () => flow.kind === 'offer' ? dispatch({ type: 'edit-offer' }) : onClose();
  return h('section', { className: `flow-page${success ? ' flow-success' : ''}` },
    !success && h('button', { className: 'back-button', onClick: back }, flow.kind === 'offer' ? '← Endre turdetaljer' : isRemoval ? '← Behold turen' : '← Tilbake til turene'),
    h('div', { className: 'flow-layout' },
      h('div', { className: 'flow-intro' },
        success && h('div', { className: 'success-icon' }, h(Icon, { name: 'check', size: 32 })),
        h('span', { className: 'eyebrow' }, success ? 'BEKREFTELSE · KUN DEMO' : flow.kind === 'offer' ? 'TILBY EN DEMOTUR · 2 AV 3' : 'SE OVER TUREN'),
        h('h1', null, success ? copy.success : flow.kind === 'join' ? `${copy.review} ${ride.name}?` : copy.review),
        h('p', { className: 'intro-copy' }, success ? copy.next : copy.description),
        success && !isRemoval && h('p', { className: 'confirmation-reference' }, 'Demoreferanse ', h('strong', null, ride.reference)),
        h('div', { className: 'flow-note' }, h(Icon, { name: 'info' }), h('p', null, 'Dette er kun en demo. Ingen sjåfør kontaktes, og ingen penger trekkes.'))),
      h('div', { className: 'flow-card' }, h(RideSummary, { ride, kind: flow.kind }),
        h('div', { className: 'flow-actions' }, success ? h('div', null,
          h('button', { className: 'button button-primary', onClick: onTrips }, 'Se mine turer', h(Icon, { name: 'arrow', size: 17 })),
          h('button', { className: 'button button-secondary', onClick: onFind }, 'Finn en annen tur')) : h('div', null,
          h('button', { className: `button ${isRemoval ? 'button-danger' : 'button-primary'}`, onClick: onConfirm }, copy.action, !isRemoval && h(Icon, { name: 'check', size: 17 })),
          h('button', { className: 'button button-secondary', onClick: back }, flow.kind === 'offer' ? 'Endre turdetaljer' : isRemoval ? 'Behold turen' : 'Avbryt'))))));
}
