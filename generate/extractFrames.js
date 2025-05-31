// Using some ChatGPT generated code to generate the frames
// Usage: node extractFrames.js <svg-file-path>

// This script extracts frames from an SVG animation using Puppeteer.
// It captures each frame at a specified FPS and saves them as PNG files.
// It also handles dynamic animation delays by freezing the animation at each frame.
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const FPS = 30;
const DURATION = 2;
const TOTAL_FRAMES = FPS * DURATION;
const SVG_FILE = process.argv[2];
const OUTPUT_DIR = './frames';

if (!SVG_FILE) {
  console.error('Usage: node extractFrames.js <svg-file-path>');
  process.exit(1);
}

(async () => {
  const svgPath = path.resolve(SVG_FILE);
  const svgContent = fs.readFileSync(svgPath, 'utf8');

  // Extract SVG size
  const widthMatch = svgContent.match(/<svg[^>]*\swidth="([\d.]+)(px)?"/i);
  const heightMatch = svgContent.match(/<svg[^>]*\sheight="([\d.]+)(px)?"/i);
  const WIDTH = widthMatch ? parseInt(widthMatch[1]) : 720;
  const HEIGHT = heightMatch ? parseInt(heightMatch[1]) : 720;

  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR);

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: WIDTH, height: HEIGHT });

  // Load the SVG as raw HTML content
  // Ensure the page is fully rendered and styles/fonts are applied before capturing the first frame
  await page.setContent(svgContent, { waitUntil: 'load' });
  await page.evaluateHandle('document.fonts.ready');
  await page.addStyleTag({ content: 'body { margin: 0; }' });
  await page.evaluate(() => void document.body.offsetHeight);
  await new Promise(resolve => setTimeout(resolve, 100));

  for (let i = 0; i < TOTAL_FRAMES; i++) {
    const t = (i / FPS) % DURATION;

    await page.evaluate((t) => {
      const svg = document.querySelector('svg');
      if (!svg) return;

      // Remove old style if it exists
      const existing = svg.querySelector('#freeze-style');
      if (existing) existing.remove();

      // Gather dynamic delay overrides
      const styleOverrides = [];

      const elements = svg.querySelectorAll('*');
      elements.forEach((el, index) => {
        const computed = getComputedStyle(el);
        const delays = computed.animationDelay.split(',').map(s => parseFloat(s.trim()) || 0);
        const newDelays = delays.map(d => `${d - t}s`);
        if (newDelays.length > 0 && computed.animationName !== 'none') {
          const selector = `._anim_${index}`;
          el.classList.add(selector.slice(1)); // remove dot
          styleOverrides.push(`
            ${selector} {
              animation-play-state: paused !important;
              animation-delay: ${newDelays.join(', ')} !important;
              animation-fill-mode: both !important;
            }
          `);
        }
      });

      const style = document.createElementNS("http://www.w3.org/2000/svg", "style");
      style.setAttribute("id", "freeze-style");
      style.textContent = styleOverrides.join('\n');
      svg.insertBefore(style, svg.firstChild);
    }, t);

    await new Promise(resolve => setTimeout(resolve, 30));

    const filePath = path.join(OUTPUT_DIR, `throbber-${String(i+1).padStart(2, '0')}.png`);
    await page.screenshot({ path: filePath });
    console.log(`Saved frame ${i+1} at t=${t.toFixed(3)}s`);
  }

  await browser.close();
})();
