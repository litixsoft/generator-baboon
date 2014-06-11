'use strict';

describe('Scenario: User navigates the application.', function () {

    it('should be the correct scope by route /', function() {
        browser.get('/');

        var view = element(by.binding('view'));
        var thingList = element.all(by.repeater('thing in awesomeThings'));

        expect(thingList.count()).toEqual(5);
        expect(view.getText()).toEqual('app/main/home/home.html');
    });

    it('should be the correct scope by route /home', function() {
        browser.get('/home');

        var view = element(by.binding('view'));
        var thingList = element.all(by.repeater('thing in awesomeThings'));

        expect(thingList.count()).toEqual(5);
        expect(view.getText()).toEqual('app/main/home/home.html');
    });

    it('should be the correct scope by route /about', function() {
        browser.get('/about');

        var view = element(by.binding('view'));
        var thingList = element.all(by.repeater('thing in awesomeThings'));

        expect(thingList.count()).toEqual(5);
        expect(view.getText()).toEqual('app/main/about/about.html');
    });

    it('should be the correct scope by route /contact', function() {
        browser.get('/contact');

        var view = element(by.binding('view'));
        var thingList = element.all(by.repeater('thing in awesomeThings'));

        expect(thingList.count()).toEqual(5);
        expect(view.getText()).toEqual('app/main/contact/contact.html');
    });

    it('should be the correct scope by route /admin', function() {
        browser.get('/admin');

        var view = element(by.binding('view'));
        var thingList = element.all(by.repeater('thing in awesomeThings'));

        expect(thingList.count()).toEqual(5);
        expect(view.getText()).toEqual('app/admin/admin.html');
    });
});