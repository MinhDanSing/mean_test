// Useraccounts service used to communicate Useraccounts REST endpoints
(function () {
  'use strict';

  angular
    .module('useraccounts')
    .factory('UseraccountsService', UseraccountsService);

  UseraccountsService.$inject = ['$resource'];

  function UseraccountsService($resource) {
    return $resource('/api/useraccounts/:useraccountId', {
      useraccountId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
