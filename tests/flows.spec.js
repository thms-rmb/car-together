import { test, expect } from '@playwright/test';

const rideCard = (page, name) => page.locator('.ride-card').filter({ has: page.getByRole('heading', { name, exact: true }) });
const openCarpool = (page) => page.getByRole('button', { name: 'Carpool', exact: true }).click();
const openTrips = (page) => page.getByRole('button', { name: /^Mine turer/ }).click();
const heading = (page, name) => page.getByRole('heading', { level: 1, name, exact: true });

// Each test starts a fresh in-memory demo and exercises the visible UI.
test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('compare routes, split a fare, and reject an invalid route', async ({ page }) => {
  const pairs = [['palmesus', 'sentrum', [120, 140, 130]], ['palmesus', 'vagsbygd', [195, 225, 210]], ['sentrum', 'vagsbygd', [160, 180, 170]]];
  for (const [from, to, prices] of pairs) {
    for (const [origin, destination] of [[from, to], [to, from]]) {
      await page.getByLabel('Fra', { exact: true }).selectOption(origin);
      await page.getByLabel('Til', { exact: true }).selectOption(destination);
      await expect(page.locator('.provider-price strong')).toHaveText(prices.map(String));
      await expect(page.locator('.cheapest')).toContainText('Demo Taxi');
    }
  }
  await page.getByLabel('Fra', { exact: true }).selectOption('palmesus');
  await page.getByLabel('Til', { exact: true }).selectOption('vagsbygd');
  await page.getByLabel('Del prisen').selectOption('3');
  await expect(page.locator('.split-preview')).toContainText('65 kr');
  await page.getByLabel('Del prisen').selectOption('4');
  await expect(page.locator('.split-preview')).toContainText('48,75 kr');
  await page.getByLabel('Til', { exact: true }).selectOption('palmesus');
  await expect(page.getByRole('alert')).toHaveText('Velg ulike steder for avreise og ankomst.');
  await expect(page.getByRole('button', { name: 'Finn samkjøring' })).toBeDisabled();
});

test('review, abandon, confirm, keep, and finally cancel a demosete', async ({ page }) => {
  await page.getByRole('button', { name: 'Finn samkjøring' }).click();
  await expect(rideCard(page, 'Emma')).toContainText('3 ledige seter');
  await rideCard(page, 'Emma').getByRole('button', { name: 'Bli med' }).click();
  await expect(heading(page, 'Ta følge med Emma?')).toBeVisible();
  await expect(page.getByRole('region', { name: 'Turdetaljer' })).toContainText('65 kr');
  await page.getByRole('button', { name: 'Avbryt', exact: true }).click();
  await expect(rideCard(page, 'Emma')).toContainText('3 ledige seter');
  await rideCard(page, 'Emma').getByRole('button', { name: 'Bli med' }).click();
  await page.getByRole('button', { name: 'Bekreft demosete' }).click();
  await expect(heading(page, 'Du er med!')).toBeVisible();
  await expect(page.locator('.confirmation-reference')).toContainText('CT-1001');
  await page.getByRole('button', { name: 'Se mine turer' }).click();
  await expect(page.locator('.saved-trip')).toHaveCount(1);
  await page.getByRole('button', { name: 'Om oss', exact: true }).click();
  await openCarpool(page);
  await expect(rideCard(page, 'Emma')).toContainText('2 ledige seter');
  await expect(rideCard(page, 'Emma').getByRole('button', { name: 'Du er med – kun demo' })).toBeDisabled();
  await openTrips(page);
  await page.getByRole('button', { name: 'Avbestill demosete', exact: true }).click();
  await page.getByRole('button', { name: 'Behold turen', exact: true }).click();
  await expect(page.locator('.saved-trip')).toHaveCount(1);
  await page.getByRole('button', { name: 'Avbestill demosete', exact: true }).click();
  await page.getByRole('button', { name: 'Avbestill demosete', exact: true }).click();
  await expect(heading(page, 'Demosetet er avbestilt')).toBeVisible();
  await page.getByRole('button', { name: 'Se mine turer' }).click();
  await expect(page.getByRole('heading', { name: 'Ingen demoturer ennå' })).toBeVisible();
  await page.getByRole('button', { name: 'Finn en demotur' }).click();
  await expect(rideCard(page, 'Emma')).toContainText('3 ledige seter');
  await expect(rideCard(page, 'Emma').getByRole('button', { name: 'Bli med' })).toBeEnabled();
});

