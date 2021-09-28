import 'react-native-get-random-values';
import React, { Component } from 'react';
import { View, StyleSheet, Text, Dimensions, TouchableOpacity, SafeAreaView } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Color from '../utility/Color';
import Video from 'react-native-video';
import gql from 'graphql-tag';
import { client, likeVideo } from '../constants/index';
import store from '../redux/store';
import NavigationHeader from './NavigationHeader';

class VideoPlayer extends Component {

	constructor(props) {
		super(props);
		const { params } = props.route;
		this.state = {
			url: params.url,
			title: params.title,
			description: params.description,
			id: params.id,
			likes: params.likes,
			isPaused: false,
			fullscreen: false,
			errors: '',
			videoLiked: params.videoLiked
		};
	}

	onBuffer = () => {

	}

	handleLikePressed = () => {
		const videoId = this.props.route.params.id;
		let variables = {
			videoId: videoId
		};

		console.log("handleLikePressed::Params", variables)
		client.mutate({
			mutation: likeVideo,
			variables
		}).then(result => {
			this.setState({
				videoLiked: true
			});
			console.log("Result", result);
		}).catch(error => {
			console.log("Error", error);
		});
	}

	videoError = () => {
		this.setState({
			errors: 'Hello, We just got an error'
		})
	}

	render() {
		const { isPaused, errors, url, videoLiked, title, description, likes, fullscreen } = this.state;
		if (url !== '') {
			return (
				<SafeAreaView style={styles.container}>
					<Text>{this.state.errors}</Text>
					<Text style={styles.close} onPress={() => {
						this.props.navigation.goBack()
					}}>X</Text>
					<Video source={{ uri: url }}
						ref={ref => { this.videoplayer = ref }}
						controls={true}
						paused={isPaused}
						fullscreen={fullscreen}
						onBuffer={this.onBuffer}
						onError={this.videoError}
						resizeMode={"cover"}
						style={styles.video} />
					<View style={styles.descriptionContainer}>
						<View style={styles.descTitleContainer}>
							<Text style={styles.descTitle}>{title}</Text>
							<View style={styles.likesContainer}>
								<Text style={styles.likesCounter}>{likes}</Text>
								{videoLiked ?
									<MaterialCommunityIcons name='cards-heart' size={32} color={Color.red} /> :
									<TouchableOpacity onPress={this.handleLikePressed}>
										<MaterialCommunityIcons name='heart-outline' size={32} color={Color.grayFill} />
									</TouchableOpacity>
								}
							</View>
						</View>
						<Text style={styles.descText}>{description}</Text>
					</View>
				</SafeAreaView>
			);
		} else {
			return null;
		}
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#FFFFFF'
	},
	video: {
		width: Dimensions.get('window').width,
		height: Dimensions.get('window').width * (9 / 16),
		backgroundColor: 'black',
	},
	descriptionContainer: {
		marginTop: 20,
		marginHorizontal: 20,
		borderBottomWidth: 1,
		borderColor: '#ddd',
		paddingBottom: 20
	},
	descTitleContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	descTitle: {
		color: '#333333',
		fontSize: 18,
		fontWeight: '700',
		flex: 1
	},
	descText: {
		marginTop: 10,
		color: '#333333',
		fontSize: 14
	},
	relatedVideosContainer: {
		marginTop: 20,
		marginHorizontal: 20
	},
	relatedTitle: {
		fontSize: 16,
		color: '#333333',
		fontWeight: '700'
	},
	likesContainer: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	likesCounter: {
		fontSize: 16,
		marginRight: 5,
		color: '#333333'
	},
	close: {
		position: 'absolute',
		zIndex: 99,
		fontSize: 20,
		paddingTop: 5,
		textAlign: 'center',
		top: 10,
		right: 20,
		borderRadius: 50,
		fontWeight: 'bold',
	}
});

export default VideoPlayer;
