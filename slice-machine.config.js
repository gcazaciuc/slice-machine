module.exports = {
    language: 'typescript',
    url: 'file:///home/gcazaciuc/slice-machine/src/fixtures/markup-dedupe.html',
    slices: [
        {
            sel: '.content',
            name: 'Content'
        }
    ],
    removeCSSClasses: true,
    removeDataAttributes: true,
    componentMinNodes: 2,
    extractColors: true,
    outputPath: 'dist'
};
