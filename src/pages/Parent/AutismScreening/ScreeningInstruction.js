import 'react-native-gesture-handler';
import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Image,
  Text,
  TextInput,
  Alert,
  Linking,
  Dimensions,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from 'react-native';
import {WebView} from 'react-native-webview';
import Video from 'react-native-video';
import Color from '../../../utility/Color';
import Styles from '../../../utility/Style';
import DateHelper from '../../../helpers/DateHelper';
import Feather from 'react-native-vector-icons/Feather';
import TimelineView from '../../../components/TimelineView';
import Button from '../../../components/Button';
import NavigationHeader from '../../../components/NavigationHeader';

import {connect} from 'react-redux';
import {getAuthResult} from '../../../redux/reducers/index';
import {setToken, setTokenPayload} from '../../../redux/actions/index';
import TokenRefresher from '../../../helpers/TokenRefresher';
import NoData from '../../../components/NoData';
import moment from 'moment';
import OrientationHelper from '../../../helpers/OrientationHelper';
import {Row, Container, Column} from '../../../components/GridSystem';
import TherapistRequest from '../../../constants/TherapistRequest';
import ParentRequest from '../../../constants/ParentRequest';
import store from '../../../redux/store';
import VideoControl from '../../../components/VideoControl';
import SoundControl from '../../../components/SoundControl';
import {getStr} from '../../../../locales/Locale';
import VimeoPlayer from '../../../components/VimeoPlayer';
import LoadingIndicator from '../../../components/LoadingIndicator';
import SimpleModal from '../../../components/SimpleModal';

const screenWidth = Dimensions.get('window').width;

