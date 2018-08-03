# Motivation

Tired of manually copying HTML & CSS and transforming it into your favorite framework views and styled ? Meet `UI Slice Machine` a tool that allows you to slice up your existing HTML templates and styles and nice component based UI for your favorite framework

# Instalation

```sh
npm install -g ui-slice-machine
```

# Usage

Create a config file, `slice-machine.config.js` in the directory where you plan in running the commands.

This file will be read by Slice Machine and the instructions in it executed.

# Config file format

Default name of the config file is  `slice-machine.config.js` and this is what will be used by slice machine to fetch the needed resources.

This is a NodeJS module so you can import other modules and do whatever you want as long as you export a JS object.

```js
module.exports = {
    slices: [
        {
            name: 'AccountView',
            url: 'http://site-to-slice.com/',
            sel: '#account'
        },
        {
            name: 'DashboardView',
            url: 'http://site-to-slice.com/',
            sel: '#main > .dashboard'
        }
    ],
    output: {
        path: 'dist/',
        viewLibrary: 'react',
        cssLibrary: 'typestyle'
    },
}
```

