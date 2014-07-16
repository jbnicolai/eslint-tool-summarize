#!/usr/bin/env node

/*
 * eslint-summarize cli
 * https://github.com/Nate-Wilkins/eslint-summarize
 * npm install eslint-summarize
 *
 * Copyright (c) 2014 Nate-Wilkins
 * Licensed under the MIT license.
 */
var program = require('commander'),
	chalk = require('chalk');

var summarize = require('./summarize');

program
	.version('0.1.0')
	.option('-c, --config <path>', 'ESLint configuration file')
	.option('-t, --template [path]', 'ESLint summary template file')
	.option('-o, --output <path>', 'Output summary file')
	.parse(process.argv);

summarize(program.config, program.template, program.output, function (err) {
	if (err) {
		console.error(chalk.red(err));
		return;
	}

	console.log(chalk.green("Completed Successfully!"));
});