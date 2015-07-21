modules.define('Shop', ['Backbone', 'underscore'], function(provide, Backbone, _) {
    provide(Backbone.NestedModel.extend({
        urlRoot: '/api/shop',

        removeOffer: function (id) {
            var model = this;

            _.find(this.get('offers'), function (offer, index) {
                if (offer.offerId == id) {
                    model.remove('offers['+index+']');
                    return true;
                }
            });
        },

        setPayment: function (code) {
            this.set('payment.selected', code);
        },

        setDelivery: function (code) {
            this.set('delivery.selected', code);
        },

        totalPrice: function () {
            var total = 0;
            var delivery = this.get('delivery');

            _.each(this.get('offers'), function (offer) {
                total += offer.price * offer.count;
            });

            total += _.findWhere(delivery.list, { code: delivery.selected }).price;

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