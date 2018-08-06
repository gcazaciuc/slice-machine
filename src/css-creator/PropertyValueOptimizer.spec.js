const PropertyValueOptimizer = require('./PropertyValueOptimizer');
jest.setTimeout(10000);

describe('Grabber spec', () => {
    it('Should be able to contract full margin properties', async () => {
        const cssOptimizer = new PropertyValueOptimizer();
        const css = cssOptimizer.optimize({
            color: 'rgb(100, 100, 0)'
        });
        expect(css).toEqual({ color: '#646400' });
    });
});
