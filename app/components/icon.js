import { createElement as h } from 'react';
const paths = {
  car: ['M5 17h14l1-5-2-5H6l-2 5 1 5Z', 'M4 12h16M7 17v2M17 17v2M7 14h1M16 14h1'],
  people: ['M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M22 21v-2a4 4 0 0 0-3-3.87', 'M13 3.13a4 4 0 0 1 0 7.75', 'M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z'],
  arrow: ['M4 12h16M14 6l6 6-6 6'],
  swap: ['M7 3v18M3 7l4-4 4 4M17 21V3M13 17l4 4 4-4'],
  pin: ['M20 10c0 6-8 11-8 11S4 16 4 10a8 8 0 1 1 16 0Z', 'M15 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z'],
  leaf: ['M20 4C9 2 3 7 5 15s17 7 15-11Z', 'M4 21 16 9'],
  check: ['M5 12l4 4L19 6'], plus: ['M12 5v14M5 12h14'],
  clock: ['M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z', 'M12 7v5l3 2'],
  info: ['M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z', 'M12 11v6M12 7h.01'],
  music: ['M9 18V5l12-2v13M9 9l12-2', 'M9 18c0 3-6 3-6 0s6-3 6 0ZM21 16c0 3-6 3-6 0s6-3 6 0Z'],
};
export default function Icon({ name, size = 20, ...props }) {
  return h('svg', { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true, ...props },
    (paths[name] || paths.car).map((d, index) => h('path', { key: index, d })));
}
