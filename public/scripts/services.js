"use strict";
angular.module('taskTool')
    // .constant('BASE_URL', 'http://localhost:3000/')
    .constant('BASE_URL', 'https://polar-depths-19089.herokuapp.com/')
    .factory('$localStorage', ['$window',
        function ($window) {
            return {
                store: function (key, value) {
                    $window.localStorage[key] = value;
                },
                fetch: function (key, value) {
                    return $window.localStorage[key] || value;
                },
                storeObj: function (key, value) {
                    $window.localStorage[key] = JSON.stringify(value);
                },
                fetchObj: function (key, value) {
                    return JSON.parse($window.localStorage[key] || value);
                }
            };
        }])
    .factory('token', ['$localStorage',
        function ($localStorage) {
            var token = null;
            var fetched = false;
            return {
                set: function (toke, isFetched) {
                    token = toke;
                    $localStorage.store('token', token);
                    fetched = isFetched;
                },
                get: function () {
                    return fetched ? token : token = $localStorage.fetch('token', null);
                }
            };
        }])
    .factory('resources', ['BASE_URL', '$resource', 'token',
        function (BASE_URL, $resource, token) {
            var fac = {};
            fac.getLoginResource = function () {
                return $resource(BASE_URL + 'users/signin', null, {
                    save: { method: 'POST' }
                });
            };
            fac.getLogoutResource = function () {
                return $resource(BASE_URL + 'users/signout', null, {
                    get: { method: 'GET', headers: { 'x-access-token': token.get() } }
                });
            };
            fac.getRegisterResource = function () {
                return $resource(BASE_URL + 'users/register', null, {
                    save: { method: 'POST' }
                });
            };
            fac.getMyTaskResource = function () {
                return $resource(BASE_URL + 'tasks/:id', null, {
                    get: { method: 'GET', headers: { 'x-access-token': token.get() }, isArray: true },
                    save: { method: 'POST', headers: { 'x-access-token': token.get() } }
                });
            };
            fac.getPublicTaskResource = function () {
                return $resource(BASE_URL + 'tasks/public', null, {
                    get: { method: 'GET', headers: { 'x-access-token': token.get() }, isArray: true }
                });
            };
            return fac;
        }])
    .factory('myTasks', ['resources', '$rootScope',
        function (resources, $rootScope) {
            var fac = {};
            var tasks = null;
            var startFetching = function () {
                var resource = resources.getMyTaskResource();
                resource.get()
                    .$promise.then(
                    function (res) {
                        //broadcast tasks
                        tasks = res;
                        $rootScope.$broadcast('mytasks-ready', tasks);
                    },
                    function (res) {
                        $rootScope.$broadcast('task-error', res);
                    }
                    );
            };
            fac.reset = function () {
                tasks = null;
            };
            fac.get = function () {
                if (tasks == null) startFetching();
                return tasks || [];
            };
            fac.startFetching = startFetching;
            return fac;
        }])
    .factory('publicTasks', ['resources', '$rootScope',
        function (resources, $rootScope) {
            var fac = {};
            var tasks = null;
            var startFetching = function () {
                var resource = resources.getPublicTaskResource();
                resource.get()
                    .$promise.then(
                    function (res) {
                        //broadcast tasks
                        tasks = res;
                        $rootScope.$broadcast('public-tasks-ready', tasks);
                    },
                    function (res) {
                        $rootScope.$broadcast('task-error', res);
                    }
                    );
            };
            fac.get = function () {
                if (tasks == null) startFetching();
                return tasks || [];
            };
            fac.reset = function () {
                tasks = null;
            };
            fac.startFetching = startFetching;
            return fac;
        }])
    .service('loginService', ['resources', 'token', '$rootScope', '$state', 'myTasks', 'publicTasks',
        function (resources, token, $rootScope, $state, myTasks, publicTasks) {
            var resource = resources.getLoginResource();
            this.signIn = function (username, password) {
                var body = { username: username, password: password };
                resource.save(JSON.stringify(body))
                    .$promise
                    .then(
                    function (res) {
                        token.set(res.token, true);
                        myTasks.startFetching();
                        publicTasks.startFetching();
                        $state.transitionTo('home');
                    },
                    function (res) { $rootScope.$broadcast('login-fail', res); }
                    );
            };
        }])
    .service('logoutService', ['resources', '$state', '$timeout', 'token', 'myTasks', 'publicTasks',
        function (resources, $state, $timeout, token, myTasks, publicTasks) {
            this.logOut = function () {
                resources.getLogoutResource().get();
                token.set(null, false);
                myTasks.reset();
                publicTasks.reset();
                $timeout(function () {
                    $state.transitionTo('login');
                }, 10);
            };
        }])
    .service('regService', ['resources', '$rootScope',
        function (resources, $rootScope) {
            var resource = resources.getRegisterResource();
            this.signUp = function (username, password) {
                var body = {
                    username: username,
                    password: password
                };
                resource.save(JSON.stringify(body))
                    .$promise
                    .then(
                    function (res) {
                        console.log('Registered Successfully!');
                        $rootScope.$broadcast('reg-success', body);
                    },
                    function (res) {
                        console.log('Registration Failed!');
                        $rootScope.$broadcast('reg-fail', res);
                    }
                    );
            };
        }])
;