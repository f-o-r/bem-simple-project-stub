modules.define(
    'w-checkout',
    ['i-bem__dom', 'app', 'yate', 'underscore', 'Shops', 'Shop', 'checkout-shop'],
    function (provide, BEMDOM, app, yate, _, Shops, Shop, checkoutShop) {
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
                                offers: value,
                                delivery: {
                                    selected: 'POST',
                                    list: [
                                        {'title': 'Курьер', 'price': 500, 'code': 'DELIVERY'},
                                        {'title': 'Самовывоз', 'price': 0, 'code': 'PICKUP'},
                                        {'title': 'Почта', 'price': 300, 'code': 'POST'}
                                    ]
                                },
                                payment: {
                                    selected: 'CASH',
                                    list: [
                                        {'title': 'Оплата на Маркете', code: 'YANDEX'},
                                        {'title': 'Наличными', code: 'CASH'}
                                    ]
                                }
                            });

                            shops.add(shop);

                            new checkoutShop({
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
        }));
});