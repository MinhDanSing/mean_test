(function () {
  'use strict';

  // Userclients controller
  angular
    .module('userclients')
    .controller('UserclientsController', UserclientsController);

  UserclientsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'userclientResolve', '$timeout', 'Upload', 'Notification'];

  function UserclientsController($scope, $state, $window, Authentication, userclient, $timeout, Upload, Notification) {
    var vm = this;

    vm.authentication = Authentication;
    vm.userclient = userclient;
    var res = vm.userclient._id ? 'Update' : 'Create';
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    var picFile;
    // file upload
    vm.progress = 0;
    vm.defaultImgUrl = '/modules/users/client/img/profile/default.png';
    vm.noSelectedImgUrl = vm.userclient._id ? '/' + vm.userclient.clientImageURL : vm.defaultImgUrl;

    // Remove existing Userclient
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.userclient.$remove($state.go('userclients.list'));
      }
    }

    // Save Userclient
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.userclientForm');
        return false;
      }
      var newuserclient = {
        _id : vm.userclient._id,
        name : vm.userclient.name,
        email : vm.userclient.email,
        devproject : vm.userclient.devproject,
        country : vm.userclient.country,
        comment : vm.userclient.comment,
        clientImageURL : vm.userclient.clientImageURL,
        user : vm.userclient.user
      } ;
      Upload.upload({
        url: '/api/userclients_saveuser',
        data: {
          newProfilePicture: $scope.picFile,
          clientdata: newuserclient
        }
      }).then(function (response) {
        $timeout(function () {
          onSuccessItem(response.data);
        });
      }, function (response) {
        onErrorItem(response.data);
      }, function (evt) {
        vm.progress = parseInt(100.0 * evt.loaded / evt.total, 10);
      });
      // TODO: move create/update logic to service
    }


    // Called after the user has successfully uploaded a new picture
    function onSuccessItem(response) {
      // Show success message
      Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Successfully saved Client' });

      // Populate user object
      $state.go('userclients.list');

      // Reset form
      vm.fileSelected = false;
      vm.progress = 0;
    }

    // Called after the user has failed to upload a new picture
    function onErrorItem(response) {
      vm.fileSelected = false;
      vm.progress = 0;

      // Show error message
      Notification.error({
        message: response.errmsg,
        title: '<i class="glyphicon glyphicon-remove"></i> Failed to save Client'
      });
    }
  }
}());
