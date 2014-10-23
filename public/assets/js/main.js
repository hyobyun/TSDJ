// GLOBALS
var aSpeed = 500;
var mode = '';

var playlistID;
var uID;
var tracks = []; //IMPORTANT

var spotifyApi;
var tick = 0;

var attributes = {
	danceability : .5,
	energy : .5,
	speechiness : .5,
	liveness : .5,
	acousticness : .5,
	valence : .5
};
var dataSources = {
	danceability : cliff,
	energy : cliff,
	speechiness : cliff,
	liveness : random,
	acousticness : random,
	valence : random
};

var danceabilityTS = new TimeSeries();
var energyTS = new TimeSeries();
var speechinessTS = new TimeSeries();
var livenessTS = new TimeSeries();
var acousticnessTS = new TimeSeries();
var valenceTS = new TimeSeries();

var smoothie;
var stopped = true;
var done = false;
var clock = setInterval(function () {
		updateClock()
	}, 1000);

var playcountPenalty = 0.5;

$.each(allSources, function (val, text) {
	$('.selectorH').append(
		$('<option></option>').val(val).html(text));
});

/**
 * Obtains parameters from the hash of the URL
 * @return Object
 */

var params = getHashParams();

var access_token = params.access_token
	refresh_token = params.refresh_token,
error = params.error;
if (error) {
	alert('There was an error during the authentication');
} else {
	if (access_token) {
		$.ajax({
			url : 'https://api.spotify.com/v1/me',
			headers : {
				'Authorization' : 'Bearer ' + access_token
			},
			success : function (response) {
				uID = response.id;
				$('#start').addClass('hidden');
				$('#connectSpotify').addClass('hidden');
				$('#selectPlaylist').removeClass('hidden');
				select(response);
			}
		});
	} else {
		loadFn();
	}

}

function updateClock() {
	tick = tick + 1;
	attributes.danceability = dataSources.danceability();
	attributes.energy = dataSources.energy();
	attributes.speechiness = dataSources.speechiness();
	attributes.liveness = dataSources.liveness();
	attributes.acousticness = dataSources.acousticness();
	attributes.valence = dataSources.valence();

	danceabilityTS.append(new Date().getTime(), attributes.danceability);
	energyTS.append(new Date().getTime(), attributes.energy);
	speechinessTS.append(new Date().getTime(), attributes.speechiness);
	livenessTS.append(new Date().getTime(), attributes.liveness);
	acousticnessTS.append(new Date().getTime(), attributes.acousticness);
	valenceTS.append(new Date().getTime(), attributes.valence);

	dataSources.danceability = window[$("#danceability :selected").text()];
	dataSources.energy = window[$("#energy :selected").text()];
	dataSources.speechiness = window[$("#speechiness :selected").text()];
	dataSources.liveness = window[$("#liveness :selected").text()];
	dataSources.acousticness = window[$("#acousticness :selected").text()];
	dataSources.valence = window[$("#valence :selected").text()];

	var audio = document.getElementById('player');

	if (audio.paused && done) {
		nextSong();
	}
}

function nextSong() {
	var play = findClosest();
	tracks[play].playCount = tracks[play].playCount + 1;
	var audio = $("#player");
	$("#albumArt").attr('src', tracks[play].album.images[0].url);
	$("#title").html(tracks[play].artists[0].name + "-" + tracks[play].name);
	audio.attr("src", tracks[play].preview_url);
	audio[0].pause();
	audio[0].load(); //suspends and restores all audio element
	audio[0].play();
}

function select(response) {
	spotifyApi = new SpotifyWebApi();
	spotifyApi.setAccessToken(access_token);
	spotifyApi.getUserPlaylists(uID)
	.then(function (data) {

		for (i = 0; i < data.items.length; i++) {
			$('#playlists').append('<a onClick="selectDataSource(\'' + data.items[i].id + '\',\'' + data.items[i].owner.id + '\')">' + data.items[i].name + '</a><br>');
		}

	}, function (err) {
		console.error(err);
	});

}

