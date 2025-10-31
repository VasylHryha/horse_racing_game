import { expect, test } from '@playwright/test'

test.describe('Race Horses SlideOver', () => {
  // Helper: navigate to race page
  async function goToRace(page: any) {
    await page.goto('/')
    await page.getByRole('button', { name: 'Start Racing →' }).click()
    await expect(page).toHaveURL(/\/race$/)
  }

  test('opens and closes the horses panel', async ({ page }) => {
    await goToRace(page)

    // Open panel via the header button
    const openBtn = page.getByRole('button', { name: '🐴 Race Horses' })
    await openBtn.click()

    // Panel title visible (prefer heading role over text)
    const title = page.getByRole('heading', { name: /Race Horses/i })
    await expect(title).toBeVisible()

    // Close via close button
    const closeBtn = page.getByRole('button', { name: 'Close panel' })
    await closeBtn.click()

    // Title should disappear (no custom timeout)
    await expect(title).toBeHidden()
  })
})
