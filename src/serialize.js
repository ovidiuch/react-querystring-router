module.exports = {
  getPropsFromQueryString: function(location) {
    var queryString = location.split('?').pop(),
        props = {};

    if (!queryString.length) {
      return props;
    }

    var pairs = queryString.split('&'),
        parts,
        key,
        value;

    for (var i = 0; i < pairs.length; i++) {
      parts = pairs[i].split('=');
      key = parts[0];
      value = decodeURIComponent(parts[1]);

      try {
        value = JSON.parse(value);
      } catch (e) {
        // If the prop was a simple type and not a stringified JSON it will
        // keep its original value
      }

      props[key] = value;
    }

    return props;
  },

  getQueryStringFromProps: function(props) {
    /**
     * Serializes a props object into a browser-complient URL. The URL
     * generated can be simply put inside the href attribute of an <a> tag, and
     * can be combined with the serialize method of the ComponentTree Mixin to
     * create a link that opens the current Component at root level
     * (full window.)
     */
    var parts = [],
        value;

    for (var key in props) {
      value = props[key];

      // Objects can be embedded in a query string as well
      if (typeof value == 'object') {
        try {
          value = JSON.stringify(value);
        } catch (e) {
          // Props that can't be stringified should be ignored
          continue;
        }
      }

      parts.push(key + '=' + encodeURIComponent(value));
    }

    return '?' + parts.join('&');
  }
};
