import React from 'react';
import { View, Text, Platform } from 'react-native';
import axios from 'axios';
import { WebView } from 'react-native-webview';
import LoadingIndicator from './LoadingIndicator';
import UrlParser from "js-video-url-parser";

export default class VimeoPlayer extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			videoId: null
		};
	}

	componentDidMount() {

	}

	loadVideoData(videoId) {
		// console.log("VideoID", videoId);
		let url = `https://player.vimeo.com/video/${videoId}/config`;
		console.log("loadVideoData", url);
		axios.get(url).then((result) => {
			console.log("ResultAx", result);
			let res = result.data;
			console.log("VideoThumb", res.video.thumbs.base);
		}).catch((err) => {
			console.log("Err", err);
		});
	}

	render() {
		let height = this.props.height ?? 250;
		// console.log("Props", this.props);
		let videoUrl = this.props.url;
		if (videoUrl) {
			let videoMetaData = UrlParser.parse(videoUrl);
			// let videoId = videoUrl.split('/')[3];
			let videoId = videoMetaData.id;
			console.log({ videoId });
			// if (this.state.videoId != videoId) {
			// 	//load
			// 	this.setState({ videoId }, () => {
			// 		this.loadVideoData(videoId);
			// 	});
			// }

			let html = `<!DOCTYPE html>
			<html lang='en' class=''>
			<head>
				<meta name="viewport" content="initial-scale=1, maximum-scale=1">
				<link rel="stylesheet" href="https://unpkg.com/plyr@3/dist/plyr.css">
				<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/5.0.0/normalize.min.css">
			</head>
			
			<body>
				<div id="player" data-plyr-provider="vimeo" data-plyr-embed-id="${videoId}"></div>
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
