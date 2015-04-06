var chai = require('chai'),
    expect = chai.expect,
    uri = require('../src/uri.js');

describe('uri lib', function() {
  it('should parse stringified and encoded props from location', function() {
    location = 'mypage.com?name=Jack&info=%7B%22age%22%3A25%7D';
    params = uri.parseLocation(location);

    expect(params.name).to.equal('Jack');
    expect(params.info.age).to.equal(25);
  });

  it('should generate location with query string from params', function() {
    var params = {
      name: 'Jack',
      info: {
        age: 25
      }
    };

    expect(uri.stringifyParams(params)).
        to.equal('?name=Jack&info=%7B%22age%22%3A25%7D');
  });
});
