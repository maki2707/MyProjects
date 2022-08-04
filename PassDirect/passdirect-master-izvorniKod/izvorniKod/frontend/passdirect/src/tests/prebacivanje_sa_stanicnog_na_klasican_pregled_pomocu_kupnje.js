const {Builder, By, Key, until} = require('selenium-webdriver');

(async function example() {
  let driver = await new Builder().forBrowser('chrome').build();
  try {
    await driver.get('http://passdirect-app.herokuapp.com/login');
    //await new Promise(resolve => setTimeout(resolve, 10000));
    await driver.findElement(By.id('email-input')).sendKeys('pass.direct@hotmail.com');
    await driver.findElement(By.name('password')).sendKeys('sifrasifra1');
    await driver.findElement(By.className('anew btn btn-2 navlinkother btn-noborder')).click();
    await new Promise(resolve => setTimeout(resolve, 1000));
    await driver.get('http://passdirect-app.herokuapp.com/timetable/2');
    await new Promise(resolve => setTimeout(resolve, 2000));
    var kol = await driver.findElements(By.className('station-grid-item'));
    await kol[11].click();
    await new Promise(resolve => setTimeout(resolve, 3000));
    let navbar = await driver.findElements(By.className('anew navlinkother btn btn-2 '));
    await navbar[2].click();
    await new Promise(resolve => setTimeout(resolve, 1000));
    //await driver.getCurrentUrl().then(url => console.assert(url == "http://passdirect-app.herokuapp.com/timetable-classic"));
  } finally {
    await driver.quit();
  }
})();