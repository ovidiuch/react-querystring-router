var _ = require('lodash'),
    uri = require('./uri.js');

var Router = function(options) {
  this._options = _.extend({
    defaultProps: {}
  }, options);

  this.routeLink = this.routeLink.bind(this);
  this.onPopState = this.onPopState.bind(this);

  this._bindPopStateEvent();

  // The initial render is done instantly when the Router instance is created
  this._loadParams(uri.parseLocation(this._getCurrentLocation()));
};

Router.prototype = {
  stop: function() {
    this._unbindPopStateEvent();
  },

  routeLink: function(event) {
    /**
     * Any <a> tag can have this method bound to its onClick event to have
     * their corresponding href location picked up by the built-in Router
     * implementation, which uses pushState to switch between Components
     * instead of reloading pages.
     */
    event.preventDefault();

    this._loadLocation(event.currentTarget.href);
  },

  goTo: function(location) {
    this._loadLocation(location);
  },

  onPopState: function(e) {
    // Chrome & Safari trigger an empty popState event initially, while
    // Firefox doesn't, we choose to ignore that event altogether
    if (!e.state) {
      return;
    }

    var location = this._getCurrentLocation(),
        params = uri.parseLocation(location);

    this._loadParams(params, location);
  },

  _loadLocation: function(location) {
    // Old-school refreshes are made when pushState isn't supported
    if (!this._isPushStateSupported()) {
      window.location = location;
      return;
    }

    // Create a history entry for the new component
    this._pushHistoryState({}, location);

    this._loadParams(uri.parseLocation(location));
  },

  _loadParams: function(params) {
    var props = _.extend({
      // Always send the components a reference to the router. This makes it
      // possible for a component to change the page through the router and
      // not have to rely on any sort of globals
      router: this
    }, this._options.defaultProps, params.props);

    // The router exposes the instance of the currently rendered component
    this.rootComponent = this._options.onRender(props,
                                                this._options.container);

    if (_.isFunction(this._options.onChange)) {
      this._options.onChange.call(this, params);
    }
  },

  _getCurrentLocation: function() {
    return window.location.href;
  },

  _bindPopStateEvent: function() {
    window.addEventListener('popstate', this.onPopState);
  },

  _unbindPopStateEvent: function() {
    window.removeEventListener('popstate', this.onPopState);
  },

  _replaceHistoryState: function(state, url) {
    window.history.replaceState(state, '', url);
  },

  _pushHistoryState: function(state, url) {
    window.history.pushState(state, '', url);
  },

  _isPushStateSupported: function() {
    return !!window.history.pushState;
  }
};

module.exports = Router;
