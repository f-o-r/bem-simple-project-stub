modules.define('w-checkout__shop', ['Backbone', 'yate'], function (provide, Backbone, yate) {
    provide(Backbone.View.extend({

        events: {
            'click .w-checkout__shop-delete': function (e) {
                this.model.destroy();
                e.preventDefault();
            },

            'click .w-checkout__shop-offer-delete': function (e) {
                this.model.removeOffer($(e.currentTarget).data('offer-id'));
                e.preventDefault();
            },

            'click .w-checkout__shop-pay': function (e) {
                this.model.checkout();
                e.preventDefault();
            }
        },

        initialize: function (options) {
            var view = this;

            this.$container = $(options.container);

            this.model.on('destroy', function () {
                view.destroy();
            });

            this.model.on('change:offers', function (model, offer) {
                view.render();
            });

            this.model.on('remove:offers', function (model, offer) {
                if (model.get('offers').length) {
                    this.actualize();
                    return;
                }

                model.destroy();
            });

            this.render();
            this.$container.append(this.$el);

        },

        destroy: function () {
            this.remove();
        },

        render: function () {
            var shopData = this.model.toJSON();
            shopData.totalPrice = this.model.totalPrice();

            //console.log(shopData);

            this.$el.html(this.template(shopData));
        },

        template: function (data) {
            return yate.render('page', data, 'w-checkout__shop', null, null);
        }
    }));
});