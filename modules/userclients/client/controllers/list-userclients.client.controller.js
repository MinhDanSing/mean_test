(function () {
  'use strict';

  angular
    .module('userclients')
    .controller('UserclientsListController', UserclientsListController);

  UserclientsListController.$inject = ['UserclientsService'];

  function UserclientsListController(UserclientsService) {
    var vm = this;

    vm.userclients = UserclientsService.query();
  }
}());
