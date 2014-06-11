'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');

var BaboonTopLevelAppGenerator = module.exports = function () {
    yeoman.generators.Base.apply(this, arguments);

    this.argument('TopLevelName', { type: String, required: true });
    this.argument('TopLevelPageName', { type: String, required: false });

    this.TopLevelName = this.TopLevelName || undefined;
};

util.inherits(BaboonTopLevelAppGenerator, yeoman.generators.Base);

BaboonTopLevelAppGenerator.prototype.ask = function () {
    if (!this.TopLevelName) {
        // If no AppName defined ask for it
    }

    this.TopLevelName = this._.camelize(this._.slugify(this._.humanize(this.TopLevelName)));
    this.TopLevelPageName = (this.TopLevelPageName || 'index').toLowerCase();
};

BaboonTopLevelAppGenerator.prototype.build = function () {
//    this.sourceRoot(path.join(__dirname, 'client'));
    this.destinationRoot(path.join('client', 'app', this.TopLevelName));

    // Basic
    this.template('index.html');
    this.template('navigation.json');
    this.template('routes.js');

    // Appname
    this.template('toplevel.js', this.TopLevelName + '.js');
    this.template('toplevel.less', this.TopLevelName + '.less');

    // Localization
    this.template(path.join('__locale', 'locale-de-de.json'));
    this.template(path.join('__locale', 'locale-en-us.json'));

    // Page
    this.template('index/index.html', path.join(this.TopLevelPageName, this.TopLevelPageName + '.html'));
    this.template('index/index.js', path.join(this.TopLevelPageName, this.TopLevelPageName + '.js'));
    this.template('index/index.spec.js', path.join(this.TopLevelPageName, this.TopLevelPageName + '.spec.js'));
};