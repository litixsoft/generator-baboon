/*global describe, inject, it, expect, beforeEach */
'use strict';

describe('Module: <%= TopLevelName %>.<%= TopLevelPageName %>', function () {

    beforeEach(module('ngRoute'));
    beforeEach(module('bbc.transport'));
    beforeEach(module('<%= TopLevelName %>.<%= TopLevelPageName %>'));

    it('should map routes', function () {
        inject(function ($route) {
            expect($route.routes['/<%= TopLevelName %>/<%= TopLevelPageName %>'].controller).toBe('<%= _.classify(TopLevelName) %><%= _.classify(TopLevelPageName) %>Ctrl');
            expect($route.routes['/<%= TopLevelName %>/<%= TopLevelPageName %>'].templateUrl).toEqual('app/<%= TopLevelName %>/<%= TopLevelPageName %>/<%= TopLevelPageName %>.html');
        });
    });
});