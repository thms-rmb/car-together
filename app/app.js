import { createElement as h, useEffect, useReducer, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { demoOffer, demoUser, formatPrice, pricesForRoute } from './mock-data.js';
import Icon from './components/icon.js';
import logo from '../src/image/Cartogether.svg';
import RouteSelector from './components/route-selector.js';
import PriceComparison from './components/price-comparison.js';
import RideCard from './components/ride-card.js';
import About from './components/about.js';
import RideFlow from './components/ride-flow.js';
import MyTrips from './components/my-trips.js';
import { createDemoState, demoReducer } from './demo-state.js';

function JourneyIllustration() {
  return h('div', { className: 'journey-art', 'aria-hidden': true },
    h('div', { className: 'art-orbit orbit-one' }), h('div', { className: 'art-orbit orbit-two' }),
    h('svg', { className: 'journey-road', viewBox: '0 0 460 260', fill: 'none' },
      h('path', { d: 'M66 61C117 15 269 24 295 80C320 134 134 103 161 172C178 218 327 241 398 173', stroke: '#c1dbcf', strokeWidth: 48 }),
      h('path', { d: 'M66 61C117 15 269 24 295 80C320 134 134 103 161 172C178 218 327 241 398 173', stroke: '#fcfdf8', strokeWidth: 2, strokeDasharray: '7 9' })),
    h('div', { className: 'art-location festival-location' }, h('span', { className: 'art-location-icon' }, h(Icon, { name: 'music', size: 21 })), h('div', null, h('strong', null, 'Palmesus'), h('span', null, 'Én siste sang?'))),
    h('div', { className: 'art-car' }, h(Icon, { name: 'car', size: 44 })),
    h('div', { className: 'art-location home-location' }, h('span', { className: 'art-location-icon' }, h(Icon, { name: 'pin', size: 21 })), h('div', null, h('strong', null, 'Hjem, sammen'), h('span', null, 'Plass til gode samtaler.'))),
    h('span', { className: 'art-spark spark-one' }, '✳'), h('span', { className: 'art-spark spark-two' }, '+'));
}

function Home({ route, onRouteChange, people, setPeople, goToCarpool, matchingCount }) {
  const prices = pricesForRoute(route.from, route.to);
  return h('div', null,
    h('section', { className: 'home-hero' }, h('div', { className: 'hero-copy' },
      h('span', { className: 'eyebrow' }, h('span', { className: 'live-dot' }), 'FESTIVALFØLELSE. HELE VEIEN.'),
      h('h1', null, 'Gode minner.', h('br'), 'En enklere ', h('span', { className: 'underlined' }, 'vei hjem.')),
      h('p', { className: 'intro-copy' }, 'Finn taxiprisen som passer deg, eller del turen med noen som skal samme vei. Enkelt, sosialt og sammen.')),
    h(JourneyIllustration)),
    h('div', { className: 'trip-workspace' },
      h('section', { className: 'trip-card', 'aria-labelledby': 'trip-heading' },
        h('span', { className: 'eyebrow' }, 'LA OSS FINNE VEIEN'), h('h2', { id: 'trip-heading' }, 'Hvor skal du?'),
        h(RouteSelector, { ...route, onRouteChange }),
        h('div', { className: 'split-section' }, h('div', { className: 'split-heading' }, h('label', { htmlFor: 'people' }, 'Del prisen'),
          h('select', { id: 'people', value: people, onChange: (event) => setPeople(Number(event.target.value)) }, [1, 2, 3, 4].map((number) => h('option', { key: number, value: number }, `${number} ${number === 1 ? 'person' : 'personer'}`)))),
        h('div', { className: 'split-preview', 'aria-live': 'polite' }, h('span', null, 'Laveste pris per person'), h('strong', null, prices ? `${formatPrice(Math.min(...prices) / people)} kr` : '–'))),
        h('button', { className: 'button button-primary carpool-cta', onClick: goToCarpool, disabled: !prices }, h(Icon, { name: 'people' }), 'Finn samkjøring', h(Icon, { name: 'arrow' })),
        h('div', { className: 'social-proof' }, h('span', { className: 'mini-avatars', 'aria-hidden': true }, h('span', null, 'E'), h('span', null, 'S')), h('p', null, matchingCount ? `${matchingCount} demoturer på denne ruten` : 'En god tur er enda bedre sammen'))),
      h(PriceComparison, { prices })),
    h('section', { className: 'together-strip' }, h('div', { className: 'strip-icon' }, h(Icon, { name: 'leaf', size: 26 })),
      h('div', null, h('h2', null, 'Samme festival. Samme retning.'), h('p', null, 'Det starter med en delt tur. Vi vil gjøre det enklere å reise sammen.')),
      h('span', { className: 'handwritten' }, 'Flere minner, færre omveier.')));
}

function Carpool({ route, onRouteChange, rides, onJoin, onOffer, offered, onTrips }) {
  const matching = rides.filter((ride) => ride.from === route.from && ride.to === route.to);
  const ownOffer = rides.find((ride) => ride.driverId === demoUser.id) || demoOffer;
  const valid = route.from !== route.to;
  return h('div', { className: 'carpool-content' },
    h('header', { className: 'page-intro' }, h('span', { className: 'eyebrow' }, 'LITT MER SOSIALT. LITT RIMELIGERE.'),
      h('h1', null, 'Skal vi ta følge?'), h('p', { className: 'intro-copy' }, 'Finn noen som skal samme vei. Her kan du prøve å bli med på en demotur.')),
    h('div', { className: 'carpool-layout' }, h('aside', null,
      h('section', { className: 'trip-card' }, h('h2', null, 'Din reiserute'), h(RouteSelector, { ...route, onRouteChange }), h('p', { className: 'fine-print' }, 'Vi viser turer i den retningen du velger.')),
      h('section', { className: 'offer-card' }, h('span', { className: 'offer-icon' }, h(Icon, { name: 'car', size: 25 })),
        h('h2', null, 'Et ledig sete?'), h('p', null, 'La noen sitte på. Velg tid, seter og pris før du publiserer en demotur.'),
        h('div', { className: 'offer-details' }, h('span', null, `${ownOffer.departure} · ${ownOffer.seats} ledige seter`), h('strong', null, `${ownOffer.price} kr / person`)),
        h('button', { className: 'button button-primary', onClick: onOffer, disabled: !valid || offered }, h(Icon, { name: offered ? 'check' : 'plus', size: 18 }), offered ? 'Demotur lagt til' : 'Tilby en demotur'),
        offered && h('button', { className: 'text-button', onClick: onTrips }, 'Administrer turen i Mine turer →'))),
      h('section', { className: 'rides-section', 'aria-labelledby': 'rides-heading' }, h('div', { className: 'section-heading' },
        h('div', null, h('h2', { id: 'rides-heading' }, 'På vei samme sted'), h('p', null, 'Private demoturer · Pris per passasjer')),
        h('span', { className: 'count-badge' }, `${valid ? matching.length : 0} turer`)),
      h('div', { className: 'ride-list', 'aria-live': 'polite' }, valid && matching.length ? matching.map((ride) => h(RideCard, { key: ride.id, ride, onJoin, onTrips })) :
        h('div', { className: 'empty-state' }, h(Icon, { name: 'people', size: 36 }), h('h3', null, valid ? 'Ingen demoturer på denne ruten' : 'Hvor går turen?'),
          h('p', null, valid ? 'Prøv en annen retning, eller tilby den første demoturen selv.' : 'Velg ulike steder for avreise og ankomst.'))),
      h('p', { className: 'fine-print' }, h(Icon, { name: 'info', size: 15 }), 'Alle sjåfører, vurderinger og avgangstider er eksempler.'))));
}

function App() {
  const [view, setView] = useState('home');
  const [route, setRoute] = useState({ from: 'palmesus', to: 'vagsbygd' });
  const [people, setPeople] = useState(1);
  const [demo, dispatch] = useReducer(demoReducer, undefined, createDemoState);
  const [resetRequested, setResetRequested] = useState(false);
  const { rides, flow } = demo;
  const offered = rides.some((ride) => ride.driverId === demoUser.id);
  const tripCount = rides.filter((ride) => ride.joined || ride.driverId === demoUser.id).length;
  const mainRef = useRef(null);
  const resetDialogRef = useRef(null);
  useEffect(() => {
    mainRef.current?.focus();
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [view, flow?.kind, flow?.step]);
  useEffect(() => {
    if (resetRequested) resetDialogRef.current?.showModal();
  }, [resetRequested]);
  const navigate = (next) => {
    dispatch({ type: 'close-flow' });
    setView(next);
  };
  const onRouteChange = (field, value) => setRoute((current) => field === 'swap' ? { from: current.to, to: current.from } : { ...current, [field]: value });
  const startFlow = (type, id) => dispatch({ type, id, route });
  const closeFlow = () => dispatch({ type: 'close-flow' });
  const confirmFlow = () => {
    if (flow?.kind === 'offer' && flow.step === 'review') setRoute({ from: flow.draft.from, to: flow.draft.to });
    dispatch({ type: 'confirm' });
  };
  const resetDemo = () => {
    dispatch({ type: 'reset' });
    setRoute({ from: 'palmesus', to: 'vagsbygd' });
    setPeople(1);
    setView('home');
    setResetRequested(false);
  };
  const matchingCount = rides.filter((ride) => ride.from === route.from && ride.to === route.to).length;
  return h('div', { className: 'app-shell' },
    h('a', { className: 'skip-link', href: '#main' }, 'Hopp til innhold'),
    h('header', { className: 'site-header' }, h('div', { className: 'header-inner' },
      h('a', { className: 'wordmark', href: '#main', onClick: () => navigate('home'), 'aria-label': 'CarTogether – Hjem' }, h('img', { className: 'brand-icon', src: logo, alt: '', width: 98, height: 65 }), 'Car', h('span', null, 'Together'), h('span', { className: 'brand-period' }, '.')),
      h('nav', { 'aria-label': 'Hovedmeny' }, [['home', 'Hjem', 'car'], ['carpool', 'Carpool', 'people'], ['trips', `Mine turer${tripCount ? ` (${tripCount})` : ''}`, 'clock'], ['about', 'Om oss', 'leaf']].map(([id, label, icon]) =>
        h('button', { key: id, className: `nav-button${view === id ? ' active' : ''}`, 'aria-current': view === id ? 'page' : undefined, onClick: () => navigate(id) }, h(Icon, { name: icon, size: 17 }), label))),
      h('span', { className: 'header-note' }, h('span', { className: 'live-dot' }), 'Laget for å dele'))),
    h('div', { className: 'demo-bar' }, h(Icon, { name: 'info', size: 14 }), h('strong', null, 'Demo – no real bookings'), h('span', null, 'Bare en smakebit på reisen. Alle priser og turer er fiktive.')),
    h('main', { id: 'main', className: 'main-container', tabIndex: -1, ref: mainRef },
      flow && h(RideFlow, { flow, dispatch, onConfirm: confirmFlow, onClose: closeFlow, onTrips: () => navigate('trips'), onFind: () => navigate('carpool') }),
      !flow && view === 'home' && h(Home, { route, onRouteChange, people, setPeople, goToCarpool: () => navigate('carpool'), matchingCount }),
      !flow && view === 'carpool' && h(Carpool, { route, onRouteChange, rides, onJoin: (id) => startFlow('start-join', id), onOffer: () => startFlow('start-offer'), offered, onTrips: () => navigate('trips') }),
      !flow && view === 'trips' && h(MyTrips, { rides, onCancel: (id) => startFlow('start-cancel', id), onWithdraw: (id) => startFlow('start-withdraw', id), onFind: () => navigate('carpool') }),
      !flow && view === 'about' && h(About)),
    h('footer', { className: 'site-footer' }, h('div', { className: 'footer-inner' }, h('span', { className: 'footer-brand' }, 'CarTogether.'), h('p', null, 'En bedre vei hjem starter sammen.'), h('span', { className: 'footer-demo' }, 'Kun en demo · ', h('button', { className: 'text-button reset-button', onClick: () => setResetRequested(true) }, 'Nullstill demo')))),
    resetRequested && h('dialog', { className: 'reset-dialog', ref: resetDialogRef, 'aria-labelledby': 'reset-title', 'aria-describedby': 'reset-description', onCancel: () => setResetRequested(false), onClose: () => setResetRequested(false) },
      h('h2', { id: 'reset-title' }, 'Starte demoen på nytt?'),
      h('p', { id: 'reset-description' }, 'Demoseter og dine tilbudte turer fjernes. De opprinnelige turene og reiseruten gjenopprettes.'),
      h('div', { className: 'dialog-actions' }, h('button', { className: 'button button-secondary', autoFocus: true, onClick: () => setResetRequested(false) }, 'Behold endringene'), h('button', { className: 'button button-primary', onClick: resetDemo }, 'Nullstill demoen'))));
}
createRoot(document.getElementById('root')).render(h(App));
