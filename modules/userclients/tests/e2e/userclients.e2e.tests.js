'use strict';

describe('Userclients E2E Tests:', function () {
  describe('Test Userclients page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/userclients');
      expect(element.all(by.repeater('userclient in userclients')).count()).toEqual(0);
    });
  });
});
