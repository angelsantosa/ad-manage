define([
    'gettext', 'jquery', 'underscore', 'backbone', 'logger',
    'googlemaps','gmaps','jquery-geocomplete',
    'text!templates/search/search.underscore',
    'text!templates/search/visible_fields.underscore',
    'text!templates/search/hidden_fields.underscore',
    'jquery-ui','bootstrap','holder','iCheck','bootstrap-star-rating','bootstrap-daterangepicker','jquery-ui-slider-pips'
    ],

    function(gettext, $, _, Backbone, Logger, googleMaps, GMaps, geocomplete,
      searchTemplate,searchTemplateVisibleFields,searchTemplateHiddenFields ) {

        Backbone.View = (function(View) {
           return View.extend({
                constructor: function(options) {
                    this.options = options || {};
                    View.apply(this, arguments);
                }
            });
        })(Backbone.View);


        var SearchView = Backbone.View.extend({

        fieldTemplate: searchTemplate,

        	initialize: function(){

            this.template = _.template(this.fieldTemplate || '');

        		_.bindAll(this, 'render', 'afterRender','renderFields','chargeMap', 'toggleMoreLess');
            this.map;
            this.render = _.wrap(this.render, function(render) {
      				// this.beforeRender();
      				render();
      				this.afterRender();
    			   });

			      this.render();

        	},

        	render: function(){
            this.$el.html(this.template({
              sections: this.options.sectionsData,
        		}));
        		return this;
        	},

        	afterRender: function() {
                this.chargeMap();
                this.toggleMoreLess();
          },

          toggleMoreLess: function(){
            var togl= this.$('.more-filters');

            togl.click(function(){
                var $this = $(this);
                $this.toggleClass('more-filters');
                if($this.hasClass('more-filters')){
                    $this.text(gettext("More Filters"));
                } else {
                    $this.text(gettext("Less Filters"));
                }
            });
          },


          chargeMap: function(){
            var dis = this;

            dis.map = new GMaps({
              el: dis.options.mapElement,
              //cordenadas del df
              lat: dis.options.lat_init,
              lng: dis.options.lng_init
            });

          },

          renderFields: function () {

            var rview= this;

            this.$('.search-fields').append(_.template(searchTemplateVisibleFields));
            this.$('.search-fields-h').append(_.template(searchTemplateHiddenFields));

            _.each(rview.options.sectionsData, function(section, index){
              _.each(section.fields, function(field){
                if(_.isUndefined(field.imamap)){
                  rview.$(field.el).append(field.view.render().el);
                }else{
                    field.view.setMap(rview.map);
                    rview.$(field.el).append(field.view.render().el);


                }

              });
            });

            return this;

          }

        });

    return SearchView;

});
