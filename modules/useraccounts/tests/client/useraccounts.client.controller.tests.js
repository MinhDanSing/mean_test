(function () {
  'use strict';

  describe('Useraccounts Controller Tests', function () {
    // Initialize global variables
    var UseraccountsController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      UseraccountsService,
      mockUseraccount;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _UseraccountsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      UseraccountsService = _UseraccountsService_;

      // create mock Useraccount
      mockUseraccount = new UseraccountsService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Useraccount Name'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Useraccounts controller.
      UseraccountsController = $controller('UseraccountsController as vm', {
        $scope: $scope,
        useraccountResolve: {}
      });

      // Spy on state go
      spyOn($state, 'go');
    }));

    describe('vm.save() as create', function () {
      var sampleUseraccountPostData;

      beforeEach(function () {
        // Create a sample Useraccount object
        sampleUseraccountPostData = new UseraccountsService({
          name: 'Useraccount Name'
        });

        $scope.vm.useraccount = sampleUseraccountPostData;
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (UseraccountsService) {
        // Set POST response
        $httpBackend.expectPOST('api/useraccounts', sampleUseraccountPostData).respond(mockUseraccount);

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL redirection after the Useraccount was created
        expect($state.go).toHaveBeenCalledWith('useraccounts.view', {
          useraccountId: mockUseraccount._id
        });
      }));

      it('should set $scope.vm.error if error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/useraccounts', sampleUseraccountPostData).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      });
    });

    describe('vm.save() as update', function () {
      beforeEach(function () {
        // Mock Useraccount in $scope
        $scope.vm.useraccount = mockUseraccount;
      });

      it('should update a valid Useraccount', inject(function (UseraccountsService) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/useraccounts\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($state.go).toHaveBeenCalledWith('useraccounts.view', {
          useraccountId: mockUseraccount._id
        });
      }));

      it('should set $scope.vm.error if error', inject(function (UseraccountsService) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/useraccounts\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      }));
    });

    describe('vm.remove()', function () {
      beforeEach(function () {
        // Setup Useraccounts
        $scope.vm.useraccount = mockUseraccount;
      });

      it('should delete the Useraccount and redirect to Useraccounts', function () {
        // Return true on confirm message
        spyOn(window, 'confirm').and.returnValue(true);

        $httpBackend.expectDELETE(/api\/useraccounts\/([0-9a-fA-F]{24})$/).respond(204);

        $scope.vm.remove();
        $httpBackend.flush();

        expect($state.go).toHaveBeenCalledWith('useraccounts.list');
      });

      it('should should not delete the Useraccount and not redirect', function () {
        // Return false on confirm message
        spyOn(window, 'confirm').and.returnValue(false);

        $scope.vm.remove();

        expect($state.go).not.toHaveBeenCalled();
      });
    });
  });
}());
