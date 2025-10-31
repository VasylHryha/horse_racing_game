import { expect, test } from '@playwright/test'

test.describe('Race Horses SlideOver', () => {
  // Helper: navigate to race page
  async function goToRace(page: any) {
    await page.goto('/')
    await page.getByTestId('btn-start-racing').click()
    await expect(page).toHaveURL(/\/race$/)
  }

  test('opens and closes the horses panel', async ({ page }) => {
    await goToRace(page)

    // Open panel via the header button
    const openBtn = page.getByTestId('open-horses')
    await openBtn.click()

    // Panel visible via test id and title present
    const panel = page.getByTestId('horses-slideover')
    await expect(panel).toBeVisible()
    // SlideOver header uses <h3>, while HorseList inside also renders a heading.
    // Disambiguate using heading level.
    const title = panel.getByRole('heading', { name: /Race Horses/i, level: 3 })
    await expect(title).toBeVisible()

    // Close via close button
    const closeBtn = page.getByRole('button', { name: 'Close panel' })
    await closeBtn.click()

    // Title should disappear (no custom timeout)
    await expect(title).toBeHidden()
  })
})
