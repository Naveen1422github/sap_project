sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("app.config.controller.home", {
            onInit: function () {

            },
            onCreateField : function () {

                const createField = this.getOwnerComponent().getRouter();
                createField.navTo("RoutecreateField");

            },

            onCreateForm : function () {

                const  formMaster = this.getOwnerComponent().getRouter();
                formMaster.navTo("RouteformMaster"); 

            }
        });
    });
