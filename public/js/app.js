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

	function helloLogin () {

			hello.init({ 
				facebook : '701500879937628',
				twitter : 'A1W6ADU6674THULpB4IGtA64l',
				oauth_proxy : 'https://auth-server.herokuapp.com/proxy'
			},{redirect_uri:'http://127.0.0.1:9292/'});

			hello.on('auth.login', function(auth){
			
				// call user information, for the given network
				hello( auth.network ).api( '/me' ).then( function(r){
					// Inject it into the container
					var label = document.getElementById( "profile_"+ auth.network );
					var navBarThumb = document.getElementById( "profile_"+ auth.network + "_thumb");
					if(!label){
						label = document.createElement('div');
						label.id = "profile_"+auth.network;
						document.getElementById('profile').appendChild(label);
					}
					label.innerHTML = '<img src="'+ r.thumbnail +'" /> Hey '+r.name + ' your screen name is ' + r.screen_name +'(User_Id ' + r.id_str +')';
					navBarThumb.innerHTML = '<img src="'+ r.thumbnail +'" height="35" width="35" class="img-circle" />';
					$("#btn_twitter").attr('onclick', 'hello("twitter").logout()').attr('title', 'Logout from Twitter');
					$("#twitter_login").attr('class', 'fa fa-check');
				});

				// finally get the latest 20 Tweets from user Timeline
				hello(auth.network).api('/statuses/home_timeline.json').then(function(tweets) {
					// console.log(tweets);
					//debugger;
					var allTimelineTweetsToShow = allTimelineTweetsToShow || [];

					$.each(tweets, function (index, tweet) {
						//debugger;
						allTimelineTweetsToShow.push({
							geolocation: tweet.coordinates,
							place: tweet.place,
							pubDate: tweet.created_at,
							id: tweet.id_str,
							content: tweet.text,
							author: tweet.user
						});
					});
					//console.log(allTimelineTweetsToShow);
					//addTweetMarkers(allTimelineTweetsToShow);
				});

				hello(auth.network).api('/statuses/user_timeline.json').then(function(tweets) {
					//console.log(tweets);
					var allUserTweetsToShow = allUserTweetsToShow || [];
				
					$.each(tweets, function (index, tweet) {
				
						allUserTweetsToShow.push({
							geolocation: tweet.coordinates,
							place: tweet.place,
							pubDate: tweet.created_at,
							id: tweet.id_str,
							content: tweet.text,
							author: tweet.user
						});
					});
					// console.log("allUserTweetsToShow = " + allUserTweetsToShow);
					
					$.each(allUserTweetsToShow, function (index, tweet) {
						if (tweet.geolocation) {
							debugger;
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

				hello(auth.network).api('/search/tweets.json?q=%23Apple&count=100').then(function(tweets) {
					// console.log(tweets.statuses);
					// debugger;
					var allSearchTweetsToShow = allSearchTweetsToShow || [];

					$.each(tweets.statuses, function (index, tweet) {
						debugger;
						allSearchTweetsToShow.push({
							geolocation: tweet.coordinates,
							place: tweet.place,
							pubDate: tweet.created_at,
							id: tweet.id_str,
							content: tweet.text,
							author: tweet.user
						});
					});

					$.each(allSearchTweetsToShow, function (index, tweet) {
						if (tweet.geolocation) {
							debugger;
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
					// console.log(allSearchTweetsToShow);
					//addTweetMarkers(allSearchTweetsToShow);
				});
			});


			hello.on('auth.logout', function(auth){
			
				// Inject it into the container
				var label = document.getElementById( "profile_"+ auth.network );
				var navBarThumb = document.getElementById( "profile_"+ auth.network + "_thumb");
				if(!label){
					label = document.createElement('div');
					label.id = "profile_"+auth.network;
					document.getElementById('profile').appendChild(label);name +'(User_Id ' + r.id_str +')';
				}
				label.innerHTML = '<p>Logged out from Twitter</p>';
				navBarThumb.innerHTML = "";
				$("#btn_twitter").attr('onclick', 'hello("twitter").login()').attr('title', 'Login to Twitter');
				$("#twitter_login").attr('class', 'fa fa-close');
			});
	}

	return {
		init: function () {
			alreadyLoggedIn();
			helloLogin();
		}
	}
	

}();