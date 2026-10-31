import { createElement as h } from 'react';
import { goals, team } from '../mock-data.js';
import Icon from './icon.js';
import ellaPhoto from '../../src/image/person1.png';
import amatheaPhoto from '../../src/image/person4.png';
import emmaPhoto from '../../src/image/person2.png';
import sunnivaPhoto from '../../src/image/person5.png';
import luciaPhoto from '../../src/image/person3.png';

const teamPhotos = {
  Ella: ellaPhoto,
  Amathea: amatheaPhoto,
  Emma: emmaPhoto,
  Sunniva: sunnivaPhoto,
  Lucia: luciaPhoto,
};

const conceptPillars = [
  {
    title: 'Hovedfunksjoner', icon: 'car',
    items: [
      'Prissammenligning i sanntid',
      'Samkjøring',
      'Matching ved arrangementer',
      'Brukerprofiler',
      'Smarte varsler',
    ],
  },
  {
    title: 'Problemene vi vil løse', icon: 'clock',
    items: [
      'Penger',
      'Tid',
      'Klima',
    ],
  },
  {
    title: 'Det som gjør ideen nyskapende', icon: 'leaf',
    items: [
      'Åpenhet',
      'Fleksibilitet',
      'Bærekraft',
      'Et bindeledd',
    ],
  },
];

export default function About() {
  return h('div', { className: 'about-content' },
    h('section', { className: 'about-intro', 'aria-labelledby': 'about-heading' },
      h('h1', { id: 'about-heading' }, 'Om ', h('span', null, 'oss')),
      h('ul', { className: 'about-concept-list' },
        h('li', null, 'CarTogether er en mobilapp som hjelper brukere med å sammenligne priser på taxi og andre transportalternativer.'),
        h('li', null, 'Med «Carpool»-funksjonen kan registrerte brukere dele kostnaden for en taxitur med venner, familie eller andre reisende for å redusere kostnadene.'),
        h('li', null, 'Det vil også være mulig å registrere seg som sjåfør og tilby rimelig skyss til andre som skal samme vei.'),
        h('li', null, 'Brukere kan også gi hverandre vurderinger som passasjerer eller sjåfører for å gjøre opplevelsen tryggere.'),
        h('li', null, 'Vi skal hovedsakelig fokusere på store arrangementer som festivaler.'))),
    h('section', { className: 'concept-section', 'aria-labelledby': 'concept-heading' },
      h('h2', { id: 'concept-heading' }, 'Konsept og løsning'),
      h('div', { className: 'concept-grid' }, conceptPillars.map((pillar) => h('article', { className: 'concept-card', key: pillar.title },
        h('div', { className: 'concept-card-heading' },
          h('span', { className: 'concept-icon' }, h(Icon, { name: pillar.icon, size: 24 })),
          h('h3', null, pillar.title)),
        h('ul', { className: 'concept-list' }, pillar.items.map((title) => h('li', { key: title },
          h('strong', null, title))))))),
      h('p', { className: 'concept-note' }, 'I demoen kan du prøve prissammenligning og samkjøring med eksempeldata. Sanntidspriser, brukerprofiler og smarte varsler er planlagte funksjoner.')),
    h('section', { className: 'team-section', 'aria-labelledby': 'team-heading' },
      h('span', { className: 'eyebrow' }, 'MENNESKENE BAK'), h('h2', { id: 'team-heading' }, 'Fem hoder. Én felles retning.'),
      h('p', { className: 'muted' }, 'Møt teamet som vil gjøre festivalreisen enklere.'),
      h('div', { className: 'team-grid' }, team.map((person) => h('article', { className: 'team-card', key: person.name },
        h('img', { className: 'team-photo', src: teamPhotos[person.name], alt: `Portrett av ${person.name}`, width: 190, height: 255, loading: 'lazy', decoding: 'async' }),
        h('h3', null, person.name), h('p', null, person.role))))),
    h('section', { className: 'goals-section', 'aria-labelledby': 'goals-heading' },
      h('span', { className: 'eyebrow' }, 'VEIEN VIDERE'), h('h2', { id: 'goals-heading' }, 'Små valg. Felles ambisjoner.'),
      h('p', { className: 'muted' }, 'Konseptet er inspirert av FNs bærekraftsmål 9, 11 og 13.'),
      h('div', { className: 'goals-grid' }, goals.map((goal) => h('article', { className: 'goal-card', key: goal.number },
        h('span', { className: 'goal-number' }, goal.number), h('h3', null, goal.title), h('p', null, goal.text))))));
}
