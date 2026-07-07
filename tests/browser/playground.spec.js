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

test('serverSide: carga inicial busca do "servidor" fake e preenche totalRecords', async ({ page }) => {
  await expect(page.locator('#server-status')).toHaveText('237 registros no "servidor"');
  await expect(page.locator('#server-grid tbody tr')).toHaveCount(10);
});

test('serverSide: mudar de página, ordenar e pesquisar disparam nova requisição', async ({ page }) => {
  await expect(page.locator('#server-status')).toHaveText('237 registros no "servidor"');

  const firstIdBefore = await page.locator('#server-grid tbody tr:first-child td[data-field="id"]').textContent();

  await page.click('#server-grid .skargrid-pagination-btn:has-text("›")');
  // A busca fake demora ~400ms — dá tempo de a página realmente mudar antes
  // de conferir o resultado (não afirmamos o estado "buscando..." em si,
  // que é transitório demais para um teste estável).
  await expect(page.locator('#server-grid tbody tr:first-child td[data-field="id"]')).not.toHaveText(firstIdBefore, { timeout: 2000 });
  await expect(page.locator('#server-status')).toHaveText('237 registros no "servidor"');

  await page.fill('#server-grid .skargrid-search-input', 'usuário 1');
  await page.waitForTimeout(600); // debounce de busca (300ms) + latência fake (400ms)
  // "usuário 1" casa com 1, 10-19, 100-199 = 111 registros num total de 237
  await expect(page.locator('#server-status')).toHaveText('111 registros no "servidor"');
  await expect(page.locator('#server-grid tbody tr')).not.toHaveCount(0);
});

test('colunas congeladas (ID e Nome) permanecem visíveis após scroll horizontal', async ({ page }) => {
  const idHeader = page.locator('#grid thead th[data-field="id"]');
  const nomeHeader = page.locator('#grid thead th[data-field="nome"]');
  const emailHeader = page.locator('#grid thead th[data-field="email"]'); // não congelada

  await expect(idHeader).toHaveClass(/skargrid-frozen-cell/);
  await expect(nomeHeader).toHaveClass(/skargrid-frozen-cell/);

  const idBoxBefore = await idHeader.boundingBox();
  const emailBoxBefore = await emailHeader.boundingBox();

  await page.locator('#grid .skargrid-table-container').evaluate(el => { el.scrollLeft = 300; });
  await page.waitForTimeout(100);

  const idBoxAfter = await idHeader.boundingBox();
  const emailBoxAfter = await emailHeader.boundingBox();

  // A coluna congelada não deve deslocar quase nada; a não-congelada, sim.
  const idShift = Math.abs(idBoxAfter.x - idBoxBefore.x);
  const emailShift = Math.abs(emailBoxAfter.x - emailBoxBefore.x);
  expect(idShift).toBeLessThan(emailShift);
  expect(emailShift).toBeGreaterThan(200);

  await expect(idHeader).toBeVisible();
  await expect(nomeHeader).toBeVisible();
});

test('rodapé de agregações mostra contagem e média, recalculadas ao filtrar', async ({ page }) => {
  const idFooter = page.locator('#grid tfoot td[data-field="id"]');
  const idadeFooter = page.locator('#grid tfoot td[data-field="idade"]');

  await expect(idFooter).toHaveText('250 linhas');
  await expect(idadeFooter).toContainText('média:');

  // Filtra via API (o dropdown de filtro em si já é coberto por outro teste)
  // e confirma que o rodapé recalcula sobre os dados filtrados.
  await page.evaluate(() => window.__skargridPlaygroundGrid?.handleColumnFilter('nome', 'Usuário 1'));

  await expect(idFooter).not.toHaveText('250 linhas');
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

test('persistState: ordenação e seleção sobrevivem a destroy()+recriação (simulando F5)', async ({ page }) => {
  await page.click('#persist-grid thead th[data-field="nome"]');
  await expect(page.locator('#persist-grid thead th[data-field="nome"]')).toHaveClass(/sorted/);

  await page.click('#persist-grid tbody tr:first-child input[type="checkbox"]');

  await page.click('#persist-reload');

  await expect(page.locator('#persist-grid thead th[data-field="nome"]')).toHaveClass(/sorted/);
  await expect(page.locator('#persist-grid tbody tr:first-child input[type="checkbox"]')).toBeChecked();

  // Espera o debounce de persistência (150ms) assentar antes de limpar — destroy()
  // finaliza mudanças pendentes por design, então limpar+recriar sem esperar
  // ressuscitaria a última mudança em vez de respeitar a limpeza.
  await page.waitForTimeout(200);
  await page.click('#persist-clear');
  await page.click('#persist-reload');
  await expect(page.locator('#persist-grid thead th[data-field="nome"]')).not.toHaveClass(/sorted/);
});

test('filtro select da coluna Status (render retorna Node) lista os valores reais', async ({ page }) => {
  await page.click('#grid thead th[data-field="status"] button.th-filter-btn');

  const dropdown = page.locator('.skargrid-filter-dropdown');
  await expect(dropdown).toBeVisible();

  const labels = await dropdown.locator('.filter-list-item label').allTextContents();
  expect(labels.length).toBeGreaterThan(0);
  for (const label of labels) {
    expect(label).not.toContain('[object');
  }
  expect(labels).toEqual(expect.arrayContaining(['ativo', 'inativo', 'pendente']));
});

test('event bus: sort, seleção e clique em linha aparecem no log de eventos', async ({ page }) => {
  await page.click('#grid thead th[data-field="nome"]');
  await expect(page.locator('#event-log')).toContainText('sort ->');

  await page.click('#grid tbody tr:first-child input[type="checkbox"]');
  await expect(page.locator('#event-log')).toContainText('selectionChange ->');

  await page.click('#grid tbody tr:first-child');
  await expect(page.locator('#event-log')).toContainText('rowClick ->');
});
