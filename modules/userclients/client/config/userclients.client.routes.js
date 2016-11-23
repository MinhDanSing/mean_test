(function () {
  'use strict';

  angular
    .module('userclients')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('userclients', {
        abstract: true,
        url: '/userclients',
        template: '<ui-view/>'
      })
      .state('userclients.list', {
        url: '',
        templateUrl: '/modules/userclients/client/views/list-userclients.client.view.html',
        controller: 'UserclientsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Userclients List'
        }
      })
      .state('userclients.create', {
        url: '/create',
        templateUrl: '/modules/userclients/client/views/form-userclient.client.view.html',
        controller: 'UserclientsController',
        controllerAs: 'vm',
        resolve: {
          userclientResolve: newUserclient
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Userclients Create'
        }
      })
      .state('userclients.edit', {
        url: '/:userclientId/edit',
        templateUrl: '/modules/userclients/client/views/form-userclient.client.view.html',
        controller: 'UserclientsController',
        controllerAs: 'vm',
        resolve: {
          userclientResolve: getUserclient
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Userclient {{ userclientResolve.name }}'
        }
      })
      .state('userclients.view', {
        url: '/:userclientId',
        templateUrl: '/modules/userclients/client/views/view-userclient.client.view.html',
        controller: 'UserclientsController',
        controllerAs: 'vm',
        resolve: {
          userclientResolve: getUserclient
        },
        data: {
          pageTitle: 'Userclient {{ userclientResolve.name }}'
        }
      });
  }

  getUserclient.$inject = ['$stateParams', 'UserclientsService'];

  function getUserclient($stateParams, UserclientsService) {
    return UserclientsService.get({
      userclientId: $stateParams.userclientId
    }).$promise;
  }

  newUserclient.$inject = ['UserclientsService'];

  function newUserclient(UserclientsService) {
    return new UserclientsService();
  }
}());
