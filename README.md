# eslint-tool-summarize
[![npm](http://img.shields.io/npm/v/eslint-tool-summarize.svg)](https://www.npmjs.org/package/eslint-tool-summarize)
[![license](http://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/Nate-Wilkins/eslint-tool-summarize/blob/master/LICENSE)
[![status](https://travis-ci.org/Nate-Wilkins/eslint-tool-summarize.svg?branch=master)](https://travis-ci.org/Nate-Wilkins/eslint-tool-summarize)
[![dependencies](https://david-dm.org/nate-wilkins/eslint-tool-summarize.png)](https://david-dm.org/nate-wilkins/eslint-tool-summarize)

> Generate a summary of the [ESLint Rules](http://eslint.org/docs/rules/) used in a `.eslintrc` configuration file.

```bash
$ npm install eslint-tool-summarize -g
```

## Usage

### Command Line

Make sure the module is installed globally.

```bash
$ eslint-tool-summarize -c ./.eslintrc -o ./output.html
$ eslint-summarize -c ./.eslintrc -o ./output.html
```

### Module

```javascript
var summarize = require('eslint-tool-summarize');

summarize.load('./.eslintrc', function (err, templateContext) {
	summarize.generate('./some-template.html', templateContext, function (err, output) {
		console.log(output);
	});
});
```

## Custom Templates (`templateContext`)

```
{
	config: "",
	categories: [
		{
			name: "",
			description: "",
			rules: [
				{
					used: rule.value[0] || rule.value,
					value: [2, 1],
					name: "",
					link: eslintRulesPage + rule.name + ".html",
					description: ""
				},
				...
			]
		},
		...
	]
}
```
