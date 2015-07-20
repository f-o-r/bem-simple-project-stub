modules.define('Shop', ['Backbone', 'underscore'], function(provide, Backbone, _) {
    provide(Backbone.NestedModel.extend({
        urlRoot: '/api/shop',

        removeOffer: function (id) {
            var model = this;

            _.each(this.get('offers'), function (offer, index) {
                if (offer.offerId == id) {
                    model.remove('offers['+index+']');
                    return;
                }
            });
        },

        totalPrice: function () {
            var total = 0;

            _.each(this.get('offers'), function (offer) {
                total += offer.price * offer.count;
            });

            return total;
        },

        actualize: function () {
            this.urlRoot = '/api/shop/actualize';
            this.save();
        },

        checkout: function () {
            this.urlRoot = '/api/shop/checkout';
            this.save();
        }
    }));
});