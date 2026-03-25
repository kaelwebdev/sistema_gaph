import { test, expect } from '@playwright/test';

test.describe('Login', () => {
  test('should display login form', async ({ page }) => {
    await page.goto('/login');
    
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Contraseña')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Ingresar' })).toBeVisible();
  });

  test('should validate required fields', async ({ page }) => {
    await page.goto('/login');
    
    await page.getByRole('button', { name: 'Ingresar' }).click();
    
    await expect(page.getByLabel('Email')).toHaveAttribute('required');
    await expect(page.getByLabel('Contraseña')).toHaveAttribute('required');
  });

  test('should display GAPH brand text', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByText('GAPH')).toBeVisible();
  });
});