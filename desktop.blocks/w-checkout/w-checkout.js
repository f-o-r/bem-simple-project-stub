modules.define(
    'w-checkout',
    ['i-bem__dom', 'app', 'yate', 'underscore', 'Shops', 'Shop', 'User', 'checkout-shop', 'checkout-user'],
    function (provide, BEMDOM, app, yate, _, Shops, Shop, User, checkoutShop, checkoutUser) {
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
                        block.user = block.findElem('user');
                        block.shops = block.findElem('shops');
                        block.agreement = block.findElem('agreement');

                        // Контроллер и модель пользователя
                        new checkoutUser({
                            model: new User({'name': 'Name', 'email': 'test@test.ru', 'phone': '+7-111-222-3344'}),
                            container: block.user
                        });

                        // Контроллер и модель соглашений
//                        new checkoutAgreement({
//                            model: new Agreement({'name': 'Name', 'email': 'test@test.ru', 'phone': '+7-111-222-3344'}),
//                            container: block.agreement
//                        });

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