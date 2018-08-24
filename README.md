# Motivation

Tired of manually copying HTML & CSS and transforming it into your favorite framework views and styled ? Meet `slice-machine` a tool that allows you to slice up your existing HTML templates and styles and nice component based UI for your favorite framework

# Instalation

```sh
npm install -g slice-machine
```

# Usage

Create a config file, `slice-machine.config.js` in the directory where you plan in running the commands.

This file will be read by Slice Machine and the instructions in it executed.

# Config file format

Default name of the config file is `slice-machine.config.js` and this is what will be used by slice machine to fetch the needed resources.

This is a NodeJS module so you can import other modules and do whatever you want as long as you export a JS object.

```js
module.exports = {
    language: 'typescript',
    url: 'http://awesome.site/url',
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
```

## Slice definition configuration

Each slice is defined by:

-   url: string

The URL to open in order to get the slice. If

-   sel: string

A CSS selector, similar to what you would give to `document.querySelector` in order to get to the slice

-   name: string

A meaningfull, component name given to the slice

-   sheetFilename

Optional parameter, determines how the file containing the CSS styles should be named

-   codeFilename

How the file containing the Javascript code for the slice should be named

-   removeDataAttributes

If `data-*` attributes should be removed from the captured DOM.

-   removeCSSClasses

If the original CSS classes that were set on the elements should be remvoed

-   extractColors

If the color pallete should be extracted and written at the beggining of the style file.

## Output configurations

outputPath - Defines where the components and styles should be written. Defaults to current directory( '.' )

## Multiple slices

Each slices, can, in turn have sub-slices and so on. Each slices can be taken from a different URL.

```js
module.exports = {
    language: 'typescript',
    url: 'http://awesome.site/url',
    slices: [
        {
            sel: '.content',
            name: 'Content',
            slices: [
                {
                    sel: '.subslice',
                    name: 'ChildComponent'
                }
            ]
        },
        {
            url: 'file://local-file',
            sel: '.another-content',
            name: 'SliceFromLocalHTML'
        }
    ],
    outputPath: 'dist'
};
```
