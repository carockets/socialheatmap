var Maps = function () {

	return {
		init: function () {
				map = new GMaps({
		            div: '#map',
		            lat: 48.137222,
		            lng: 11.575278,
		            enableNewStyle: true,
		            zoom: 10
	        	});
        }
    }
}();