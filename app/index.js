'use strict';

var yeoman = require('yeoman-generator');
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

module.exports = yeoman.generators.Base.extend({
    constructor: function () {
        yeoman.generators.Base.apply(this, arguments);

        this.argument('app_name', { type: String, required: false, defaults: require('path').basename(process.cwd())});
        this.slugname = this._.slugify(this.app_name);
        this.app_name = this._.camelize(this._.slugify(this._.humanize(this.app_name)));
    },

    initializing: function () {
        this.log(chalk.green(banner));
    },

    prompting: function () {
        var done = this.async();

        // Validators
        function validateIsPort (value) {
            return !isNaN(value) && parseInt(value) > 0 && parseInt(value) <= 65535;
        }

        function validateIsConnectionString (value) {
            if (value) {
                var host = value.split(':');
                return host.length === 2 && validateIsPort(host[1]);
            }

            return false;
        }

        function validateIsNumber (value) {
            return !isNaN(value);
        }

        var prompts = [
            {
                name: 'app_name',
                message: 'Whats the name of your baboon application?',
                default: this.app_name,
                validate: function (input) {
                    return (input.length > 2);
                }
            },
            {
                validate: function (input) {
                    return (input.length > 2);
                },
                type: 'input',
                name: 'app_displayname',
                message: 'Whats the displayname of your baboon application?',
                default: 'Baboon Example Application'
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
            this.slugname = this._.slugify(props.app_name);

            if (props.githubUsername) {
                this.baboon.repoUrl = 'https://github.com/' + props.githubUsername + '/' + this.slugname;
            } else {
                this.baboon.repoUrl = 'user/repo';
            }

            done();
        }.bind(this));
    },

    configuring: function () {
        this.copy('CHANGELOG.md', 'CHANGELOG.md');
        this.copy('_Gruntfile.js', 'Gruntfile.js');
        this.copy('client_settings.js', 'client_settings.js');
        this.copy('server.js', 'server.js');
        this.copy('update.bat', 'update.bat');
        this.copy('update.sh', 'update.sh');
        this.copy('bowerrc', '.bowerrc');
        this.copy('editorconfig', '.editorconfig');
        this.copy('jshintrc', '.jshintrc');
        this.copy('_validate-commit-msg.js', 'validate-commit-msg.js');

        this.template('_package.json', 'package.json');
        this.template('_bower.json', 'bower.json');
        this.template('_readme.md', 'README.md');
        this.template('_config.js', 'config.js');

        if (this.baboon.useGithub) {
            this.copy('gitignore', '.gitignore');
            this.copy('LICENSE', 'LICENSE');
            this.copy('travis.yml', '.travis.yml');
        }
    },

    writing: function () {
        this.directory('client', 'client');
        this.directory('scripts', 'scripts');
        this.directory('server', 'server');
        this.directory('test', 'test');
    },

    install: function () {
        var self = this;

        this.installDependencies({
            skipInstall: this.options['skip-install'],
            callback: function () {
                self.log('-');
                self.log('Run `' + chalk.yellow.bold('grunt setup') + '` for you! Keep in mind!');
                self.log('-');

                self.spawnCommand('grunt', ['setup']).on('exit', function () {
                    var help = [
                        'I\'m all done. Enter `' + chalk.yellow.bold('grunt serve') + '` to start your application. \nIt will be served on `' + chalk.yellow.bold(self.baboon.app_protocol + '://localhost:' + self.baboon.app_port) + '`.'
                    ];

                    if (self.baboon.app_rights_enabled) {
                        help.push('The administrator account is `' + chalk.cyan.bold('sysadmin') + '` with password `' + chalk.cyan.bold('a') + '`');
                    }

                    self.log(help.join('\n'));
                });
            }
        });
    }
});