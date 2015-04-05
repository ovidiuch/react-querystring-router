var chai = require('chai'),
    expect = chai.expect,
    serialize = require('../src/serialize.js');

describe('serialize lib', function() {
  it('should parse stringified and encoded props from location', function() {
    location = 'mypage.com?component=List&' +
               'props=%7B%22dataUrl%22%3A%22users.json%22%7D';
    params = serialize.parseLocation(location);

    expect(params.component).to.equal('List');
    expect(params.props.dataUrl).to.equal('users.json');
  });

  it('should generate location with query string from params', function() {
    var params = {
      component: 'List',
      props: {
        dataUrl: 'users.json'
      }
    };

    expect(serialize.stringifyParams(params)).
        to.equal('?component=List&' +
                 'props=%7B%22dataUrl%22%3A%22users.json%22%7D');
  });
});
