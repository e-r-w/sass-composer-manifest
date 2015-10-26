var manifest = require('../lib/manifest');
var assert = require('assert');

describe('manifest npm', function(){

  var result;

  it('should append an npm dependency', function(){
    result = manifest.toSassString({
      dependencies: {
        foo: '^0.0.1'
      }
    });
    assert.equal(result, '@import "foo"');
  });

  it('should append multiple npm dependencies', function(){
    result = manifest.toSassString({
      dependencies: {
        foo: '^0.0.1',
        bar: '~0.0.1'
      }
    });
    assert.equal(result, '@import "foo"\n@import "bar"');
  });

});