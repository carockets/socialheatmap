var App = function () {

	function alreadyLoggedIn() {
		var online = function(session){
			var current_time = (new Date()).getTime() / 1000;
			return session && session.access_token && session.expires > current_time;
		};

		var isLoggedInTwitter = hello( "twitter" ).getAuthResponse();

		if (online(isLoggedInTwitter)) {
			$("#btn_twitter").attr('onclick', 'hello("twitter").logout()').attr('title', 'Logout from Twitter');
			$("#twitter_login").attr('class', 'fa fa-check');
		}
		else {
			$("#btn_twitter").attr('onclick', 'hello("twitter").login()').attr('title', 'Login to Twitter');
			$("#twitter_login").attr('class', 'fa fa-close');
		}
	}

	function helloInit () {

			hello.init({ 
				facebook : '701500879937628',
				twitter : 'A1W6ADU6674THULpB4IGtA64l',
				oauth_proxy : 'https://auth-server.herokuapp.com/proxy'
			},{redirect_uri:'http://socialheatmap.herokuapp.com//'});
		}

	function helloUser () {
		hello.on('auth.logout', function(auth){
			
				// Inject it into the container
				var navBarThumb = document.getElementById( "profile_"+ auth.network + "_thumb");
				navBarThumb.innerHTML = "<span style='margin-right:10px;'>Please log in first! </span>";
				$("#btn_twitter").attr('onclick', 'hello("twitter").login()').attr('title', 'Login to Twitter');
				$("#twitter_login").attr('class', 'fa fa-close');
			});

		hello.on('auth.login', function(auth){
				// call user information, for the given network
				hello( auth.network ).api( '/me' ).then( function(r){
					// Inject it into the container
					var navBarThumb = document.getElementById( "profile_"+ auth.network + "_thumb");
					navBarThumb.innerHTML = '<span style="margin-right:10px;"> Logged in :) </span><img src="'+ r.thumbnail +'" height="35" width="35" class="img-circle" />';
					$("#btn_twitter").attr('onclick', 'hello("twitter").logout()').attr('title', 'Logout from Twitter');
					$("#twitter_login").attr('class', 'fa fa-check');
				});
		});
	}

	function searchTwitter () {

			var searchTerm = $('#twitterSearchTerm').val();
			var loadIndicatorContainer = document.getElementById('load-indicator');

			if (searchTerm !== '') {
				loadIndicatorContainer.innerHTML = '<span>Loading results for ' + searchTerm + '<i class="fa fa-refresh fa-spin"></i></span>'
				if(searchTerm.indexOf('@') == 0) {
					console.log('getting user timeline');
					hello('twitter').api('/statuses/user_timeline.json?screen_name=' + searchTerm.substring(1, searchTerm.length) + '&result_type=recent&count=100', function (json) {
					// place for callback
					// console.log(json);
					}).then(function(tweets) {

						var allSearchTweetsToShow = allSearchTweetsToShow || [];
						$.each(tweets, function (index, tweet) {
							allSearchTweetsToShow.push({
								geolocation: tweet.coordinates,
								place: tweet.place,
								pubDate: tweet.created_at,
								id: tweet.id_str,
								content: tweet.text,
								author: tweet.user
							});
						});

						map.removeMarkers();

						$.each(allSearchTweetsToShow, function (index, tweet) {
							
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
						})
					});

				}

				else if(searchTerm.indexOf('#') == 0) {
					console.log('getting search tweets');
					hello('twitter').api('/statuses/filter.json?', 'post', '{location: -180,-90,180,90, track:"' + searchTerm.substring(1, searchTerm.length) + '"}' function (json) {
					// place for callback
					// console.log(json);
					}).then(function(tweets) {

						var allSearchTweetsToShow = allSearchTweetsToShow || [];
						$.each(tweets.statuses, function (index, tweet) {
							allSearchTweetsToShow.push({
								geolocation: tweet.coordinates,
								place: tweet.place,
								pubDate: tweet.created_at,
								id: tweet.id_str,
								content: tweet.text,
								author: tweet.user
							});
						});

						map.removeMarkers();

						$.each(allSearchTweetsToShow, function (index, tweet) {
							
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
					});
				}

				
				loadIndicatorContainer.innerHTML = '<span>Done. Showing results for ' + searchTerm + '</span>'
			}
		}

	return {
		init: function () {
			helloInit();
			alreadyLoggedIn();
			helloUser();
		},
		searchTweets : function () {
			searchTwitter();
		}
	}
}();

