define([
    'jquery',
    'underscore',
    'backbone',
    'backbone.modal',
    // Using the Require.js text! plugin, we are loaded raw text
    // which will be used as our views primary template
    // 'text!../templates/index/_login_modal.html'
], function($, _, Backbone) {


    var LoginModal = Backbone.Modal.extend({
        template: _.template($("#modal-template").html()),
        cancelEl: '.bbm-button',
        beforeCancel: function() {
            console.log('cancel');
            window.location.replace('/#');
        },
        beforeSubmit: function() {
            console.log('submit');
            $('.alert-error').hide(); // Hide any errors on a new submit
            var url = '../rest-auth/login/';
            console.log('Loggin in... ');

            $.ajax({
                url: url,
                type: 'POST',
                dataType: "json",
                data: $('form.form-login').serialize(),
                success: function(data) {
                    console.log(["Login request details: ", data]);
                    window.location.replace('/#');
                    window.location.reload();
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.log(jqXHR.responseJSON);
                    var loginMessageCollection = new LoginMessageCollection();
                    if (jqXHR.responseJSON.email) {
                        jqXHR.responseJSON.email.forEach(function iterator(item) {
                            loginMessageCollection.add(new LoginMessage({
                                message: item
                            }));
                        });
                    }
                    $('.alert-error').text(jqXHR.responseText).show();
                }
            });

            return false;
        }
    });
    return LoginModal;
});
