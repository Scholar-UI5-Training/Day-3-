sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"com/demo/TrainingDemo/formatters/formatter",
	"sap/ui/Device",
	"sap/ui/model/Filter",
	"sap/ui/model/Sorter",
	"sap/m/Menu",
	"sap/m/MenuItem"
], function (Controller, formatter, Device, Filter, Sorter, Menu, MenuItem) {
	"use strict";

	return Controller.extend("com.demo.TrainingDemo.controller.View", {
		formatter: formatter,
		onInit: function () {
			this._mViewSettingsDialogs = {};
			this.mGroupFunctions = {
				ShipperName: function (oContext) {
					var name = oContext.getProperty("ShipperName");
					return {
						key: name,
						text: name
					};
				},
				Category: function (oContext) {
					var category = oContext.getProperty("Category");
					return {
						key: category,
						text: category
					};
				}
			};
		},

		addListItem: function () {
			var newItem = {
				"ProductName": "New Product",
				"ProductId": "NP-101",
				"Quantity": 1,
				"QuantityUnit": "pcs.",
				"ExtendedPrice": 5.71212,
				"ShipperName": "Fun Inc.",
				"ShippedDate": "2015-01-27T00:00:00",
				"Status": "N",
				"Currency": "EUR",
				"Category": "New"
			};
			var oModel = this.getOwnerComponent().getModel("invoice");
			oModel.setProperty("/Invoices", oModel.getProperty("/Invoices").concat(newItem));
		},

		removeListItem: function () {
			var oModel = this.getOwnerComponent().getModel("invoice");
			var aItems = oModel.getProperty("/Invoices");
			aItems.splice(aItems.length - 1, 1); // just 1 entry to remove
			oModel.setProperty("/Invoices", aItems);
		},

		createViewSettingsDialog: function (sDialogFragmentName) {
			var oDialog = this._mViewSettingsDialogs[sDialogFragmentName];
			if (!oDialog) {
				oDialog = sap.ui.xmlfragment(sDialogFragmentName, this);
				this._mViewSettingsDialogs[sDialogFragmentName] = oDialog;

				if (Device.system.desktop) {
					oDialog.addStyleClass("sapUiSizeCompact");
				}
			}
			return oDialog;
		},

		handleSortButtonPressed: function () {
			this.createViewSettingsDialog("com.demo.TrainingDemo.view.fragments.SortDialog").open();
		},

		handleFilterButtonPressed: function () {
			this.createViewSettingsDialog("com.demo.TrainingDemo.view.fragments.FilterDialog").open();
		},

		handleGroupButtonPressed: function () {
			this.createViewSettingsDialog("com.demo.TrainingDemo.view.fragments.GroupDialog").open();
		},

		handleSortDialogConfirm: function (oEvent) {
			var oTable = this.byId("idInvoiceTable"),
				mParams = oEvent.getParameters(),
				oBinding = oTable.getBinding("items"),
				sPath,
				bDescending,
				aSorters = [];

			sPath = mParams.sortItem.getKey();
			bDescending = mParams.sortDescending;
			aSorters.push(new Sorter(sPath, bDescending));

			// apply the selected sort and group settings
			oBinding.sort(aSorters);
		},

		handleFilterDialogConfirm: function (oEvent) {
			var oTable = this.byId("idInvoiceTable"),
				mParams = oEvent.getParameters(),
				oBinding = oTable.getBinding("items"),
				aFilters = [];

			mParams.filterItems.forEach(function (oItem) {
				var aSplit = oItem.getKey().split("___"),
					sPath = aSplit[0],
					sOperator = aSplit[1],
					sValue1 = aSplit[2],
					sValue2 = aSplit[3],
					oFilter = new Filter(sPath, sOperator, sValue1, sValue2);
				aFilters.push(oFilter);
			});

			// apply filter settings
			oBinding.filter(aFilters);

			// update filter bar
			this.byId("filterBar").setVisible(aFilters.length > 0);
			this.byId("filterLabel").setText(mParams.filterString);
		},

		handleGroupDialogConfirm: function (oEvent) {
			var oTable = this.byId("idInvoiceTable"),
				mParams = oEvent.getParameters(),
				oBinding = oTable.getBinding("items"),
				sPath,
				bDescending,
				vGroup,
				aGroups = [];

			if (mParams.groupItem) {
				sPath = mParams.groupItem.getKey();
				bDescending = mParams.groupDescending;
				vGroup = this.mGroupFunctions[sPath];
				aGroups.push(new Sorter(sPath, bDescending, vGroup));
			}
			// apply the selected group settings
			oBinding.sort(aGroups);
		},

		onToggleContextMenu: function (oEvent) {
			var oToggleButton = oEvent.getSource();
			if (oEvent.getParameter("pressed")) {
				oToggleButton.setTooltip("Disable Custom Context Menu");
				this.byId("idInvoiceTable").setContextMenu(new Menu({
					items: [
						new MenuItem({
							text: "Change Layout"
						}),
						new MenuItem({
							text: "Insert Column"
						})
					]
				}));
			} else {
				oToggleButton.setTooltip("Enable Custom Context Menu");
				this.byId("idInvoiceTable").destroyContextMenu();
			}
		},

		onExit: function () {
			var oDialogKey,
				oDialogValue;
			for (oDialogKey in this._mViewSettingsDialogs) {
				oDialogValue = this._mViewSettingsDialogs[oDialogKey];

				if (oDialogValue) {
					oDialogValue.destroy();
				}
			}
		}
	});
});