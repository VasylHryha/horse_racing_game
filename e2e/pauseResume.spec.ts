import { expect, test } from '@playwright/test'

test.describe('Pause and Resume', () => {
  // Helper: navigate to race page
  async function goToRace(page: any) {
    await page.goto('/')
    await page.getByRole('button', { name: 'Start Racing →' }).click()
    await expect(page).toHaveURL(/.*\/race/)
  }

  test('pauses race and then resumes it', async ({ page }) => {
    await goToRace(page)
    const startButton = page.locator('button', { hasText: /START RACE|PAUSE|RESUME/ })
    await startButton.click()
    await expect(page.locator('span').filter({ hasText: 'RACING' })).toBeVisible({ timeout: 5000 })
    // Pause (button label includes an emoji, so match the text substring)
    await page.getByRole('button', { name: /PAUSE/ }).click()
    await expect(page.locator('span').filter({ hasText: 'PAUSED' })).toBeVisible()
    // Resume
    await page.getByRole('button', { name: /RESUME/ }).click()
    await expect(page.locator('span').filter({ hasText: 'RACING' })).toBeVisible()
  })

  test('allows multiple pause/resume cycles', async ({ page }) => {
    await goToRace(page)
    const startButton = page.locator('button', { hasText: /START RACE|PAUSE|RESUME/ })
    await startButton.click()
    await expect(page.locator('span').filter({ hasText: 'RACING' })).toBeVisible({ timeout: 5000 })

    // Perform three pause/resume toggles
    for (let i = 0; i < 3; i++) {
      await page.getByRole('button', { name: /PAUSE/ }).click()
      await expect(page.locator('span').filter({ hasText: 'PAUSED' })).toBeVisible()
      await page.getByRole('button', { name: /RESUME/ }).click()
      await expect(page.locator('span').filter({ hasText: 'RACING' })).toBeVisible()
    }
  })
})
