import React, {Component} from 'react';

import {
  Text,
  Dimensions,
  View,
  StyleSheet,
  Image,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {Card, List, ListItem, Button, Icon} from 'react-native-elements';

import {getStr} from '../../../locales/Locale';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import TherapySessionLink from '../../components/TherapySessionLink';
import ProgressCircle from 'react-native-progress-circle';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {connect} from 'react-redux';
import {
  client,
  getStudentSessions,
  GetVimeoProjects,
  GetVimeoProjectVideos,
  getTherapyProgramDetails,
} from '../../constants/index';
import store from '../../redux/store';
import {getAuthResult, getAuthTokenPayload} from '../../redux/reducers/index';
import {setToken, setTokenPayload} from '../../redux/actions/index';
import DateHelper from '../../helpers/DateHelper';
import TokenRefresher from '../../helpers/TokenRefresher';
import Color from '../../utility/Color';
import NavigationHeader from '../../components/NavigationHeader';
import {Container} from '../../components/GridSystem';
import {WebView} from 'react-native-webview';
import OrientationHelper from '../../helpers/OrientationHelper';
import LoadingIndicator from '../../components/LoadingIndicator';
import UrlParser from 'js-video-url-parser';
import VimeoPlayer from '../../components/VimeoPlayer';
import YoutubePlayer from '../../components/YoutubePlayer';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

class VimeoProjectVideos extends Component {
  constructor(props) {
    super(props);

    let {route} = this.props;
    const {object} = route.params;

    this.state = {
      title: '',
      projectId: '',
      isLoading: true,
      vimeoVideos: [],
      object: [],
      clinicVideo: [],
    };
  }

  componentDidMount() {
		console.error("porps 66 vimeoprojectvideos", this.props)
    let {route} = this.props;
    const {object} = route.params;

    console.log('Object', object);

    this.setState({title: object.node.name, object: object, isLoading: true});

    if (object.node.projectId != undefined) {
      this.setState({projectId: object.node.projectId}, () => {
        this.getProjectVideos();
      });
    } else {
      let videoList = object.node.videos.edges;
      this.setState({clinicVideo: videoList}, () => {
        this.setState({
          isLoading: false,
        });
      });
    }
  }
// https://api.vimeo.com/users/100800066/projects/${this.state.projectId}/videos?sort=last_user_action_event_date&page=1
  getProjectVideos() {
    fetch(
      `https://api.vimeo.com/users/100800066/projects/${this.state.projectId}/videos`,
      {
        method: 'GET',
        headers: new Headers({
          'Content-Type': 'application/vnd.vimeo.*+json',
          Authorization: 'Bearer 57fe5b03eac21264d45df680fb335a42',
        }),
      },
    )
      .then((res) => res.json())
      .then((res) => {
        console.log('getProjectVideos', res.data);
        this.setState({
          vimeoVideos: res.data,
          isLoading: false,
        });
      })
      .catch((err) => {
        Alert.alert('Information', 'Cannot load video project list.');
        this.setState({
          vimeoVideos: [],
          isLoading: false,
        });
      });
  }

  getVideoItem(video, index) {
    // console.log(JSON.stringify(video));
    let duration = DateHelper.convertSecondsToMinutes(video.duration);
    let description = video.description;
    let videoLiked = false;

    return (
      <View style={styles.scrollViewItem} key={index}>
        <TouchableOpacity
          onPress={() => {
            console.log('PlayingVideo', video);
            this.props.navigation.navigate('Playing Tutorial Video', {
              url: video.files[0].link,
              title: video.name,
              description: video.description,
              likes: 0,
              videoLiked: videoLiked,
            });
          }}>
          <Image
            style={{
              width: '100%',
              height: 200,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: 'rgba(0, 0, 0, 0.05)',
            }}
            source={{uri: video.pictures.sizes[3].link}}
          />
          <MaterialCommunityIcons
            style={styles.playIcon}
            name="play-circle"
            color={'#BEBEBE'}
            size={60}
          />
          <View style={{padding: 10}}>
            <View style={{flexDirection: 'row'}}>
              <Text
                style={{
                  color: '#FF8080',
                  fontSize: 12,
                  width: '50%',
                  textAlign: 'left',
                }}>
                Receptive Language
              </Text>
              <Text
                style={{
                  color: '#FF8080',
                  fontSize: 12,
                  width: '50%',
                  textAlign: 'right',
                }}>
                {duration}
              </Text>
            </View>
            <Text style={{color: '#63686E', fontSize: 18}}>{video.name}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  renderClinicVideoItem = (item, index) => {
    console.log('clinic video1===', item);

    let videoMetaData = UrlParser.parse(item.node.url);

    let videoHeight = ((screenWidth - 60) * 165) / 295;

    if (videoMetaData.provider == 'youtube') {
      // console.log("Render Youtube", item.node.url);
      return (
        <View style={styles.clinicCard} key={index}>
          <YoutubePlayer url={item.node.url} height={videoHeight} />
        </View>
      );
    } else {
      // console.log("Render Vimeo", item.node.url);
      return (
        <View style={styles.clinicCard} key={index}>
          <VimeoPlayer url={item.node.url} height={videoHeight} />
        </View>
      );
    }
  };

  render() {
    const {isLoading, vimeoVideos, clinicVideo, projectId} = this.state;
    console.log('abcde1===', clinicVideo);
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: Color.white}}>
        <NavigationHeader
          title={this.state.title}
          backPress={() => this.props.navigation.goBack()}
        />

        {isLoading && <LoadingIndicator />}
        {!isLoading && (
          <Container>
            <ScrollView contentInsetAdjustmentBehavior="automatic">
              <View style={[styles.tutorialVideos]}>
                {clinicVideo.length > 0
                  ? clinicVideo.map((video, index) =>
                      this.renderClinicVideoItem(video, index),
                    )
                  : vimeoVideos.map((video, index) =>
                      this.getVideoItem(video, index),
                    )}
              </View>
            </ScrollView>
          </Container>
        )}
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    height: 50,
    width: '95%',
  },
  backIcon: {
    fontSize: 50,
    fontWeight: 'normal',
    color: '#fff',
    width: '10%',
    paddingTop: 15,
    paddingLeft: 10,
  },
  backIconText: {
    fontSize: 20,
    fontWeight: 'normal',
    color: '#63686E',
  },
  headerTitle: {
    textAlign: 'center',
    width: '85%',
    fontSize: 22,
    paddingTop: 10,
    color: '#45494E',
    fontWeight: 'bold',
  },
  rightIcon: {
    fontSize: 50,
    fontWeight: 'normal',
    color: '#fff',
    width: '10%',
    paddingTop: 15,
    paddingRight: 10,
  },
  scrollView: {
    padding: 10,
    backgroundColor: '#FFFFFF',
    height: screenHeight,
  },
  scrollViewItem: {
    borderWidth: 0.1,
    backgroundColor: '#ffffff',
    // height: 210,
    // width: 300,
    // marginRight: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  // Tutorial videos
  tutorialVideos: {
    // padding: 10,
  },
  targetView: {
    paddingTop: 8,
    paddingBottom: 8,
    marginBottom: 20,
    borderColor: 'rgba(62, 123, 250, 0.05)',
  },
  targetText: {
    width: '90%',
    paddingBottom: 5,
    color: '#3E7BFA',
    fontSize: 13,
    fontWeight: '700',
    fontStyle: 'normal',
  },
  targetProgress: {
    height: 2,
    borderWidth: 1,
    borderColor: 'rgba(95, 95, 95, 0.1)',
  },
  targetProgressColor: {
    position: 'absolute',
    top: 32,
    width: '25%',
    height: 2,
    borderWidth: 1,
    borderColor: '#3E7BFA',
  },
  playIcon: {
    position: 'absolute',
    top: '35%',
    left: '40%',
  },
  clinicCard: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,

    backgroundColor: Color.white,
    padding: 8,
    margin: 3,
    marginVertical: 8,
    borderRadius: 5,
  },
});
const mapStateToProps = (state) => ({
  authResult: getAuthResult(state),
  authTokenPayload: getAuthTokenPayload(state),
});

const mapDispatchToProps = (dispatch) => ({
  dispatchSetToken: (data) => dispatch(setToken(data)),
  dispatchSetTokenPayload: (data) => dispatch(setTokenPayload(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(VimeoProjectVideos);
