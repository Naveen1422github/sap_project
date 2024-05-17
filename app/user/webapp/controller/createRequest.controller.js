sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterType",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/m/ColumnListItem",
    "sap/m/Input",
    "sap/ui/dom/jquery/getSelectedText"
], function (
    Controller,
    JSONModel,
    Filter,
    FilterType,
    FilterOperator,
    MessageBox,
    MessageToast,
    ColumnListItem,
    Input,
    getSelectedText
) {
    "use strict";
    var entryCount;
 
    return Controller.extend("app.user.controller.createRequest", {
        onInit: function () {
            var that = this;
 
            // Initialize model
            var formTypesModel = new JSONModel({ items: [] });
            this.getView().setModel(formTypesModel, "formTypes");
 
            // Load
            let oModel = this.getOwnerComponent().getModel();
            let oBindList = oModel.bindList("/formMaster");
            oBindList.requestContexts(0, Infinity).then(function (aContexts) {
                var forms = aContexts.map(function (oContext) {
                    return oContext.getObject();
                });
                var formTypes = forms.map(function (obj) {
                    return { key: obj.formName, text: obj.formName };
                });
                formTypesModel.setProperty("/items", formTypes);
            });
 
            var formFieldModel = new JSONModel({ items: [] });
            this.getView().setModel(formFieldModel, "formFields");
 
            let oFFBindList = oModel.bindList("/formFieldTable");
            oFFBindList.requestContexts(0, Infinity).then(function (aContexts) {
                var formFields = aContexts.map(function (oContext) {
                    return oContext.getObject();
                });
                formFieldModel.setData({ items: formFields });
            });
 
            let entryBindList = oModel.bindList("/raisedRequest");
            entryBindList.requestContexts(0, Infinity).then(function (aContexts) {
                var formEntries = aContexts.map(function (oContext) {
                    return oContext.getObject();
                });
                entryCount = formEntries.length;
                console.log("Number", entryCount);
 
            });
        },
 
        onSelectFormType: function (oEvent) {
            var selectedKey = oEvent.getParameter("selectedItem").getKey();
            this.filterFormFields(selectedKey);
        },
 
        filterFormFields: function (selectedKey) {
            var formFieldModel = this.getView().getModel("formFields");
            var allFields = formFieldModel.getProperty("/items");
            var filteredFields = allFields.filter(function (field) {
                return field.formType === selectedKey && field.checkedField === true;
            });
            console.log("dsa", filteredFields)
 
            var inputModel = new JSONModel(filteredFields);
            this.getView().setModel(inputModel, "inputModel");
        },
 
 
        // Submit
 
        onSubmitForm: function () {
            var newEntryData = this.getView().getModel("inputModel").getData();
            console.log("yo", newEntryData)
 
            var newEntry = {
                id: entryCount,
                formType: this.getView().byId("selectedFormType").getSelectedKey(),
                action: false,
                status: false
            };
 
            // Map inputModel items to newEntry properties
            newEntryData.forEach(function (field) {
                switch (field.paraName) {
                    case "Name":
                        newEntry.userName = field.value;
                        break;
                    case "Email":
                        newEntry.email = field.value;
                        break;
                    case "Phone":
                        newEntry.phoneNo = field.value;
                        break;
                    case "Department":
                        newEntry.department = field.value;
                        break;
                    case "Reason":
                        newEntry.reason = field.value;
                        break;
                    case "requestedAt":
                        newEntry.requestedAt = field.value;
                        break;
                    case "fromDate":
                        newEntry.fromDate = field.value;
                        break;
                    case "toDate":
                        newEntry.toDate = field.value;
                        break;
                    case "assetType":
                        newEntry.assetType = field.value;
                        break;
                    default:
                        // Handle other paraName cases if necessary
                        break;
                }
            });
 
            console.log("Entry", newEntry)
        }
    });
});
 