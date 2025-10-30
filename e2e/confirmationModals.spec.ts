import { expect, test } from '@playwright/test'

test.describe('Confirmation Modals', () => {
  test('should show confirmation modal when generating program during race', async ({ page }) => {
    await page.goto('/')

    // Setup: Initial load
    await page.waitForLoadState('networkidle')

    // Generate initial program
    await page.getByText('GENERATE PROGRAM').click()
    await page.waitForTimeout(500)

    // Start race
    const startButton = page.locator('button').filter({ hasText: /START|PAUSE|RESUME/ })
    await startButton.click()

    // Wait for race to start
    await expect(page.locator('span').filter({ hasText: 'RACING' })).toBeVisible({ timeout: 5000 })
    await page.waitForTimeout(500)

    // Try to generate program again while racing
    await page.getByText('GENERATE PROGRAM').click()

    // Modal should appear
    const modal = page.locator('[role="dialog"], .modal, [class*="modal"]').first()
    await expect(modal).toBeVisible({ timeout: 5000 })

    // Cancel the modal
    const cancelButton = page.getByText('Cancel').first()
    await expect(cancelButton).toBeVisible()
    await cancelButton.click()

    // Modal should close
    await expect(modal).not.toBeVisible()

    // Race should still be running
    const statusText = await page.locator('span').filter({ hasText: /RACING|PAUSED/ }).textContent()
    expect(['RACING', 'PAUSED']).toContain(statusText?.trim())
  })

  test('should show confirmation modal when clicking restart during race', async ({ page }) => {
    await page.goto('/')

    // Setup
    await page.waitForLoadState('networkidle')
    await page.getByText('GENERATE PROGRAM').click()
    await page.waitForTimeout(500)

    // Start race
    const startButton = page.locator('button').filter({ hasText: /START|PAUSE|RESUME/ })
    await startButton.click()

    // Wait for race to start
    await expect(page.locator('span').filter({ hasText: 'RACING' })).toBeVisible({ timeout: 5000 })
    await page.waitForTimeout(500)

    // Click restart button
    await page.getByText('RESTART').click()

    // Modal should appear
    const modal = page.locator('[role="dialog"], .modal, [class*="modal"]').first()
    await expect(modal).toBeVisible({ timeout: 5000 })

    // Modal should contain confirmation text
    const modalText = await modal.textContent()
    expect(modalText).toContain('Confirm')
  })

  test('should allow canceling restart action', async ({ page }) => {
    await page.goto('/')

    // Setup
    await page.waitForLoadState('networkidle')
    await page.getByText('GENERATE PROGRAM').click()
    await page.waitForTimeout(500)

    // Start race
    const startButton = page.locator('button').filter({ hasText: /START|PAUSE|RESUME/ })
    await startButton.click()

    // Wait for race to start
    await expect(page.locator('span').filter({ hasText: 'RACING' })).toBeVisible({ timeout: 5000 })
    await page.waitForTimeout(500)

    // Click restart
    await page.getByText('RESTART').click()

    // Modal appears
    const modal = page.locator('[role="dialog"], .modal, [class*="modal"]').first()
    await expect(modal).toBeVisible()

    // Click cancel
    const cancelButton = page.getByText('Cancel').first()
    await cancelButton.click()

    // Modal should close
    await expect(modal).not.toBeVisible()

    // Race should continue
    const statusText = await page.locator('span').filter({ hasText: /RACING|PAUSED/ }).textContent()
    expect(['RACING', 'PAUSED']).toContain(statusText?.trim())
  })

  test('should show confirmation before generating new program on existing schedule', async ({
    page,
  }) => {
    await page.goto('/')

    // Setup: Generate initial program
    await page.waitForLoadState('networkidle')
    await page.getByText('GENERATE PROGRAM').click()
    await page.waitForTimeout(500)

    // Try to generate program again (not during race)
    await page.getByText('GENERATE PROGRAM').click()

    // Modal should appear
    const modal = page.locator('[role="dialog"], .modal, [class*="modal"]').first()
    await expect(modal).toBeVisible({ timeout: 5000 })

    // Should have continue and cancel options
    const continueButton = page.getByText('Continue').first()
    const cancelButton = page.getByText('Cancel').first()

    await expect(continueButton).toBeVisible()
    await expect(cancelButton).toBeVisible()
  })
})
