'use strict';

describe('Useraccounts E2E Tests:', function () {
  describe('Test Useraccounts page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/useraccounts');
      expect(element.all(by.repeater('useraccount in useraccounts')).count()).toEqual(0);
    });
  });
});
