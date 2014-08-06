/**
 * @object
 * @author nate-wilkins <nwilkins2012@gmail.com> (https://github.com/nate-wilkins)
 * @license MIT (c) 2014
 *
 * @description
 * Summarize a desired configuration file using a summary template
 */
'use strict';

var fs = require('fs'),
	path = require('path');

var async = require('async'),
	scrap = require('scrap'),
	nunjucks = require('nunjucks');

var eslintRulesPage = "http://eslint.org/docs/rules/";

nunjucks.configure({
	autoescape: false
});

module.exports = {
	/**
	 * Loads a `.eslintrc` configuration file
	 * @param {string} configPath - path to the configuration file
	 * @param {function} loaded_callback - called once the configuration file was loaded
	 */
	load: function (configPath, loaded_callback) {
		// Rendering context passed to the `loaded_callback`
		var templateContext = {
			config: configPath,
			categories: []
		};

		// Make sure we can read both files up-front (doesn't really matter for template)
		fs.readFile(configPath, function (err, contents) {
			if (err) { return loaded_callback(err); }

			var config;

			try { config = JSON.parse(contents, 'utf8'); }
			catch (loadErr) { return loaded_callback(loadErr); }

			if (!config || !config.rules) { return loaded_callback(new Error("Invalid configuration file")); }

			// Grab the eslint rules page
			scrap(eslintRulesPage, function (err, $) {
				if (err) { return loaded_callback(err); }

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

						ruleProcessed_callback(null);
					}, headerProcessed_callback);
				}, function (err) {
					if (err) { return loaded_callback(err); }

					loaded_callback(null, templateContext);
				});
			});
		});
	},

	/**
	 * Generates a summary from a provided template and context
	 * @param {string} templatePath - path to the summary template
	 * @param {object} context - configuration summary context
	 * @param {function} generated_callback - called once the summary is generated
	 */
	generate: function (templatePath, context, generated_callback) {
		if (arguments.length === 2) {
			generated_callback = context;
			context = templatePath;
			templatePath = path.join(__dirname, "./default-template.html");
		}

		var err = null, output;
		try { output = nunjucks.render(templatePath, context); }
		catch(renderErr) { err = renderErr; }

		generated_callback(err, output);
	}
};
