import { createElement as h } from 'react';
import { formatPrice, providers } from '../mock-data.js';
import Icon from './icon.js';
export default function PriceComparison({ prices }) {
  return h('section', { className: 'comparison', 'aria-labelledby': 'taxi-heading' },
    h('div', { className: 'section-heading' }, h('div', null, h('h2', { id: 'taxi-heading' }, 'Samme vei. Ulike priser.'), h('p', null, 'Sammenlign tre fiktive taxiselskaper.')),
      h('span', { className: 'category-tag' }, h(Icon, { name: 'people', size: 15 }), 'Standard · 1–4')),
    prices ? h('div', { className: 'provider-list', 'aria-live': 'polite' }, providers.map((provider, index) => {
      const cheapest = prices[index] === Math.min(...prices);
      return h('article', { className: `provider-card${cheapest ? ' cheapest' : ''}`, key: provider.id },
        h('div', { className: `provider-mark ${provider.color}`, 'aria-hidden': true }, provider.initials),
        h('div', { className: 'provider-detail' }, h('h3', null, provider.name), h('span', null, 'Standard taxi · 1–4 personer')),
        h('div', { className: 'provider-price' }, cheapest && h('span', { className: 'best-badge' }, h(Icon, { name: 'check', size: 12 }), 'Lavest pris'),
          h('p', null, h('strong', null, formatPrice(prices[index])), ' kr')));
    })) : h('div', { className: 'empty-state' }, h(Icon, { name: 'pin', size: 30 }), h('p', null, 'Velg to ulike steder for å se demopriser.')),
    h('p', { className: 'fine-print' }, h(Icon, { name: 'info', size: 15 }), 'Faste demopriser for hele bilen. Ingen ekte bestillinger.'));
}
