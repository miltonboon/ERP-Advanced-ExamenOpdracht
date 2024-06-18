sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageToast"
], function (Controller, JSONModel, Filter, FilterOperator, MessageToast) {
    "use strict";

    return Controller.extend("movementsapp.controller.Movements", {

        onInit: function () {
            this.uri = "/MovementSet";
            this._items = []; // items van create pop up 

            // object voor de create pop up
            var oItemsModel = new JSONModel({ items: [] });
            this.getView().setModel(oItemsModel, "itemsModel");
        },

        applyFilters: function () {
            var oSelect = this.byId("typeSelect");
            var sSelectedKey = oSelect.getSelectedKey();

            var aFilters = [];
            if (sSelectedKey && sSelectedKey !== "all") {
                aFilters.push(new Filter("Type", FilterOperator.EQ, sSelectedKey));
            }

            var oList = this.byId("entryList");
            var oBinding = oList.getBinding("items");
            oBinding.filter(aFilters);

            console.log("Applied filter: ", sSelectedKey);
        },

        onSelectionChange: function (oEvent) {
            var oList = oEvent.getSource();
            var oSelectedItem = oList.getSelectedItem();

            if (oSelectedItem) {
                var oBindingContext = oSelectedItem.getBindingContext();
                var sMovId = oBindingContext.getProperty("Id");
                this._showDetail(oBindingContext, sMovId);
            } else {
                this._clearDetail();
            }
        },

        _showDetail: function (oBindingContext, sMovId) {
            var oDetailPage = this.byId("detailPage");
            var oDetailContent = this.byId("detailContent");
            var oNoDataText = this.byId("noDataText");

            oDetailContent.setVisible(true);
            oNoDataText.setVisible(false);

            oDetailPage.bindElement(oBindingContext.getPath());
            this.byId("SplitApp").toDetail(oDetailPage);

            // Apply filter to the items list based on selected MovId
            var oItemsList = this.byId("itemsListDetail");
            var aFilters = [new Filter("MovId", FilterOperator.EQ, sMovId)];
            var oBinding = oItemsList.getBinding("items");
            oBinding.filter(aFilters);
        },

        _clearDetail: function () {
            var oDetailPage = this.byId("detailPage");
            var oDetailContent = this.byId("detailContent");
            var oNoDataText = this.byId("noDataText");

            oDetailContent.setVisible(false);
            oNoDataText.setVisible(true);

            oDetailPage.unbindElement();
            this.byId("SplitApp").toDetail(oDetailPage);

            // Clear the items list filter
            var oItemsList = this.byId("itemsListDetail");
            var oBinding = oItemsList.getBinding("items");
            oBinding.filter([]);
        },

        onOpenCreateDialog: function () {
            this._items = []; // maakt de items array leeg om opnieuwe in te vullen
            this.getView().getModel("itemsModel").setProperty("/items", this._items); // maakt het model van de items ook leeg

            if (!this._createDialog) {
                this._createDialog = this.byId("createMovementDialog");
            }
            this._createDialog.open();
        },

        onCloseCreateDialog: function () {
            if (this._createDialog) {
                this._createDialog.close();
            }
        },

        onSaveNewMovement: function () {
            var location = this.byId("locationSelect").getSelectedKey();
            var type = this.byId("typeSelectDialog").getSelectedKey();
            var date = this.byId("datePicker").getDateValue();
            var partner = this.byId("partnerInput").getValue();

            var newMovement = { location, type, date, partner, items: this._items };

            console.log("New Movement: ", newMovement);
            this.onCloseCreateDialog();
        },

        onOpenAddItemDialog: function () {
            if (!this._addItemDialog) {
                this._addItemDialog = this.byId("addItemDialog");
            }
            this._addItemDialog.open();
        },

        onCloseAddItemDialog: function () {
            if (this._addItemDialog) {
                this._addItemDialog.close();
            }
        },

        onAddItem: function () {
            var materialNumber = this.byId("materialNumberInput").getValue();
            var quantity = this.byId("quantityInput").getValue();
            var unit = this.byId("unitInput").getValue();

            var newItem = { materialNumber, quantity, unit };
            this._items.push(newItem);

            var oItemsModel = this.getView().getModel("itemsModel");
            oItemsModel.setProperty("/items", this._items);

            this.onCloseAddItemDialog();
        },

        onDeleteEntry: function () {
            if (!this._deleteEntryId) {
                this._deleteEntryId = null;
            }
            var oDetailPage = this.byId("detailPage");
            this._deleteEntryId = oDetailPage.getBindingContext().getProperty("Id");

            if (!this._confirmDeleteDialog) {
                this._confirmDeleteDialog = this.byId("confirmDeleteDialog");
            }
            this._confirmDeleteDialog.open();
        },

        onCloseConfirmDeleteDialog: function () {
            if (this._confirmDeleteDialog) {
                this._confirmDeleteDialog.close();
            }
        },

        onConfirmDelete: function () {
            var sPath = "/MovementSet('" + this._deleteEntryId + "')";
            var oModel = this.getView().getModel();

            oModel.remove(sPath, {
                success: function () {
                    MessageToast.show("Movement deleted successfully");
                    this.onCloseConfirmDeleteDialog();
                }.bind(this),
                error: function () {
                    MessageToast.show("Error deleting movement");
                }
            });

            console.log("Delete Movement ID: ", this._deleteEntryId);
        }
    });
});
