#!/usr/bin/env node

/**
 * @script
 * @author nate-wilkins <nwilkins2012@gmail.com> (https://github.com/nate-wilkins)
 * @license MIT (c) 2014
 *
 * @description
 * Generate a summary of the ESLint Rules used in a `.eslintrc` configuration file
 */
'use strict';

var fs = require('fs');

var program = require('commander'),
	intel = require('intel'),
	chalk = require('chalk');

var summarize = require('./summarize');

program
	.version('0.1.0')
	.option('-c, --config <path>', 'ESLint configuration file')
	.option('-t, --template [path]', 'Summary template file')
	.option('-o, --output <path>', 'Summary destination')
	.parse(process.argv);

summarize.load(program.config, function (err, context) {
	if (err) { return intel.error(chalk.red(err)); }

	summarize.generate(program.template, context, function (err, output) {
		if (err) { return intel.error(chalk.red(err)); }

		fs.writeFile(program.output, output,{ encoding: 'utf8' }, function (err) {
			if (err) { return intel.error(chalk.red(err)); }

			intel.info(chalk.green("Completed Successfully!"));
		});
	});
});
