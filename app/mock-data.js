export const locations = [
  { id: 'palmesus', name: 'Palmesus (festival)' },
  { id: 'sentrum', name: 'Kristiansand sentrum' },
  { id: 'vagsbygd', name: 'Vågsbygd' },
];
export const providers = [
  { id: 'demo', name: 'Demo Taxi', initials: 'dt', color: 'navy' },
  { id: 'bytaxi', name: 'Bytaxi Mock', initials: 'by', color: 'teal' },
  { id: 'festival', name: 'Festivalbil Mock', initials: 'f.', color: 'purple' },
];
export const routePrices = {
  'palmesus|sentrum': [120, 140, 130],
  'palmesus|vagsbygd': [195, 225, 210],
  'sentrum|vagsbygd': [160, 180, 170],
};
export const demoUser = { id: 'demo-user', name: 'Alex', initials: 'AL', rating: 4.8 };
export const demoOffer = { ...demoUser, id: 'own-offer', driverId: demoUser.id, departure: '21:00', seats: 2, price: 60 };
export const seededRides = [
  { id: 'emma', driverId: 'emma', name: 'Emma', initials: 'EM', from: 'palmesus', to: 'vagsbygd', departure: '20:00', seats: 3, price: 65, rating: 4.9 },
  { id: 'sofie', driverId: 'sofie', name: 'Sofie', initials: 'SO', from: 'palmesus', to: 'vagsbygd', departure: '20:30', seats: 2, price: 70, rating: 4.7 },
  { id: 'maja', driverId: 'maja', name: 'Maja', initials: 'MA', from: 'sentrum', to: 'palmesus', departure: '21:00', seats: 2, price: 45, rating: 4.8 },
];
export const team = [
  { name: 'Ella', role: 'CEO', initials: 'EL' },
  { name: 'Amathea', role: 'CFO', initials: 'AM' },
  { name: 'Emma', role: 'CPO', initials: 'EM' },
  { name: 'Sunniva', role: 'CMO', initials: 'SU' },
  { name: 'Lucia', role: 'COO', initials: 'LU' },
];
export const goals = [
  { number: '09', title: 'Innovasjon', text: 'Vi vil gjøre transport enklere å finne ved å samle og sammenligne alternativer på ett sted.' },
  { number: '11', title: 'Bærekraftige byer', text: 'Vi ønsker å gjøre samkjøring til et tilgjengelig valg for mer effektiv transport i byen.' },
  { number: '13', title: 'Klimainnsats', text: 'Vi vil inspirere flere til å reise sammen og velge delte turer fremfor å kjøre alene.' },
];
export const locationName = (id) => locations.find((location) => location.id === id)?.name;
export const pricesForRoute = (from, to) => routePrices[[from, to].sort().join('|')];
export const formatPrice = (price) => new Intl.NumberFormat('nb-NO', {
  minimumFractionDigits: Number.isInteger(price) ? 0 : 2, maximumFractionDigits: 2,
}).format(price);
