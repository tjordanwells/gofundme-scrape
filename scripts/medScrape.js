const puppeteer = require('puppeteer');
const d3 = require("d3");
const fs = require("fs");
const mkdirp = require("mkdirp");

const mongoose = require("mongoose");
const db = require("../db");

mongoose.connect("mongodb://localhost/gofundme");

puppeteer.launch({headless: true}).then(async browser => {
  const page = await browser.newPage();
  page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1');
  
  await page.goto('https://www.gofundme.com/discover/medical-fundraiser', {timeout: 0});
  await page.waitForSelector('.content-section');

 for (let i = 0; i < 100; i++) {
    await page.waitForSelector('div.mt2x > a.js-load-more-results', {timeout: 0});
    
    await page.evaluate(() => {
      document.querySelectorAll('a.js-load-more-results')[0].click();
    });

    console.log(`click ${i}`);
  }

  const output = [];

  await page.waitForSelector('div.funds-contain--tiles-grid');
  
  const tiles = await page.$$('div.funds-contain--tiles-grid div.js-fund-tile');

  for (const tile of tiles) {
    const title = await tile.$eval('div.fund-title', div => div.innerText);
    const location = await tile.$eval('div.fund-location > span', span => span.innerText);
    const raised = await tile.$eval('div.show-for-medium > strong', strong => strong.innerText.split(' raised'));
    const total = await tile.$eval('div.fund-item > div.show-for-medium', div => div.innerText.split('of '));

    const raisedString = raised[0];
    const totalString = total[1];

    output.push({
      category: "Medical",
      title,
      location,
      raisedString,
      totalString
    });

    db.Fundraiser.create(output)
      .then(dbFundraiser => {
        console.log(`success: ${dbFundraiser}`);
      })
      .catch(error => {
        return res.json(error);
      });
  };

  function write() {
    const OUT_PATH = '../output/';
    mkdirp.sync(OUT_PATH, err => console.log(err));
  
    const csv = d3.csvFormat(output);
    const timestamp = Date.now();

    fs.writeFileSync(`../output/medical-fundraisers-${timestamp}.csv`, csv);
  };

  write();

  await browser.close();

}).catch((error) => {
  if (error) {
    console.log(error);
  }
});
