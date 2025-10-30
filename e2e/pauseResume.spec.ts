import { expect, test } from '@playwright/test'

test.describe('Pause and Resume', () => {
  test('should pause race and then resume it', async ({ page }) => {
    await page.goto('/')

    // Setup: Generate horses and program
    await page.waitForLoadState('networkidle')
    await page.getByText('GENERATE PROGRAM').click()
    await page.waitForTimeout(500)

    // Start race
    const startButton = page.locator('button').filter({ hasText: /START|PAUSE|RESUME/ })
    await startButton.click()

    // Wait for race to start
    await expect(page.locator('span').filter({ hasText: 'RACING' })).toBeVisible({ timeout: 5000 })
    await page.waitForTimeout(1000)

    // Verify button shows PAUSE
    const pauseButton = page.locator('button').filter({ hasText: 'PAUSE' })
    await expect(pauseButton).toBeVisible()

    // Click pause
    await pauseButton.click()

    // Verify status changed to PAUSED
    await expect(page.locator('span').filter({ hasText: 'PAUSED' })).toBeVisible()

    // Verify button changed to RESUME
    const resumeButton = page.locator('button').filter({ hasText: 'RESUME' })
    await expect(resumeButton).toBeVisible()

    // Pause badge should have yellow background
    const pausedBadge = page.locator('span').filter({ hasText: 'PAUSED' })
    const badgeClass = await pausedBadge.getAttribute('class')
    expect(badgeClass).toContain('bg-yellow')

    // Click resume
    await resumeButton.click()

    // Status should return to RACING
    await expect(page.locator('span').filter({ hasText: 'RACING' })).toBeVisible()

    // Button should change back to PAUSE
    await expect(pauseButton).toBeVisible()
  })

  test('should maintain horse positions when pausing', async ({ page }) => {
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
    await page.waitForTimeout(1000)

    // Get horse positions before pause
    const horseElements = page.locator('[class*="horse"]').first() // Get first horse element
    const positionBefore = await horseElements.evaluate((el) => {
      return window.getComputedStyle(el).transform
    })

    // Pause the race
    await page.locator('button').filter({ hasText: 'PAUSE' }).click()
    await page.waitForTimeout(300)

    // Check position is the same after a moment
    const positionAfter1 = await horseElements.evaluate((el) => {
      return window.getComputedStyle(el).transform
    })
    expect(positionAfter1).toBe(positionBefore)

    // Wait a bit more and check again
    await page.waitForTimeout(500)
    const positionAfter2 = await horseElements.evaluate((el) => {
      return window.getComputedStyle(el).transform
    })
    expect(positionAfter2).toBe(positionBefore)

    // Resume and verify movement resumes
    await page.locator('button').filter({ hasText: 'RESUME' }).click()
    await page.waitForTimeout(500)

    const positionAfterResume = await horseElements.evaluate((el) => {
      return window.getComputedStyle(el).transform
    })
    // Position should have changed after resume
    expect(positionAfterResume).not.toBe(positionBefore)
  })

  test('should allow multiple pause/resume cycles', async ({ page }) => {
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

    // Cycle 1: Pause and Resume
    await page.waitForTimeout(1000)
    await page.locator('button').filter({ hasText: 'PAUSE' }).click()
    await expect(page.locator('span').filter({ hasText: 'PAUSED' })).toBeVisible()
    await page.locator('button').filter({ hasText: 'RESUME' }).click()
    await expect(page.locator('span').filter({ hasText: 'RACING' })).toBeVisible()

    // Cycle 2: Pause and Resume again
    await page.waitForTimeout(500)
    await page.locator('button').filter({ hasText: 'PAUSE' }).click()
    await expect(page.locator('span').filter({ hasText: 'PAUSED' })).toBeVisible()
    await page.locator('button').filter({ hasText: 'RESUME' }).click()
    await expect(page.locator('span').filter({ hasText: 'RACING' })).toBeVisible()

    // Cycle 3: Pause and Resume one more time
    await page.waitForTimeout(500)
    await page.locator('button').filter({ hasText: 'PAUSE' }).click()
    await expect(page.locator('span').filter({ hasText: 'PAUSED' })).toBeVisible()
    await page.locator('button').filter({ hasText: 'RESUME' }).click()
    await expect(page.locator('span').filter({ hasText: 'RACING' })).toBeVisible()
  })

  test('should pause from RACING state and unpause back to RACING', async ({ page }) => {
    await page.goto('/')

    // Setup
    await page.waitForLoadState('networkidle')
    await page.getByText('GENERATE PROGRAM').click()
    await page.waitForTimeout(500)

    // Start race
    const startButton = page.locator('button').filter({ hasText: /START|PAUSE|RESUME/ })
    await startButton.click()

    // Wait for RACING state
    await expect(page.locator('span').filter({ hasText: 'RACING' })).toBeVisible({ timeout: 5000 })

    // Get button in RACING state
    let button = page.locator('button').filter({ hasText: 'PAUSE' })
    expect(button).toBeDefined()

    // Pause
    await button.click()
    await expect(page.locator('span').filter({ hasText: 'PAUSED' })).toBeVisible()

    // Get button in PAUSED state
    button = page.locator('button').filter({ hasText: 'RESUME' })
    expect(button).toBeDefined()

    // Resume
    await button.click()
    await expect(page.locator('span').filter({ hasText: 'RACING' })).toBeVisible()

    // Get button back in RACING state
    button = page.locator('button').filter({ hasText: 'PAUSE' })
    expect(button).toBeDefined()
  })
})
