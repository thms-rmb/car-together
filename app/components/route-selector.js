import { createElement as h } from 'react';
import { locations } from '../mock-data.js';
import Icon from './icon.js';
export default function RouteSelector({ from, to, onRouteChange }) {
  const field = (id, label, value) => h('label', { className: 'route-field', htmlFor: id },
    h('span', { className: `route-dot ${id}` }),
    h('span', { className: 'field-content' }, h('span', { className: 'field-label', id: `${id}-label` }, label),
      h('select', { id, value, 'aria-labelledby': `${id}-label`, onChange: (event) => onRouteChange(id, event.target.value), 'aria-describedby': from === to ? 'route-error' : undefined },
        locations.map((location) => h('option', { value: location.id, key: location.id }, location.name)))));
  return h('div', { className: 'route-selector' }, field('from', 'Fra', from),
    h('button', { className: 'swap-button', type: 'button', 'aria-label': 'Bytt reiseretning', onClick: () => onRouteChange('swap') }, h(Icon, { name: 'swap', size: 18 })),
    field('to', 'Til', to),
    from === to && h('p', { id: 'route-error', className: 'validation', role: 'alert' }, 'Velg ulike steder for avreise og ankomst.'));
}
