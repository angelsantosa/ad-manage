define([
        'gettext', 'underscore', 'backbone'
    ], function (gettext, _, Backbone) {

        var MultiFieldModel = Backbone.Model.extend({


          getValuesComa: function(){

            var valuesData_ = this.toJSON();
            var corpse;
            var c = 1;

            for(var x in valuesData_) {
                if(valuesData_.hasOwnProperty(x)) {
                  if (c == 1){
                    corpse= valuesData_[x];
                    c += 1;
                  }else{
                    corpse = corpse + "," + valuesData_[x];
                  }

                }
            }

            console.log(corpse);
            return corpse;
          },

        });
        return MultiFieldModel;
});
