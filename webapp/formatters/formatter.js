sap.ui.define([], function () {
	"use strict";
	return {
		statusText: function (sStatus) {
			var resourceBundle = this.getView().getModel("i18n").getResourceBundle();
			switch (sStatus) {
			case "S":
				return resourceBundle.getText("ORDER_SUCCESSFUL");
			case "F":
				return resourceBundle.getText("ORDER_FAIL");
			case "N":
				return resourceBundle.getText("ORDER_INPROCESS");
			default:
				return sStatus;
			}
		},

		statusState: function (sStatus) {
			switch (sStatus) {
			case "S":
				return "Success";
			case "F":
				return "Error";
			case "N":
				return "Warning";
			default:
				return sStatus;
			}
		}
	};
});