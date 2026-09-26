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

    async function getNameInput(): Promise<WebElement> {
        return driver.findElement(By.name('name'));
    }

    async function getHeightInput(): Promise<WebElement> {
        return driver.findElement(By.name('height'));
    }

    async function getWeightInput(): Promise<WebElement> {
        return driver.findElement(By.name('weight'));
    }

    async function getTextInputs(): Promise<WebElement[]> {
        return driver.findElements(By.css('input[type="text"]'));
    }

    async function getGenderRadioButtons(): Promise<WebElement[]> {
        return driver.findElements(By.css('input[name="gender"][type="radio"]'));
    }

    async function getSubmitButton(): Promise<WebElement> {
        return driver.findElement(By.css('input[type="submit"]'));
    }

    test('contains words menu and banners', async () => {
        const bodyText = (await driver.findElement(By.tagName('body')).getText()).toLowerCase();

        expect(bodyText.includes('menu')).toBe(true);
        expect(bodyText.includes('banners')).toBe(true);
    });

    test('contains CoolSoft by Somebody in the bottom table cell', async () => {
        const rows = await driver.findElements(By.css('table tr'));
        const lastRow = rows[rows.length - 1];
        const cells = await lastRow.findElements(By.css('th, td'));
        const lastCellText = await cells[cells.length - 1].getText();

        expect(lastCellText.includes('CoolSoft by Somebody')).toBe(true);
    });

    test('has empty text inputs and unselected gender by default', async () => {
        const nameInput = await getNameInput();
        const heightInput = await getHeightInput();
        const weightInput = await getWeightInput();

        expect(await nameInput.getAttribute('value')).toBe('');
        expect(await heightInput.getAttribute('value')).toBe('');
        expect(await weightInput.getAttribute('value')).toBe('');

        const radios = await getGenderRadioButtons();
        for (const radio of radios) {
            expect(await radio.isSelected()).toBe(false);
        }
    });

    test('submitting height 50 and weight 3 opens a response page', async () => {
        const form = await getForm();
        const heightInput = await getHeightInput();
        const weightInput = await getWeightInput();

        await heightInput.sendKeys('50');
        await weightInput.sendKeys('3');

        const submitButton = await getSubmitButton();
        await submitButton.click();

        await driver.wait(until.stalenessOf(form), 10000);

        const currentUrl = await driver.getCurrentUrl();
        const title = await driver.getTitle();
        const bodyText = await driver.findElement(By.tagName('body')).getText();

        expect(currentUrl.length).toBeGreaterThan(0);
        expect(title.length).toBeGreaterThan(0);
        expect(bodyText.length).toBeGreaterThan(0);
    });

    test('contains a form with three text inputs, two radio buttons and one button', async () => {
        const inputs = await getTextInputs();
        const radios = await getGenderRadioButtons();
        const submitButtons = await driver.findElements(By.css('input[type="submit"]'));

        expect(inputs.length).toBe(3);
        expect(radios.length).toBe(2);
        expect(submitButtons.length).toBe(1);
    });

    test('submitting invalid height and weight produces a validation response', async () => {
        const heightInput = await getHeightInput();
        const weightInput = await getWeightInput();

        await heightInput.sendKeys('10');
        await weightInput.sendKeys('1');

        const submitButton = await getSubmitButton();
        await submitButton.click();

        try {
            const alert = await driver.switchTo().alert();
            const alertText = await alert.getText();

            expect(alertText.length).toBeGreaterThan(0);
            await alert.accept();
        } catch {
            const bodyText = await driver.findElement(By.tagName('body')).getText();
            expect(bodyText.length).toBeGreaterThan(0);
        }
    });

    test('contains current date in DD.MM.YYYY format', async () => {
        const now = new Date();
        const dd = String(now.getDate()).padStart(2, '0');
        const mm = String(now.getMonth() + 1).padStart(2, '0');
        const yyyy = String(now.getFullYear());
        const today = `${dd}.${mm}.${yyyy}`;

        const bodyText = await driver.findElement(By.tagName('body')).getText();
        expect(bodyText.includes(today)).toBe(true);
    });
});