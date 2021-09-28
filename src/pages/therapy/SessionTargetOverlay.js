import React, {Component} from 'react';
import TargetInstructions from '../../components/TargetInstructions';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Image,
  FlatList,
  Text,
  TextInput,
  StatusBar,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import NavigationHeader from '../../components/NavigationHeader';
import {Container} from '../../components/GridSystem';
import Color from '../../utility/Color';
import UrlParser from 'js-video-url-parser';
import YoutubePlayer from '../../components/YoutubePlayer';
import VimeoPlayer from '../../components/VimeoPlayer';

const screenWidth = Dimensions.get('window').width;

class SessionTargetOverlay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.data,
    };

    this.params = this.props.route.params;
    console.log('Params', this.params);
  }

  render() {
    let videoUrl = this.params.videoUrl;
    let videoMetaData = UrlParser.parse(videoUrl);
    let videoHeight = (screenWidth * 165) / 295;

    return (
      <SafeAreaView style={{backgroundColor: Color.white, flex: 1}}>
        <NavigationHeader
          backPress={() => this.props.navigation.goBack()}
          title="Video Instruction"
        />
        <Container>
          <Text style={{color: Color.black, fontSize: 16, marginVertical: 10}}>
            {this.params.title}
          </Text>

          {videoMetaData?.provider == 'youtube' && videoUrl && (
            <YoutubePlayer url={videoUrl} height={videoHeight} />
          )}
          {videoMetaData?.provider == 'vimeo' && videoUrl && (
            <VimeoPlayer url={videoUrl} height={videoHeight} />
          )}

          {/* {!isVideoAvailable && <NoData>No Video Available</NoData>} */}
        </Container>
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  scrollView: {
    padding: 5,
  },
});

export default SessionTargetOverlay;
