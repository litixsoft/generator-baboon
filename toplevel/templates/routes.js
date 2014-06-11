'use strict';
module.exports = function (baboon, router) {
    var auth = baboon.middleware.auth;

    router.get('/<%= TopLevelName %>', auth.restrictedAdmin, function (req, res) {
        res.render('app/<%= TopLevelName %>/index');
    });

    router.get('/<%= TopLevelName %>/*', auth.restrictedAdmin, function (req, res) {
        res.render('app/<%= TopLevelName %>/index');
    });

    return router;
};