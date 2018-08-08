module.exports = {
    slices: [
        {
            url: 'https://theme.crumina.net/html-olympus/72-ForumsCreateTopic.html',
            sel: '.ui-block',
            name: 'Postcard',
            sheetName: 'PostcardStyle.ts',
            codeFileName: 'Postcard.tsx'
        }
    ],
    removeCSSClasses: true,
    removeDataAttributes: true,
    extractColors: true,
    output: {
        path: 'dist'
    }
};
