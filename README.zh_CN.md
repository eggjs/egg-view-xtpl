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

egg 的 [xtemplate](https://github.com/xtemplate/xtemplate) 模板插件

## 安装

```bash
$ npm i egg-view-xtpl --save
```

## 用法

### 配置

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

更多参考： [config/config.default.js](config/config.default.js).

### 示例

#### Demo

```html
// app/view/hello.xtpl
hello {{ data }}
```

Render it

```js
// app/controller/render.js
exports.xtpl = function* () {
  yield ctx.render('hello.xtpl', {
    data: 'world',
  });
};
```

#### Include

可以引用相对路径的其他模板：

```html
// app/view/a.ejs include app/view/b.xtpl
{{ include('./b.xtpl') }}
```

## 问题 & 建议

请在 [这里](https://github.com/eggjs/egg/issues) 开 issue.

## License

[MIT](LICENSE)
