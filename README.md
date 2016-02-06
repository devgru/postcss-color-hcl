# postcss-color-hcl [![Build Status](https://travis-ci.org/devgru/postcss-color-hcl.png)](https://travis-ci.org/postcss/postcss-color-hcl)

> [PostCSS](https://github.com/postcss/postcss) plugin to transform [hcl() color](http://hclwizard.org/hcl-color-scheme/) to compatible CSS (#hex or rgba()).

## Installation

```bash
$ npm install postcss-color-hcl
```

## Usage

```js
// dependencies
var fs = require("fs")
var postcss = require("postcss")
var colorHcl = require("postcss-color-hcl")

// css to be processed
var css = fs.readFileSync("input.css", "utf8")

// process css
var output = postcss()
  .use(colorHcl())
  .process(css)
  .css
```

Using this `input.css`:

```css
body {
  color: hcl(21, 70%, 50%, 0.5);
  background: hcl(0, 0%, 50%);
}

```

you will get:

```css
body {
  color: rgba(221, 52, 80, 0.5);
  background: rgb(119, 119, 119);
}
```

Checkout [tests](test) for more examples.

---

## Contributing

Work on a branch, install dev-dependencies, respect coding style & run tests before submitting a bug fix or a feature.

    $ git clone https://github.com/devgru/postcss-color-hcl.git
    $ git checkout -b patch-1
    $ npm install
    $ npm test

## [Changelog](CHANGELOG.md)

## [License](LICENSE)
