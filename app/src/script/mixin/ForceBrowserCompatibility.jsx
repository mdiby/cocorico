var platform = require('platform');
var React = require('react');
var ReactBootstrap = require('react-bootstrap');

var ConfigStore = require('../store/ConfigStore.jsx');

var Hint = require('../component/Hint.jsx');

var RedirectLink = require('../component/RedirectLink');

var Button = ReactBootstrap.Button;

var ForceBrowserCompatibility = {

  getInitialState: function() {
    return {
      override: false
    };
  },

    // https://gist.github.com/alexey-bass/1115557
  _compareVersion: function(left, right) {
    if (typeof left + typeof right !== 'stringstring')
      return false;

    var a = left.split('.')
      , b = right.split('.')
      , i = 0, len = Math.max(a.length, b.length);

    for (; i < len; i++) {
      if ((a[i] && !b[i] && parseInt(a[i]) > 0) || (parseInt(a[i]) > parseInt(b[i]))) {
        return 1;
      } else if ((b[i] && !a[i] && parseInt(b[i]) > 0) || (parseInt(a[i]) < parseInt(b[i]))) {
        return -1;
      }
    }

    return 0;
  },

  renderUnsupportedWebBrowserDialog: function() {
    var supported = ConfigStore.getConfig().supportedWebBrowsers;
    var name = platform.name.toLowerCase();

    return (
      <ReactBootstrap.Grid>
        <Hint style="warning">
          <h3>Ohoo... votre navigateur n'est pas compatible :(</h3>
          <p>
            Malheureusement, votre navigateur Web ({platform.name} {platform.version})
            n'a pas été testé et <strong>nous ne pouvons donc pas garantir la
            fiabilité de votre vote</strong>.
          </p>
          {name in supported && supported[name].updateLink
            ? <p>
              Vous pouvez&nbsp;
              <RedirectLink href={supported[name].updateLink}>
                mettre à jour {platform.name}
              </RedirectLink>
              &nbsp;ou installer et utiliser l'un des
              navigateurs Web suivants :
            </p>
            : <p>
              Vous pouvez installer et utiliser l'un des
              navigateurs Web suivants :
            </p>}
          <ul>
            {Object.keys(supported).map((key) => {
              if (!supported[key].installLink || key === name) {
                return null;
              }

              return (
                <li key={key}>
                  <RedirectLink href={supported[key].installLink}>
                    {supported[key].name}
                  </RedirectLink>
                </li>
              );
            })}
          </ul>
          <p>ou bien choisir d'ignorer cet	avertissement.</p>
          <Button bsStyle="warning" onClick={(e)=>this.ignoreButtonClickHandler(e)}>
            Ignorer
          </Button>
        </Hint>
      </ReactBootstrap.Grid>
    );
  },

  ignoreButtonClickHandler: function(e) {
    this.render = this._renderMethodOverridenByBrowserCompat;
    this.setState({override: true});
  },

  componentWillMount: function() {
    var supported = ConfigStore.getConfig().supportedWebBrowsers;
    var name = platform.name.toLowerCase();

    if (!(name in supported)
        || this._compareVersion(platform.version, supported[name].version) < 0) {
      this._renderMethodOverridenByBrowserCompat = this.render;
      this.render = this.renderUnsupportedWebBrowserDialog;
    }
  },

};

module.exports = ForceBrowserCompatibility;
