'use strict';

angular.module('admin.roles', [])
    .config(function ($routeProvider) {

        $routeProvider.when('/admin/roles', {templateUrl: 'app/admin/roles/roles.html', controller: 'AdminRoleListCtrl'});
        $routeProvider.when('/admin/roles/edit/:id', {templateUrl: 'app/admin/roles/editRole.html', controller: 'AdminEditRoleCtrl', resolve: {
            rights: function(srvLibrary) {
                return srvLibrary.getRights();
            }
        }});
        $routeProvider.when('/admin/roles/new', {templateUrl: 'app/admin/roles/editRole.html', controller: 'AdminEditRoleCtrl', resolve: {
            rights: function(srvLibrary) {
                return srvLibrary.getRights();
            }
        }});
    })
    .factory('srvLibrary', function($q, $bbcTransport, adminModulePath) {
        var sdo = {
            getRights: function() {
                var deferred = $q.defer();
                $bbcTransport.emit(adminModulePath + 'rights/rights/getAll', function (error, result) {
                    deferred.resolve(result.items);
                });
                return deferred.promise;
            }
        };
        return sdo;
    })
    .controller('AdminRoleListCtrl', function ($rootScope, $scope, adminModulePath, $bbcTransport, $bbcModal, $translate) {
        $scope.initialPageSize = 10;
        $scope.pagingOptions = { skip: 0, limit: $scope.initialPageSize};
        $scope.sortOpts = { name: 1 };
        var header = 'DEL';
        var msg = 'DEL';
        var btnTextValues = { yes: 'Y', no: 'N' };

        $rootScope.$on('$translateChangeSuccess', function () {
            $translate(['DELETE', 'DELETE_MSG', 'YES', 'NO']).then(function (v) {
                header = v.DELETE;
                msg = v.DELETE_MSG;
                btnTextValues.yes = v.YES;
                btnTextValues.no = v.NO;
            });
        });

        var getData = function () {
            var options = { options: $scope.pagingOptions };
            options.options.sort = $scope.sortOpts;
            options.options.fields = ['name', 'description'];

            $bbcTransport.emit(adminModulePath + 'roles/roles/getAll', options, function (error, result) {
                if (result) {
                    for(var i = 0; i < result.items.length; i++) {
                        var name = result.items[i].name.toLowerCase();
                        result.items[i].canDelete = name !== 'user' && name !== 'guest' && name !== 'admin';
                    }

                    $scope.roles = result.items;
                    $scope.count = result.count;
                }
            });
        };

        $rootScope.$broadcast('$translateChangeSuccess');

        $scope.load = function (sort, page) {
            $scope.pagingOptions = page;
            $scope.sortOpts = sort;
            getData();
        };

        $scope.closeAlert = function (index) {
            $scope.alerts.splice(index, 1);
        };

        $scope.alerts = [];
        $scope.remove = function(id) {
            $scope.alerts.length = 0;
            var options = { id: 'deleteGroup', message: msg, headline: header, backdrop: true, buttonTextValues: btnTextValues };
            options.callObj = {
                cbYes: function () {
                    $bbcTransport.emit(adminModulePath + 'roles/roles/remove', { id: id }, function (error) {
                        if (error) {
                            if (error.name === 'ControllerError') {
                                $scope.alerts.push({ type: 'danger', msg: error.message });
                            }
                            else {
                                $scope.alerts.push({ type: 'danger', msg: 'GENERIC_ERROR' });
                            }
                        }
                        else {
                            getData();
                        }
                    });
                },
                cbNo: function () { }
            };
            $bbcModal.open(options);
        };

        getData();
    })
    .controller('AdminEditRoleCtrl', function ($scope, $routeParams, $location, $bbcForm, adminModulePath, $bbcTransport, rights) {
        $scope.bbcForm = $bbcForm('baboon_role', '_id');
        $scope.isReadOnly = false;
        $scope.rights = rights;

        function initState() {
            $scope.isReadOnly = $scope.bbcForm.model.name === 'User' || $scope.bbcForm.model.name === 'Guest' || $scope.bbcForm.model.name === 'Admin';

            for(var i = 0; i < $scope.rights.length; i++) {
                var r = $scope.rights[i];
                r.checked = hasUserRight(r._id);
                r.sort = r.checked;
            }
        }

        if ($routeParams.id && !$scope.bbcForm.hasLoadedModelFromCache($routeParams.id)) {
            $bbcTransport.emit(adminModulePath + 'roles/roles/getById', { id: $routeParams.id }, function (error, result) {
                if (result) {
                    $scope.bbcForm.setModel(result);
                    initState();
                }
            });
        } else {
            initState();
        }

        function hasUserRight(id) {
            if($scope.bbcForm.model.rights) {
                for (var i = 0; i < $scope.bbcForm.model.rights.length; i++) {
                    if ($scope.bbcForm.model.rights[i] === id) {
                        return true;
                    }
                }
            }
            return false;
        }

        $scope.setStyle = function (r) {
            return r.checked === true ? { 'border-left': '3px solid green' } : null;
        };

        $scope.save = function (model) {
            if ($scope.form) {
                $scope.form.errors = {};
            }

            var method = model._id ? 'roles/roles/update' : 'roles/roles/create';

            $bbcTransport.emit(adminModulePath + method, model, function (error, result) {
                if (result) {
                    $scope.bbcForm.setModel(typeof(result) === 'object' ? result : model, true);
                    $location.path('/admin/roles');
                } else if (error) {
                    if (error.name === 'ValidationError') {
                        $scope.bbcForm.populateValidation($scope.form, error.errors);
                    }
                }
            });
        };
    });