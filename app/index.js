'use strict';

var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
//var yosay = require('yosay');
var crypto = require('crypto');
var chalk = require('chalk');
var banner =
    '\n' +
    '   ▄▄▄▄    ▄▄▄       ▄▄▄▄    ▒█████   ▒█████   ███▄    █ \n' +
    '  ▓█████▄ ▒████▄    ▓█████▄ ▒██▒  ██▒▒██▒  ██▒ ██ ▀█   █ \n' +
    '  ▒██▒ ▄██▒██  ▀█▄  ▒██▒ ▄██▒██░  ██▒▒██░  ██▒▓██  ▀█ ██▒\n' +
    '  ▒██░█▀  ░██▄▄▄▄██ ▒██░█▀  ▒██   ██░▒██   ██░▓██▒  ▐▌██▒\n' +
    '  ░▓█  ▀█▓ ▓█   ▓██▒░▓█  ▀█▓░ ████▓▒░░ ████▓▒░▒██░   ▓██░\n' +
    '  ░▒▓███▀▒ ▒▒   ▓▒█░░▒▓███▀▒░ ▒░▒░▒░ ░ ▒░▒░▒░ ░ ▒░   ▒ ▒ \n' +
    '  ▒░▒   ░   ▒   ▒▒ ░▒░▒   ░   ░ ▒ ▒░   ░ ▒ ▒░ ░ ░░   ░ ▒░\n' +
    '   ░    ░   ░   ▒    ░    ░ ░ ░ ░ ▒  ░ ░ ░ ▒     ░   ░ ░ \n' +
    '   ░            ░  ░ ░          ░ ░      ░ ░           ░ \n' +
    '        ░                 ░                              \n' +
    '                                           by Litixsoft  \n';

var BaboonGenerator = module.exports = function BaboonGenerator (args, options) {
    yeoman.generators.Base.apply(this, arguments);

    this.argument('app_name', { type: String, required: false });
    this.app_name = this.app_name || path.basename(process.cwd());
    this.app_name = this._.camelize(this._.slugify(this._.humanize(this.app_name)));

    this.on('end', function () {
        this.installDependencies({
            npm: true,
            bower: false,
            skipInstall: options['skip-install'],
            callback: function () {
                this.emit('install_bower');
            }.bind(this)
        });
    });

    this.on('install_bower', function () {
        this.installDependencies({
            npm: false,
            bower: true,
            skipInstall: options['skip-install'],
            callback: function () {
                var self = this;

                console.log('\nRun `' + chalk.yellow.bold('grunt setup') + '` for you! Keep in mind!\n\n');
                this.spawnCommand('grunt', ['setup']).on('exit', function () {
                    self.emit('exit');
                });
            }.bind(this)
        });
    });

    this.on('exit', function () {
        var help = [
                ' I\'m all done. Enter `' + chalk.yellow.bold('grunt serve') + '` to start your application. They will be serve on `' + chalk.yellow.bold(this.baboon.app_protocol + '://localhost:' + this.baboon.app_port) + '`.'
        ];

        if (this.baboon.app_rights_enabled) {
            help.push(' The administrator account is `' + chalk.cyan.bold('admin') + '` with password `' + chalk.cyan.bold('a') + '`');
        }

        console.log('\n\n' + help.join('\n'));
    });
};

util.inherits(BaboonGenerator, yeoman.generators.Base);

