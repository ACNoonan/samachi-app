import puppeteer, { Browser, Page } from 'puppeteer';
import { expect } from 'chai';
import { describe, before, after, it } from 'mocha';

describe('Samachi Authentication and Wallet Flow', () => {
  let browser: Browser;
  let page: Page;

  before(async () => {
    browser = await puppeteer.launch({
      headless: false, // Set to true for CI/CD
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    page = await browser.newPage();
  });

  after(async () => {
    await browser.close();
  });

  it('should redirect to login when not authenticated', async () => {
    await page.goto('http://localhost:3000/dashboard');
    await page.waitForNavigation();
    expect(page.url()).to.include('/login');
  });

  it('should show wallet not connected state when authenticated without wallet', async () => {
    // First login
    await page.goto('http://localhost:3000/login');
    await page.type('input[type="email"]', 'test@example.com');
    await page.type('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForNavigation();

    // Check wallet page
    await page.goto('http://localhost:3000/wallet');
    await page.waitForSelector('.glass-card');
    
    // Verify wallet not connected message
    const walletText = await page.$eval('.glass-card', (el: Element) => el.textContent || '');
    expect(walletText).to.include('Your Solana wallet is not connected');
  });

  it('should show connected state when wallet is connected', async () => {
    // Navigate to wallet page
    await page.goto('http://localhost:3000/wallet');
    
    // Click connect wallet button
    await page.click('button:has-text("Connect Wallet")');
    
    // Wait for wallet connection modal
    await page.waitForSelector('.wallet-adapter-modal');
    
    // Select Phantom wallet
    await page.click('button:has-text("Phantom")');
    
    // Wait for connection to complete
    await page.waitForSelector('.glass-card', { timeout: 10000 });
    
    // Verify connected state
    const walletText = await page.$eval('.glass-card', (el: Element) => el.textContent || '');
    expect(walletText).to.not.include('Your Solana wallet is not connected');
  });

  it('should show Glownet features when available', async () => {
    // Navigate to wallet page
    await page.goto('http://localhost:3000/wallet');
    
    // Wait for Glownet section
    await page.waitForSelector('.glass-card');
    
    // Check for Glownet features
    const glownetText = await page.$eval('.glass-card', (el: Element) => el.textContent || '');
    expect(glownetText).to.include('Network Credit');
  });

  it('should handle card registration flow', async () => {
    // Navigate to card registration page
    await page.goto('http://localhost:3000/card/card-test-005');
    
    // Check if card is registered
    const pageContent = await page.content();
    if (pageContent.includes('Sign In')) {
      // Card is registered, should show sign in option
      expect(pageContent).to.include('Sign In');
    } else {
      // Card is not registered, should show registration form
      expect(pageContent).to.include('Register');
      
      // Fill registration form
      await page.type('input[type="email"]', 'newuser@example.com');
      await page.type('input[type="password"]', 'password123');
      await page.click('button[type="submit"]');
      
      // Wait for registration to complete
      await page.waitForNavigation();
      
      // Verify redirect to dashboard
      expect(page.url()).to.include('/dashboard');
    }
  });
}); 