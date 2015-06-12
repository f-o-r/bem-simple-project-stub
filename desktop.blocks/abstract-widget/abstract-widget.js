modules.define('abstract-widget', ['i-bem__dom', 'app', 'yate'], function (provide, BEMDOM, app, yate) {
    provide(BEMDOM.decl(this.name,
        {
            onSetMod: {
                'js': {
                    'inited': function () {
                        var rand = Math.round(Math.random() * 100);
                        var block = this;

                        this.titleData = 'Заголовок '+rand;
                        this.listData = {'title': 'List '+rand, 'elements': [1+rand, 2+rand, 3+rand, 4+rand, 5+rand]};
                        this.listItemData = 'alone listItem';
                        this.widgetData = {'title': this.titleData, 'list': this.listData};
                        this.collection = app.getData('abstractCollection');

                        this.listeners();

                        setTimeout(function () {
                            block.drawContent();
                        }, 2000);
                    }
                }
            },

            listeners: function () {
                this.collection.on('change', this.render);
            },

            drawContent: function () {
                var block = this;

                this.setMod('content', 'hide');
                BEMDOM.update(this.domElem, this.renderContent());
                setTimeout(function () {
                    block.delMod('content');
                }, 100);
            },

            render: function () {
                return yate.render('index', this.widgetData, 'abstract-widget');
            },

            renderContent: function () {
                return yate.render('index', this.widgetData, 'abstract-widget__inner');
            },

            renderTitle: function () {
                return yate.render('index', this.titleData, 'abstract-widget__title');
            },

            renderList: function () {
                return yate.render('index', this.listData, 'list');
            },

            renderListItem: function () {
                return yate.render('index', this.listItemData, 'list__item');
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