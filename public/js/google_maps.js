var Maps = function () {

	function loadMap () {
		map = new GMaps({
		        div: '#map',
		        lat: 48.137222,
		        lng: 11.575278,
		        enableNewStyle: true,
		        zoom: 2
	      	});
	}
	
	return {
		init: function () {
			loadMap();
        }    
    }
}();