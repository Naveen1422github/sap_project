sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/ui/core/routing/History"
    ],
    function(BaseController, History) {
      "use strict";
  
      return BaseController.extend("app.config.controller.App", {
        onInit: function() {
        },

        onPressBack : function () {
          window.history.back()
          
          // another way to do same 
          //        // Refresh the model if it exists
          //         var oModel = this.getView().getModel();
          //         if (oModel) {
          //             oModel.refresh();
          //         } else {
          //             console.error("Model not found.");
          //         }

          //         // Navigate back in history or to the home route
              
          //         const oHistory = History.getInstance();
          //         const sPreviousHash = oHistory.getPreviousHash();
 
          //         if (sPreviousHash !== undefined) {
          //             window.history.go(-1);
          //         } else {
          //             const oRouter = this.getOwnerComponent().getRouter();
          //             oRouter.navTo("Routehome", {}, true);
          //         }
        },

        
        onLogoPressed : function () {

        }
      });
    }
  );
  