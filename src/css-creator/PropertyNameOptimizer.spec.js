const PropertyNameOptimizer = require('./PropertyNameOptimizer')
jest.setTimeout(10000)

describe('Grabber spec', () => {
    it('Should be able to contract full margin properties', async () => {
        const cssOptimizer = new PropertyNameOptimizer();
        const css = cssOptimizer.contract({
            'margin-top': '10px',
            'margin-left': '20px',
            'margin-right': '30px',
            'margin-bottom': '40px'
        })
        expect(css).toEqual( { margin: '10px 30px 40px 20px' })

        expect(true).toBe(true)
    })

    it('Should be able to contract full padding properties', async () => {
        const cssOptimizer = new PropertyNameOptimizer();
        const css = cssOptimizer.contract({
            'padding-top': '10px',
            'padding-left': '20px',
            'padding-right': '30px',
            'padding-bottom': '40px'
        })
        expect(css).toEqual( { padding: '10px 30px 40px 20px' })

        expect(true).toBe(true)
    })
});