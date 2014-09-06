var App = function () {

	function helloLogin () {

		//var TWITTER_CLIENT_ID = {
		//	'meow.com' : 'A1W6ADU6674THULpB4IGtA64l',
		//}[window.location.hostname];

		hello.init({ 
			facebook : '701500879937628',
			twitter : 'A1W6ADU6674THULpB4IGtA64l',
			oauth_proxy : 'https://auth-server.herokuapp.com/proxy'
		},{redirect_uri:'http://socialheatmap.herokuapp.com/'});

		hello.on('auth.login', function(auth){
		
			// call user information, for the given network
			hello( auth.network ).api( '/me' ).then( function(r){
				// Inject it into the container
				console.log(r.name);
				var label = document.getElementById( "profile_"+ auth.network );
				if(!label){
					label = document.createElement('div');
					label.id = "profile_"+auth.network;
					document.getElementById('profile').appendChild(label);
				}
				label.innerHTML = '<img src="'+ r.thumbnail +'" /> Hey '+r.name + ' your screen name is ' + r.screen_name +'(User_Id ' + r.id_str +')';
			});
		});
	}

	return {
		init: function () {
			helloLogin();
		}
	}
	

}();