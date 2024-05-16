sap.ui.define([
	"sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    'sap/ui/core/Fragment',
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/FilterType",
    "sap/m/MessageBox",
    "sap/ui/core/ID",

], function(
	Controller, JSONModel, Fragment, Filter, FilterOperator, FilterType, MessageBox, ID
) {
	"use strict";   
    var fieldModelData;
    var formFieldModelData;
    let allFields;
    let fields;

	return Controller.extend("app.config.controller.formField", {
        onInit: function () {
            this.getOwnerComponent().getRouter().getRoute("RouteformField").attachPatternMatched(this.handleRouteMatched, this);
        },

        handleRouteMatched: function (oEvent) {
                const form = {
                    id: oEvent.getParameter("arguments").id,
                    formName: oEvent.getParameter("arguments").formName,
                    formDesc: oEvent.getParameter("arguments").formDesc,
                }

                console.log("form", form)
                const formFieldModel = new JSONModel(form);
                this.getView().setModel(formFieldModel, "formFieldModel");
                var oFilter = new Filter("formType", FilterOperator.EQ, oEvent.getParameter("arguments").formName);
                this.getView().byId("formFieldTable").getBinding("items").filter(oFilter, FilterType.Application);
                this.onRefreshFormField();
        },
            
        fieldDataState: function () {
            var that = this;
            return new Promise(function (resolve, reject) {
                var fieldDataModel = new sap.ui.model.json.JSONModel();
                that.getView().setModel(fieldDataModel, "fieldDataModel");
                let oModel = that.getOwnerComponent().getModel();
                let oBindList = oModel.bindList("/fieldTable");
                oBindList.requestContexts(0,Infinity).then(function (aContexts){
                    fields=[];
                    aContexts.forEach(function (oContext) {
                        fields.push(oContext.getObject());
                    });
                    fieldDataModel.setData(fields);
                    that.getView().setModel(fieldDataModel, "fieldDataModel");
 
                    fieldModelData = that.getView().getModel("fieldDataModel").getData();
                    console.log("Fields", fieldModelData);
 
                    resolve();
                });
            });
        },


        onRefreshFormField: function () {
            var that = this;
 
            Promise.all([this.addExtraField(), this.fieldDataState()]).then(function () {
 
                var extraObjects = fieldModelData.filter(function (formObject) {
                    return !formFieldModelData.some(function (formFieldObject) {
                        return formFieldObject.formType === formObject.formType;
                    });
                });
 
                console.log("Extra Objects:", extraObjects);
 
                extraObjects.forEach(function (extraObject) {
                    console.log("Extra Object:", extraObject);
                    if (extraObject) {
 
                        var oEntrySet = {
                            id : parseInt(extraObject.id),
                            checkedField: false,
                            formType: that.getView().getModel("formFieldModel").getProperty("/formName"),
                            formDesc: that.getView().getModel("formFieldModel").getProperty("/formDesc"),
                            paraName: extraObject.fieldName,
                            paraDesc: extraObject.fieldDesc
                        };

                        console.log("dfs", oEntrySet)
 
                        var oModel = that.getView().getModel();
                        var oBindListNewEntitySet = oModel.bindList("/formFieldTable");
                        oBindListNewEntitySet.create(oEntrySet);
                    }
                });
 
                that.RefreshData();
            });
        },


        addExtraField: function () {
            var that = this;
            return new Promise(function (resolve, reject) {
                var formFieldDataModel = new JSONModel();
                that.getView().setModel(formFieldDataModel, "formFieldDataModel");
                let oModel = that.getOwnerComponent().getModel();
                let oBindList = oModel.bindList("/formFieldTable");
                oBindList.requestContexts(0,Infinity).then(function (aContexts){
                    allFields=[];
                    aContexts.forEach(function (oContext) {
                        allFields.push(oContext.getObject());
                    });
                    formFieldDataModel.setData(allFields);
                    that.getView().setModel(formFieldDataModel, "formFieldDataModel");
 
                    formFieldModelData = that.getView().getModel("formFieldDataModel").getData();
                    console.log("Form Fields", formFieldModelData);
 
                    resolve();
                });
            });
        },

        RefreshData: function() {
            this.getView().byId("formFieldTable").getBinding("items").refresh();
        }
	});
});