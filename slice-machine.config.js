module.exports = {
    language: 'typescript',
    url: 'https://www.bobbibrown.com.mx/products/2339/makeup/lips',
    slices: [
        {
            sel: '.product-grid',
            name: 'ProductGrid',
            slices: [
                {
                    sel: '.product-grid__item',
                    name: 'ProductGridItem'
                }
            ]
        }
    ],
    removeCSSClasses: true,
    removeDataAttributes: true,
    extractColors: true,
    outputPath: 'dist'
};
