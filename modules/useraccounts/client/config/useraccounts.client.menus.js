/**
 * Created by Mobile on 21/11/2016.
 */
(function () {
  'use strict';

  angular
    .module('useraccounts')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Accounts',
      state: 'useraccounts.list',
      roles: ['user']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'articles', {
      title: 'Profile edit',
      state: 'useraccounts.profile',
      roles: ['*']
    });
  }
}());
