import { test, expect } from '@playwright/test';

test.describe('Navegación', () => {
  test('should redirect root to landing page', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Bienvenido al Sistema GAPH')).toBeVisible();
  });

  test('should navigate to login page', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByText('GAPH')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Ingresar' })).toBeVisible();
  });
});