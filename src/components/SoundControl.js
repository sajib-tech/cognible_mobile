import 'react-native-gesture-handler';
import React, { Component } from 'react';
import {
    View,
    Dimensions,
    TouchableOpacity,
    Text,
    Alert
} from 'react-native';
import Sound from 'react-native-sound';
import OrientationHelper from '../helpers/OrientationHelper';
import Fontisto from 'react-native-vector-icons/Fontisto';
import BackgroundTimer from 'react-native-background-timer';
import Color from '../utility/Color';
import LoadingIndicator from './LoadingIndicator';

const width = Dimensions.get('window').width

class SoundControl extends Component {
    constructor(props) {
        super(props);

        this.state = {
            status: "WAITING",
            isReady: false,
            isPlaying: false,
            totalDuration: 0,
            currentDuration: 0
        };

        this.sound = null;
    }

    componentDidMount() {
        console.log("Url", this.props.audioUrl);
        this.sound = new Sound(this.props.audioUrl, null, (error) => {
            if (error) {
                console.log('failed to load the sound', error);
                this.setState({ status: "ERROR" });
                return;
            }

            let totalDuration = this.sound.getDuration();
            // loaded successfully
            console.log('duration in seconds: ' + totalDuration + 'number of channels: ' + this.sound.getNumberOfChannels());

            this.setState({ isReady: true, status: "OK", totalDuration });
            // Play the sound with an onEnd callback
            // this.sound.play((success) => {
            //     if (success) {
            //         console.log('successfully finished playing');
            //     } else {
            //         console.log('playback failed due to audio decoding errors');
            //     }
            // });
        });

        this.interval = BackgroundTimer.setInterval(() => {
            if (this.sound) {
                if (this.state.isReady) {
                    this.sound.getCurrentTime((seconds) => {
                        this.setState({ currentDuration: seconds });
                    });
                } else {
                    this.setState({ currentDuration: 0 });
                }
            }
        }, 200);
    }

    componentWillUnmount() {
        BackgroundTimer.clearInterval(this.interval);
    }

    playOrPause() {
        if (this.sound && this.state.isReady) {
            if (this.state.isPlaying) {
                this.sound.pause();
                this.setState({ isPlaying: false });
            } else {
                this.sound.play((success) => {
                    if (success) {
                        // console.log('successfully finished playing');
                        this.setState({ isPlaying: false });
                    } else {
                        Alert.alert("Information", "Cannot play audio");
                        console.log('playback failed due to audio decoding errors');
                    }
                });
                this.setState({ isPlaying: true });
            }
        } else {
            console.log("Sound is not loaded or not ready");
        }
    }

    getPercentage() {
        if (this.state.totalDuration == 0) {
            return 0;
        }

        return (this.state.currentDuration / this.state.totalDuration * 100);
    }

    formatTime(seconds) {
        let minutes = Math.floor(seconds / 60);
        let sec = Math.floor(seconds % 60);

        if (minutes < 10) {
            minutes = "0" + minutes;
        }

        if (sec < 10) {
            sec = "0" + sec;
        }

        return minutes + ":" + sec;
    }

    render() {
        let { status } = this.state;

        if (status == "WAITING") {
            return (
                <View style={styles.wrapperWaiting}>
                    <LoadingIndicator color={Color.white} />
                </View>
            );
        } else if (status == "ERROR") {
            return (
                <View style={styles.wrapperError}>
                    <Text style={{ color: Color.white }}>Failed to load sound file.</Text>
                </View>
            );
        }

        return (
            <View style={styles.wrapper}>
                <View style={styles.progressWrapper}>
                    <View style={styles.progressBar}>
                        <View style={[styles.progressBarActive, { width: this.getPercentage() + '%' }]} />
                    </View>
                    <Text>{this.formatTime(this.state.currentDuration)} / {this.formatTime(this.state.totalDuration)}</Text>
                </View>
                <TouchableOpacity style={styles.buttonWrapper} onPress={() => {
                    this.playOrPause();
                }}>
                    <Fontisto name={this.state.isPlaying ? 'pause' : 'play'} size={20} color='#fff' />
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = {
    wrapper: {
        backgroundColor: "#f5f8ff",
        borderColor: "#d8e4fe",
        borderWidth: 1,
        borderRadius: 5,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center'
    },
    wrapperWaiting: {
        backgroundColor: Color.warning,
        borderRadius: 5,
        height: 70
    },
    wrapperError: {
        backgroundColor: Color.danger,
        borderRadius: 5,
        padding: 16,
        justifyContent: 'center',
        alignItems: 'center'
    },
    progressWrapper: {
        flex: 1,
        paddingRight: 10
    },
    buttonWrapper: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: Color.primary,
        justifyContent: 'center',
        alignItems: 'center'
    },
    progressBar: {
        height: 3,
        borderRadius: 1,
        backgroundColor: "#e9ecf2"
    },
    progressBarActive: {
        height: 3,
        borderRadius: 1,
        backgroundColor: Color.primary
    }
};

export default SoundControl;