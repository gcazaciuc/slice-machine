module.exports = {
    slices: [
        {
            url: 'https://theme.crumina.net/html-olympus/02-ProfilePage.html',
            sel: '.hentry.post',
            name: 'PostComponent',
            sheetName: 'PostComponentStyle.ts',
            codeFileName: 'PostComponent.tsx'
        }
    ],
    ignoreCSSSources: [
        'bootstrap.css',
        'bootstrap-reboot.css',
        'bootstrap-grid.css',
        'fonts.min.css'
    ],
    keepCSSClasses: true,
    output: {
        path: 'dist'
    }
};
