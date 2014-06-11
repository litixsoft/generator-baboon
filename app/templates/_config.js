'use strict';

module.exports = function () {
    /**
     * Contains all configuration functions.
     * @type {{filesPath: string, production: object, development: object, unitTest: object, e2eTest: object}}
     */
    var config = {};

    config.filesPath = './server/var';

    /**
     * The production configuration
     * This configuration used when no other configuration is specified.
     *
     * @returns {Object} config
     */
    config.production = function () {

        // Contains all settings for this configuration
        return {
            node_env: 'production',
            app_name: '<%= _.slugify(baboon.app_name) %>',
            app_displayname: '<%= baboon.app_displayname %>',
            protocol: '<%= baboon.app_protocol %>',
            host: '127.0.0.1',
            port: <%= baboon.app_port %>,
            rights: {
                enabled: <%= baboon.app_rights_enabled %>,
                masterLoginPage: <%= baboon.app_rights_masterloginpage || false %>,
                database: '<%= baboon.app_mongodb %>/<%= _.slugify(baboon.app_name) %>_rights?w=1&journal=True&fsync=True'
            },
            session: {
                key: 'baboon.sid',
                secret: '<%= baboon.app_session_secret %>',
                maxLife: <%= baboon.app_session_maxLife %>,
                inactiveTime: <%= baboon.app_session_inactiveTime %>,
                stores: {
                    inMemory: {
                        type: 'inMemory'
                    },
                    redis: {
                        type: 'redis',
                        host: '<%= baboon.app_redisio.split(':')[0] %>',
                        port: <%= baboon.app_redisio.split(':')[1] %>
                    },
                    mongoDb: {
                        type: 'mongoDb',
                        host: '<%= baboon.app_mongodb.split(':')[0] %>',
                        port: <%= baboon.app_mongodb.split(':')[1] %>,
                        dbName: '<%= _.slugify(baboon.app_name) %>_sessions',
                        collectionName: 'sessions'
                    },
                    tingoDb: {
                        type: 'tingoDb',
                        dbPath: require('path').join(config.filesPath, 'db'),
                        collectionName: 'sessions'
                    }
                },
                activeStore: '<%= baboon.app_session_activeStore %>'
            },
            logging: {
                appenders: {
                    file: {
                        maxLogSize: 2048000,
                        backups: 10
                    },
                    db: '<%= baboon.app_mongodb %>/<%= _.slugify(baboon.app_name) %>_logs'
                },
                loggers: {
                    audit: {
                        active: true,
                        level: 'INFO',
                        appender: 'log4js-node-mongodb'
                    },
                    syslog: {
                        active: true,
                        level: 'INFO',
                        appender: 'file'
                    },
                    express: {
                        active: true,
                        level: 'INFO',
                        appender: 'file'
                    },
                    socket: {
                        active: true,
                        level: 'INFO',
                        appender: 'file'
                    }
                }
            },
            mail: {
                /*
                    host - hostname of the SMTP server (defaults to "localhost")
                    port - port of the SMTP server (defaults to 25, not needed with service)
                    useSsl - use SSL (default is false). If you're using port 587 then keep secureConnection false, since the connection is started in insecure plain text mode and only later upgraded with STARTTLS
                    auth - authentication object as {user:"...", pass:"..."} or {XOAuth2: {xoauth2_options}} or {XOAuthToken: "base64data"}
                    ignoreTLS - ignore server support for STARTTLS (defaults to false)
                    debug - output client and server messages to console
                    maxConnections - how many connections to keep in the pool (defaults to 5)
                    maxMessages - limit the count of messages to send through a single connection (no limit by default)
                */
                senderAddress: 'support@baboon.de',
                templatePath: './server/templates/mail',
                auth: {
                    user: 'user@mail.domain',
                    pass: 'password'
                },
                host: 'smtp.example.com',
                port: 465,
                useSsl: true,
                from: 'test@example.com',
                to: 'foo@bar.com',
                type: 'PICKUP', // only SMTP and PICKUP are allowed (default: 'SMTP')
                directory: './.tmp' // required for type PICKUP
            },
            mongo: {
            }
        };
    };

    /**
     * The development configuration
     * Development inherits all settings of the production.
     * These can be changed, overwritten or extended.
     *
     * @returns {Object} config
     */
    config.development = function () {

        // Config contains all settings from production.
        var settings = config.production();

        // Overwrite the settings for this configuration
        settings.node_env = 'development';
        settings.logging.loggers.audit.level = 'DEBUG';
        settings.logging.loggers.audit.appender = 'console';
        settings.logging.loggers.syslog.level = 'DEBUG';
        settings.logging.loggers.syslog.appender = 'console';
        settings.logging.loggers.express.level = 'DEBUG';
        settings.logging.loggers.express.appender = 'console';
        settings.logging.loggers.socket.level = 'DEBUG';
        settings.logging.loggers.socket.appender = 'console';

        return settings;
    };

    /**
     * The unitTest configuration
     * UnitTest inherits all settings of the development.
     * These can be changed, overwritten or extended.
     *
     * @returns {Object} config
     */
    config.unitTest = function () {

        // Config contains all settings from development.
        var settings = config.production();
        settings.node_env = 'development';
        settings.logging.appenders.db = '<%= baboon.app_mongodb %>/test_<%= _.slugify(baboon.app_name) %>_logs';

        settings.mail.directory = './.tmp/';
        settings.mail.type = 'PICKUP';

        settings.rights.database = '<%= baboon.app_mongodb %>/test_<%= _.slugify(baboon.app_name) %>_rights?w=1&journal=True&fsync=True';

        return settings;
    };

    /**
     * The e2eTest configuration
     * E2ETest inherits all settings of the development.
     * These can be changed, overwritten or extended.
     *
     * @returns {Object} config
     */
    config.e2eTest = function () {

        // Config contains all settings from development.
        var settings = config.development();

        // overwrite the settings for this configuration
        settings.port = <%= baboon.app_e2eTest_port %>;

        return settings;
    };

    /**
     * The e2eTest production configuration
     * E2ETest inherits all settings of the development.
     * These can be changed, overwritten or extended.
     *
     * @returns {Object} config
     */
    config.e2eProductionTest = function () {

        // Config contains all settings from development.
        var settings = config.development();

        // overwrite the settings for this configuration
        settings.port = <%= baboon.app_e2eTest_port %>;
        settings.node_env = 'production';

        return settings;
    };

    /**
     * The e2eTest production configuration
     * E2ETest inherits all settings of the development.
     * These can be changed, overwritten or extended.
     *
     * @returns {Object} config
     */
    config.productionLog = function () {

        // Config contains all settings from development.
        var settings = config.production();

        // overwrite the settings for this configuration
        settings.logging.loggers.audit.level = 'DEBUG';
        settings.logging.loggers.audit.appender = 'console';
        settings.logging.loggers.syslog.level = 'DEBUG';
        settings.logging.loggers.syslog.appender = 'console';
        settings.logging.loggers.express.level = 'DEBUG';
        settings.logging.loggers.express.appender = 'console';
        settings.logging.loggers.socket.level = 'DEBUG';
        settings.logging.loggers.socket.appender = 'console';

        return settings;
    };

    return config;
};