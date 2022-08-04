const {Builder, By, Key, until} = require('selenium-webdriver');

(async function example() {
  let driver = await new Builder().forBrowser('chrome').build();
  try {
    await driver.get('http://passdirect-app.herokuapp.com/login');
    //await new Promise(resolve => setTimeout(resolve, 10000));
    await driver.findElement(By.id('email-input')).sendKeys('pass.direct@hotmail.com');
    await driver.findElement(By.name('password')).sendKeys('sifrasifra1');
    await driver.findElement(By.className('anew btn btn-2 navlinkother btn-noborder')).click();
    await new Promise(resolve => setTimeout(resolve, 2000));
    await driver.get('http://passdirect-app.herokuapp.com/timetable-classic');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await driver.findElement(By.id('react-select-2-input')).click();
    await driver.findElement(By.id('react-select-2-option-0')).click();
    await driver.findElement(By.id('react-select-3-input')).click();
    await driver.findElement(By.id('react-select-3-option-2')).click();
    await driver.findElement(By.name('planDatPoc')).sendKeys('01012024');
    await driver.findElement(By.className('anew navlinkother btn btn-2 btn-noborder ')).click();
    await new Promise(resolve => setTimeout(resolve, 3000));
    let navbar = await driver.findElements(By.className('anew navlinkother btn btn-2 '));
    await new Promise(resolve => setTimeout(resolve, 6000));
    await navbar[2].click();
    await new Promise(resolve => setTimeout(resolve, 1000));
  } finally {
    await driver.quit();
  }
})();