(function () {
  'use strict';

  angular
    .module('useraccounts')
    .controller('UseraccountsListController', UseraccountsListController);

  UseraccountsListController.$inject = ['UseraccountsService'];

  function UseraccountsListController(UseraccountsService) {
    var vm = this;

    vm.useraccounts = UseraccountsService.query();
  }
}());
