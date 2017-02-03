(function (define) {
    define([
        'jquery',
        'gettext',
        'account/router'
    ], function($, gettext, Router){
        console.log(gettext('Manage your courses'));

        Router.initialize();
    });
}).call(this, define || RequireJS.define);
