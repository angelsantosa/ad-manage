define([
        'gettext', 'underscore', 'backbone'
    ], function (gettext, _, Backbone) {

        var ResultModel = Backbone.Model.extend({
        	idAttribute: 'id',
        });
        return ResultModel;
});