BaboonGenerator.prototype.askFor = function askFor () {
    var done = this.async();

    // Validators
    var validateIsPort = function (value) {
        return !isNaN(value) && parseInt(value) > 0 && parseInt(value) <= 65535;
    };

    var validateIsConnectionString = function (value) {
        if (value) {
            var host = value.split(':');
            return host.length === 2 && validateIsPort(host[1]);
        }

        return false;
    };

    var validateIsNumber = function (value) {
        return !isNaN(value);
    };

    // Show greetings
    console.log(chalk.green(banner));

    var prompts = [
        {
            validate: function (input) {
                return (input.length > 2);
            },
            type: 'input',
            name: 'app_displayname',
            message: 'Whats the displayname of your baboon application?',
            default: 'Baboon Example Application'
        },
        {
            validate: function (input) {
                return (input.length > 2);
            },
            type: 'input',
            name: 'app_name',
            message: 'Whats the name of your baboon application?',
            default: this.app_name
        },
        // github?
        {
            type: 'confirm',
            name: 'useGithub',
            message: 'Would you like to use github?',
            default: false
        },
        {
            when: function (answer) {
                return (answer && answer.useGithub === true);
            },
            type: 'input',
            name: 'githubUsername',
            message: 'Whats the Github username?',
            default: ''
        },
        {
            validate: validateIsPort,
            type: 'input',
            name: 'app_port',
            message: 'On which port would you like to serve?',
            default: 3000
        },
        {
            validate: validateIsPort,
            type: 'input',
            name: 'app_e2eTest_port',
            message: 'On which port would you like to serve e2e tests?',
            default: function (props) {
                return parseInt(props.app_port) + 1;
            }
        },
        // Rights Managment
        {
            type: 'confirm',
            name: 'app_rights_enabled',
            message: 'Would you like to enable the ´right management´?',
            default: false
        },
        {
            when: function (answer) {
                return (answer && answer.app_rights_enabled === true);
            },
            type: 'confirm',
            name: 'app_rights_masterloginpage',
            message: 'Would you like to use a ´Master Login Page´?',
            default: true
        },

        // MongoDB
        {
            validate: validateIsConnectionString,
            type: 'input',
            name: 'app_mongodb',
            message: 'Please specified your MongoDB host. (HOST:PORT)',
            default: 'localhost:27017'
        },

        // RedisIO
        {
            validate: validateIsConnectionString,
            type: 'input',
            name: 'app_redisio',
            message: 'Please specified your RedisIO host. (HOST:PORT)',
            default: 'localhost:6379'
        },

        // Session
        {
            validate: validateIsNumber,
            type: 'input',
            name: 'app_session_maxLife',
            message: 'Please specified your `maximal session lifetime` in seconds:',
            default: 804600
        },
        {
            validate: validateIsNumber,
            type: 'input',
            name: 'app_session_inactiveTime',
            message: 'Please specified your `session inactive time` in seconds.',
            default: 3600
        },
        {
            type: 'list',
            name: 'app_session_activeStore',
            message: 'Select your Sessionstore:',
            choices: [
                'inMemory',
                'MongoDB',
                'RedisIO',
                'TingoDB'
            ]
        }
    ];

    this.prompt(prompts, function (props) {
        var shasum = crypto.createHash('sha1');
        shasum.update(props.app_name);
        shasum.update(props.app_displayname);
        shasum.update(crypto.randomBytes(256));

        this.baboon = props;
        this.baboon.app_protocol = 'http';
        this.baboon.app_session_secret = shasum.digest('hex');

        if(props.githubUsername){
            this.baboon.repoUrl = 'https://github.com/' + props.githubUsername + '/' + this._.slugify(props.app_name);
        } else {
            this.baboon.repoUrl = 'user/repo';
        }

        done();
    }.bind(this));
};

BaboonGenerator.prototype.app = function app () {
    this.directory('client', 'client');
    this.directory('scripts', 'scripts');
    this.directory('server', 'server');
    this.directory('test', 'test');

    this.copy('CHANGELOG.md', 'CHANGELOG.md');
    this.copy('Gruntfile.js', 'Gruntfile.js');
    this.copy('client_settings.js', 'client_settings.js');
    this.copy('server.js', 'server.js');
    this.copy('update.bat', 'update.bat');
    this.copy('update.sh', 'update.sh');

    this.copy('.bowerrc', '.bowerrc');
    this.copy('.editorconfig', '.editorconfig');
    this.copy('.jshintrc', '.jshintrc');

    if (this.baboon.useGithub) {
        this.copy('_gitignore', '.gitignore');
        this.copy('LICENSE', 'LICENSE');
    }
};

BaboonGenerator.prototype.packageFiles = function packageFiles () {
    this.template('_package.json', 'package.json');
    this.template('_bower.json', 'bower.json');
    this.template('_readme.md', 'README.md');
};

BaboonGenerator.prototype.configFiles = function configFiles () {
    this.template('_config.js', 'config.js');
};