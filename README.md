# bem-core Library [![Build Status](https://travis-ci.org/bem/bem-core.svg?branch=v2)](https://travis-ci.org/bem/bem-core)

This README is also available [in Russian](http://ru.bem.info/libs/bem-core/).

## What is this?

`bem-core` is a base library for web interface development.
It provides the minimal stack for coding client-side JavaScript and templating.

## Use

The easiest way to run a project with `bem-core` is to use
the [project-stub](https://github.com/bem/project-stub).

You can use any other way you are familiar with to include the library into
the project.

## Inside

### Levels

  - `common.blocks` — suited for any devices and browsers
  - `desktop.blocks` — should be used for desktop browsers
  - `touch.blocks` — implement some touch-platforms specifics

### Blocks

  - `i-bem` — base block with helpers for JS and HTML
  - `strings` — helpers for JS-strings
  - `objects` — helpers for JS-objects
  - `functions` — helpers for JS-functions
  - `events` — JS-events
  - `querystring` — helpers for work with querystring
  - `tick` — global timer
  - `idle` — IDLE event
  - `next-tick` — polyfill for `nextTick`/`setTimeout(0, ...)`
  - `inherit` — OOP helpers
  - `jquery` — jQuery
  - `clearfix` — CSS clearfix trick
  - `identify` — identify JS-objects
  - `cookie` — helpers for work with browser cookies
  - `vow` — Promises/A+ implementation
  - `dom` — helpers for work with DOM
  - `loader` — loader for JS files
  - `ua` — browser features detection
  - `page` — html/head/body scaffold

### Technologies

  - vanilla.js + browser.js
  - bemhtml
  - bemtree

## API

The autogenerated JSDoc API can be found on the separate branch [v2-jsdoc](http://github.com/bem/bem-core/tree/v2-jsdoc).

Please note that "v2-jsdoc"'s content is updated automatically. Any fixes should go to the "v2" branch to the concrete
block's source code, as described in the "Contribution" section below.

## Changelog

You can check the changelog at the [changelog page](http://bem.info/libs/bem-core/changelog/).

## Migration

If you used BEM before, check the [migration instructions](http://bem.info/libs/bem-core/migration/).

## Development

### Working copy

1. Get the needed version code (e.g., `v2`):
   ```shell
   $ git clone -b v2 git://github.com/bem/bem-core.git
   $ cd bem-core
   ```

2. Install the dependencies:
   ```shell
   $ npm install
   ```

   You need `export PATH=./node_modules/.bin:$PATH`
   or an alternative way to run locally-installed [bem-tools](https://github.com/bem/bem-tools) and other npm-dependencies.

3. Install all necessary libraries:
   ```shell
   $ bower-npm-install
   ```

4. Build and run tests (specs):
   ```shell
   $ bem make desktop.specs touch.specs
   ```

5. Run development server:
   ```shell
   $ bem server
   ```

### How to contribute

1. [Create an issue](https://github.com/bem/bem-core/issues/new) with a proper description.
2. Decide which version needs your changes.
3. Create a feature-branch with an issue number and a version (`issues/<issue_number>@v<version_number>`) based on a version branch.
   For example, for an issue #42 and a version #1: `git checkout -b issues/42@v1 v1`.
   If you need changes for several versions, each of them has to have a feature branch.
4. Commit changes and `push`. Rebase your branch on a corresponding version branch if it's needed.
5. Create a pull-request from your feature branch; or several pull-requests if you changed several versions.
6. Link your pull request with an issue number any way you like. A comment will work perfectly.
7. Wait for your pull request and the issue to be closed ;-)

### Modular testing

A default test bundle for `functions__debounce`:
```shell
$ bem make desktop.specs/functions__debounce
```

You can see the results of the tests in the terminal after the building process finishes.

You can also watch them in a browser loading `desktop.specs/functions__debounce/spec-js+browser-js+bemhtml/spec-js+browser-js+bemhtml.html`.

Run tests for other BEM entities in the same way. This will work for those which are equipped with `.spec.js` file.

### Code coverage

To build code coverage report add `ISTANBUL_COVERAGE=yes` environment variable to the tests run command:
```shell
$ ISTANBUL_COVERAGE=yes bem make desktop.specs && istanbul report html
```

You can run modular testing with coverage as well by using more concrete build target as was described above.
```
$ ISTANBUL_COVERAGE=yes bem make desktop.specs/functions__debounce && istanbul report html
```

After tests finish, you can view coverage HTML report by opening `coverage/index.html` in your favorite
browser.

The whole code coverage statistics can be found on the [bem-core profile page](https://coveralls.io/r/bem/bem-core) on
[Coveralls](https://coveralls.io).

Tests are built with a [bem-pr](https://github.com/narqo/bem-pr) library.
Check the [details](https://github.com/narqo/bem-pr/blob/master/docs/tests.ru.md) about testing infrastructure of the bem-pr.

## Supported browsers

Our browser support policy is based on statistics we get from [Yandex](http://company.yandex.com) services.

Browsers with more than 2% users get full compliant support, more than 0.5% — partially compliant
(which means that data is accessible but not necessary 100% functional). New features testing
is not provided by us for  browsers with less than 0.5% users.

### Desktop

#### Fully compliant

  - Google Chrome 29+
  - Firefox 24+
  - Yandex 1.7+
  - Opera 12.16
  - MSIE 10.0
  - MSIE 9.0
  - MSIE 8.0
  - Opera 12.15

#### Partially compliant

  - Opera 17.0
  - Opera 16.0
  - Opera 12.14
  - Opera 12.2
  - Firefox 23

### Touch

#### Fully compliant

  - iOS 6+
  - Android 2.3+
  - Opera Mobile 12+
  - Windows Phone 7+

#### Partially compliant

  - iOS 5
  - Android 2.2
