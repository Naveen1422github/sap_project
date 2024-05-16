sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("app.user.controller.home", {
            onInit: function () {
                
            },
            
            oncreateRequest: function () {
                const createRequest = this.getOwnerComponent().getRouter();
                createRequest.navTo("RoutecreateRequest"); 
            },


            ondisplayRequest: function () {

                const displayRequest = this.getOwnerComponent().getRouter();
                displayRequest.navTo("RoutedisplayRequest")

            }
        });
    });
