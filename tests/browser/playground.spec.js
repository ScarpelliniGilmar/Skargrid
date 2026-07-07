import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { expect, test } from '@playwright/test';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

test.beforeEach(async ({ page }) => {
  await page.goto(`file://${path.join(root, 'docs/playground.html')}`);
});

test('grid completo monta com paginação, ordenação e filtros', async ({ page }) => {
  await expect(page.locator('#grid table')).toBeVisible();
  await expect(page.locator('#grid tbody tr')).toHaveCount(10);
  await expect(page.locator('#status')).toContainText('Grid completo montado');

  // filtro por coluna (columnFilters + filterType)
  await expect(page.locator('#grid thead input, #grid thead select')).not.toHaveCount(0);
});

test('virtualização monta 50k linhas sem paginação', async ({ page }) => {
  await expect(page.locator('#virtual-grid table')).toBeVisible();
  const rowCount = await page.locator('#virtual-grid tbody tr').count();
  expect(rowCount).toBeGreaterThan(0);
});

test('console de API executa os métodos públicos sem erro', async ({ page }) => {
  const actions = [
    'getData',
    'getSelectedRows',
    'selectRows',
    'clearSelection',
    'clearAllFilters',
    'clearSearch',
    'clearSort',
    'goToPage',
    'changePageSize',
    'updateData',
    'setThemeDark',
    'setThemeLight',
    'showLoading',
    'hideLoading',
    'getState',
    'saveState',
    'restoreState',
  ];

  for (const action of actions) {
    await page.click(`[data-api="${action}"]`);
  }

  const log = await page.locator('#api-log').textContent();
  expect(log).not.toContain('ERRO');
  for (const action of actions) {
    expect(log).toContain(action);
  }
  expect(log).toContain('estado restaurado');
});

test('destroy() e recriação em ciclo não deixam erro', async ({ page }) => {
  await page.click('#destroy-recreate');
  await expect(page.locator('#api-log')).toContainText('10 ciclos de destroy()+recriação concluídos sem erro');
  await expect(page.locator('#grid table')).toBeVisible();
});

test('alternar tema aplica data-theme no documento', async ({ page }) => {
  await page.click('#toggle-theme');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.click('#toggle-theme');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
});

test('exportação CSV e XLSX funcionam de ponta a ponta', async ({ page }) => {
  const [csvDownload] = await Promise.all([
    page.waitForEvent('download'),
    page.click('#grid button[title="Export CSV"]'),
  ]);
  expect(csvDownload.suggestedFilename()).toContain('.csv');

  const [xlsxDownload] = await Promise.all([
    page.waitForEvent('download'),
    page.click('#grid button[title="Export XLSX"]'),
  ]);
  expect(xlsxDownload.suggestedFilename()).toContain('.xlsx');
});

test('event bus: sort, seleção e clique em linha aparecem no log de eventos', async ({ page }) => {
  await page.click('#grid thead th[data-field="nome"]');
  await expect(page.locator('#event-log')).toContainText('sort ->');

  await page.click('#grid tbody tr:first-child input[type="checkbox"]');
  await expect(page.locator('#event-log')).toContainText('selectionChange ->');

  await page.click('#grid tbody tr:first-child');
  await expect(page.locator('#event-log')).toContainText('rowClick ->');
});