function selectDataSource(tid, owid) {
	playlistID = tid;
	spotifyApi.getPlaylist(owid, playlistID)
	.then(function (data) {
		for (i = 0; i < data.tracks.items.length; i++) {
			tracks.push(data.tracks.items[i].track);
		}

		for (i = 0; i < tracks.length; i++) {
			var tName = 'spotify:track:' + tracks[i].id;
			var iTrack = tracks[i];
			$.ajax({
				type : 'get',
				async : false,
				url : 'http://developer.echonest.com/api/v4/track/profile',
				dataType : 'json',
				data : {
					'api_key' : 'L1NC8IQEVR4R8U2RL',
					'id' : tName,
					'bucket' : 'audio_summary'
				},
				success : function (resp) {

					iTrack['danceability'] = resp.response.track.audio_summary.danceability;
					iTrack['energy'] = resp.response.track.audio_summary.energy;
					iTrack['speechiness'] = resp.response.track.audio_summary.speechiness;
					iTrack['liveness'] = resp.response.track.audio_summary.liveness;
					iTrack['acousticness'] = resp.response.track.audio_summary.acousticness;
					iTrack['valence'] = resp.response.track.audio_summary.valence;
					iTrack['playCount'] = 0;
					tracks[i] = iTrack;
				}
			});
			done = true;

			//var attributes = {danceability: .5, energy:.5, speechiness:.5, liveness: .5, acousticness:.5, valence:.5};


		}

		$('#selectPlaylist').fadeOut(aSpeed, function () {
			$('#selectPlaylist').addClass('hidden');
			$('#start').addClass('hidden');
			$('#dashboard').removeClass('hidden').fadeIn(aSpeed);
			//var attributes = {danceability: .5, energy:.5, speechiness:.5, liveness: .5, acousticness:.5, valence:.5};
			smoothiedanceability = new SmoothieChart({
					labels : {
						disabled : true
					},
					millisPerPixel : 100,
					maxValue : 1,
					minValue : 0,
					grid : {
						strokeStyle : 'rgb(51, 51, 51)',
						fillStyle : 'rgb(51,51,51)',
						lineWidth : 1,
						verticalSections : 25
					}
				});
			smoothieenergy = new SmoothieChart({
					labels : {
						disabled : true
					},
					millisPerPixel : 100,
					maxValue : 1,
					minValue : 0,
					grid : {
						strokeStyle : 'rgb(51, 51, 51)',
						fillStyle : 'rgb(51,51,51)',
						lineWidth : 1,
						verticalSections : 25
					}
				});
			smoothiespeechiness = new SmoothieChart({
					labels : {
						disabled : true
					},
					millisPerPixel : 100,
					maxValue : 1,
					minValue : 0,
					grid : {
						strokeStyle : 'rgb(51, 51, 51)',
						fillStyle : 'rgb(51,51,51)',
						lineWidth : 1,
						verticalSections : 25
					}
				});
			smoothieliveness = new SmoothieChart({
					labels : {
						disabled : true
					},
					millisPerPixel : 100,
					maxValue : 1,
					minValue : 0,
					grid : {
						strokeStyle : 'rgb(51, 51, 51)',
						fillStyle : 'rgb(51,51,51)',
						lineWidth : 1,
						verticalSections : 25
					}
				});
			smoothieacousticness = new SmoothieChart({
					labels : {
						disabled : true
					},
					millisPerPixel : 100,
					maxValue : 1,
					minValue : 0,
					grid : {
						strokeStyle : 'rgb(51, 51, 51)',
						fillStyle : 'rgb(51,51,51)',
						lineWidth : 1,
						verticalSections : 25
					}
				});
			smoothievalence = new SmoothieChart({
					labels : {
						disabled : true
					},
					millisPerPixel : 100,
					maxValue : 1,
					minValue : 0,
					grid : {
						strokeStyle : 'rgb(51, 51, 51)',
						fillStyle : 'rgb(51,51,51)',
						lineWidth : 1,
						verticalSections : 25
					}
				});

			smoothiedanceability.addTimeSeries(danceabilityTS, {
				strokeStyle : 'rgb(255, 255, 255)',
				fillStyle : 'rgba(0, 255, 0, 0)',
				lineWidth : 3
			});
			smoothiedanceability.streamTo(document.getElementById("danceabilityCanvas"), 1000);

			smoothieenergy.addTimeSeries(energyTS, {
				strokeStyle : 'rgb(255, 255, 255)',
				fillStyle : 'rgba(0, 255, 0, 0)',
				lineWidth : 3
			});
			smoothieenergy.streamTo(document.getElementById("energyCanvas"), 1000);

			smoothiespeechiness.addTimeSeries(speechinessTS, {
				strokeStyle : 'rgb(255, 255, 255)',
				fillStyle : 'rgba(0, 255, 0, 0)',
				lineWidth : 3
			});
			smoothiespeechiness.streamTo(document.getElementById("speechinessCanvas"), 1000);

			smoothieliveness.addTimeSeries(livenessTS, {
				strokeStyle : 'rgb(255, 255, 255)',
				fillStyle : 'rgba(0, 255, 0, 0)',
				lineWidth : 3
			});
			smoothieliveness.streamTo(document.getElementById("livenessCanvas"), 1000);

			smoothieacousticness.addTimeSeries(acousticnessTS, {
				strokeStyle : 'rgb(255, 255, 255)',
				fillStyle : 'rgba(0, 255, 0, 0)',
				lineWidth : 3
			});
			smoothieacousticness.streamTo(document.getElementById("acousticnessCanvas"), 1000);

			smoothievalence.addTimeSeries(valenceTS, {
				strokeStyle : 'rgb(255, 255, 255)',
				fillStyle : 'rgba(0, 255, 0, 0)',
				lineWidth : 3
			});
			smoothievalence.streamTo(document.getElementById("valenceCanvas"), 1000);

		});
	}, function (err) {
		console.error(err);
	});

}
function findClosest() {
	console.log('--FIND--');
	//var attributes = {danceability: .5, energy:.5, speechiness:.5, liveness: .5, acousticness:.5, valence:.5};
	var closestDist = 9999;
	var closest = 0;
	for (i = 0; i < tracks.length; i++) {
		var d1 = Math.abs(attributes.danceability - tracks[i].danceability);
		var d2 = Math.abs(attributes.energy - tracks[i].energy);
		var d3 = Math.abs(attributes.speechiness - tracks[i].speechiness);
		var d4 = Math.abs(attributes.liveness - tracks[i].liveness);
		var d5 = Math.abs(attributes.acousticness - tracks[i].acousticness);
		var d6 = Math.abs(attributes.valence - tracks[i].acousticness);
		var dist = Math.sqrt(d1 * d1 + d2 * d2 + d3 * d3 + d4 * d4 + d5 * d5 + d6 * d6);

		dist = dist + tracks[i].playCount * playcountPenalty;
		if (dist < closestDist) {
			console.log(i + " " + dist + "!!!!!!!!!!!!" + tracks[i].name);
			closestDist = dist;
			closest = i;
		} else {
			console.log(i + " " + dist + " " + tracks[i].playCount);
		}

	}
	return closest;
}
function loadFn() {
	$('#start').removeClass('hidden').fadeIn(aSpeed);

}
function mainStart() {
	$('#start').fadeOut(aSpeed, function () {
		$('#start').addClass('hidden');
		$('#connectSpotify').removeClass('hidden').fadeOut(0).fadeIn(aSpeed);
	});

}

function songChoice(mode) {
	$('#start').fadeOut(aSpeed, function () {
		$('#start').addClass('hidden');
		$('#connectSpotify').removeClass('hidden').fadeOut(0).fadeIn(aSpeed);
	});
}

function getHashParams() {
	var hashParams = {};
	var e,
	r = /([^&;=]+)=?([^&;]*)/g,
	q = window.location.hash.substring(1);
	while (e = r.exec(q)) {
		hashParams[e[1]] = decodeURIComponent(e[2]);
	}
	return hashParams;
}
