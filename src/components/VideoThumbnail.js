import React, { Component } from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Color from '../utility/Color';
import UrlParser from "js-video-url-parser";
import LoadingIndicator from './LoadingIndicator';

class VideoThumbnail extends Component {

    constructor(props) {
        super(props);

        this.state = {
            convertedThumbnailUrl: null
        };
    }

    componentDidMount() {
        if (this.props.videoUrl) {
            let videoMetaData = UrlParser.parse(this.props.videoUrl);
            console.log("VideoMetaData", videoMetaData);
            if (videoMetaData.provider == "youtube") {
                this.setState({
                    convertedThumbnailUrl: "http://i3.ytimg.com/vi/" + videoMetaData.id + "/hqdefault.jpg"
                })
            }
        }
    }

    render() {
        let image = <View style={styles.thumbBox}><LoadingIndicator /></View>;
        if (this.props.videoUrl) {
            if (this.state.convertedThumbnailUrl) {
                image = <Image source={{ uri: this.state.convertedThumbnailUrl }} style={styles.thumb} />
            }
        } else if (this.props.imageUrl) {
            image = <Image source={{ uri: this.props.imageUrl }} style={styles.thumb} />
        }

        return (
            <View style={styles.wrapper}>
                {image}
                <Text style={styles.title}>{this.props.title}</Text>
                <Text style={styles.description} numberOfLines={2} ellipsizeMode='tail'>{this.props.description}</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    wrapper: {
        width: 250,
        borderColor: Color.gray,
        borderWidth: 1,
        borderRadius: 5,
        paddingVertical: 6,
        paddingHorizontal: 10,
        marginRight: 5
    },
    thumb: {
        width: 230,
        height: 150,
        resizeMode: 'cover'
    },
    thumbBox: {
        width: 230,
        height: 150,
        backgroundColor: Color.gray
    },
    title: {
        fontSize: 14,
        fontWeight: 'bold',
        color: Color.primary,
        marginTop: 5,
        marginBottom: 5
    },
    description: {
        fontSize: 10,
        color: Color.grayDarkFill
    }
});

export default VideoThumbnail;
