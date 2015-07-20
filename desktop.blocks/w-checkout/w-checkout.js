modules.define(
    'w-checkout',
    ['i-bem__dom', 'app', 'yate', 'underscore', 'Shops', 'Shop', 'w-checkout__shop'],
    function (provide, BEMDOM, app, yate, _, Shops, Shop, wCheckoutShop) {
    provide(BEMDOM.decl(this.name,
        {
            onSetMod: {
                'js': {
                    'inited': function () {
                        var block = this;
                        var shops = new Shops();
                        var shop;

                        var cart = [
                            {'offerId': 'id1', 'title': 'Товар #1', 'price': 900.99, 'count': 1, 'shopId': 'shopId1'},
                            {'offerId': 'id2', 'title': 'Товар #2', 'price': 450, 'count': 1, 'shopId': 'shopId1'},
                            {'offerId': 'id3', 'title': 'Товар #3', 'price': 100, 'count': 3, 'shopId': 'shopId2'}
                        ];

                        var carts = _.groupBy(cart, 'shopId');

                        block.draw();
                        block.shops = block.findElem('shops');

                        _.each(carts, function (value, key) {
                            shop = new Shop({
                                shopId: key,
                                offers: value
                            });

                            console.log(shop.url());
                            shops.add(shop);

                            new wCheckoutShop({
                                model: shop,
                                container: block.shops
                            });
                        });


                    }
                }
            },

            render: function () {
                return yate.render('page', {}, 'w-checkout', null, null);
            },

            draw: function () {
                BEMDOM.update(this.domElem, this.render());
            }
        },
        {
            live : function() {
                this.liveBindTo('button', 'click', function(e) {
                    var result;

                    switch ($(e.target).data('type')) {
                        case 'abstract-widget':
                            result = this.render();
                        break;
                        case 'abstract-widget__inner':
                            result = this.renderContent();
                        break;
                        case 'abstract-widget__title':
                            result = this.renderTitle();
                        break;
                        case 'list':
                            result = this.renderList();
                        break;
                        case 'list__item':
                            result = this.renderListItem();
                        break;
                    }

                    this.findElem('code').text(result);
                });

                return false; // если инициализация блока не может быть отложена
            }
        }));
});