test('validate and edit an offer, publish it, then withdraw and offer again', async ({ page }) => {
  await openCarpool(page);
  await page.getByRole('button', { name: 'Tilby en demotur', exact: true }).click();
  await page.getByLabel('Til', { exact: true }).selectOption('palmesus');
  await page.getByLabel('Avgang (demotid)', { exact: true }).fill('');
  await page.getByLabel('Ledige seter (1–4)', { exact: true }).fill('0');
  await page.getByLabel('Pris per person (kr)', { exact: true }).fill('0');
  await page.getByRole('button', { name: 'Se over demoturen' }).click();
  await expect(heading(page, 'Plass til flere?')).toBeVisible();
  await expect(page.getByText('Velg en pris fra 1 til 500 kr.')).toBeVisible();
  await expect(page.getByText('Velg mellom 1 og 4 ledige seter.')).toBeVisible();
  await expect(page.getByText('Velg et gyldig klokkeslett.')).toBeVisible();
  await page.getByLabel('Fra', { exact: true }).selectOption('sentrum');
  await page.getByLabel('Avgang (demotid)', { exact: true }).fill('22:15');
  await page.getByLabel('Ledige seter (1–4)', { exact: true }).fill('4');
  await page.getByLabel('Pris per person (kr)', { exact: true }).fill('85');
  await page.getByRole('button', { name: 'Se over demoturen' }).click();
  await expect(heading(page, 'Klar til å dele turen?')).toBeVisible();
  await expect(page.getByRole('region', { name: 'Turdetaljer' })).toContainText('85 kr');
  await page.getByRole('button', { name: 'Endre turdetaljer', exact: true }).click();
  await expect(page.getByLabel('Pris per person (kr)', { exact: true })).toHaveValue('85');
  await expect(page.getByLabel('Avgang (demotid)', { exact: true })).toHaveValue('22:15');
  await page.getByRole('button', { name: 'Se over demoturen' }).click();
  await page.getByRole('button', { name: 'Publiser demotur' }).click();
  await expect(heading(page, 'Turen din er publisert!')).toBeVisible();
  await page.getByRole('button', { name: 'Finn en annen tur' }).click();
  await expect(page.getByLabel('Fra', { exact: true })).toHaveValue('sentrum');
  await expect(page.getByLabel('Til', { exact: true })).toHaveValue('palmesus');
  const ownCard = page.locator('.ride-card').filter({ hasText: 'Alex (deg)' });
  await expect(ownCard).toContainText('22:15');
  await expect(ownCard).toContainText('4 ledige seter');
  await expect(ownCard).toContainText('85 kr');
  await expect(ownCard.getByRole('button', { name: 'Din demotur', exact: true })).toBeDisabled();
  await expect(page.getByRole('button', { name: 'Demotur lagt til' })).toBeDisabled();
  await openTrips(page);
  await expect(page.locator('.saved-trip')).toHaveCount(1);
  await page.getByRole('button', { name: 'Trekk tilbake demotur', exact: true }).click();
  await page.getByRole('button', { name: 'Behold turen', exact: true }).click();
  await expect(page.locator('.saved-trip')).toHaveCount(1);
  await page.getByRole('button', { name: 'Trekk tilbake demotur', exact: true }).click();
  await page.getByRole('button', { name: 'Trekk tilbake demotur', exact: true }).click();
  await expect(heading(page, 'Demoturen er trukket tilbake')).toBeVisible();
  await page.getByRole('button', { name: 'Finn en annen tur' }).click();
  await expect(ownCard).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Tilby en demotur', exact: true })).toBeEnabled();
});

test('abandoning an offer leaves the ride list and My trips unchanged', async ({ page }) => {
  await openCarpool(page);
  await page.getByRole('button', { name: 'Tilby en demotur', exact: true }).click();
  await page.getByRole('button', { name: 'Se over demoturen' }).click();
  await page.getByRole('button', { name: 'Endre turdetaljer', exact: true }).click();
  await page.getByRole('button', { name: '← Tilbake til Carpool', exact: true }).click();
  await expect(page.locator('.ride-card')).toHaveCount(2);
  await openTrips(page);
  await expect(page.getByRole('heading', { name: 'Ingen demoturer ennå' })).toBeVisible();
});

test('reset asks first and restores trips, route, and split defaults', async ({ page }) => {
  await page.getByLabel('Del prisen').selectOption('3');
  await openCarpool(page);
  await rideCard(page, 'Emma').getByRole('button', { name: 'Bli med' }).click();
  await page.getByRole('button', { name: 'Bekreft demosete' }).click();
  await page.getByRole('button', { name: 'Nullstill demo', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'Starte demoen på nytt?' });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('button', { name: 'Behold endringene' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await page.getByRole('button', { name: 'Se mine turer' }).click();
  await expect(page.locator('.saved-trip')).toHaveCount(1);
  await page.getByRole('button', { name: 'Nullstill demo', exact: true }).click();
  await dialog.getByRole('button', { name: 'Nullstill demoen', exact: true }).click();
  await expect(page.getByRole('heading', { level: 1, name: /^Gode minner/ })).toBeVisible();
  await expect(page.getByLabel('Fra', { exact: true })).toHaveValue('palmesus');
  await expect(page.getByLabel('Til', { exact: true })).toHaveValue('vagsbygd');
  await expect(page.getByLabel('Del prisen')).toHaveValue('1');
  await openCarpool(page);
  await expect(rideCard(page, 'Emma')).toContainText('3 ledige seter');
  await openTrips(page);
  await expect(page.getByRole('heading', { name: 'Ingen demoturer ennå' })).toBeVisible();
});

test('a refresh resets confirmations and offers; keyboard navigation and layout stay usable', async ({ page }) => {
  await openCarpool(page);
  await page.getByRole('button', { name: 'Tilby en demotur', exact: true }).click();
  await page.getByRole('button', { name: 'Se over demoturen' }).click();
  await page.getByRole('button', { name: 'Publiser demotur' }).click();
  await page.reload();
  await openTrips(page);
  await expect(page.getByRole('heading', { name: 'Ingen demoturer ennå' })).toBeVisible();
  await page.getByRole('button', { name: 'Hjem', exact: true }).click();
  await page.getByLabel('Fra', { exact: true }).focus();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Bytt reiseretning' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByLabel('Fra', { exact: true })).toHaveValue('vagsbygd');
  await expect(page.locator('.demo-bar')).toContainText('Demo – no real bookings');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});
