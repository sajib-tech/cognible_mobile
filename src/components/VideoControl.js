import 'react-native-gesture-handler';
import React, { Component } from 'react';
import {
    View,
    Dimensions,
    TouchableOpacity,
    Text
} from 'react-native';
import Video from 'react-native-video';
import OrientationHelper from '../helpers/OrientationHelper';
import Fontisto from 'react-native-vector-icons/Fontisto';
import BackgroundTimer from 'react-native-background-timer';

const width = Dimensions.get('window').width

class VideoControl extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isPaused: true,
            counterShow: 0
        };
    }

    componentDidMount() {
        console.log("Video", this.props.videoUrl)

        BackgroundTimer.runBackgroundTimer(() => {
            this.setState({ counterShow: this.state.counterShow - 1 });
        }, 1000);
    }

    componentWillUnmount() {
        BackgroundTimer.stopBackgroundTimer();
    }

    tick() {
        setTimeout(() => {
            this.setState({ counterShow: this.state.counterShow - 1 });
            this.tick();
        }, 100);
    }

    render() {
        return (
            <View>
                <Video source={{ uri: this.props.videoUrl }}
                    volume={1}
                    // controls={true}
                    paused={this.state.isPaused}
                    resizeMode='cover'
                    style={styles.video} />

                {this.state.isPaused && (
                    <TouchableOpacity style={styles.videoControl}
                        activeOpacity={1}
                        onPress={() => {
                            this.setState({ isPaused: false, counterShow: 3 });
                        }}>
                        <View style={styles.videoControlCircle}>
                            <Fontisto name='play' size={20} color='#fff' />
                        </View>
                    </TouchableOpacity>
                )}

                {!this.state.isPaused && (
                    <TouchableOpacity style={styles.videoControlTransparent}
                        activeOpacity={1}
                        onPress={() => {
                            this.setState({ counterShow: 3 });
                        }}>
                        {/* <Text>{this.state.counterShow}</Text> */}
                        {this.state.counterShow > 0 && (
                            <TouchableOpacity activeOpacity={1} style={styles.videoControlCircle} onPress={() => {
                                this.setState({ isPaused: !this.state.isPaused });
                            }}>
                                <Fontisto name='pause' size={20} color='#fff' />
                            </TouchableOpacity>
                        )}
                    </TouchableOpacity>
                )}
            </View>
        );
    }
}

const styles = {
    video: {
        height: OrientationHelper.getDeviceOrientation() == 'portrait' ? 250 : 400,
        borderRadius: 5
    },
    videoControl: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        height: OrientationHelper.getDeviceOrientation() == 'portrait' ? 250 : 400,
        borderRadius: 5,
        backgroundColor: 'rgba(0,0,0,0.1)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    videoControlTransparent: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        height: OrientationHelper.getDeviceOrientation() == 'portrait' ? 250 : 400,
        borderRadius: 5,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center'
    },
    videoControlCircle: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center'
    },
};

export default VideoControl;