(function () {
  'use strict';

  describe('Userclients Route Tests', function () {
    // Initialize global variables
    var $scope,
      UserclientsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _UserclientsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      UserclientsService = _UserclientsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('userclients');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/userclients');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          UserclientsController,
          mockUserclient;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('userclients.view');
          $templateCache.put('modules/userclients/client/views/view-userclient.client.view.html', '');

          // create mock Userclient
          mockUserclient = new UserclientsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Userclient Name'
          });

          // Initialize Controller
          UserclientsController = $controller('UserclientsController as vm', {
            $scope: $scope,
            userclientResolve: mockUserclient
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:userclientId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.userclientResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            userclientId: 1
          })).toEqual('/userclients/1');
        }));

        it('should attach an Userclient to the controller scope', function () {
          expect($scope.vm.userclient._id).toBe(mockUserclient._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/userclients/client/views/view-userclient.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          UserclientsController,
          mockUserclient;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('userclients.create');
          $templateCache.put('modules/userclients/client/views/form-userclient.client.view.html', '');

          // create mock Userclient
          mockUserclient = new UserclientsService();

          // Initialize Controller
          UserclientsController = $controller('UserclientsController as vm', {
            $scope: $scope,
            userclientResolve: mockUserclient
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.userclientResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/userclients/create');
        }));

        it('should attach an Userclient to the controller scope', function () {
          expect($scope.vm.userclient._id).toBe(mockUserclient._id);
          expect($scope.vm.userclient._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/userclients/client/views/form-userclient.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          UserclientsController,
          mockUserclient;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('userclients.edit');
          $templateCache.put('modules/userclients/client/views/form-userclient.client.view.html', '');

          // create mock Userclient
          mockUserclient = new UserclientsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Userclient Name'
          });

          // Initialize Controller
          UserclientsController = $controller('UserclientsController as vm', {
            $scope: $scope,
            userclientResolve: mockUserclient
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:userclientId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.userclientResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            userclientId: 1
          })).toEqual('/userclients/1/edit');
        }));

        it('should attach an Userclient to the controller scope', function () {
          expect($scope.vm.userclient._id).toBe(mockUserclient._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/userclients/client/views/form-userclient.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
