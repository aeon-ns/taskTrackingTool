"use strict";
angular.module('taskTool')
    .controller('LoginController', ['$scope', 'regService', 'loginService',
        function ($scope, regService, loginService) {
            $scope.user = { username: '', password: '' };
            $scope.reason = '';
            $scope.login = function () {
                $scope.regSuccess = $scope.regFail = $scope.loginFail = false;
                if ($scope.user.username && $scope.user.password)
                    loginService.signIn($scope.user.username, $scope.user.password);
            };
            $scope.register = function () {
                $scope.regSuccess = $scope.regFail = $scope.loginFail = false;
                if ($scope.user.username && $scope.user.password && $scope.user.cpassword && $scope.user.password == $scope.user.cpassword)
                    regService.signUp($scope.user.username, $scope.user.password);
            };
            $scope.$on('reg-success', function (event, res) {
                $scope.regSuccess = true;
                $scope.loginMode = true;
                event.preventDefault();
            });
            $scope.$on('reg-fail', function (event, res) {
                $scope.regFail = true;
                console.log(res);
                if (res.status == 409) $scope.reason = res.data.msg;
                event.preventDefault();
            });
            $scope.$on('login-fail', function (event, res) {
                $scope.loginFail = true;
                event.preventDefault();
            });
        }])
    .filter('timeElapsed',
    function () {
        return function (input) {
            var created = new Date(input);
            var interval = Date.now() - created.getTime();
            var tmp = "";
            if (interval < 1000) {
                tmp = " milliseconds";
            } else if ((interval / 1000) < 60) {
                interval = parseInt(interval / 1000, 10);
                tmp = (interval == 1) ? " second" : " seconds";
            } else if ((interval / 60000) < 60) {
                interval = parseInt(interval / 60000, 10);
                tmp = (interval == 1) ? " minute" : " minutes";
            } else {
                interval = parseInt(interval / 3600000, 10);
                tmp = (interval == 1) ? " hour" : " hours";
            }
            return interval + tmp + " ago";
        };
    })
    .controller('HomeController', ['$scope', 'myTasks', 'publicTasks', 'logoutService',
        function ($scope, myTasks, publicTasks, logoutService) {
            $scope.public = false;
            $scope.err = false;
            $scope.tasks = myTasks.get();
            $scope.showPublic = function () {
                $scope.public = true;
                $scope.tasks = publicTasks.get();
            };
            $scope.showMyTasks = function () {
                $scope.public = false;
                $scope.tasks = myTasks.get();
            };
            $scope.logout = function () {
                logoutService.logOut();
            };
            $scope.$on('task-error', function (event, res) {
                $scope.err = true;
                $scope.msg = res.data.msg;
            });
            $scope.$on('mytasks-ready', function (event, mytasks) {
                if (!$scope.public) $scope.tasks = mytasks;
                $scope.err = false;
            });
            $scope.$on('public-tasks-ready', function (event, publictasks) {
                if ($scope.public) $scope.tasks = publictasks;
                $scope.err = false;
            });
        }])
    .controller('TaskController', ['$scope', 'resources', 'myTasks', 'publicTasks', '$state', 'logoutService',
        function ($scope, resources, myTasks, publicTasks, $state, logoutService) {
            $scope.task = { deadline: new Date(), private: 'public' };
            $scope.logout = function () {
                logoutService.logOut();
            };
            $scope.submit = function () {
                if ($scope.task.private) $scope.task.private = $scope.task.private == 'private';
                console.log('submit');
                console.log($scope.task);
                resources.getMyTaskResource().save(JSON.stringify($scope.task))
                    .$promise
                    .then(
                    function (res) {
                        console.log('saved');
                        myTasks.startFetching();
                        publicTasks.startFetching();
                        $state.transitionTo('home');
                    },
                    function (res) { $scope.$parent.$broadcast('task-error', res); }
                    );
            };
        }])
    ;