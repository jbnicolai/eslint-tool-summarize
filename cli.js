#!/usr/bin/env node

var program = require('commander'),
	chalk = require('chalk');

var summarize = require('./summarize');

program
	.version('0.1.0')
	.option('-c, --config <path>', 'Eslint configuration file')
	.option('-t, --template [path]', 'Eslint summary template file')
	.option('-o, --output <path>', 'Output summary file')
	.parse(process.argv);

summarize(program.config, program.template, program.output, function (err) {
	if (err) {
		console.error(chalk.red(err));
		return;
	}

	console.log(chalk.green("Completed Successfully!"));
});