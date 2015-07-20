modules.define('Shops', ['Backbone', 'Shop'], function(provide, Backbone, Shop) {
    var Shops = Backbone.Collection.extend({
        model: Shop
    });

    provide(Shops);
});