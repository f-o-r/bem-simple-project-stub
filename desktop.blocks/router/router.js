modules.define('router', ['Backbone'], function (provide, Backbone) {
    var AppRouter = Backbone.Router.extend({
        routes: {
            "work/:id": "getWork",
            "*actions": "defaultRoute"
        }
    });

    var appRouter = new AppRouter;

    appRouter.on('route:defaultRoute', function (actions) {
        console.log('defaultRoute', actions);
    });

    appRouter.on('route:getWork', function (actions) {
        console.log('getServiceList', actions);
    });

    Backbone.history.start();

    provide(appRouter);
});