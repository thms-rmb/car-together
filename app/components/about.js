import { createElement as h } from 'react';
import { goals, team } from '../mock-data.js';
import Icon from './icon.js';
export default function About() {
  return h('div', { className: 'about-content' },
    h('section', { className: 'about-intro' }, h('div', null,
      h('span', { className: 'eyebrow' }, 'LITT OM OSS'), h('h1', null, 'Bedre sammen.', h('br'), h('span', null, 'Hele veien hjem.')),
      h('p', { className: 'intro-copy' }, 'De beste festivalminnene skaper vi sammen. Vi synes reisen hjem også skal være enkel, sosial og litt rimeligere.')),
    h('div', { className: 'mission-card' }, h(Icon, { name: 'people', size: 32 }), h('h2', null, 'En liten idé med plass til flere.'),
      h('p', null, 'CarTogether gjør det lettere å sammenligne taxipriser og finne andre som skal samme vei. Mindre planlegging, mer festival.'),
      h('span', { className: 'small-label' }, 'Et konsept i utvikling · En lokal demo'))),
    h('section', { className: 'team-section', 'aria-labelledby': 'team-heading' },
      h('span', { className: 'eyebrow' }, 'MENNESKENE BAK'), h('h2', { id: 'team-heading' }, 'Fem hoder. Én felles retning.'),
      h('p', { className: 'muted' }, 'Møt teamet som vil gjøre festivalreisen enklere.'),
      h('div', { className: 'team-grid' }, team.map((person) => h('article', { className: 'team-card', key: person.name },
        h('div', { className: 'team-avatar', 'aria-hidden': true }, person.initials), h('h3', null, person.name), h('p', null, person.role))))),
    h('section', { className: 'goals-section', 'aria-labelledby': 'goals-heading' },
      h('span', { className: 'eyebrow' }, 'VEIEN VIDERE'), h('h2', { id: 'goals-heading' }, 'Små valg. Felles ambisjoner.'),
      h('p', { className: 'muted' }, 'Konseptet er inspirert av FNs bærekraftsmål 9, 11 og 13.'),
      h('div', { className: 'goals-grid' }, goals.map((goal) => h('article', { className: 'goal-card', key: goal.number },
        h('span', { className: 'goal-number' }, goal.number), h('h3', null, goal.title), h('p', null, goal.text))))));
}
