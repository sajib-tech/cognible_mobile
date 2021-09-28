import React, {Component} from 'react';
import {
  Text,
  View,
  Alert,
  StyleSheet,
  Image,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Platform,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import RNFetchBlob from 'rn-fetch-blob';
import Video from 'react-native-video';
import {WebView} from 'react-native-webview';
import {connect} from 'react-redux';
import {getAuthResult} from '../../../redux/reducers/index';
import {setToken, setTokenPayload} from '../../../redux/actions/index';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Fontisto from 'react-native-vector-icons/Fontisto';

import Feather from 'react-native-vector-icons/Feather';
import OrientationHelper from '../../../helpers/OrientationHelper';
import {Row, Container, Column} from '../../../components/GridSystem';
import TherapistRequest from '../../../constants/TherapistRequest';
import ParentRequest from '../../../constants/ParentRequest';
import Button from '../../../components/Button';
import NavigationHeader from '../../../components/NavigationHeader';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import Color from '../../../utility/Color';
import axios from 'axios';
import qs from 'qs';
import store from '../../../redux/store';
import StringHelper from '../../../helpers/StringHelper';
import Mime from 'mime-types';
import VideoControl from '../../../components/VideoControl';
import {getStr} from '../../../../locales/Locale';

class ScreeningVideo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      videoList: [
        //{ name: 'asldkjalsdkjaklsdj.mp4', id: 1, uploadPercentage: 78, uri: "http://application.cogniable.us/static/preliminary_assess/sample.mp4" }
      ],
      isSubmitVideos: false,

      showVideo: false,
      currentVideoUrl: null,
      canSubmitVideo: true,
    };

    this.uploadUrl = null;
    this.params = this.props.route.params;
    console.log('Params', this.params);
  }

  componentDidMount() {
    console.log("student", this.props)
    let assessmentId = store.getState().assessmentData;
    console.log('assid', assessmentId);
    ParentRequest.setDispatchFunction(this.props.dispatchSetToken);

    if (this.params) {
      this.setState({
        videoList: [
          {
            name: StringHelper.baseName(this.params.video),
            path: '',
            uri: this.params.video,
            url: this.params.video,
            id: this.params.id,
            uploadPercentage: 100,
            data: {},
            status: 'OK',
          },
        ],
        canSubmitVideo: false,
      });
    }
  }

  addVideo(data) {
    console.log('Data', data);
    let videoList = this.state.videoList;

    let videoPath = null;
    if (Platform.OS == 'android') {
      videoPath = 'file://' + data.path;
    } else {
      videoPath = data.uri;
    }

    // let videoPath = (Platform.OS === 'android') ? data.uri : data.uri.replace('file://', '');

    //let videoPath = data.uri;

    let baseName = StringHelper.baseName(videoPath);

    let vid = {
      name: baseName,
      path: videoPath,
      uri: videoPath,
      uploadPercentage: 0,
      id: Math.floor(Math.random() * 10000000),
      data: {},
      status: 'UPLOAD',
    };
    console.log('Add New Video', vid);
    videoList.push(vid);

    let length = videoList.length;

    this.setState({videoList}, () => {
      this.uploadVideo(length - 1);
    });
  }

  removeVideo(index) {
    Alert.alert(
      'Warning',
      'Are you sure want to delete this video ?',
      [
        {text: 'No', onPress: () => {}, style: 'cancel'},
        {
          text: 'Yes',
          onPress: () => {
            let videoList = this.state.videoList;
            let video = videoList[index];
            //video.cancel()

            videoList.splice(index, 1);
            this.setState({videoList});
          },
        },
      ],
      {cancelable: false},
    );
  }

  getBucketSignedUrl(fileName) {
    let url = 'https://application.cogniable.us/apis/buckets/s3/signed-url/';
    let params = {
      key: 'assessment_videos/' + fileName,
    };
    return axios.post(url, qs.stringify(params));
  }

  sendVideo(video, data) {
    console.log('Video', video);

    let videoPath =
      Platform.OS === 'android' ? video.uri : video.uri.replace('file://', '');
    let baseName = StringHelper.baseName(videoPath);

    console.log('Data', data);
    let url = this.uploadUrl;
    let mime = Mime.lookup(baseName);
    if (mime == false) {
      mime = 'video/mp4';
    }
    let uploadParams = [
      {name: 'key', data: data.key},
      {name: 'x-amz-algorithm', data: data['x-amz-algorithm']},
      {name: 'x-amz-credential', data: data['x-amz-credential']},
      {name: 'x-amz-date', data: data['x-amz-date']},
      {name: 'policy', data: data.policy},
      {name: 'x-amz-signature', data: data['x-amz-signature']},
      {
        name: 'file',
        filename: baseName,
        type: mime,
        data: RNFetchBlob.wrap(videoPath),
      },
    ];
    console.log('Upload Params', uploadParams);

    RNFetchBlob.fetch(
      'POST',
      url,
      {
        'Content-Type': 'multipart/form-data',
      },
      uploadParams,
    )
      .uploadProgress((written, total) => {
        let videoList = this.state.videoList;
        videoList = videoList.map((vd) => {
          if (vd.id == video.id) {
            vd.uploadPercentage = Math.round((written / total) * 100);
          }
          return vd;
        });
        this.setState({videoList});

        console.log('uploaded', video.name, written / total);
      })
      .then((response) => {
        let videoList = this.state.videoList;
        videoList = videoList.map((vd) => {
          if (vd.id == video.id) {
            if (response.respInfo.status == 204) {
              vd.status = 'OK';
            }
            vd.uploadPercentage = 100;
          }
          return vd;
        });
        this.setState({videoList});
      })
      .catch((err) => {
        let videoList = this.state.videoList;
        videoList = videoList.map((vd) => {
          if (vd.id == video.id) {
            vd.uploadPercentage = 0;
            vd.status = 'ERROR';
          }
          return vd;
        });
        this.setState({videoList});

        console.log('Upload Error', err);
      });
  }

  uploadVideo(index) {
    let videoList = this.state.videoList;
    let video = videoList[index];
    video.status = 'UPLOAD';
    videoList[index] = video;
    this.setState({videoList});

    console.log('upload video', video);

    let videoPath =
      Platform.OS === 'android' ? video.uri : video.uri.replace('file://', '');
    let baseName = StringHelper.baseName(videoPath);

    let url = 'https://application.cogniable.us/apis/upload-file/';
    let mime = Mime.lookup(baseName);
    if (mime == false) {
      mime = 'video/mp4';
    }
    let uploadParams = [
      {
        name: 'file',
        filename: baseName,
        type: mime,
        data: RNFetchBlob.wrap(videoPath),
      },
    ];
    console.log('Upload Params', uploadParams);

    RNFetchBlob.fetch(
      'POST',
      url,
      {
        'Content-Type': 'multipart/form-data',
      },
      uploadParams,
    )
      .uploadProgress((written, total) => {
        let videoList = this.state.videoList;
        videoList = videoList.map((vd) => {
          if (vd.id == video.id) {
            vd.uploadPercentage = Math.round((written / total) * 100);
          }
          return vd;
        });
        this.setState({videoList});

        console.log('uploaded', video.name, written / total);
      })
      .then((response) => {
        console.log('Response', response);
        let videoRespData = JSON.parse(response.data);
        let videoList = this.state.videoList;
        videoList = videoList.map((vd) => {
          if (vd.id == video.id) {
            if (response.respInfo.status == 200) {
              vd.status = 'OK';
            }
            vd.uploadPercentage = 100;
            vd.url = videoRespData.fileUrl;
          }
          return vd;
        });
        this.setState({videoList});
      })
      .catch((err) => {
        let videoList = this.state.videoList;
        videoList = videoList.map((vd) => {
          if (vd.id == video.id) {
            vd.uploadPercentage = 0;
            vd.status = 'ERROR';
          }
          return vd;
        });
        this.setState({videoList});

        console.log('Upload Error', err);
      });

    /*
        this.getBucketSignedUrl(video.name).then((result) => {
            let data = result.data.fields;
            this.uploadUrl = result.data.url;
            console.log("getBucketSignedUrl", result.data);

            videoList = this.state.videoList.map((vd) => {
                if (vd.id == video.id) {
                    vd.data = data;
                }
                return vd;
            });

            this.setState({ videoList }, () => {
                this.sendVideo(video, data);
            });
        }).catch((err) => {
            console.log(err);
            Alert.alert("Warning", "Oops. cannot get signed URL.\n" + err.toString());
        });
        */
  }

  startRecording() {
    let options = {
      title: 'Record a Video',
      mediaType: 'video',
      // customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
   launchCamera(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = {uri: response.uri};

        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };

        this.addVideo(response);
      }
    });
  }

  uploadFromLibrary() {
    let options = {
      title: 'Record a Video',
      mediaType: 'video',
      // customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
      storageOptions: {
        skipBackup: true,
        path: 'images',
        cameraRoll: true,
        waitUntilSaved: true,
      },
    };
   launchImageLibrary(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = {uri: response.uri};

        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };

        this.addVideo(response);
      }
    });
  }

  gotoNextScreen() {
    if (this.props.disableNavigation) {
    } else {
      this.props.navigation.goBack();

      setTimeout(() => {
        this.props.navigation.navigate('ScreeningAnalyzingVideo');
      }, 1000);
    }

    let parentScreen = store.getState().autismScreening;
    if (parentScreen) {
      // parentScreen.setState({ activeNumber: 3, tabletView: 'result' });
      parentScreen.getData();
    }
  }

  submitVideos() {
    this.setState({isSubmitVideos: true});

    let assessmentId = store.getState().assessmentData;
    // let assessmentId = "UHJlbGltaW5hcnlBc3Nlc3NtZW50VHlwZTo3OQ==";

    let array = this.state.videoList.map((video) => {
      let queryString = {
        id: assessmentId,
        videoUrl: video.url,
      };
      console.log(queryString);
      return ParentRequest.screeningSubmitVideos(queryString);
    });

    Promise.all(array)
      .then((result) => {
        this.setState({isSubmitVideos: false});

        Alert.alert(
          'Information',
          'Submited Video Successfully',
          [
            {
              text: 'Ok',
              onPress: () => {
                this.gotoNextScreen();
              },
            },
          ],
          {cancelable: false},
        );
      })
      .catch((err) => {
        console.log('Error', err);
        Alert.alert('Error', 'Cannot Submit Videos');
        this.setState({isSubmitVideos: false});
      });
  }

  render() {
    let canUpload = false;
    if (this.state.videoList.length != 0) {
      canUpload = true;
      this.state.videoList.forEach((vid) => {
        if (vid.status != 'OK') {
          canUpload = false;
        }
      });
    }

    return (
      <SafeAreaView style={styles.container}>
        <NavigationHeader
          title={"Video based assessments"}
          enable={this.props.disableNavigation != true}
          backPress={() => this.props.navigation.goBack()}
        />

        <Container enablePadding={this.props.disableNavigation != true}>
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={styles.scrollView}>
            <View style={styles.descriptionWrapper}>
              <Text style={styles.descriptionText}>
                {getStr('homeScreenAutism.VideoDescription')}
              </Text>
            </View>

            {this.state.canSubmitVideo && (
              <View style={styles.videoInputView}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    this.startRecording();
                  }}>
                  <Text style={styles.startText}>
                    <FontAwesome5
                      name={'video'}
                      style={{fontSize: 16, color: '#3E7BFA'}}
                    />{' '}
                    Start Recording
                  </Text>
                </TouchableOpacity>
                <Text style={{textAlign: 'center'}}>Or</Text>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    this.uploadFromLibrary();
                  }}>
                  <Text style={styles.uploadFromText}>
                    Upload Video from Gallery
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            <View>
              {this.state.videoList.map((video, index) => {
                let html = `
                                <html>
                                <head>
                                <meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" name="viewport"/>
                                <meta name='apple-mobile-web-app-capable' content='yes' />
                                </head>
                                <body style='background: #ddd;margin:0;padding:0'>
                                    <video width="140" height="100" preload="auto">
                                        <source src="${video.uri}" type="video/mp4">
                                    </video>
                                </body>
                                </html>
                                        `;

                // console.log(video.uri);
                return (
                  <TouchableOpacity
                    style={styles.videoBox}
                    key={index}
                    activeOpacity={1}
                    onPress={() => {
                      if (video.status == 'ERROR') {
                        this.uploadVideo(index);
                      }
                    }}>
                    <View style={{}}>
                      {/* <WebView
                                                style={{ width: 140, height: 100 }}
                                                javaScriptEnabled={true}
                                                domStorageEnabled={true}
                                                source={{ html: html }} /> */}
                      {/* <Video source={{ uri: video.uri }}
                                                volume={0}
                                                paused={true}
                                                resizeMode='cover'
                                                style={styles.backgroundVideo} /> */}
                      <TouchableOpacity
                        onPress={() => {
                          this.setState({
                            showVideo: true,
                            currentVideoUrl: video.uri,
                          });
                        }}
                        style={styles.backgroundVideo}>
                        <Video
                          source={{uri: video.uri}}
                          volume={0}
                          paused={true}
                          resizeMode="cover"
                          style={{width: '100%', height: '100%'}}
                        />
                        <View
                          style={{
                            width: '100%',
                            height: '100%',
                            position: 'absolute',
                            justifyContent: 'center',
                            alignItems: 'center',
                            top: 0,
                            left: 0,
                          }}>
                          <Fontisto name="play" size={20} color={Color.black} />
                        </View>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.videoContent}>
                      <View style={{flexDirection: 'row'}}>
                        <Text
                          style={styles.videoTitle}
                          numberOfLines={1}
                          ellipsizeMode="middle">
                          {video.name}
                        </Text>
                        {this.state.canSubmitVideo && (
                          <TouchableOpacity
                            style={{marginLeft: 10}}
                            onPress={() => {
                              this.removeVideo(index);
                            }}>
                            <Feather
                              name="trash"
                              size={20}
                              color={Color.danger}
                            />
                          </TouchableOpacity>
                        )}
                      </View>
                      {video.status == 'UPLOAD' && (
                        <Text style={styles.uploadingText}>
                          Uploading... {video.uploadPercentage}%
                        </Text>
                      )}
                      {video.status == 'OK' && (
                        <Text style={styles.uploadingSuccessText}>
                          Upload Success
                        </Text>
                      )}
                      {video.status == 'ERROR' && (
                        <Text style={styles.uploadingErrorText}>
                          Error. Touch to Reupload
                        </Text>
                      )}

                      <View style={styles.barPercentage}>
                        <View
                          style={[
                            styles.barPercentageActive,
                            {width: video.uploadPercentage + '%'},
                          ]}
                        />
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
          {canUpload && (
            <>
              {OrientationHelper.getDeviceOrientation() == 'portrait' && (
                <>
                  {this.state.canSubmitVideo && (
                    <Button
                      isLoading={this.state.isSubmitVideos}
                      labelButton="Submit Videos"
                      onPress={() => {
                        this.submitVideos();
                      }}
                      style={{marginBottom: 10}}
                    />
                  )}
                </>
              )}
              {OrientationHelper.getDeviceOrientation() == 'landscape' && (
                <Row>
                  <Column></Column>
                  <Column>
                    {this.state.canSubmitVideo && (
                      <Button
                        isLoading={this.state.isSubmitVideos}
                        labelButton="Submit Videos"
                        onPress={() => {
                          this.submitVideos();
                        }}
                        style={{marginBottom: 10}}
                      />
                    )}
                  </Column>
                </Row>
              )}
            </>
          )}

          <Modal
            animationType="fade"
            transparent={true}
            visible={this.state.showVideo}
            onRequestClose={() => {
              this.setState({showVideo: false});
            }}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => {
                this.setState({showVideo: false});
              }}
              style={styles.modalRoot}>
              <View style={styles.modalContent}>
                <VideoControl videoUrl={this.state.currentVideoUrl} />
              </View>
            </TouchableOpacity>
          </Modal>
        </Container>
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  descriptionWrapper: {
    backgroundColor: Color.primaryTransparent,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginVertical: 10,
    borderRadius: 5,
  },
  descriptionText: {
    color: Color.white,
  },
  videoBox: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Color.gray,
    marginTop: 10,
  },
  videoContent: {
    padding: 8,
    flex: 1,
  },
  videoTitle: {
    flex: 1,
    fontSize: 16,
    color: '#45494E',
  },
  uploadingText: {
    fontSize: 14,
    color: '#888',
    marginBottom: 4,
  },
  uploadingSuccessText: {
    fontSize: 14,
    color: Color.success,
    marginBottom: 4,
  },
  uploadingErrorText: {
    fontSize: 14,
    color: Color.danger,
    marginBottom: 4,
  },
  barPercentage: {
    backgroundColor: '#f1f5ff',
    height: 3,
    borderRadius: 1,
  },
  barPercentageActive: {
    backgroundColor: Color.primary,
    height: 3,
    borderRadius: 1,
  },
  backgroundVideo: {
    width: 100,
    height: 70,
    borderRadius: 4,
    backgroundColor: Color.white,
  },

  videoInputView: {
    padding: 25,
    borderStyle: 'dashed',
    height: 240,
    borderWidth: 1,
    borderRadius: 1,
  },
  startText: {
    marginLeft: 30,
    marginTop: 30,
    marginRight: 30,
    marginBottom: 20,
    padding: 20,
    textAlign: 'center',
    backgroundColor: 'rgba(62, 123, 250, 0.075)',
    borderRadius: 8,
    color: '#3E7BFA',
    fontFamily: 'SF Pro Text',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 19,
  },
  uploadFromText: {
    textDecorationLine: 'underline',
    color: 'rgba(95, 95, 95, 0.75)',
    paddingTop: 20,
    textAlign: 'center',
    fontFamily: 'SF Pro Text',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: 16,
  },
  modalRoot: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  modalContent: {
    width: 300,
    padding: 16,
    borderRadius: 5,
    backgroundColor: Color.white,
  },
});

const mapStateToProps = (state) => ({
  authResult: getAuthResult(state),
});

const mapDispatchToProps = (dispatch) => ({
  dispatchSetToken: (data) => dispatch(setToken(data)),
  dispatchSetTokenPayload: (data) => dispatch(setTokenPayload(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ScreeningVideo);
