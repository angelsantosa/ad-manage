;(function (define) {
    'use strict';
    define(['jquery', 'jquery.smartWizard'], function($) {

        var FormWizard = {

            wizardContent: '',
            numberOfSteps: -1,

            initialize: function (wizard) {
                _.bindAll(this, 'leaveAStepCallback', 'onShowStep', 'onFinishWizard', 'validateSteps');

                // Inicializar las variables
                this.wizardContent = $('#wizard', this.wizard);
                this.numberOfSteps = $('.swMain > ul > li', this.wizard).length;

                // TODO: Cookie que paso es el que se encontraba antes de terminar el procesamiento
                // TODO: Al terminar de procesar reiniciar en el paso cero

                // function to initiate Wizard Form
                this.wizardContent.smartWizard({
                    selected: 0,
                    keyNavigation: false,
                    onLeaveStep: this.leaveAStepCallback,
                    onShowStep: this.onShowStep,
                    enableAllSteps: true,
                });
            },

            leaveAStepCallback: function (obj, context) {
                return this.validateSteps(context.fromStep, context.toStep);
                // return false to stay on step and true to continue navigation
            },

            onShowStep: function (obj, context) {
                var wizardContent = $(this.wizardContent);
                var numberOfSteps = this.numberOfSteps

                if(context.toStep == numberOfSteps){
                    $('.anchor').children("li:nth-child(" + context.toStep + ")").children("a").removeClass('wait');
                }
                $(".next-step").unbind("click").click(function (e) {
                    e.preventDefault();
                    wizardContent.smartWizard("goForward");
                });
                $(".back-step").unbind("click").click(function (e) {
                    e.preventDefault();
                    wizardContent.smartWizard("goBackward");
                });
                $(".finish-step").unbind("click").click(function (e) {
                    e.preventDefault();
                    this.onFinishWizard(obj, context);
                });
            },

            onFinishWizard: function (obj, context) {
                alert('form submit function');
                $('.anchor').children("li").last().children("a").removeClass('wait').removeClass('selected').addClass('done').children('.stepNumber').addClass('animated tada');
                //wizardForm.submit();
            },

            validateSteps: function (stepnumber, nextstep) {
                var isStepValid = false;
                
                if (this.numberOfSteps >= nextstep && nextstep > stepnumber) {
                    
                    // cache the form element selector
                    for (var i=stepnumber; i<=nextstep; i++){
                        $('.anchor').children("li:nth-child(" + i + ")").not("li:nth-child(" + nextstep + ")").children("a").removeClass('wait').addClass('wait').children('.stepNumber').addClass('animated tada');
                    }
                    isStepValid = true;
                    return true;
                } else if (nextstep < stepnumber) {
                    for (i=nextstep; i<=stepnumber; i++){
                        $('.anchor').children("li:nth-child(" + i + ")").children("a").addClass('wait').children('.stepNumber').removeClass('animated tada');
                    }
                    
                    return true;
                } 
            },
        };

        return FormWizard;
    });
}).call(this, define || RequireJS.define);
