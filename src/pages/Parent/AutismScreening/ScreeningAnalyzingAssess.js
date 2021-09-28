import React, {Component} from 'react';

import {
  Text,
  View,
  TextInput,
  StyleSheet,
  Image,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Color from '../../../utility/Color';
import NavigationHeader from '../../../components/NavigationHeader';
import OrientationHelper from '../../../helpers/OrientationHelper';
import {Row, Container, Column} from '../../../components/GridSystem';
import StudentHelper from '../../../helpers/StudentHelper';
import {getStr} from '../../../../locales/Locale';

class ScreeningAnalyzingAssess extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    //This screen only shown on mobile.
  }

  changeToInstruction() {
    // this.props.navigation.goBack();

    setTimeout(() => {
      this.props.navigation.navigate('ScreeningInstruction', {
        student: this.props.route.params.student
      });
    }, 1000);
  }

  // {
  //     name: "Functional Video Assessment Result",
  //     duration: '8-10 Mins',
  //     description:
  //       getStr('homeScreenAutism.ScreeningDesc') +
  //       studentName +
  //       getStr('homeScreenAutism.ScreenDesc'),
  //     tabletView: 'result',
  //     text: getStr('NewChanges.viewResult'),
  //     active: (
  //       <Text style={{color: Color.blueFill}}>
  //         {getStr('NewChanges.viewResult')}{' '}
  //         <MaterialCommunityIcons
  //           name="arrow-right"
  //           size={20}
  //           color={Color.blueFill}
  //         />
  //       </Text>
  //     ),
  //     done: (
  //       <Text style={{color: Color.greenFill}}>
  //         <MaterialCommunityIcons
  //           name="check"
  //           size={20}
  //           color={Color.greenFill}
  //         />{' '}
  //         {getStr('NewChanges.viewResult')}
  //       </Text>
  //     ),
  //   },

  render() {
    let studentName
    if(this.props.route.params.student) {
      studentName = this.props.route.params.student.node.firstname
    } else {

      studentName = StudentHelper.getStudentName();
    }
    return (
      <SafeAreaView style={{backgroundColor: Color.white, flex: 1}}>
        <NavigationHeader
          title="Analyzing Assessment"
          backPress={() => this.props.navigation.goBack()}
        />
        <ScrollView contentInsetAdjustmentBehavior="automatic">
          <Container>
            <Image
              source={require('../../../../android/img/autism-screening.jpeg')}
              style={styles.thumbnail}
            />

            <Text style={styles.upcomingNext}>Upcoming Next</Text>
            <TouchableOpacity
              style={styles.assessmentView}
              activeOpacity={0.8}
              onPress={() => {
                this.changeToInstruction();
              }}>
              <Text style={styles.step}>STEP 3 . 8 - 10 MIN</Text>
              <Text style={styles.title}>Video based Assessment</Text>
              <Text style={styles.description}>
                Engage with {studentName} as prescribed by the script while
                recording the whole activity
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.assessmentView} activeOpacity={0.8}>
              <Text style={styles.step}>STEP 4 . 8 - 10 MIN</Text>
              <Text style={styles.title}>Record a Video</Text>
              <Text style={styles.description}>
                Engage with {studentName} as prescribed by the script while
                recording the whole activity
              </Text>
            </TouchableOpacity>
          </Container>
        </ScrollView>
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  thumbnail: {
    width: '100%',
    height: 200,
  },

  wrapper: {
    flex: 1,
    backgroundColor: '#ecf0f1',
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    height: 50,
    width: '100%',
  },
  backIcon: {
    fontSize: 50,
    fontWeight: 'normal',
    color: '#fff',
    width: '10%',
    paddingTop: 15,
  },
  backIconText: {
    fontSize: 20,
    fontWeight: 'normal',
    color: '#63686E',
  },
  headerTitle: {
    textAlign: 'center',
    width: '80%',
    fontSize: 22,
    paddingTop: 10,
    color: '#45494E',
  },

  assessmentView: {
    padding: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
    marginBottom: 10,
  },
  upcomingNext: {
    fontFamily: 'SF Pro Text',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 16,
    color: 'rgba(95, 95, 95, 0.75)',
    marginVertical: 16,
  },
  step: {
    paddingBottom: 10,
    fontFamily: 'SF Pro Text',
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: 13,
    color: '#63686E',
  },
  title: {
    paddingBottom: 10,
    fontFamily: 'SF Pro Text',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 19,
    color: '#45494E',
  },
  description: {
    fontFamily: 'SF Pro Text',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: 14,
    color: 'rgba(95, 95, 95, 0.75)',
  },
});
export default ScreeningAnalyzingAssess;
