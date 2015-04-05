var _ = require('lodash'),
    chai = require('chai'),
    expect = chai.expect,
    sinon = require('sinon'),
    sinonChai = require('sinon-chai'),
    serialize = require('../src/serialize.js'),
    Router = require('../src/router.js');

chai.use(sinonChai);

describe('Router class', function() {
  var componentInstance = {},
      onRenderSpy = sinon.spy(function() {
        return componentInstance;
      });

  var routerOptions,
      routerInstance,
      location,
      uriParams;

  function createRouter(extraOptions) {
    routerInstance = new Router(_.merge(routerOptions, extraOptions));
  };

  beforeEach(function() {
    // Allow query string to be overridden before tests
    location = 'mypage.com?component=List&dataUrl=users.json';

    uriParams = {
      component: 'List',
      props: {
        dataUrl: 'users.json'
      }
    };

    sinon.stub(serialize, 'parseLocation', function() {
      return uriParams;
    });

    // Ignore window API
    sinon.stub(Router.prototype, '_getCurrentLocation', function() {
      return location;
    });
    sinon.stub(Router.prototype, '_isPushStateSupported').returns(true);
    sinon.stub(Router.prototype, '_bindPopStateEvent');
    sinon.stub(Router.prototype, '_unbindPopStateEvent');
    sinon.stub(Router.prototype, '_replaceHistoryState');
    sinon.stub(Router.prototype, '_pushHistoryState');

    routerOptions = {onRender: onRenderSpy};
  });

  afterEach(function() {
    serialize.parseLocation.restore();

    Router.prototype._getCurrentLocation.restore();
    Router.prototype._isPushStateSupported.restore();
    Router.prototype._bindPopStateEvent.restore();
    Router.prototype._unbindPopStateEvent.restore();
    Router.prototype._replaceHistoryState.restore();
    Router.prototype._pushHistoryState.restore();

    onRenderSpy.reset();
  });

  describe('new instance', function() {
    it('should get current location', function() {
      createRouter();

      expect(routerInstance._getCurrentLocation).to.have.been.called;
    });

    it('should unserialize current URL', function() {
      createRouter();

      expect(serialize.parseLocation).to.have.been.calledWith(location);
    });

    it('should render using URL params as props', function() {
      createRouter();

      var propsSent = onRenderSpy.lastCall.args[0];
      expect(propsSent.dataUrl).to.equal('users.json');
    });

    it('should extend default props', function() {
      createRouter({
        defaultProps: {
          defaultProp: true
        }
      });

      var propsSent = onRenderSpy.lastCall.args[0];
      expect(propsSent.dataUrl).to.equal('users.json');
      expect(propsSent.defaultProp).to.equal(true);
    });

    it('should attach router reference to props', function() {
      createRouter();

      var propsSent = onRenderSpy.lastCall.args[0];
      expect(propsSent.router).to.equal(routerInstance);
    });

    it('should use container node received in options', function() {
      var container = '<fake DOM element>';
      createRouter({
        container: container
      });

      expect(onRenderSpy.lastCall.args[1]).to.equal(container);
    });

    it('should expose reference to root component', function() {
      createRouter();

      expect(routerInstance.rootComponent).to.equal(componentInstance);
    });

    it('should call onChange callback with params', function() {
      var onChangeSpy = sinon.spy();
      createRouter({
        onChange: onChangeSpy
      });

      var propsSent = onChangeSpy.lastCall.args[0];
      expect(propsSent.component).to.equal('List');
      expect(propsSent.props.dataUrl).to.equal('users.json');
    });
  });

  describe('.goTo method', function() {
    beforeEach(function() {
      location = 'mypage.com?component=User&dataUrl=user.json';

      uriParams = {
        component: 'User',
        props: {
          dataUrl: 'user.json'
        }
      };
    });

    it('should check if pushState is supported', function() {
      createRouter();

      routerInstance.goTo(location);

      expect(routerInstance._isPushStateSupported).to.have.been.called;
    });

    it('should unserialize new URL query string', function() {
      createRouter();

      routerInstance.goTo(location);

      expect(serialize.parseLocation).to.have.been.calledWith(location);
    });

    it('should render using new URL params as props', function() {
      createRouter();

      routerInstance.goTo(location);

      var propsSent = onRenderSpy.lastCall.args[0];
      expect(propsSent.dataUrl).to.equal('user.json');
    });

    it('should extend default props', function() {
      createRouter({
        defaultProps: {
          defaultProp: true
        }
      });

      routerInstance.goTo(location);

      var propsSent = onRenderSpy.lastCall.args[0];
      expect(propsSent.dataUrl).to.equal('user.json');
      expect(propsSent.defaultProp).to.equal(true);
    });

    it('should attach router reference to props', function() {
      createRouter();

      routerInstance.goTo(location);

      var propsSent = onRenderSpy.lastCall.args[0];
      expect(propsSent.router).to.equal(routerInstance);
    });

    it('should push new entry to browser history', function() {
      createRouter();

      routerInstance.goTo(location);

      // It's a bit difficult to mock the native functions so we mocked the
      // private methods that wrap those calls
      //expect(routerInstance._pushHistoryState).to.have.been.called;
      expect(routerInstance._pushHistoryState.lastCall.args[1])
          .to.equal(location);
    });

    it('should call onChange callback', function() {
      var onChangeSpy = sinon.spy();
      createRouter({
        onChange: onChangeSpy
      });

      routerInstance.goTo(location);

      var propsSent = onChangeSpy.lastCall.args[0];
      expect(propsSent.component).to.equal('User');
      expect(propsSent.props.dataUrl).to.equal('user.json');
    });
  });

  describe('.PopState event', function() {
    beforeEach(function() {
      location = 'mypage.com?component=User&dataUrl=user.json';

      uriParams = {
        component: 'User',
        props: {
          dataUrl: 'user.json'
        }
      };
    });

    it('should get current location', function() {
      createRouter();

      expect(routerInstance._getCurrentLocation).to.have.been.called;
    });

    it('should unserialize current URL', function() {
      createRouter();

      expect(serialize.parseLocation).to.have.been.calledWith(location);
    });

    it('should extend default props', function() {
      createRouter({
        defaultProps: {
          defaultProp: true
        }
      });

      routerInstance.onPopState({
        state: {}
      });

      var propsSent = onRenderSpy.lastCall.args[0];
      expect(propsSent.dataUrl).to.equal('user.json');
      expect(propsSent.defaultProp).to.equal(true);
    });

    it('should attach router reference to props', function() {
      createRouter();

      routerInstance.onPopState({
        state: {}
      });

      var propsSent = onRenderSpy.lastCall.args[0];
      expect(propsSent.router).to.equal(routerInstance);
    });

    it('should call onChange callback', function() {
      var onChangeSpy = sinon.spy();
      createRouter({
        onChange: onChangeSpy
      });

      routerInstance.onPopState({
        state: {}
      });

      var propsSent = onChangeSpy.lastCall.args[0];
      expect(propsSent.component).to.equal('User');
      expect(propsSent.props.dataUrl).to.equal('user.json');
    });
  });
});
