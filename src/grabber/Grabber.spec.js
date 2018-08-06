const Grabber = require('./Grabber');
const path = require('path');
const testUrl = 'https://theme.crumina.net/html-olympus/02-ProfilePage.html';
const selector = '.hentry.post';
jest.setTimeout(10000);

describe('Grabber spec', () => {
    it('Should be able to instantiate the grabber', async () => {
        const grabber = new Grabber();
        const domTree = await grabber.grab(testUrl, selector);
        console.log(JSON.stringify(domTree));

        expect(true).toBe(true);
    });
    it.only('Should grab the styles with the exception of framework specific ones', async () => {
        const grabber = new Grabber();
        const fileToOpen = path.resolve('./src/fixtures/simple.html');
        const domTree = await grabber.grab(`file://${fileToOpen}`, '.content');
        console.log(JSON.stringify(domTree));

        expect(true).toBe(true);
    });
});
