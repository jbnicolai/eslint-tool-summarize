#!/usr/bin/env node

/**
 * @script
 * @author nate-wilkins <nwilkins2012@gmail.com> (https://github.com/nate-wilkins)
 * @license MIT (c) 2014
 *
 * @description
 * Generate a summary of the ESLint Rules used in a `.eslintrc` configuration file.
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
