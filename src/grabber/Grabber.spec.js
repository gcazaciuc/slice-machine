const Grabber = require('./Grabber');
const testUrl = 'https://theme.crumina.net/html-olympus/02-ProfilePage.html';
const selector = '.hentry.post';
jest.setTimeout(10000);

describe('Grabber spec', () => {
    it('Should be able to instantiate the grabber', async () => {
        const grabber = new Grabber();
        const { css } = await grabber.grab(testUrl, selector);
        console.log(JSON.stringify(css));

        expect(true).toBe(true);
    });
});
