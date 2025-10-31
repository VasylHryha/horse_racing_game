import { expect, test } from '@playwright/test'

test('visits home and shows simulator heading', async ({ page }) => {
  // Navigate to the app
  await page.goto('/')
  // Expect main heading and the two primary buttons
  await expect(page.locator('h1')).toContainText('Horse Racing Simulator')
  await expect(page.getByTestId('btn-generate-horses')).toBeVisible()
  await expect(page.getByTestId('btn-start-racing')).toBeVisible()
})
