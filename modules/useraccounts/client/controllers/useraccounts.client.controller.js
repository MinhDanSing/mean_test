(function () {
  'use strict';

  // Useraccounts controller
  angular
    .module('useraccounts')
    .controller('UseraccountsController', UseraccountsController);

  UseraccountsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'useraccountResolve'];

  function UseraccountsController($scope, $state, $window, Authentication, useraccount) {
    var vm = this;

    vm.authentication = Authentication;
    vm.useraccount = useraccount;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.forminput = [
      {
        'title': 'Name',
        'variable': 'name',
        'validate': 'required'
      },
      {
        'title': 'Nation',
        'variable': 'nation',
        'validate': 'required'
      },
      {
        'title': 'Country',
        'variable': 'country',
        'validate': 'required'
      },
      {
        'title': 'Vpn',
        'variable': 'vpn',
        'validate': 'required'
      },
      {
        'title': 'Ip',
        'variable': 'ip',
        'validate': 'required'
      },
      {
        'title': 'Email',
        'variable': 'email',
        'validate': 'required'
      },
      {
        'title': 'Skype',
        'variable': 'skype',
        'validate': 'required'
      },
      {
        'title': 'Link',
        'variable': 'link',
        'validate': 'required'
      },
      {
        'title': 'Jobtitle',
        'variable': 'jobtitle',
        'validate': 'required'
      },
      {
        'title': 'Skill',
        'variable': 'skill',
        'validate': 'required'
      }
    ];
    if (!useraccount._id) {
      useraccount.name = '';
      useraccount.nation = '';
      useraccount.country = '';
      useraccount.vpn = '';
      useraccount.ip = '';
      useraccount.email = '';
      useraccount.skype = '';
      useraccount.link = '';
      useraccount.jobtitle = '';
      useraccount.country = '';
      useraccount.skill = '';
    }
    // Remove existing Useraccount
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.useraccount.$remove($state.go('useraccounts.list'));
      }
    }

    // Save Useraccount
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.useraccountForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.useraccount._id) {
        vm.useraccount.$update(successCallback, errorCallback);
      } else {
        vm.useraccount.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('useraccounts.view', {
          useraccountId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
