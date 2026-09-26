import { Builder, By, WebDriver, WebElement, until } from 'selenium-webdriver';

const BASE_URL = 'http://svyatoslav.biz/testlab/wt/';

describe('WT alternative lab tests', () => {
  let driver: WebDriver;

  beforeEach(async () => {
    driver = await new Builder().forBrowser('chrome').build();
    await driver.manage().window().maximize();
    await driver.get(BASE_URL);
  });

  afterEach(async () => {
    if (driver) {
      await driver.quit();
    }
  });

  async function getForm(): Promise<WebElement> {
    return driver.findElement(By.css('form'));
  }

  async function getTextInputs(): Promise<WebElement[]> {
    const form = await getForm();
    return form.findElements(By.css('input[type="text"]'));
  }

  async function getRadioButtons(): Promise<WebElement[]> {
    const form = await getForm();
    return form.findElements(By.css('input[type="radio"]'));
  }

  async function getSubmitButton(): Promise<WebElement> {
    const form = await getForm();
    const buttons = await form.findElements(By.css('input[type="submit"], input[type="button"], button'));
    return buttons[0];
  }

  test('contains words menu and banners', async () => {
    const source = (await driver.getPageSource()).toLowerCase();
    expect(source.includes('menu')).toBe(true);
    expect(source.includes('banners')).toBe(true);
  });

  test('contains CoolSoft by Somebody in the bottom table cell', async () => {
    const rows = await driver.findElements(By.css('table tr'));
    const lastRow = rows[rows.length - 1];
    const cells = await lastRow.findElements(By.css('th, td'));
    const lastCellText = await cells[cells.length - 1].getText();
    expect(lastCellText.includes('CoolSoft by Somebody')).toBe(true);
  });

  test('has empty text inputs and unselected gender by default', async () => {
    const inputs = await getTextInputs();
    for (const input of inputs) {
      expect(await input.getAttribute('value')).toBe('');
    }

    const radios = await getRadioButtons();
    for (const radio of radios) {
      expect(await radio.isSelected()).toBe(false);
    }
  });

    test('shows too high body mass message after submitting height 50 and weight 3', async () => {
        const form = await getForm();
        const inputs = await getTextInputs();

        await inputs[0].sendKeys('50');
        await inputs[1].sendKeys('3');

        const submitButton = await getSubmitButton();
        await submitButton.click();

        await driver.wait(until.stalenessOf(form), 10000);
        const source = await driver.getPageSource();
        expect(source.includes('Слишком большая масса тела')).toBe(true);
    });

  test('contains a form with three text inputs, two radio buttons and one button', async () => {
    const inputs = await getTextInputs();
    const radios = await getRadioButtons();
    const form = await getForm();
    const buttons = await form.findElements(By.css('input[type="submit"], button'));

    expect(inputs.length).toBe(3);
    expect(radios.length).toBe(2);
    expect(buttons.length).toBe(1);
  });

    test('shows validation messages for wrong height and weight', async () => {
        const inputs = await getTextInputs();
        await inputs[0].sendKeys('10');
        await inputs[1].sendKeys('1');

        const submitButton = await getSubmitButton();
        await submitButton.click();

        try {
            const alert = await driver.switchTo().alert();
            const alertText = await alert.getText();

            expect(alertText.includes('50-300') || alertText.toLowerCase().includes('рост')).toBe(true);
            expect(alertText.includes('3-500') || alertText.toLowerCase().includes('вес')).toBe(true);

            await alert.accept();
        } catch {
            const source = await driver.getPageSource();
            expect(source.includes('50-300 см') || source.includes('50-300')).toBe(true);
            expect(source.includes('3-500 кг') || source.includes('3-500')).toBe(true);
        }
    });

  test('contains current date in DD.MM.YYYY format', async () => {
    const now = new Date();
    const dd = String(now.getDate()).padStart(2, '0');
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const yyyy = String(now.getFullYear());
    const today = `${dd}.${mm}.${yyyy}`;

    const source = await driver.getPageSource();
    expect(source.includes(today)).toBe(true);
  });
});
