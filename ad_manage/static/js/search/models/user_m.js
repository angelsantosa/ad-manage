define([
        'gettext', 'underscore', 'backbone'
    ], function (gettext, _, Backbone) {

        var UserModel = Backbone.Model.extend({
        	idAttribute: 'id',
        });
        return UserModel;
});
