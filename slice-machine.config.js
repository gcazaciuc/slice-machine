module.exports = {
    language: 'typescript',
    url: 'https://theme.crumina.net/html-olympus/02-ProfilePage.html',
    slices: [
        {
            sel: '#newsfeed-items-grid',
            name: 'NewsfeedGrid',
            slices: [
                {
                    name: 'SimplePost',
                    sel: '#newsfeed-items-grid .ui-block:nth-child(1)'
                },
                {
                    name: 'PostWithVideo',
                    sel: '#newsfeed-items-grid .ui-block:nth-child(2)'
                },
                {
                    name: 'PostWithReplies',
                    sel: '#newsfeed-items-grid .ui-block:nth-child(3)'
                },
                {
                    name: 'PostWithPhoto',
                    sel: '#newsfeed-items-grid .ui-block:nth-child(4)'
                }
            ]
        }
    ],
    removeCSSClasses: true,
    removeDataAttributes: true,
    extractColors: true,
    outputPath: 'dist'
};
