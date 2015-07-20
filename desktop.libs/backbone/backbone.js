modules.define('Backbone', ['underscore'], function (provide, _) {
    var ctx = {
        '_': _,
        '$': jQuery
    };

    (function (self) {
        self.self = self;
        include('../../libs/backbone/backbone.js');
    })(ctx);

    (function () {
        include('../../libs/backbone-nested-model/backbone-nested.js');
    }).call(ctx);

    provide(ctx.Backbone);
});