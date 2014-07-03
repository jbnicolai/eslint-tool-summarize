/*
 * eslint-summarize
 * https://github.com/Nate-Wilkins/eslint-summarize
 * npm install eslint-summarize
 *
 * Copyright (c) 2014 Nate-Wilkins
 * Licensed under the MIT license.
 */
'use strict';

var fs = require('fs');

var intel = require('intel'),
	async = require('async'),
	scrap = require('scrap'),
	nunjucks = require('nunjucks');

var eslintRulesPage = "http://eslint.org/docs/rules/";

nunjucks.configure({
	autoescape: false
});

/**
 * Generate a Eslint summary report on a '.eslintrc' configuration file
 * @param {string} configPath - path to the configuration file
 * @param {string} templatePath - path to the summary template
 * @param {string} outputPath - path to output the generated summary
 * @param {function} summarize_callback - indicate when summary was generated
 */
module.exports = function (configPath, templatePath, outputPath, summarize_callback) {
	templatePath = templatePath || "./summary-template.html";

	// Rendering context - object that's passed to the template engine
	var templateContext = {
		config: configPath,
		template: templatePath,
		output: outputPath,
		categories: []
	};

	// Make sure we can read both files up-front (doesn't really matter for template)
	async.parallel([
		function (cb) { fs.readFile(configPath, cb); },
		function (cb) { fs.readFile(templatePath, cb); }
	], function (err, files) {
		if (err || !files) { summarize_callback.call(null, err); return; }

		// Get our configured eslint rules
		var config = JSON.parse(files[0], 'utf8');
		if (!config || !config.rules) { summarize_callback.call(null, "Invalid config file"); return; }

		// Grab the eslint rules page
		scrap(eslintRulesPage, function (err, $) {
			if (err) { summarize_callback.call(null, err); }

			// Scrap rule categories
			async.each($('h2'), function (item, headerProcessed_callback) {
				item = $(item);

				var headerText = item.text();
				var summary = item.next('p');
				var category = {
					name: headerText,
					description: summary.text(),
					rules: []
				};
				templateContext.categories.push(category);

				// Scrap rules for this category
				async.eachSeries(summary.next().find('li'), function (rule, ruleProcessed_callback) {
					rule = $(rule);

					var ruleParts = rule.text().trim().split(' - ');
					var ruleName = ruleParts[0];
					var configRule = config.rules[ruleName];

					category.rules.push({
						used: configRule && configRule.length ? configRule[0] : configRule,
						value: configRule,
						name: ruleName,
						link: eslintRulesPage + ruleName + ".html",
						description: ruleParts[1]
					});

					ruleProcessed_callback.call(null);
				}, headerProcessed_callback);
			}, function (err) {
				if (err) { summarize_callback.call(null, err); }

				// Output the eslint summary
				fs.writeFile(outputPath, nunjucks.render(templatePath, templateContext), function (err) {
					if (err) { summarize_callback.call(null, err); }

					summarize_callback.call(null);
				});
			});
		});
	});
};