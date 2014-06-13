'use strict';

var fs = require('fs');

module.exports = function (grunt) {
    // load npm tasks
    require('load-grunt-tasks')(grunt);

    // Project configuration.
    grunt.initConfig({
        jshintFiles: ['Gruntfile.js', 'app/**/*.js', '!app/**/_*.js', 'toplevel/**/*.js', '!toplevel/**/_*.js'],
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            reports: ['.reports'],
            demo: ['demo']
        },
        jshint: {
            options: {
                jshintrc: true
            },
            test: '<%= jshintFiles %>',
            jslint: {
                options: {
                    reporter: 'jslint',
                    reporterOutput: '.reports/lint/jshint.xml'
                },
                files: {
                    src: '<%= jshintFiles %>'
                }
            },
            checkstyle: {
                options: {
                    reporter: 'checkstyle',
                    reporterOutput: '.reports/lint/jshint_checkstyle.xml'
                },
                files: {
                    src: '<%= jshintFiles %>'
                }
            }
        },
        bgShell: {
            generator: {
                cmd: 'cd demo && yo baboon'
            },
            link: {
                cmd: 'npm link'
            },
            sudo_link: {
                cmd: 'sudo npm link'
            }
        },
        changelog: {
            options: {
            }
        },
        bump: {
            options: {
                files: ['package.json'],
                updateConfigs: ['pkg'],
                commitFiles: ['.'],
                commitMessage: 'chore: release v%VERSION%',
                push: false
            }
        }
    });

    // Register tasks.
    grunt.registerTask('git:commitHook', 'Install git commit hook', function () {
        grunt.file.copy('validate-commit-msg.js', '.git/hooks/commit-msg');
        fs.chmodSync('.git/hooks/commit-msg', '0755');
        grunt.log.ok('Registered git hook: commit-msg');
    });

    grunt.registerTask('mkdir:demo', 'Create test directory', function () {
        grunt.file.mkdir(require('path').join(__dirname, 'demo'));
    });

    grunt.registerTask('link', 'Do npm link to test the generator', function () {
        if (process.platform === 'win32') {
            grunt.task.run(['bgShell:link']);
        } else {
            grunt.task.run(['bgShell:sudo_link']);
        }
    });

    grunt.registerTask('test', 'Test the generator', function () {
        grunt.task.run(['git:commitHook', 'jshint:test', 'clean:demo', 'mkdir:demo', 'link', 'bgShell:generator']);
    });

    grunt.registerTask('lint', ['jshint:test']);
    grunt.registerTask('ci', ['clean', 'jshint:jslint', 'jshint:checkstyle']);
    grunt.registerTask('release', 'Bump version, update changelog and tag version', function (version) {
        grunt.task.run([
                'bump:' + (version || 'patch') + ':bump-only',
            'changelog',
            'bump-commit'
        ]);
    });

    // Default task.
    grunt.registerTask('default', 'lint');
};