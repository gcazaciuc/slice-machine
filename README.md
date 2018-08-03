# Motivation

Tired of manually copying HTML & CSS and transforming it into your favorite framework views and styled ? Meet `UI Slice Machine` a tool that allows you to slice up your existing HTML templates and styles and nice component based UI for your favorite framework

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
    slices: [
        {
            url: 'https://examplesite.com/',
            sel: '.post',
            name: 'PostComponent',
            sheetName: 'PostComponentStyle.ts',
            codeFileName: 'PostComponent.ts'
        }
    ],
    output: {
        path: 'dist'
    }
};
```

## Slice definition configuration

Each slice is defined by:

-   url

The URL to open in order to get the slice

-   sel

A CSS selector, similar to what you would give to `document.querySelector` in order to get to the slice

-   name

A meaningfull, component name given to the slice

-   sheetName

How the file containing the CSS styles should be named

-   codeFileName

How the file containing the Javascript code for the slice should be named

## Output configurations

The styles & javascript code for all the files will be written to the directory specified
in `output -> path` section of the config.

It defaults to `.` .
