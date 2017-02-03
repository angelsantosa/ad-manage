define([
        'gettext', 'underscore', 'backbone',
        'search/models/result_m',

    ], function (gettext, _, Backbone, ResultModel) {

        return Backbone.Collection.extend({
        	model: ResultModel,

          search: function(filterModel, urlAPI){

            var filerJ = filterModel.toJSON();

            var urlToFix= urlAPI;


            for(var x in filerJ) {
                if(filerJ.hasOwnProperty(x)) {
                  urlToFix = urlToFix + "&" + x + "=" + filerJ[x];
                }
            }
            console.log(urlToFix);
            
            return urlToFix;

          },
          parse: function(response) {
            return response.results;
          }


        });
});
