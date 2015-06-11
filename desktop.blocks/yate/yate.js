modules.define('yate', function (provide) {
    include('../../node_modules/yate/lib/runtime.js');
    yr.render = yr.run;
    provide(yr);
});