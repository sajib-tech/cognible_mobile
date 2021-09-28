/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import 'react-native-gesture-handler';
import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Image,
  FlatList,
  Text,
  Alert,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import Slider from '@react-native-community/slider';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {StackActions} from '@react-navigation/native'

import {ApolloProvider, Mutation} from 'react-apollo';
import {saveSessionFeedback} from '../../constants/index';
import Color from '../../utility/Color';
import NavigationHeader from '../../components/NavigationHeader';
import {Container} from '../../components/GridSystem';
import Button from '../../components/Button';
import TextInput from '../../components/TextInput';
import OrientationHelper from '../../helpers/OrientationHelper';
import {setToken} from '../../redux/actions';
import {connect} from 'react-redux';
import ParentRequest from '../../constants/ParentRequest';
import GraphqlErrorProcessor from '../../helpers/GraphqlErrorProcessor';

class SessionFeedbackScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSaving: false,
      pageTitle: '',
      fromPage: '',
      sliderValue: 1,
      feedback: '',
      sessionId: '',
      childSeesionId: '',
      studentId: '',
    };
    this.gotoSessionSummary = this.gotoSessionSummary.bind(this);
    this.goBack = this.goBack.bind(this);
  }

  goBack() {
    this.props.navigation.goBack();
  }

  componentDidMount() {
    let {route, isFromTab} = this.props;

    if (route && route.params !== undefined)
      this.setState({studentId: this.props.route.params.studentId});
    if (route && route.params !== undefined) {
      if (isFromTab != undefined) {
        this.setState(
          {
            pageTitle: this.props.route.params.pageTitle,
            fromPage: this.props.route.params.fromPage,
            sessionId: this.props.route.params.sessionId,
            childSeesionId: this.props.route.params.childSeesionId,
          },
          () => {
            ParentRequest.setDispatchFunction(this.props.dispatchSetToken);
            this.getFeedbackData();
            if (OrientationHelper.getDeviceOrientation() == 'landscape') {
              if (this.props.disableNavigation) {
                this.props.navigation.replace("StudentDetail")
              } else {
                this.props.navigation.goBack();
                this.gotoSessionSummary();
              }
            }
          },
        );
        // 
      } else {
        this.setState(
          {
            pageTitle: route.params.pageTitle,
            fromPage: route.params.fromPage,
            sessionId: route.params.sessionId,
            childSeesionId: route.params.childSeesionId,
          },
          () => {
            ParentRequest.setDispatchFunction(this.props.dispatchSetToken);
            this.getFeedbackData();
            if (OrientationHelper.getDeviceOrientation() == 'landscape') {
              if (this.props.disableNavigation) {
                this.props.navigation.replace("StudentDetail")
              } else {
                this.props.navigation.goBack();
                this.gotoSessionSummary();
              }
            }
          },
        );
      }
    }
  }

  gotoSessionSummary() {
    let {navigation} = this.props;
    navigation.navigate('SessionSummaryScreen', {
      pageTitle: this.state.pageTitle,
      fromPage: this.state.fromPage,
      sessionId: this.state.sessionId,
      childSeesionId: this.state.childSeesionId,
      studentId: this.state.studentId,
    });
  }

  getFeedbackData() {
    let {route} = this.props;
    let queryParams = {
      id: this.state.childSeesionId,
    };
    ParentRequest.getSessionFeedback(queryParams)
      .then((res) => {
        console.log('Returned feedback --->' + JSON.stringify(res.data));
        let data = res.data;
        this.setState({
          feedback: data.childSessionDetails.feedback
            ? data.childSessionDetails.feedback
            : '',
          sliderValue: data.childSessionDetails.rating
            ? data.childSessionDetails.rating
            : 1,
        });
      })
      .catch((err) => {
        console.log('Err', GraphqlErrorProcessor.process(err));
      });
  }

  sendFeedback() {
    console.log("navigation =-=-=-=-==-==-=-=-=-", this.props)
    if(this.state.feedback.length>750){
      return
    }
    this.setState({isSaving: true});
    if(OrientationHelper.getDeviceOrientation() === "portrait") {
    let queryParams = {
      pk: this.state.childSeesionId,
      feedback: this.state.feedback ? this.state.feedback : '',
      rating: this.state.sliderValue ? this.state.sliderValue : 0,
    };

    console.log('queryParams for feed back --->', queryParams);

    ParentRequest.saveSessionFeedback(queryParams)
      .then((res) => {
        console.log("res", res)
        this.setState({isSaving: false});
        Alert.alert(
          'Session Feedback',
          'Thank you for your feedback',
          [
            {
              text: 'OK',
              onPress: () => {
                console.log('OK Pressed');
                if (OrientationHelper.getDeviceOrientation() == 'portrait') {
                  this.gotoSessionSummary();
                } 
              },
            },
          ],
          {cancelable: false},
        );
      })
      .catch((err) => {
        alert('Information error', GraphqlErrorProcessor.process(err));
        this.setState({isSaving: false});
      });
    } else {
      let queryParams = {
        pk: this.props.childSeesionId,
        feedback: this.state.feedback ? this.state.feedback : '',
        rating: this.state.sliderValue ? this.state.sliderValue : 0,
      };

      ParentRequest.saveSessionFeedback(queryParams)
      .then((res) => {
        console.log("res", res)
        this.setState({isSaving: false});
        Alert.alert(
          'Session Feedback',
          'Thank you for your feedback',
          [
            {
              text: 'OK',
              onPress: () => {
                console.log('OK Pressed');
               this.props.onOkPress()

              },
            },
          ],
          {cancelable: false},
        );
      })
      .catch((err) => {
        alert('Information error', GraphqlErrorProcessor.process(err));
        this.setState({isSaving: false});
      });
    }
      // 
  }

  render() {
    console.log("child session id session feedback", this.props)
    return (
      <SafeAreaView style={{backgroundColor: Color.white, flex: 1}}>
        {this.props.isFromTab == undefined && (
          <NavigationHeader
            title="Session Feedback"
            backPress={() => {
              this.props.navigation.goBack();
            }}
          />
        )}
        {/* Header */}
        <Container>
          <ScrollView contentInsetAdjustmentBehavior="automatic">
            <Text style={styles.title}>Upload Video for Evaluation</Text>
            <View style={styles.videoInputView}>
              <Text style={styles.startText}>Browse Files</Text>
            </View>
            <Text style={styles.title}>Session Feedback</Text>
            <TextInput
              placeholder={'Write Something ...'}
              numberOfLines={8}
              multiline={true}
              value={this.state.feedback}
              onChangeText={(feedback) => {
                this.setState({feedback});
              }}
            />
            <View style={{flexDirection:'row-reverse'}}>
                <Text style={{color:this.state.feedback.length>750?'red':Color.grayDarkFill}}>{this.state.feedback.length}/750</Text>

            </View>
            <View style={{flexDirection: 'row'}}>
              <Text style={[styles.title, {flex: 1}]}>
                Did you like this session?
              </Text>
              <Text style={styles.sliderValue}>{this.state.sliderValue}</Text>
            </View>
            <View style={styles.mainContainer}>
              <Slider
                maximumValue={10}
                minimumValue={0}
                minimumTrackTintColor="#307ecc"
                maximumTrackTintColor="#000000"
                step={1}
                value={this.state.sliderValue}
                onValueChange={(sliderValue) => this.setState({sliderValue})}
              />
            </View>
          </ScrollView>

          <Button
            style={{marginVertical: 10}}
            onPress={() => {
              this.sendFeedback();
            }}
            isLoading={this.state.isSaving}
            labelButton="Complete Session"
          />
        </Container>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#ecf0f1',
    padding: 10,
  },
  title: {
    fontSize: 18,
    color: '#45494E',
    marginTop: 10,
  },
  sliderValue: {
    fontSize: 20,
    marginTop: 10,
    color: Color.primary,
  },

  content: {
    flex: 1, // Take up all available space
    justifyContent: 'center', // Center vertically
    alignItems: 'center', // Center horizontally
    color: 'black',
    borderWidth: 1,
  },
  continueViewTouchable: {
    marginTop: 28,
    paddingTop: 10,
    paddingBottom: 10,
    marginLeft: 12,
    marginRight: 12,
    marginBottom: 15,
    backgroundColor: '#1E90FF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff',
  },
  continueView: {
    marginVertical: 10,
  },
  continueViewText: {
    color: '#fff',
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  mainContainer: {
    marginTop: 10,
  },
  feedbackInput: {
    borderWidth: 1,
    borderColor: Color.gray,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    height: 130,
    textAlignVertical: 'top',
    padding: 16,
  },
  videoInputView: {
    padding: 25,
    borderStyle: 'dashed',
    height: 130,
    borderWidth: 1,
    borderRadius: 1,
    marginVertical: 16,
    backgroundColor: '#F8F8F8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  startText: {
    color: Color.blackFont,
    fontFamily: 'SF Pro Text',
    fontSize: 16,
  },
});

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => ({
  dispatchSetToken: (data) => dispatch(setToken(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SessionFeedbackScreen);
