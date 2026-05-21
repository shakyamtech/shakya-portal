const puppeteer = require('puppeteer');

(async () => {
  try {
    console.log("Launching browser...");
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 800 });
    console.log("Going to URL...");
    await page.goto('https://shreekrishna.jyasapasa.workers.dev/login', { waitUntil: 'networkidle2' });
    
    console.log("Taking screenshot...");
    // Crop a bit more center as requested
    await page.screenshot({ 
        path: 'public/images/project_shreekrishna.png', 
        clip: { x: 150, y: 50, width: 900, height: 600 } 
    });
    console.log("Screenshot saved!");
    await browser.close();
  } catch(e) {
    console.error(e);
  }
})();
