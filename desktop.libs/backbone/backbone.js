modules.define('backbone', ['underscore'], function (provide, _) {
    var ctx = {
        '_': _,
        '$': jQuery
    };

    (function () {
        include('../../libs/backbone/backbone.js');
    }).call(ctx);

    provide(ctx.Backbone);
});