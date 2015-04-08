# react-minimal-router [![Build Status](https://travis-ci.org/skidding/react-minimal-router.svg?branch=master)](https://travis-ci.org/skidding/react-minimal-router) [![Coverage Status](https://coveralls.io/repos/skidding/react-minimal-router/badge.svg?branch=master)](https://coveralls.io/r/skidding/react-minimal-router?branch=master)
Bare router for React components, using query string as props.

```
http://mysite.com/?component=Father&eyes=blue&mood=happy
```

This route would render the Father component (see `getComponentClass` option),
using the following props:

```js
{
  eyes: 'blue',
  mood: 'happy'
}
```

#### Options

```js
var Router = require('react-minimal-router').Router;

var myRouter = new Router({
  // These props will be sent to all components loaded, and will be overridden
  // by the ones in the URL query string
  defaultProps: {
    fries: true
  },
  // This is how the router maps component names to corresponding classes
  getComponentClass: function(name) {
    return require('components/' + name + '.jsx');
  },
  // Tell React where to render in the DOM
  container: document.getElementById('content'),
  // Called whenever the route changes (also initially), receiving the parsed
  // params as the first argument
  onChange: function(params) {
    // E.g. Use the params to set a custom document.title
  }
});
```

The router always sends a reference to itself to the rendered component through
the `router` prop.

#### Changing the route

```jsx
var stringifyParams = require('react-minimal-router').uri.stringifyParams;

//...

render: function() {
  return <div className="serious-component">
    <a href={stringifyParams({lifeChangingProp: 1})}
       onClick={this.props.router.routeLink}>
       Click me por favor
    </a>
  </div>;
};
```