class ScreeningInstruction extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,

      menu: [
        {id: 'English', label: 'English'},
        {id: 'Hindi', label: 'हिंदी'},
      ],
      selectedLanguage: 'English',

      id: null,
      language: null,
      videoUrl: null,
      videoDescription: null,
      videoInstruction: null,
      videoIntro: null,
      audioUrl: null,
      audioDescription: null,
      scriptUrl: null,
      scriptDescription: null,
      introVisible: true,
      instructionVisible: false,
    };
  }

  _refresh() {
    this.componentDidMount();
  }

  componentDidMount() {

		console.log("props gbnfg f", this.props)
    //Call this on every page
    ParentRequest.setDispatchFunction(this.props.dispatchSetToken);
    this.getData();
  }

  getData() {
    this.setState({isLoading: true});
    let user = this.props.route.params.student ? this.props.route.params.student.node : store.getState().user.student;

    ParentRequest.screeningGetPreAssessVideos({
      language: this.state.selectedLanguage,
      student: user.id,
    })
      .then((dataResult) => {
        // console.log("screeningGetPreAssessVideos", dataResult);
        let edges = dataResult.data.getPreAssessVideos.edges;

        if (edges.length == 0) {
          throw new Error('Server Returning Zero Result');
        }

        let data = edges[0].node;

        // data.videoUrl = data.videoUrl.replace("static", "dj_static");
        // data.audioUrl = data.audioUrl.replace("static", "dj_static");
        // data.videoDescription = getStr("homeScreenAutism.ScreeningVideoInstruction");
        // data.audioDescription = getStr("homeScreenAutism.ScreeningAudioInstruction");
        // data.scriptDescription = getStr("homeScreenAutism.ScreeningScriptInstruction");

        this.setState(data);

        this.setState({
          isLoading: false,
        });

        console.log('Data', data);

        // this.getUrlData();
      })
      .catch((error) => {
        console.log(error);
        Alert.alert('Error', error.toString());
        this.setState({isLoading: false});
      });
  }

  getUrlData() {
    let user = store.getState().user.student;
    ParentRequest.screeningGetPreAssessInstruction({
      language: this.state.selectedLanguage,
      student: user.id,
    })
      .then((result) => {
        console.log('screeningGetPreAssessInstruction', result);
        let audioUrl = result.data.getScreeningFiles.audio;
        let scriptUrl = result.data.getScreeningFiles.transcript;
        let videoUrl = result.data.getScreeningFiles.video;

        audioUrl = audioUrl == '' ? null : audioUrl;
        scriptUrl = scriptUrl == '' ? null : scriptUrl;
        videoUrl = videoUrl == '' ? null : videoUrl;

        this.setState({audioUrl, scriptUrl, videoUrl});
      })
      .catch((error) => {
        console.log(error);
        Alert.alert('Error', error.toString());
        this.setState({isLoading: false});
      });
  }

  gotoScreeningVideo() {
    if (this.props.disableNavigation) {
      console.log('disableNavigation');
      let parentScreen = store.getState().autismScreening;
      if (parentScreen) {
        console.log('Parent Screen Exist');
        parentScreen.setState({activeNumber: 2, tabletView: 'video'});
      }
    } else {
      this.props.navigation.goBack();

      this.props.navigation.navigate('ScreeningVideo');
      setTimeout(() => {
      }, 1000);
    }
  }

  renderContent() {
    let videoHeight = ((screenWidth - 16 * 4) * 165) / 295;
    let modalVideoHeight = (300 * 165) / 295;
    return (
      <>
        <View style={{flexDirection: 'row'}}>
          {this.state.menu.map((lang, index) => {
            return (
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.menu}
                key={index}
                onPress={() => {
                  this.setState({selectedLanguage: lang.id}, () => {
                    this.getData();
                  });
                }}>
                <Text
                  style={
                    this.state.selectedLanguage == lang.id
                      ? styles.menuTextActive
                      : styles.menuText
                  }>
                  {lang.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <ScrollView>
          <View style={styles.box}>
            <Text style={styles.regularText}>
              {this.state.videoDescription}
            </Text>
            {/* {this.state.videoUrl && <VideoControl videoUrl={this.state.videoUrl} />} */}
            {this.state.videoUrl && (
              <VimeoPlayer url={this.state.videoUrl} height={videoHeight} />
            )}
            {/* <View>
                            <Video source={{ uri: this.state.videoUrl }}
                                volume={1}
                                // controls={true}
                                paused={false}
                                resizeMode='cover'
                                style={styles.video} />
                            <TouchableOpacity style={styles.videoControl}>
                                <View style={styles.videoControlCircle}>
                                    <Feather name='play' size={20} color='#fff' />
                                </View>
                            </TouchableOpacity>
                        </View> */}
          </View>
          <View style={styles.box}>
            <Text style={styles.regularText}>
              {this.state.audioDescription}
            </Text>
            {this.state.audioUrl && (
              <SoundControl audioUrl={this.state.audioUrl} />
            )}
            {/* <WebView
                            style={styles.audio}
                            javaScriptEnabled={true}
                            domStorageEnabled={true}
                            source={{ uri: this.state.audioUrl }} /> */}
          </View>
          <View style={styles.box}>
            <Text style={styles.regularText}>
              {this.state.scriptDescription}
            </Text>

            <TouchableOpacity
              style={styles.downloadButton}
              onPress={() => {
                Linking.openURL(this.state.scriptUrl);
              }}>
              <Text style={styles.downloadText}>Download Script</Text>
              <Feather name="download" size={20} color={Color.primary} />
            </TouchableOpacity>
          </View>
        </ScrollView>

        <SimpleModal
          visible={this.state.introVisible}
          onRequestClose={() => {
            // this.setState({ introVisible: false });
          }}>
          <Text style={styles.modalTitle}>Introduction</Text>
          <View style={styles.line} />
          <VimeoPlayer url={this.state.videoIntro} height={modalVideoHeight} />
          <Button
            labelButton="Next"
            style={{marginTop: 10}}
            onPress={() => {
              this.setState({introVisible: false, instructionVisible: true});
            }}
          />
          <Button
            labelButton="Back"
            theme="secondary"
            style={{marginTop: 10}}
            onPress={() => {
              this.props.navigation.goBack();
            }}
          />
        </SimpleModal>

        <SimpleModal
          visible={this.state.instructionVisible}
          onRequestClose={() => {
            // this.setState({ instructionVisible: false });
          }}>
          <Text style={styles.modalTitle}>Instruction</Text>
          <View style={styles.line} />
          <VimeoPlayer
            url={this.state.videoInstruction}
            height={modalVideoHeight}
          />
          <Button
            labelButton="Close"
            style={{marginTop: 10}}
            onPress={() => {
              this.setState({introVisible: false, instructionVisible: false});
            }}
          />
          <Button
            labelButton="Back"
            theme="secondary"
            style={{marginTop: 10}}
            onPress={() => {
              this.setState({introVisible: true, instructionVisible: false});
            }}
          />
        </SimpleModal>

        {OrientationHelper.getDeviceOrientation() == 'portrait' && (
          <Button
            labelButton="Video Assessment"
            onPress={() => {
              this.gotoScreeningVideo();
            }}
            style={{marginBottom: 10}}
          />
        )}
        {OrientationHelper.getDeviceOrientation() == 'landscape' && (
          <Row>
            <Column></Column>
            <Column>
              <Button
                labelButton="Record A Video"
                onPress={() => {
                  this.gotoScreeningVideo();
                }}
                style={{marginBottom: 10}}
              />
            </Column>
          </Row>
        )}
      </>
    );
  }

  render() {
    let {isLoading} = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <NavigationHeader
          title={"Video based Assessment Instruction"}
          enable={this.props.disableNavigation != true}
          backPress={() => this.props.navigation.goBack()}
        />

        {isLoading && <LoadingIndicator />}

        {!isLoading && (
          <Container enablePadding={this.props.disableNavigation != true}>
            {OrientationHelper.getDeviceOrientation() == 'portrait' && (
              <>{this.renderContent()}</>
            )}
            {OrientationHelper.getDeviceOrientation() == 'landscape' && (
              <>{this.renderContent()}</>
            )}
          </Container>
        )}
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.white,
    flex: 1,
  },
  menu: {
    marginRight: 10,
    marginVertical: 10,
  },
  menuText: {
    borderBottomColor: Color.white,
    borderBottomWidth: 2,
    color: Color.black,
    fontSize: 17,
    paddingVertical: 5,
  },
  menuTextActive: {
    borderBottomColor: Color.primary,
    borderBottomWidth: 2,
    color: Color.primary,
    fontSize: 17,
    paddingVertical: 5,
  },
  box: {
    borderWidth: 1,
    borderColor: Color.gray,
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  regularText: {
    fontSize: 15,
    color: '#63686E',
    marginBottom: 5,
  },

  audio: {
    height: 100,
    backgroundColor: '#fff',
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  downloadText: {
    fontSize: 18,
    color: Color.primary,
    marginRight: 10,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  line: {
    backgroundColor: Color.gray,
    marginVertical: 10,
    height: 1,
  },
});

const mapStateToProps = (state) => ({
  authResult: getAuthResult(state),
});

const mapDispatchToProps = (dispatch) => ({
  dispatchSetToken: (data) => dispatch(setToken(data)),
  dispatchSetTokenPayload: (data) => dispatch(setTokenPayload(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ScreeningInstruction);
