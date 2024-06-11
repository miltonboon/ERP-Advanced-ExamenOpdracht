sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (Controller, Filter, FilterOperator) {
    "use strict";

    return Controller.extend("movementsapp.controller.Movements", {
        onInit: function () {
        },

        onSelectionChange: function (oEvent) {
            var oSelectedItem = oEvent.getParameter("listItem") || oEvent.getSource();
            var oBindingContext = oSelectedItem.getBindingContext();
            this._showDetail(oBindingContext);
        },

        _showDetail: function (oBindingContext) {
            var oDetailPage = this.byId("detailPage");
            oDetailPage.bindElement(oBindingContext.getPath());
            this.byId("SplitApp").toDetail(oDetailPage);
        }
    });
});
