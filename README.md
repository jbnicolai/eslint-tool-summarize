eslint-summarize
================
[![npm](http://img.shields.io/npm/v/eslint-summarize.svg)](https://www.npmjs.org/package/eslint-summarize)
[![license](http://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/Nate-Wilkins/eslint-summarize/blob/master/LICENSE)
[![deps](https://david-dm.org/nate-wilkins/eslint-summarize.png)](https://david-dm.org/nate-wilkins/eslint-summarize)

#### Description

Generate a summary of the [Eslint Rules](http://eslint.org/docs/rules/) used in a `.eslintrc` configuration file.

#### Install

```
npm install eslint-summarize -g
```

#### Usage

##### Command Line

Make sure the module is installed globally.

```
eslint-summarize -c ./eslintrc -o ./output.html 
```

##### As Module

```javascript
var summarize = require('eslint-summarize');

summarize('./.eslintrc', './templates/my-template.html' || null, './output.html', function (err) {
	// Completed - check err
});
```

##### Custom Templates - TemplateContext

```
{
	config: "",
	template: "", 
	output: "", 
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
