var fs = require('fs');

var async = require('async'),
	GitHubApi = require("github"),
	nunjucks = require('nunjucks');

var username = process.argv[2],
	password = process.argv[3],
	configPath = proocess.argv[4],
	templatePath = process.argv[5],
	destinationPath = process.argv[6];
	
var github = new GitHubApi({
	version: "3.0.0",
	protocol: "https",
	timeout: 5000
});

github.authenticate({
	type: "basic",
	username: username,
	password: password
});

nunjucks.configure({
	autoescape: false
});

var getRuleDescription = function (rule, cb) {
	github.repos.getContent({
		user: "eslint",
		repo: "eslint",
		path: "docs/rules/" + rule + ".md",
		encoding: "utf-8"
	}, function(err, res) {
		if (err || !res || !res.content) { console.log(JSON.stringify(err)); cb("err"); return; }

		var fileContent = new Buffer(res.content, res.encoding).toString();
		var descSelector = new RegExp("^.*\n\n(.+)\n?");
		var match = descSelector.exec(fileContent);
		var desc = match[1];
		desc = desc.substring(0, desc.lastIndexOf("."));

		console.log(rule + "--" + JSON.stringify(desc, null, "\t"));

		cb(null, {
			name: rule,
			description: desc,
			link: "https://github.com/eslint/eslint/blob/master/docs/rules/" + rule + ".md"
		});
	});
};

var config = (JSON.parse(fs.readFileSync(configPath, "utf8")));
if (!config || !config.rules) { throw new Error("Invalid configuration"); }

var rules = Object.keys(config.rules);

var recievedRules = [];
var missedRules = [];
async.eachSeries(rules, function (rule, cb) {
	getRuleDescription(rule, function (err, ruleDoc) {
		if (err) { missedRules.push(err); }
		else { recievedRules.push(ruleDoc); }
		cb.apply(this, arguments);
	});
}, function (err) {
	fs.writeFile(destinationPath, nunjucks.render(templatePath, { rules: recievedRules }), function (err, cb) {

	});
});