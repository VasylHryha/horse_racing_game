import { expect, test } from '@playwright/test'

test.describe('Pause and Resume', () => {
  // Helper: navigate to race page
  async function goToRace(page: any) {
    await page.goto('/')
    await page.getByTestId('btn-start-racing').click()
    await expect(page).toHaveURL(/.*\/race/)
  }

  test('pauses race and then resumes it', async ({ page }) => {
    await goToRace(page)
    const startButton = page.getByTestId('race-ctrl')
    await startButton.click()
    await expect(page.getByTestId('race-status-badge')).toHaveText(/RACING/)
    // Pause
    await startButton.click()
    await expect(page.getByTestId('race-status-badge')).toHaveText(/PAUSED/)
    // Resume
    await startButton.click()
    await expect(page.getByTestId('race-status-badge')).toHaveText(/RACING/)
  })

  test('allows multiple pause/resume cycles', async ({ page }) => {
    await goToRace(page)
    const startButton = page.getByTestId('race-ctrl')
    await startButton.click()
    await expect(page.getByTestId('race-status-badge')).toHaveText(/RACING/)

    // Perform three pause/resume toggles
    for (let i = 0; i < 3; i++) {
      await startButton.click()
      await expect(page.getByTestId('race-status-badge')).toHaveText(/PAUSED/)
      await startButton.click()
      await expect(page.getByTestId('race-status-badge')).toHaveText(/RACING/)
    }
  })
})
