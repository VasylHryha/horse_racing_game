import { expect, test } from '@playwright/test'

test.describe('Mobile Responsiveness', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should display mobile-friendly home page', {
    tag: '@mobile',
  }, async ({ page }) => {
    // Verify home page loads
    await expect(page.getByRole('heading', { name: /Horse Racing Simulator/i })).toBeVisible()

    // Verify buttons are visible and clickable
    const generateBtn = page.getByTestId('btn-generate-horses')
    await expect(generateBtn).toBeVisible()

    const startRacingBtn = page.getByTestId('btn-start-racing')
    await expect(startRacingBtn).toBeVisible()
  })

  test('should navigate to race page and display mobile race controls', {
    tag: '@mobile',
  }, async ({ page }) => {
    // Generate horses and start racing
    const startRacingBtn = page.getByTestId('btn-start-racing')
    await expect(startRacingBtn).toBeEnabled()
    await startRacingBtn.click()

    // Verify we're on the race page
    await expect(page.getByRole('heading', { name: /Race Track/i })).toBeVisible()

    // Verify mobile race controls are visible
    const homeBtn = page.getByTestId('btn-home')
    await expect(homeBtn).toBeVisible()

    const raceCtrlBtn = page.getByTestId('race-ctrl')
    await expect(raceCtrlBtn).toBeVisible()
    await expect(raceCtrlBtn).toHaveText(/START|RESUME|PAUSE/)

    const horsesBtn = page.getByTestId('open-horses')
    await expect(horsesBtn).toBeVisible()

    // Verify status badge is visible
    const statusBadge = page.getByTestId('race-status-badge')
    await expect(statusBadge).toBeVisible()
  })

  test('should open and close horses panel on mobile', {
    tag: '@mobile',
  }, async ({ page }) => {
    // Navigate to race page
    await page.getByTestId('btn-start-racing').click()

    // Open horses panel
    const horsesBtn = page.getByTestId('open-horses')
    await horsesBtn.click()

    // Verify panel is open
    const horsesPanel = page.getByTestId('horses-slideover')
    await expect(horsesPanel).toBeVisible()

    // Close panel by clicking the X button
    const closeBtn = horsesPanel.getByRole('button', { name: /close/i })
    await closeBtn.click()

    // Verify panel is closed
    await expect(horsesPanel).not.toBeVisible()
  })

  test('should display race track with horizontal scroll on mobile', {
    tag: '@mobile',
  }, async ({ page, isMobile }) => {
    // Skip this test on desktop viewports
    test.skip(!isMobile, 'This test is only for mobile viewports')

    // Navigate to race page
    await page.getByTestId('btn-start-racing').click()

    // Verify race track container is visible
    const raceTrack = page.getByTestId('race-track')
    await expect(raceTrack).toBeVisible()

    // Verify the track has horizontal scroll capability
    const isScrollable = await raceTrack.evaluate(el => el.scrollWidth > el.clientWidth)

    // On mobile (Pixel 5 is 393px wide), the 520px track should be scrollable
    expect(isScrollable).toBeTruthy()

    // And scrolling actually changes scrollLeft
    const before = await raceTrack.evaluate(el => el.scrollLeft)
    await raceTrack.evaluate(el => el.scrollBy({ left: 80, behavior: 'instant' }))
    const after = await raceTrack.evaluate(el => el.scrollLeft)
    expect(after).toBeGreaterThan(before)
  })

  test('should start and pause race with mobile controls', {
    tag: '@mobile',
  }, async ({ page }) => {
    // Navigate to race page
    await page.getByTestId('btn-start-racing').click()

    const raceCtrlBtn = page.getByTestId('race-ctrl')
    const statusBadge = page.getByTestId('race-status-badge')

    // Start race
    await expect(raceCtrlBtn).toHaveText(/START/)
    await raceCtrlBtn.click()

    // Wait for race to start
    await expect(statusBadge).toHaveText('RACING', { timeout: 3000 })
    await expect(raceCtrlBtn).toHaveText(/PAUSE/)

    // Pause race
    await raceCtrlBtn.click()
    await expect(statusBadge).toHaveText('PAUSED')
    await expect(raceCtrlBtn).toHaveText(/RESUME/)
  })

  test('shows swipe hint on mobile, hidden on desktop', {
    tag: '@mobile',
  }, async ({ page, isMobile }) => {
    await page.getByTestId('btn-start-racing').click()
    const hint = page.getByText('← Swipe →')
    if (isMobile)
      await expect(hint).toBeVisible()
    else
      await expect(hint).toBeHidden()
  })

  test('status badge exposes proper ARIA live region', {
    tag: '@mobile',
  }, async ({ page }) => {
    await page.getByTestId('btn-start-racing').click()
    const badge = page.getByTestId('race-status-badge')
    await expect(badge).toHaveAttribute('role', 'status')
    await expect(badge).toHaveAttribute('aria-live', 'polite')
    await expect(badge).toHaveAttribute('aria-atomic', 'true')
  })

  test('horses panel width is responsive to viewport', {
    tag: '@mobile',
  }, async ({ page, isMobile }) => {
    await page.getByTestId('btn-start-racing').click()
    await page.getByTestId('open-horses').click()

    const panel = page.getByTestId('horses-slideover')
    await expect(panel).toBeVisible()

    const box = await panel.boundingBox()
    expect(box).not.toBeNull()
    const vp = page.viewportSize()!

    if (isMobile) {
      // On mobile, panel should use (nearly) full viewport width
      expect(box!.width).toBeGreaterThanOrEqual(vp.width - 4)
      expect(box!.width).toBeLessThanOrEqual(vp.width + 2)
    }
    else {
      // On desktop, width is capped by max-w-md (~448px), allow small tolerance
      expect(box!.width).toBeGreaterThanOrEqual(420)
      expect(box!.width).toBeLessThanOrEqual(470)
    }
  })

  test('overlay click closes panel on desktop only', {
    tag: '@mobile',
  }, async ({ page, isMobile }) => {
    await page.getByTestId('btn-start-racing').click()
    await page.getByTestId('open-horses').click()
    const panel = page.getByTestId('horses-slideover')
    await expect(panel).toBeVisible()

    if (!isMobile) {
      // Click outside the panel area to hit the overlay
      const vp = page.viewportSize()!
      await page.mouse.click(vp.width - 5, 10)
      await expect(panel).toBeHidden()
    }
    else {
      // On mobile the panel fills the screen — overlay click is not viable
      await expect(panel).toBeVisible()
    }
  })
})
