import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import moment from 'moment';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Color from '../../utility/Color';
import store from '../../redux/store';
import {
  client,
  getAreaList,
  getAreasList,
  getMilestoneGroups,
} from '../../constants/therapist';
import TherapistRequest from '../../constants/TherapistRequest';
import Button from '../Button';
class ActiveAssessmentCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      areaID: '',
    };
  }

  componentDidMount() {
    this.getTTargets();
  }

  getTTargets() {
    TherapistRequest.getAreaList()
      .then((result) => {
        this.setState({areaID: result.data.vbmappAreas[0].id});
      })
      .catch((error) => {
        console.log('error===', error);
      });
  }

  deleteAssessment(id) {
    Alert.alert('Information', 'Are you sure ?', [
      {text: 'No', onPress: () => {}, style: 'cancel'},
      {
        text: 'Yes',
        onPress: () => {
          let variables = {
            id,
          };
          console.log('variable>>>', variables);
          TherapistRequest.deleteVBMAPPAssessment(variables)
            .then((result) => {
              console.log('result>>>', result, this.props);
              Alert.alert('Information', 'Assessment Successfully Deleted!!.');
              let parentScreen = store.getState().assessmentsList;
              if (parentScreen) {
                parentScreen._refresh();
              }
              //   this.props.navigation.goBack();
              this.getTTargets();
              //   setTimeout(() => {
              // 	this.props.getData()
              //   }, 500);
            })
            .catch((error) => {
              console.log('error>>', error);
            });
        },
      },
    ]);
  }

  render() {
    const {
      master,
      testNo,
      student,
      program,
      milestones,
      barriers,
      transition,
      eesa,
    } = this.props;
    const {areaID} = this.state;
    console.log('card data>>>>>', this.props);
    let outputDate = moment(this.props.timestamp).format('MMMM DD, YYYY');
    return (
      <View style={styles.container}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Text style={styles.heading}>Assessment {this.props.testNo}</Text>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <TouchableOpacity
            style={{marginRight: 5}}
            onPress={() => {
              this.deleteAssessment(master);
            }}>
            <MaterialCommunityIcons
              name="delete"
              size={20}
              color={Color.gray}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{marginRight: 5}}
            onPress={() => {
              console.log("info pressed");
              this.props.navigation.navigate('VbmappToc', {
                master: master,
                testNo: testNo,
                student: student,
                program: program,
                programID: areaID,
              })
            }}>
            <MaterialCommunityIcons name='information-outline' size={20} color={Color.primary} />
          </TouchableOpacity>
          </View>
          
          
        </View>
        <Text style={styles.subText}>
         {outputDate}
        </Text>
        <View style={{...styles.stats,marginTop:5}}>
          <Text style={styles.stat}>Milestones: {this.props.milestones}</Text>
          <Text style={styles.stat}>Barriers: {this.props.barriers}</Text>
          
        </View>
        <View style={styles.stats}>
          
          <Text style={styles.stat}>EESA: {this.props.eesa}</Text>
          <Text style={styles.stat}>Transitions: {this.props.transition}</Text>
        </View>
        <Button
          theme="secondary"
          labelButton="Continue Assessment"
          onPress={() => {
            this.props.navigation.navigate('AreasList', {
              student: this.props.student,
              master: this.props.master,
              test: this.props.testNo,
              milestones: milestones,
              barriers: barriers,
              transition: transition,
              eesa: eesa,
            });
          }}
        />

        <View style={styles.buttons}>
          <TouchableOpacity
            onPress={() => {
              console.log(master);
              this.props.navigation.navigate('IepReport', {
                pk: master,
              });
            }}
            style={{flexDirection: 'row', alignItems: 'center'}}>
            <MaterialCommunityIcons
              name="chart-pie"
              size={20}
              color={Color.grayFill}
            />
            <Text style={styles.buttontext}>IEP Report</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{flexDirection: 'row', alignItems: 'center'}}
            onPress={() =>
              this.props.navigation.navigate('NotesList', {
                master: master,
                testNo: testNo,
                student: student,
              })
            }>
            <MaterialCommunityIcons
              name="bookmark-outline"
              size={20}
              color={Color.grayFill}
            />
            <Text style={styles.buttontext}>Notes</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonss}>
          <TouchableOpacity
            onPress={() =>
              this.props.navigation.navigate('VbmappSuggestedTargets', {
                master: master,
                testNo: testNo,
                student: student,
                program: program,
                programID: areaID,
              })
            }
            style={{flexDirection: 'row', alignItems: 'center'}}>
            <MaterialCommunityIcons
              name="bookmark-outline"
              size={20}
              color={Color.grayFill}
            />

            <Text style={styles.buttontext}>Suggested Targets</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    borderColor: '#aaa',
    padding: 20,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },
  heading: {
    fontSize: 18,
    fontWeight: '700',
    color: '#45494E',
  },
  subText: {
    fontSize: 14,
    fontWeight: '300',
    color: '#45494E',
  },
  stats: {
    marginTop: 0,
    marginBottom: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stat: {
    fontSize: 12,
    color: '#45494E',
  },
  buttonOutline: {
    borderWidth: 2,
    borderRadius: 10,
    borderColor: '#3E7BFA',
    padding: 10,
  },
  buttonText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#3E7BFA',
    fontWeight: '700',
  },
  buttontext: {
    color: '#45494E',
    paddingLeft: 5,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  buttonss: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

export default ActiveAssessmentCard;
