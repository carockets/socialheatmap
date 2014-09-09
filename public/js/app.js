var SocialHeatMap = SocialHeatMap || {}

$(document).ready(function () {
	SocialHeatMap.helloInit();
	SocialHeatMap.alreadyLoggedIn();
	SocialHeatMap.helloUser();
});


SocialHeatMap.alreadyLoggedIn = function () {
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

SocialHeatMap.helloInit = function () {

	hello.init({ 
	 	facebook : '701500879937628',
	 	twitter : 'A1W6ADU6674THULpB4IGtA64l',
	 	oauth_proxy : 'https://auth-server.herokuapp.com/proxy'
	 },{redirect_uri:'http://socialheatmap.herokuapp.com//'});

	// hello.init({ 
	// 	facebook : '701500879937628',
	// 	twitter : 'A1W6ADU6674THULpB4IGtA64l',
	// 	oauth_proxy : 'https://auth-server.herokuapp.com/proxy'
	// },{redirect_uri:'http://127.0.0.1:9292//'});
}

SocialHeatMap.helloUser = function () {
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

SocialHeatMap.searchTwitter = function() {
	var searchTerm = $('#twitterSearchTerm').val();
	var loadIndicatorContainer = document.getElementById('load-indicator');

	if (searchTerm !== '') {
		map.removeMarkers();
		// show user that request is sent
		loadIndicatorContainer.innerHTML = '<span>Loading results for ' + searchTerm + ' <i class="fa fa-refresh fa-spin"></i></span>'
		
		// distinguish if search for user or hashtag
		if(searchTerm.indexOf('@') == 0) {
			// get user_timeline
			SocialHeatMap.getUserTimeline(searchTerm.substring(1, searchTerm.length));
		}

		else if(searchTerm.indexOf('#') == 0) {
			// get Tweets for certain hastag
			SocialHeatMap.getSearchTweets(searchTerm);
		}		
		// tell user that everything ist up to date
		loadIndicatorContainer.innerHTML = '<span>Done. Showing results for ' + searchTerm + '</span>'
	}
}

SocialHeatMap.getUserTimeline = function(screen_name) {

	hello('twitter').api('/statuses/user_timeline.json?screen_name=' 
		+ screen_name 
		+ '&result_type=recent'
		+ '&include_rts=false'
		+ '&count=200', function (response) {
			// place for callback
			//console.log(json);

			var processedTweets = SocialHeatMap.apiResponseToProcessedTweet(response);
			Maps.drawMarkers(processedTweets);
	});
}

SocialHeatMap.getSearchTweets = function(hastag) {

	var processedTweets = processedTweets || [];

	var api_request = '/search/tweets.json?q=' 
		+ hastag
		+ '&result_type=recent'
		+ '&count=100';

	var current_request = api_request;

	
		hello('twitter').api( current_request, function (response) {
			debugger;
			// place for callback
			//console.log(current_request);
			processedTweets = processedTweets.concat(SocialHeatMap.apiResponseToProcessedTweet(response.statuses));
			// console.log(processedTweets);
			Maps.drawMarkers(processedTweets);
		});
	
}

SocialHeatMap.apiResponseToProcessedTweet = function(tweets) {

	debugger;
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
	return allSearchTweetsToShow;
}

