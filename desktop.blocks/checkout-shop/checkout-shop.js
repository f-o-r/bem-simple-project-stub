modules.define(
    'checkout-shop',
    ['Backbone', 'yate', 'checkout-shop__delivery', 'checkout-shop__offers', 'checkout-shop__payment', 'checkout-shop__total'],
    function (provide, Backbone, yate, deliveryView, offersView, paymentView, totalView) {

        provide(Backbone.View.extend({

        events: {
            'click .checkout-shop-delete': function (e) {
                this.model.destroy();
                e.preventDefault();
            },

            'click .checkout-shop-offer-delete': function (e) {
                this.model.removeOffer($(e.currentTarget).data('offer-id'));
                e.preventDefault();
            },

            'click .checkout-shop-checkout': function (e) {
                this.model.checkout();
                e.preventDefault();
            }
        },

        initialize: function (options) {
            this.$container = $(options.container);

            this.render();
            this.subViewInit();
            this.setListeners();
        },

        subViewInit: function () {
            var $el = this.$el;
            var model = this.model;

            this.$container.append($el);
            this.$delivery = $el.find('.checkout-shop__delivery');
            this.$offers = $el.find('.checkout-shop__offers');
            this.$payment = $el.find('.checkout-shop__payment');
            this.$total = $el.find('.checkout-shop__total');

            new deliveryView({model: model, container: this.$delivery});
            new offersView({model: model, container: this.$offers});
            new paymentView({model: model, container: this.$payment});
            new totalView({model: model, container: this.$total});
        },

        setListeners: function () {
            var view = this;

            this.model.on('destroy', function () {
                view.destroy();
            });

            this.model.on('remove:offers', function (model, offer) {
                if (model.get('offers').length) {
                    this.actualize();
                    return;
                }

                model.destroy();
            });
        },

        destroy: function () {
            this.remove();
        },

        render: function () {
            this.$el.html(this.template(this.model.toJSON()));
        },

        template: function (data) {
            return yate.render('page', data, 'checkout-shop', null, null);
        }
    }));
});