const {Builder, By, Key, until} = require('selenium-webdriver');

(async function example() {
  let driver = await new Builder().forBrowser('chrome').build();
  try {
    await driver.get('http://passdirect-app.herokuapp.com/login');
    //await new Promise(resolve => setTimeout(resolve, 10000));
    await driver.findElement(By.id('email-input')).sendKeys('gabrijelovadruzina@gmail.com');
    await driver.findElement(By.name('password')).sendKeys('adminadmin');
    await driver.findElement(By.className('anew btn btn-2 navlinkother btn-noborder')).click();
    await new Promise(resolve => setTimeout(resolve, 2000));
    await driver.get('http://passdirect-app.herokuapp.com/admin');
    let gumbi = await driver.findElements(By.className('anew navlinkother btn btn-2 btn-noborder'))
    await gumbi[1].click();
    await new Promise(resolve => setTimeout(resolve, 3000));
    let navbar = await driver.findElements(By.className('anew navlinkother btn btn-2 '));
    await navbar[3].click();
    await new Promise(resolve => setTimeout(resolve, 1000));
    //await driver.getCurrentUrl().then(url => console.assert(url == "http://passdirect-app.herokuapp.com/"));
  } finally {
    await driver.quit();
  }
})();