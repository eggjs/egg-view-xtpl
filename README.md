# egg-view-xtpl

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![David deps][david-image]][david-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/egg-view-xtpl.svg?style=flat-square
[npm-url]: https://npmjs.org/package/egg-view-xtpl
[travis-image]: https://img.shields.io/travis/eggjs/egg-view-xtpl.svg?style=flat-square
[travis-url]: https://travis-ci.org/eggjs/egg-view-xtpl
[codecov-image]: https://img.shields.io/codecov/c/github/eggjs/egg-view-xtpl.svg?style=flat-square
[codecov-url]: https://codecov.io/github/eggjs/egg-view-xtpl?branch=master
[david-image]: https://img.shields.io/david/eggjs/egg-view-xtpl.svg?style=flat-square
[david-url]: https://david-dm.org/eggjs/egg-view-xtpl
[snyk-image]: https://snyk.io/test/npm/egg-view-xtpl/badge.svg?style=flat-square
[snyk-url]: https://snyk.io/test/npm/egg-view-xtpl
[download-image]: https://img.shields.io/npm/dm/egg-view-xtpl.svg?style=flat-square
[download-url]: https://npmjs.org/package/egg-view-xtpl

<!--
Description here.
-->

## Install

```bash
$ npm i egg-view-xtpl --save
```

## Usage

### Configuration

```js
// {app_root}/config/plugin.js
exports.xtpl = {
  enable: true,
  package: 'egg-view-xtpl',
};
```

```js
// {app_root}/config/config.default.js
exports.view = {
  mapping: {
    '.xtpl': 'xtpl',
  },
};

// xtpl config
exports.xtpl = {};

```

see [config/config.default.js](config/config.default.js) for more detail.

## Example

<!-- example here -->

## Questions & Suggestions

Please open an issue [here](https://github.com/eggjs/egg/issues).

## License

[MIT](LICENSE)
