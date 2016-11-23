/**
 * Created by Mobile on 21/11/2016.
 */
(function () {
  'use strict';

  angular
    .module('userclients')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Clients',
      state: 'userclients.list',
      roles: ['user']
    });

    // Add the dropdown list item
  }
}());
