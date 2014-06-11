// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html
'use strict';

module.exports = function (config) {
    config.set({
        // base path, that will be used to resolve files and exclude
        basePath: '../',

        // testing framework to use (jasmine/mocha/qunit/...)
        frameworks: ['jasmine'],

        // list of files / patterns to load in the browser
        files: [
            'test/fixtures/clientAppMocks.js',
            'client/assets/bower_components/angular/angular.js',
            'client/assets/bower_components/angular-mocks/angular-mocks.js',
            'client/assets/bower_components/angular-resource/angular-resource.js',
            'client/assets/bower_components/angular-cookies/angular-cookies.js',
            'client/assets/bower_components/angular-sanitize/angular-sanitize.js',
            'client/assets/bower_components/angular-route/angular-route.js',
            'client/assets/bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
            'client/assets/bower_components/angular-translate/angular-translate.js',
            'client/assets/bower_components/angular-translate-loader-static-files/angular-translate-loader-static-files.js',
            'client/assets/bower_components/angular-dynamic-locale/src/tmhDinamicLocale.js',
            'client/assets/bower_components/highlightjs/highlight.pack.js',
            'client/assets/bower_components/angular-highlightjs/angular-highlightjs.js',
            'client/assets/bower_components/angular-socket-io/socket.js',
            'client/assets/bower_components/baboon-client/modules/navigation/navigation.js',
            'client/assets/bower_components/baboon-client/modules/**/*.js',
            'client/assets/bower_components/checklist-model/checklist-model.js',
            'client/common/popup_login/popup_login.js',
            'client/app/**/*.js'
        ],

        // list of files / patterns to exclude
        exclude: [],

        // web server port
        port: 9090,

        // level of logging
        // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: false,


        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera
        // - Safari (only Mac)
        // - PhantomJS
        // - IE (only Windows)
        browsers: ['Chrome'],


        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: false
    });
};
