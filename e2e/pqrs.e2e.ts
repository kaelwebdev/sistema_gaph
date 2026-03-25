import { test, expect } from '@playwright/test';

test.describe('PQRS - Contacto', () => {
  test('should display landing page', async ({ page }) => {
    await page.goto('/');
    
    await expect(page.getByText('Bienvenido al Sistema GAPH')).toBeVisible();
    await expect(page.getByLabel('Unidad Residencial')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Continuar' })).toBeVisible();
  });

  test('should show pqrs link', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('¿Tienes una petición, queja o sugerencia?')).toBeVisible();
  });

  test('should show alert when clicking pqrs without selection', async ({ page }) => {
    page.on('dialog', async dialog => {
      expect(dialog.message()).toContain('Por favor selecciona una unidad residencial primero');
      await dialog.dismiss();
    });
    
    await page.goto('/');
    await page.getByText('¿Tienes una petición, queja o sugerencia?').click();
  });
});