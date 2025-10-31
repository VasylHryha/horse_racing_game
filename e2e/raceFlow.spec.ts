import { expect, test } from '@playwright/test'

test.describe('Complete Race Flow', () => {
  // Helper: navigate from Home to the Race page
  async function goToRace(page: any) {
    await page.goto('/')
    await page.getByRole('button', { name: 'Start Racing →' }).click()
    await expect(page).toHaveURL(/\/race$/)
  }

  test('loads home and navigates to race', async ({ page }) => {
    // Home UI expectations
    await page.goto('/')
    await expect(page.getByRole('heading', { name: /Horse Racing/i })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Generate New Horses' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Start Racing →' })).toBeVisible()

    // Navigate to race
    await page.getByRole('button', { name: 'Start Racing →' }).click()
    await expect(page).toHaveURL(/\/race$/)
    // Status badge shows IDLE initially
    await expect(page.locator('span').filter({ hasText: 'IDLE' })).toBeVisible()
  })

  test('starts race and updates status badge', async ({ page }) => {
    await goToRace(page)
    // Start via header button (label flips between START RACE/PAUSE/RESUME)
    const startButton = page.locator('button').filter({ hasText: /START RACE|PAUSE|RESUME/ })
    await startButton.click()
    // Status changes to RACING
    await expect(page.locator('span').filter({ hasText: 'RACING' })).toBeVisible({ timeout: 5000 })
  })

  test('pause and resume during race', async ({ page }) => {
    await goToRace(page)
    const startButton = page.locator('button').filter({ hasText: /START RACE|PAUSE|RESUME/ })
    await startButton.click()
    await expect(page.locator('span').filter({ hasText: 'RACING' })).toBeVisible({ timeout: 5000 })
    // Pause toggles to PAUSED
    const pauseButton = page.locator('button').filter({ hasText: 'PAUSE' })
    await pauseButton.click()
    await expect(page.locator('span').filter({ hasText: 'PAUSED' })).toBeVisible()
    // Resume returns to RACING
    const resumeButton = page.locator('button').filter({ hasText: 'RESUME' })
    await resumeButton.click()
    await expect(page.locator('span').filter({ hasText: 'RACING' })).toBeVisible()
  })

  test('expand Speed section on race page', async ({ page }) => {
    await goToRace(page)
    // Expand the accordion and expect presets to be visible
    const speedHeader = page.locator('button').filter({ hasText: /^Speed/ }).first()
    await speedHeader.click()
    await page.waitForTimeout(250)
    await expect(page.getByText('Slowest')).toBeVisible()
  })

  test('results panel becomes visible after progress', async ({ page }) => {
    test.setTimeout(60000)
    await goToRace(page)
    const startButton = page.locator('button').filter({ hasText: /START RACE|PAUSE|RESUME/ })
    await startButton.click()
    // After some time, expect the Results accordion to be present
    await expect(page.locator('span').filter({ hasText: 'RACING' })).toBeVisible({ timeout: 5000 })
    await expect(page.getByText('Results', { exact: false })).toBeVisible({ timeout: 30000 })
  })
})
