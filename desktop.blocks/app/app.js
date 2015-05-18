modules.define('app', ['i-bem', 'Backbone', 'router'], function (provide, BEM, Backbone, router) {
    provide({
        init: function () {
            this._log({
                'router': router
            });

            BEM.channel('bus').trigger('app:init');
        },

        setData: function (key, value) {
            return this._data[key] = value;
        },

        getData: function (key) {
            return this._data[key] || null;
        },

        _data: {},

        _VERBOSE: true,

        _log: function (components) {

            if (this._VERBOSE) {
                return false;
            }

            console.log('App start...');
            console.log('App/router', components.router);

            return true;
        }
    });
});