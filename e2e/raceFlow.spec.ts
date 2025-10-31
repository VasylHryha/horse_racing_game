import { expect, test } from '@playwright/test'

test.describe('Complete Race Flow', () => {
  // Helper: navigate from Home to the Race page
  async function goToRace(page: any) {
    await page.goto('/')
    await page.getByTestId('btn-start-racing').click()
    await expect(page).toHaveURL(/\/race$/)
  }

  test('loads home and navigates to race', async ({ page }) => {
    // Home UI expectations
    await page.goto('/')
    await expect(page.getByRole('heading', { name: /Horse Racing/i })).toBeVisible()
    await expect(page.getByTestId('btn-generate-horses')).toBeVisible()
    await expect(page.getByTestId('btn-start-racing')).toBeVisible()

    // Navigate to race
    await page.getByTestId('btn-start-racing').click()
    await expect(page).toHaveURL(/\/race$/)
    // Status badge shows IDLE initially
    await expect(page.getByTestId('race-status-badge')).toHaveText(/IDLE/)
  })

  test('starts race and updates status badge', async ({ page }) => {
    await goToRace(page)
    // Start via header button (label flips between START RACE/PAUSE/RESUME)
    const startButton = page.getByTestId('race-ctrl')
    await startButton.click()
    // Status changes to RACING
    await expect(page.getByTestId('race-status-badge')).toHaveText(/RACING/)
  })

  test('pause and resume during race', async ({ page }) => {
    await goToRace(page)
    const startButton = page.getByTestId('race-ctrl')
    await startButton.click()
    await expect(page.getByTestId('race-status-badge')).toHaveText(/RACING/)
    // Pause toggles to PAUSED
    await startButton.click()
    await expect(page.getByTestId('race-status-badge')).toHaveText(/PAUSED/)
    // Resume returns to RACING
    await startButton.click()
    await expect(page.getByTestId('race-status-badge')).toHaveText(/RACING/)
  })

  test('expand Speed section on race page', async ({ page }) => {
    await goToRace(page)
    // Expand the accordion and expect presets to be visible
    const speed = page.getByTestId('speed-accordion').getByRole('button')
    await speed.click()
    await expect(speed).toHaveAttribute('aria-expanded', 'true')
    await expect(page.getByText('Slowest')).toBeVisible()
  })

  test('results panel becomes visible after progress', async ({ page }) => {
    test.setTimeout(60000)
    await goToRace(page)
    const startButton = page.getByTestId('race-ctrl')
    await startButton.click()
    // After some time, expect the Results accordion to show rows
    await expect(page.getByTestId('race-status-badge')).toHaveText(/RACING/)
    // Wait for first results item and assert a row content
    await expect(page.getByTestId('results-item').first()).toBeVisible({ timeout: 30000 })
    const firstRow = page.getByTestId('results-row').first()
    await expect(firstRow).toContainText(/🥇|\b[1-3]\b/)
    await expect(firstRow).toContainText(/[A-Z]/i)
  })
})
