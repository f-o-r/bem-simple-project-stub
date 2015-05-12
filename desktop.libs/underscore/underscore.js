modules.define('underscore', function (provide) {
    var ctx = {};

    (function () {
        include('../../libs/underscore/underscore.js');
    }).call(ctx);

    provide(ctx._);
});