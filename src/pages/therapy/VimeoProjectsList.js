import React, {Component} from 'react';

import {
  Text,
  View,
  StyleSheet,
  Image,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
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
import Swiper from 'react-native-page-swiper';
import {error} from 'react-native-gifted-chat/lib/utils';
import TherapistRequest from '../../constants/TherapistRequest';

class VimeoProjectsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      vimeoProjects: [],
      clinicVideo: [],
      totalCount: 0,
      vimeoProjectDescriptions: [
        {
          description:
            'Components of behavior, environment and the ABC of the behavior.',
        },
        {description: 'Functions of behavior'},
        {description: 'Generalization, Incidental teaching, Token economy'},
        {description: 'Ethics, documentation and reporting'},
        {
          description:
            'Ethical Responsibility to the Field od behavior Analysis, society and client',
        },
        {description: '(No videos present)'},
        {
          description:
            'General description of verbal operants available in 3 languages(English, Hindi and Marathi)',
        },
        {
          description:
            'Guide to the different functionality offered in the tool',
        },
        {
          description:
            'Information regarding autism, how can it be used to develop language, and how cogniable can provide a helping hand.',
        },
        {
          description:
            'All the verbal operants and other important domains along with protocols',
        },
        {
          description:
            'All the verbal operants and other important domains along with protocols in hindi',
        },
        {description: ''},
        {description: ''},
        {description: ''},
        {description: ''},
        {description: ''},
        {description: ''},
      ],
    };
  }

  componentDidMount() {
		console.error("props vimeoprojetlist 90", this.props)
    const clinicVideo = this.props.route.params.clinicVideo;
    this.setState({clinicVideo: clinicVideo}, () => {
      this.fetchVimeoProjects();
    });
  }

  fetchVimeoProjects() {
    client
      .query({
        query: GetVimeoProjects,
      })
      .then((result) => {
        console.log( "fetched projects",  JSON.stringify(result));
        let descriptions = this.state.vimeoProjectDescriptions;
        let tempVimeoProjects = [];
        let vp = result.data.VimeoProject.edges;
				let vpLength = vp?.length;
				// console.error("group 1",result.data.getClinicLibrary.edges[0])
        result.data.getClinicLibrary.edges[0]?.node?.projectId && tempVimeoProjects.push(result.data.getClinicLibrary.edges[0]);
        result.data.getClinicLibrary.edges[1]?.node?.projectId &&tempVimeoProjects.push(result.data.getClinicLibrary.edges[1]);
        for (let index = 0; index < vpLength; index++) {
          const element = vp[index];
          element.node.description = descriptions[index].description;
          tempVimeoProjects.push(element);
          console.log('--------------------->' + JSON.stringify(element));
        }

        this.setState(
          {
            clinicVideo: [...this.state.clinicVideo, ...tempVimeoProjects],
          },
          () => {
            this.setState(
              {totalCount: Math.ceil(this.state.clinicVideo.length / 8)},
              () => {
                console.log('abcdesss===', this.state.totalCount);
                console.log('clinicVideo', this.state.clinicVideo);

                for (let i = 0; i <= this.state.totalCount; i++) {
                  let arrName = 'arr' + (i + 1);
                  this.setState({[arrName]: []});
                }
                setTimeout(() => {
                  let i = 1;

                  this.state.clinicVideo.map((item, index) => {
                    let arrName = 'arr' + i;

                    if (this.state[arrName].length <= 8) {
                      this.setState({
                        ['arr' + i]: [...this.state['arr' + i], item],
                      });
                    }
                    if (this.state[arrName].length == 8) {
                      i++;
                    }
                  });
                }, 1000);
              },
            );
          },
        );
      })
      .catch((error) => {
        console.log(JSON.stringify(error));
      });
  }

  getSwiperView = () => {

		console.error("state", this.state['arr' + (2 + 1)])
    var payments = [];
    for (let i = 0; i < this.state.totalCount; i++) {
      payments.push(
        <View style={styles.slide1} key={1}>
          <ScrollView contentInsetAdjustmentBehavior="automatic">
            <Container>
              <Text
                style={{fontSize: 16, color: Color.blackFont, marginTop: 10}}>
                  {getStr("TargetAllocate.Modules")}
              </Text>
              {this.state['arr' + (i + 1)] != undefined &&
                this.state['arr' + (i + 1)].map(
                  (project, index) => (
                    // console.log(project),
                    (
                      <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() => {
                          this.props.navigation.navigate('VimeoProjectVideos', {
                            // projectId: project.node.projectId,
                            // projectName: project.node.name,
                            object: project,
                            // clinicID :project.node.id
                          });
                        }}
                        key={index}>
                        <View style={styles.card}>
                          <Text
                            style={{
                              fontFamily: 'SF Pro Text',
                              fontStyle: 'normal',
                              fontWeight: '700',
                              fontSize: 16,
                              color: '#63686E',
                              marginBottom: 5,
                            }}>
                            {project.node.name}
                          </Text>
                          <Text
                            style={{
                              fontFamily: 'SF Pro Text',
                              fontStyle: 'normal',
                              fontWeight: 'normal',
                              fontSize: 16,
                              color: 'rgba(95, 95, 95, 0.75)',
                            }}>
                            {project.node.description}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    )
                  ),
                )}
            </Container>
          </ScrollView>
        </View>,
      );
    }
    return payments;
  };

  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: Color.white}}>
        <NavigationHeader
          title={getStr("TargetAllocate.TutorialVideos")}
          backPress={() => this.props.navigation.goBack()}
        />

        <Swiper style={styles.wrapper}>{this.getSwiperView()}</Swiper>
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
  wrapper: {},
  slide1: {
    flex: 1,
  },
  slide2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slide3: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#92BBD9',
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
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
  },
  scrollViewItem: {
    borderWidth: 0.1,
    backgroundColor: '#ffffff',
    // height: 210,
    // width: 300,
    marginRight: 10,
    borderRadius: 8,
  },
  // Tutorial videos
  tutorialVideos: {
    borderWidth: 0.5,
    marginBottom: 10,
    // padding: 10,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  card: {
    margin: 3,
    marginTop: 10,
    backgroundColor: Color.white,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
    paddingVertical: 10,
    paddingHorizontal: 10,
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
});
export default VimeoProjectsList;
