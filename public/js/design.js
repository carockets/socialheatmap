var Design = function () {

	function registerTooltip() {
		$("[data-toggle='tooltip']").tooltip();
	}

	return {
		init: function () {
			registerTooltip();
		}
	}

} ();