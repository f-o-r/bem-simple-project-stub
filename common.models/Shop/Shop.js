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

        setDelivery: function (code) {
            var deliveryList = _.clone(this.get('delivery'));

            _.each(deliveryList, function (delivery) {
                delivery.selected = -1;
            });

            this.set('delivery', deliveryList);
        },

        totalPrice: function () {
            var total = 0;

            _.each(this.get('offers'), function (offer) {
                total += offer.price * offer.count;
            });

            total += _.findWhere(this.get('delivery'), { selected: true }).price;

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