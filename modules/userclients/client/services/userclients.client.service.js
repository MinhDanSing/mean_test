// Userclients service used to communicate Userclients REST endpoints
(function () {
  'use strict';

  angular
    .module('userclients')
    .factory('UserclientsService', UserclientsService);

  UserclientsService.$inject = ['$resource'];

  function UserclientsService($resource) {
    return $resource('/api/userclients/:userclientId', {
      userclientId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
