import { expect, test } from '@playwright/test'

test.describe('Speed Control', () => {
  // Helper: navigate to race page
  async function goToRace(page: any) {
    await page.goto('/')
    await page.getByTestId('btn-start-racing').click()
    await expect(page).toHaveURL(/\/race$/)
  }

  test('expand/collapse speed control on race page', async ({ page }) => {
    await goToRace(page)
    // Expand then collapse the accordion; assert aria-expanded toggles
    const speedHeader = page.getByTestId('speed-accordion').getByRole('button')
    await expect(speedHeader).toHaveAttribute('aria-expanded', 'false')
    await speedHeader.click()
    await expect(speedHeader).toHaveAttribute('aria-expanded', 'true')
    await expect(page.getByText('Slowest')).toBeVisible()
    await speedHeader.click()
    await expect(speedHeader).toHaveAttribute('aria-expanded', 'false')
  })

  test('change speed before race, disabled during race', async ({ page }) => {
    await goToRace(page)
    const speedHeader = page.getByTestId('speed-accordion').getByRole('button')
    await speedHeader.click()
    await expect(page.getByText('Slowest')).toBeVisible()

    // Before race: clicking preset updates selection
    await page.getByText('Fastest').click()

    // Start race
    const startButton = page.getByTestId('race-ctrl')
    await startButton.click()
    await expect(page.getByTestId('race-status-badge')).toHaveText(/RACING/)

    // Inputs should be disabled during race
    const input = page.locator('input#speed-NORMAL')
    await expect(input).toBeDisabled()
  })
})
