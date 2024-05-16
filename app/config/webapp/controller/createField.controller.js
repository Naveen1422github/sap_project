sap.ui.define([
	"sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    'sap/ui/core/Fragment',
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/FilterType",
    "sap/m/MessageBox",
], function(
	Controller, JSONModel, Fragment, Filter, FilterOperator, FilterType, MessageBox
) {
	"use strict";
    var lastFieldID;

    var validateNewField;
    var usedField;

	return Controller.extend("app.config.controller.createField", {
		onInit : function () {

		},


        usedNameAndDesc: function () {
            var that = this;
 
            var loadDataPromise = new Promise(function (resolve, reject) {
                var usedFieldDataModel = new sap.ui.model.json.JSONModel();
                that.getView().setModel(usedFieldDataModel, "usedFieldDataModel");
                let oModel = that.getOwnerComponent().getModel();
                let oBindList = oModel.bindList("/fieldTable");
                oBindList.requestContexts(0, Infinity).then(function (aContexts) {
                    usedField = [];
                    aContexts.forEach(function (oContext) {
                        usedField.push(oContext.getObject());
                    });
                    usedFieldDataModel.setData(usedField);
                    var usedParameterModelData = that.getView().getModel("usedFieldDataModel").getData();
                    validateNewField = usedParameterModelData.map(function (obj) {
                        return {
                            id: obj.id,
                            fieldName: obj.fieldName,
                            fieldDesc: obj.fieldDesc
                        };
                    });
                    console.log("Validate New Parameter", validateNewField);
                    resolve(usedField);
                });
            });
        },

		onCreateField: function () {
            this.usedNameAndDesc();
            var oView = this.getView();
            const addFieldData = {
                fieldName: "",
                fieldDesc: ""
            };
            const addFieldModel = new JSONModel(addFieldData);
            oView.setModel(addFieldModel, "addFieldModel");
 
            if (!this._oDialogItem) {
                this._oDialogItem = sap.ui.xmlfragment("app.config.fragments.addField", this);
                oView.addDependent(this._oDialogItem);
            }
            this._oDialogItem.open();
        },

		oncancelNewField : function () {
			this._oDialogItem.close();
		},

        // for refreshing data
        RefreshData: function () {
            this.getView().byId("fieldTable").getBinding("items").refresh();
        },


        onsaveNewField: async function () {
            var addFieldData = this.getView().getModel("addFieldModel").getData();
            await this.onLastFieldID();
 
            var fieldEntry = {
                id: parseInt(lastFieldID, 10),
                fieldName: addFieldData.fieldName,
                fieldDesc: addFieldData.fieldDesc,
            };
 
            if (fieldEntry.fieldName === '' || fieldEntry.fieldDesc === '') {
                sap.m.MessageToast.show("Input fields cannot be blank.", {
                    duration: 3000,
                    width: "15em",
                    my: "center top",
                    at: "center top",
                    of: window,
                    offset: "30 30",
                    onClose: function () {
                        console.log("Message toast closed");
                    }
                });
                console.log("Field or description cannot be null");
                return;
            } else {
                var isDuplicateField = validateNewField.some(function (entry) {
                    return entry.fieldName === fieldEntry.fieldName || entry.fieldDesc === fieldEntry.fieldDesc;
                });
 
                if (isDuplicateField) {
                    sap.m.MessageToast.show("Field or Description already exists.", {
                        duration: 3000,
                        width: "15em",
                        my: "center top",
                        at: "center top",
                        of: window,
                        offset: "30 30",
                        onClose: function () {
                            console.log("Message toast closed");
                        }
                    });
                    console.log("Duplicate found");
                    return;
                } else {
                    validateNewField.push(fieldEntry);
                    console.log("Entry added successfully");
                }
            }
 
            console.log(fieldEntry);
 
            let oModel = this.getView().getModel();
            let oBindListField = oModel.bindList("/fieldTable");
            oBindListField.create(fieldEntry);
            this._oDialogItem.close();
            this.RefreshData();
        },


        // onsaveNewField: async function () {
        //     var addFieldData = this.getView().getModel("addFieldModel").getData();
        //     await this.onLastFieldID();
 
        //     var fieldEntry = {
        //         id: parseInt(lastFieldID, 10),
        //         fieldName: addFieldData.fieldName,
        //         fieldDesc: addFieldData.fieldDesc
        //     };

        //     console.log("data", fieldEntry)
            
        //     let oModel = this.getView().getModel();
        //     let oBindListField = oModel.bindList("/fieldTable");
        //     oBindListField.create(fieldEntry);
        //     this._oDialogItem.close();
        //     this.RefreshData();
        // },



         // for auto handling ID
        onLastFieldID: function () {
            try {
                var oTable = this.getView().byId("fieldTable");
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
                        lastFieldID = i;
                        break;
                    }
                }
            } catch (error) {
                lastFieldID = "1";
            }
 
            console.log("Next Available ID:", lastFieldID);
        },
	});
});