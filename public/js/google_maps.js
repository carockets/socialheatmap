var Maps = Maps || {}

$(document).ready(function () {
	Maps.loadMap();
});

Maps.loadMap = function () {
	map = new GMaps({
		div: '#map',
		lat: 48.137222,
		lng: 11.575278,
		enableNewStyle: true,
		zoom: 2
	});	
}

Maps.drawMarkers = function (tweets) {
	if (tweets != undefined) {
		$.each(tweets, function (index, tweet) {						
			if (tweet.geolocation) {
									
				map.addMarker({
					lng: tweet.geolocation.coordinates[0],
					lat: tweet.geolocation.coordinates[1],
					title: tweet.author.screen_name,
					infoWindow: {
						content: '<h5>@' + tweet.author.screen_name + '</h5><p>' + tweet.content + '</p><p>' + tweet.pubDate + '</p>'
						}
				});
			}
		});
	}
}