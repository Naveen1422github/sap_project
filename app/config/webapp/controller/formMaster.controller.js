sap.ui.define([
	"sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    'sap/ui/core/Fragment',
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/FilterType",
    "sap/m/MessageBox",

], function(
	Controller, JSONModel, Fragment, Filter, FilterOperator, FilterType, Messsagebox
) {
	"use strict";
	var lastFormID;

	return Controller.extend("app.config.controller.formMaster", {
		onInit : function () {

		},

		// onCreateForm : function () {

		// 	let oView = this.getView();
		// 	const addFormData = {
		// 		formName: "",
		// 		formDesc: ""
		// 	};

		// 	const addFormModel = new JSONModel(addFormData);
		// 	oView.setModel(addFormModel, "addFormModel");

		// 	if (!this._oDialogForm) {
		// 		this._oDialogForm = sap.ui.xmlfragment("app.config.fragments.addForm", this);
		// 		oView.addDependent(this_oDialogForm);
		// 	}
		// 	this_._oDialogForm.open();

		// },

		onCreateForm: function () {
            var oView = this.getView();
            const addFormData = {
                formName: "",
                formDesc: ""
            };
            const addFormModel = new JSONModel(addFormData);
            oView.setModel(addFormModel, "addFormModel");
 
            if (!this._oDialogForm) {
                this._oDialogForm = sap.ui.xmlfragment("app.config.fragments.addForm", this);
                oView.addDependent(this._oDialogForm);
            }
            this._oDialogForm.open();
        },

		oncancelNewForm : function () {
			this._oDialogForm.close();
		},

        onsaveNewForm: async function () {
            var addFormData = this.getView().getModel("addFormModel").getData();
            await this.onLastFormID();
 
            var formEntry = {
                id: parseInt(lastFormID, 10),
                formName: addFormData.formName,
                formDesc: addFormData.formDesc
            };

            console.log("data", formEntry)
            
            let oModel = this.getView().getModel();
            let oBindListForm = oModel.bindList("/formMaster");
            oBindListForm.create(formEntry);
            this._oDialogForm.close();
            this.RefreshData();
        },

      // for refreshing data
        RefreshData: function () {
            this.getView().byId("formTable").getBinding("items").refresh();
        },

         // for auto handling ID
        onLastFormID: function () {
            try {
                var oTable = this.getView().byId("formTable");
                var oItems = oTable.getItems();
 
                var usedIDs = new Set();
 
                oItems.forEach(function (oItem) {
                    var currentID = parseInt(oItem.getCells()[0].getText(), 10);
                    if (!isNaN(currentID)) {
                        usedIDs.add(currentID);
                    }
                });
 
                // Find the smallest available ID
                for (let i = 1; i <= oItems.length + 1; i++) {
                    if (!usedIDs.has(i)) {
                        lastFormID = i;
                        break;
                    }
                }
            } catch (error) {
                lastFormID = "1";
            }
 
            console.log("Next Available ID:", lastFormID);
        },

        onselectForm: function (oEvent) {
                const config = this.getOwnerComponent().getRouter();
                var data = oEvent.getSource().getBindingContext().getObject();
                config.navTo("RouteformField", {
                    id: data.id,
                    formName: data.formName,
                    formDesc: data.formDesc
                });
        },
	});
});