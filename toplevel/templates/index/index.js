
'use strict';

angular.module('<%= TopLevelName %>.<%= TopLevelPageName %>', [])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/<%= TopLevelName %>/<%= TopLevelPageName %>', {
                templateUrl: 'app/<%= TopLevelName %>/<%= TopLevelPageName %>/<%= TopLevelPageName %>.html',
                controller: '<%= _.classify(TopLevelName) %><%= _.classify(TopLevelPageName) %>Ctrl'
            });
    })
    .controller('<%= _.classify(TopLevelName) %><%= _.classify(TopLevelPageName) %>Ctrl', function ($scope) {
        $scope.title = '<%= _.classify(TopLevelName) %>.<%= _.classify(TopLevelPageName) %>';
    });