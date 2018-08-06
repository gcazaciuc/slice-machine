const PropertyNameOptimizer = require('./PropertyNameOptimizer');
jest.setTimeout(10000);

describe('Grabber spec', () => {
    it('Should be able to contract full margin properties', async () => {
        const cssOptimizer = new PropertyNameOptimizer();
        const css = cssOptimizer.contract({
            'margin-top': '10px',
            'margin-left': '20px',
            'margin-right': '30px',
            'margin-bottom': '40px'
        });
        expect(css).toEqual({ margin: '10px 30px 40px 20px' });
    });

    it('Should be able to contract full padding properties', async () => {
        const cssOptimizer = new PropertyNameOptimizer();
        const css = cssOptimizer.contract({
            'padding-top': '10px',
            'padding-left': '20px',
            'padding-right': '30px',
            'padding-bottom': '40px'
        });
        expect(css).toEqual({ padding: '10px 30px 40px 20px' });
    });

    it('Should be able to contract border properties', async () => {
        const cssOptimizer = new PropertyNameOptimizer();
        const css = cssOptimizer.contract({
            'border-width': '10px',
            'border-style': 'dotted',
            'border-color': 'blue'
        });
        expect(css).toEqual({ border: '10px dotted blue' });
    });

    it('Should be able to contract border TOP properties', async () => {
        const cssOptimizer = new PropertyNameOptimizer();
        const css = cssOptimizer.contract({
            'border-top-width': '10px',
            'border-top-style': 'dotted',
            'border-top-color': 'blue'
        });
        expect(css).toEqual({ 'border-top': '10px dotted blue' });
    });

    it('Should be able to contract border RIGHT properties', async () => {
        const cssOptimizer = new PropertyNameOptimizer();
        const css = cssOptimizer.contract({
            'border-right-width': '10px',
            'border-right-style': 'dotted',
            'border-right-color': 'blue'
        });
        expect(css).toEqual({ 'border-right': '10px dotted blue' });
    });
});
