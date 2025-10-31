import { expect, test } from '@playwright/test'

test.describe('Confirmation Modals', () => {
  // Helper: navigate to race and start racing
  async function goToRaceAndStart(page: any) {
    await page.goto('/')
    await page.getByTestId('btn-start-racing').click()
    await expect(page).toHaveURL(/.*\/race/)
    const startBtn = page.getByTestId('race-ctrl')
    await startBtn.click()
    await expect(page.getByTestId('race-status-badge')).toHaveText(/RACING/)
  }

  test('shows confirm modal when navigating Home during race', async ({ page }) => {
    await goToRaceAndStart(page)

    // Click Home in RaceHeader
    await page.getByTestId('btn-home').click()

    // Modal should appear with title and buttons
    const modalTitle = page.getByText('Return to Home?')
    await expect(modalTitle).toBeVisible({ timeout: 5000 })
    await expect(page.getByRole('button', { name: 'Go Home' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Stay' })).toBeVisible()

    // Cancel (Stay) keeps you on the race page
    await page.getByRole('button', { name: 'Stay' }).click()
    await expect(modalTitle).toBeHidden()
    // Still racing or paused
    const statusText = await page.getByTestId('race-status-badge').textContent()
    expect(['RACING', 'PAUSED']).toContain(statusText?.trim() || '')
  })
})
