define([
        'gettext', 'underscore', 'backbone',
        'search/models/user_m',

    ], function (gettext, _, Backbone, UserModel) {

        return Backbone.Collection.extend({
        	model: UserModel,

        	parse : function(response) {
                return response;
            }
        });
});
