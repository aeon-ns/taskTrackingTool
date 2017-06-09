"use strict";
angular.module('taskTool', ['ui.router', 'ngResource'])
    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('login', {
                url: '/',
                templateUrl: '../views/login.html',
                controller: 'LoginController'
            })
            .state('home', {
                url: '/home',
                templateUrl: '../views/home.html',
                controller: 'HomeController'
            })
            .state('newTask', {
                url: '/newTask',
                templateUrl: '../views/task.html',
                controller: 'TaskController'
            });
        $urlRouterProvider.otherwise('/');
    })
    ;