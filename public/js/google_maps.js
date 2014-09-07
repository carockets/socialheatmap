var Maps = function () {

	function loadMap () {
		map = new GMaps({
		        div: '#map',
		        lat: 48.137222,
		        lng: 11.575278,
		        enableNewStyle: true,
		        zoom: 2
	      	});
		setInitialMarker();
	}

	function setInitialMarker () {
		map.addMarker({
			  lat: 48.137222,
			  lng: 11.575278,
			  title: 'Munich',
			  infoWindow: {
			  content: '<p>Munich Marienplatz</p>'
			}
		});
	}

	function addTweetMarkers(tweets) {
		debugger;
		$.each(tweets, function (index, tweet) {
			if (tweet.coordinates) {
				map.addMarker({
					lng: tweet.geolocation.coordinates[0],
					lat: tweet.geolocation.coordinates[1],
					title: tweet.author.name,
					infoWindow: {
					content: '<p>' + tweet.text + '</p>'
					}
				});
			}
		});
	}

	return {
		init: function () {
			loadMap();
        }    
    }
}();