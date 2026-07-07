import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { expect, test } from '@playwright/test';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

test('carrega o bundle IIFE e renderiza uma tabela básica', async ({ page }) => {
  await page.setContent('<div id="grid"></div>');
  await page.addStyleTag({ path: path.join(root, 'dist/skargrid.css') });
  await page.addScriptTag({ path: path.join(root, 'dist/skargrid.min.js') });

  await page.evaluate(() => {
    new window.Skargrid('grid', {
      data: [
        { id: 1, name: 'Ada' },
        { id: 2, name: 'Grace' },
      ],
      columns: [
        { field: 'id', title: 'ID' },
        { field: 'name', title: 'Name' },
      ],
      sortable: true,
    });
  });

  await expect(page.locator('#grid table')).toBeVisible();
  await expect(page.locator('#grid tbody tr')).toHaveCount(2);
  await expect(page.locator('#grid')).toContainText('Ada');
  await expect(page.locator('#grid')).toContainText('Grace');
});
