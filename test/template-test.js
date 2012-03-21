var should = require('should')
  , Template = require('../lib/template');

describe('Template', function () {
  var tpl;

  beforeEach(function () {
    tpl = new Template('awesome');
  });

  it('shuold provide the answer', function () {
    tpl.getAnswer().should.equal(42);
  });
});
