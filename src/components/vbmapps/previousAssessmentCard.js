import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Color from '../../utility/Color';
import store from "../../redux/store";

import moment from 'moment';
import TherapistRequest from '../../constants/TherapistRequest';

class PreviousAssessmentCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      areaID :'',
    }
  }
  componentDidMount() {
    this.getTTargets()
  }

  getTTargets(){
    TherapistRequest.getAreaList().then(result => {
      console.log("lalalksskksslslsk",result.data.vbmappAreas[0].id)
      this.setState({areaID:result.data.vbmappAreas[0].id})
    }).catch(error => {
      console.log("error===",error);
    });
  }

  deleteAssessment(id) {
		Alert.alert(
		  'Information',
		  'Are you sure ?',
		  [
			{text: 'No', onPress: () => {}, style: 'cancel'},
			{
			  text: 'Yes',
			  onPress: () => {	
				let variables = {
				  id,
				};
				console.log("variable>>>",variables);
				TherapistRequest.deleteVBMAPPAssessment(variables)
				  .then((result) => {					
					console.log("result>>>",result,this.props);
					Alert.alert(
						'Information',
						'Assessment Successfully Deleted!!.',
					  );
            let parentScreen = store.getState().assessmentsList;
            if (parentScreen) {
              parentScreen._refresh();
            }
					
				  })
				  .catch((error) => {
					console.log("error>>",error);
				  });
			  },
			},
		  ],
		);
	  }
	

  render() {
    const { master, testNo, student, program, milestones, barriers, transition, eesa } = this.props;
    const {areaID} = this.state;

    let outputDate = moment(this.props.timestamp).format("MMMM DD, YYYY");
    return (
      <TouchableOpacity style={styles.container}
        onPress={() => this.props.navigation.navigate('AreasList', {
          student: this.props.student,
          master: this.props.master,
          test: this.props.testNo,
          milestones: milestones,
          barriers: barriers,
          transition: transition,
          eesa: eesa,
        })}>
          <View style={{
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
				this.deleteAssessment(master)
            }}>
            <MaterialCommunityIcons name="delete" size={20} color={Color.gray} />
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
        <Text style={styles.subText}>{outputDate}</Text>
        <View style={{...styles.stats,marginTop:5}}>
          <Text style={styles.stat}>Milestones: {this.props.milestones}</Text>
          <Text style={styles.stat}>Barriers: {this.props.barriers}</Text>
          
        </View>
        <View style={{...styles.stats,borderBottomWidth:0.5,paddingBottom:5}}>
          
          <Text style={styles.stat}>EESA: {this.props.eesa}</Text>
          <Text style={styles.stat}>Transitions: {this.props.transition}</Text>
        </View>
        <View style={styles.buttons}>
          <TouchableOpacity onPress={() => {
            console.log(master);
            this.props.navigation.navigate('IepReport', {
              pk: master
            })
          }} style={styles.button}>
            <MaterialCommunityIcons
              name='chart-pie'
              size={20}
              color={Color.grayFill}
            />
            <Text style={styles.buttonText}>IEP Report</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => this.props.navigation.navigate('NotesList', {
            master: master,
            testNo: testNo,
            student: student
          })}>
            <MaterialCommunityIcons
              name='bookmark-outline'
              size={20}
              color={Color.grayFill}
            />
            <Text style={styles.buttonText}>Notes</Text>
          </TouchableOpacity>

        </View>
        <View style={styles.buttonss}>

          <TouchableOpacity onPress={() => this.props.navigation.navigate('VbmappSuggestedTargets', {
            master: master,
            testNo: testNo,
            student: student,
            program: program,
            programID : areaID,

          })} style={styles.button}>
            <MaterialCommunityIcons
              name='bookmark-outline'
              size={20}
              color={Color.grayFill}
            />
            <Text style={styles.buttonText}>Suggested Targets</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    borderColor: '#aaa',
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
    marginBottom: 30
  },
  heading: {
    fontSize: 18,
    fontWeight: '700',
    color: '#45494E'
  },
  subText: {
    fontSize: 14,
    fontWeight: '300',
    color: '#45494E'
  },
  stats: {
    marginTop: 0,
    marginBottom:5 ,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderColor: '#ddd'
  },
  stat: {
    fontSize: 14,
    color: '#45494E'
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  buttonss: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  button: {
    marginRight: 10,
    flexDirection: 'row',
    alignItems: 'center'
  },
  buttonText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#45494E'
  }
})

export default PreviousAssessmentCard;