(function () {
  'use strict';

  angular
    .module('useraccounts')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('useraccounts', {
        abstract: true,
        url: '/useraccounts',
        template: '<ui-view/>'
      })
      .state('useraccounts.list', {
        url: '',
        templateUrl: '/modules/useraccounts/client/views/list-useraccounts.client.view.html',
        controller: 'UseraccountsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Useraccounts List'
        }
      })
      .state('useraccounts.create', {
        url: '/create',
        templateUrl: '/modules/useraccounts/client/views/form-useraccount.client.view.html',
        controller: 'UseraccountsController',
        controllerAs: 'vm',
        resolve: {
          useraccountResolve: newUseraccount
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Useraccounts Create'
        }
      })
      .state('useraccounts.edit', {
        url: '/:useraccountId/edit',
        templateUrl: '/modules/useraccounts/client/views/form-useraccount.client.view.html',
        controller: 'UseraccountsController',
        controllerAs: 'vm',
        resolve: {
          useraccountResolve: getUseraccount
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Useraccount {{ useraccountResolve.name }}'
        }
      })
      .state('useraccounts.view', {
        url: '/:useraccountId',
        templateUrl: '/modules/useraccounts/client/views/view-useraccount.client.view.html',
        controller: 'UseraccountsController',
        controllerAs: 'vm',
        resolve: {
          useraccountResolve: getUseraccount
        },
        data: {
          pageTitle: 'Useraccount {{ useraccountResolve.name }}'
        }
      });
  }

  getUseraccount.$inject = ['$stateParams', 'UseraccountsService'];

  function getUseraccount($stateParams, UseraccountsService) {
    return UseraccountsService.get({
      useraccountId: $stateParams.useraccountId
    }).$promise;
  }

  newUseraccount.$inject = ['UseraccountsService'];

  function newUseraccount(UseraccountsService) {
    return new UseraccountsService();
  }
}());
