import React from 'react';
import { View, Text, Platform } from 'react-native';
import axios from 'axios';
import { WebView } from 'react-native-webview';
import LoadingIndicator from './LoadingIndicator';
import UrlParser from "js-video-url-parser";

export default class YoutubePlayer extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			videoId: null,
			embedUrl: null
		};
	}

	componentDidMount() {
		let videoMetaData = UrlParser.parse(this.props.url);
		let embedUrl = "https://www.youtube.com/embed/" + videoMetaData.id;
		console.log(embedUrl);
		this.setState({
			embedUrl: embedUrl,
			videoId: videoMetaData.id
		});
	}

	/*
window.ready(function() {
				alert("cuy");
				setTimeout(function(){
					
					document.getElementsByClassName("ytp-overflow-button")[0].style = "display: none !important";
				}, 2000);
			});

	*/

	render() {
		const INJECTED_JAVASCRIPT = `(function() {
			document.body.style = "display:none"
			true;
		})();`;

		let height = this.props.height ?? 250;
		// console.log("Props", this.props);
		let { embedUrl, videoId } = this.state;
		if (embedUrl) {
			let html = `<!DOCTYPE html>
			<html lang='en' class=''>
			<head>
				<meta name="viewport" content="initial-scale=1, maximum-scale=1">
				<link rel="stylesheet" href="https://unpkg.com/plyr@3/dist/plyr.css">
				<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/5.0.0/normalize.min.css">
			</head>
			
			<body>
				<div id="player" data-plyr-provider="youtube" data-plyr-embed-id="${videoId}"></div>
				<script
					src="https://cdn.polyfill.io/v2/polyfill.min.js?features=es6,Array.prototype.includes,CustomEvent,Object.entries,Object.values,URL"></script>
				<script src="https://unpkg.com/plyr@3"></script>
				<script>
					const player = new Plyr('#player', {});
					window.player = player;
				</script>
			</body>
			</html>`;
			return (
				<View style={{ height }}>
					<WebView containerStyle={{ width: '100%', height: '100%' }}
						// scalesPageToFit={true}
						source={{ html }}
						javaScriptEnabled={true}
						domStorageEnabled={true}
						originWhitelist={['*']}
						allowsFullscreenVideo={true}
						mediaPlaybackRequiresUserAction={Platform.OS == 'ios' ? true : false}
						automaticallyAdjustContentInsets={false}
					/>
				</View>
			);
		}

		return (
			<View style={{ height: 150 }}>
				<LoadingIndicator />
			</View>
		);
	}
}
