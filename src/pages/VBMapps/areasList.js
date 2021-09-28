import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Color from '../../utility/Color';
import { client, getAreasList,getMilestoneGroups } from '../../constants/therapist';
import * as Progress from 'react-native-progress';
import store from "../../redux/store";
import { connect } from 'react-redux';
import { getAuthResult } from '../../redux/reducers/index';

import { setToken, setTokenPayload, setVBMAPPSArea } from '../../redux/actions';
import TherapistRequest from '../../constants/TherapistRequest';

import NavigationHeader from '../../components/NavigationHeader.js';
import { Row, Container, Column } from '../../components/GridSystem';

class AreasList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      areas:[],
      milestones:0,
      barriers:0,
      transition:0,
      eesa:0
    }
		this.props.dispatchSetVBMAPPSArea(this);

  }


  

  componentWillUnmount() {
		//remove from redux
		this.props.dispatchSetVBMAPPSArea(null);
	}
	_refresh() {
		this.componentDidMount();
	}
  componentDidMount() {
		TherapistRequest.setDispatchFunction(this.props.dispatchSetToken);
    this.getResultData();
    this.getAssessments();

  }


  getResultData() {
    client.query({
      query: getAreasList
    }).then(result => {
     
      console.log("arealiat 26=====================>>>>>>>==============",result.data.vbmappAreas);
      this.setState({
        areas: result.data.vbmappAreas
      })
    }).catch(err => console.log(JSON.stringify(err)));
  }

  getAssessments() {
		const { student, program, master } = this.props.route.params;
		let variables = {
			studentID: student.node.id
		};
		TherapistRequest.getVBMAPPSAssessmentsList(variables).then(result => {
      const data=result.data.vbmappGetAssessments.edges.filter(item=>{
        return item.node.id===master
      })
			this.setState({
				milestones:data[0].milestonePercent,
        barriers:data[0].barriersPercent,
        transition:data[0].transitionPercent,
        eesa:data[0].eesaPercent
			})
		}).catch(err => console.log(JSON.stringify(err)));
	}

  getAreas = () => {
    const { areas,milestones,barriers,transition,eesa } = this.state;
    const { student, master, test } = this.props.route.params;
    let areasArray = [];
    let milestoneCounter = 0;
    for(let x=0;x<areas.length;x++) {
      switch(areas[x].areaName) {
        case 'Milestones':
          milestoneCounter = x;
         // getResultData(areas[x].id);
          areasArray.push(
            <TouchableOpacity onPress={() => this.props.navigation.navigate('MilestoneGroups', {
              student: student,
              master: master,
              test: test,
              area: {
                id: areas[x].id,
                name: areas[x].areaName
              }
            })} style={styles.areaContainer}>
              <View style={{flexDirection:'row',justifyContent:'space-between'}}>
              <Text style={styles.areaName}>{areas[x].areaName}</Text>
                {milestones != undefined ?
              <Text style={{margin:0,backgroundColor:'#D5EDFF',padding:3}}>{milestones+"%"}</Text>
                : <Text style={{margin:0,backgroundColor:'#D5EDFF',padding:3}}>0%</Text>}
              </View>

              <Text style={styles.areaDesc}>{areas[x].description}</Text>
              <View style={styles.progress}>
                <Progress.Bar progress={milestones != undefined ? milestones/100 : 0} width={null} color="#623bb2" borderColor="#623bb2"/>
              </View>
            </TouchableOpacity>
          )
        break;

        case 'Barriers':
          areasArray.push(
            <TouchableOpacity onPress={() => this.props.navigation.navigate('MilestoneGroups', {
              student: student,
              master: master,
              test: test,
              area: {
                id: areas[x].id,
                name: areas[x].areaName
              }
            })} style={styles.areaContainer}>
              <View style={{flexDirection:'row',justifyContent:'space-between'}}>
              <Text style={styles.areaName}>{areas[x].areaName}</Text>
                {barriers != undefined ?
              <Text style={{margin:0,backgroundColor:'#D5EDFF',padding:3}}>{barriers+"%"}</Text>
              :<Text style={{margin:0,backgroundColor:'#D5EDFF',padding:3}}>0%</Text>}
              </View>
              <Text style={styles.areaDesc}>{areas[x].description}</Text>
              <View style={styles.progress}>
                <Progress.Bar progress={barriers != undefined ? barriers/100 : 0} width={null} color="#f04a3d" borderColor="#f04a3d"/>
              </View>
            </TouchableOpacity>
          )
        break;

        case 'Transition Assessment':
          areasArray.push(
            <TouchableOpacity onPress={() => this.props.navigation.navigate('MilestoneGroups', {
              student: student,
              master: master,
              test: test,
              area: {
                id: areas[x].id,
                name: areas[x].areaName
              }
            })} style={styles.areaContainer}>
              <View style={{flexDirection:'row',justifyContent:'space-between'}}>
              <Text style={styles.areaName}>{areas[x].areaName}</Text>
                {transition != undefined ?
              <Text style={{margin:0,backgroundColor:'#D5EDFF',padding:3}}>{transition+"%"}</Text>
              :<Text style={{margin:0,backgroundColor:'#D5EDFF',padding:3}}>0%</Text>}
              </View>
              <Text style={styles.areaDesc}>{areas[x].description}</Text>
              <View style={styles.progress}>
                <Progress.Bar progress={transition != undefined ? transition/100 : 0} width={null} color="#4eb151" borderColor="#4eb151"/>
              </View>
            </TouchableOpacity>
          )
        break;

        case 'EESA':
          areasArray.push(
            <TouchableOpacity onPress={() => this.props.navigation.navigate('MilestoneGroups', {
              student: student,
              master: master,
              test: test,
              area: {
                id: areas[x].id,
                name: areas[x].areaName
              }
            })} style={styles.areaContainer}>
             <View style={{flexDirection:'row',justifyContent:'space-between'}}>
              <Text style={styles.areaName}>{areas[x].areaName}</Text>
               {eesa != undefined ?
              <Text style={{margin:0,backgroundColor:'#D5EDFF',padding:3}}>{eesa+"%"}</Text>
              :<Text style={{margin:0,backgroundColor:'#D5EDFF',padding:3}}>0%</Text>}
              </View>
              <Text style={styles.areaDesc}>{areas[x].description}</Text>
              <View style={styles.progress}>
                <Progress.Bar progress={eesa != undefined ? eesa/100 : 0} width={null} color="#ed5f32" borderColor="#ed5f32"/>
              </View>
            </TouchableOpacity>
          )
        break;

        case 'Task Analysis':
          areasArray.push(
            <TouchableOpacity onPress={() => this.props.navigation.navigate('MilestoneGroups', {
              student: student,
              master: master,
              test: test,
              area: {
                id: areas[milestoneCounter].id,
                name: areas[x].areaName
              }
            })} style={styles.areaContainer}>
              <Text style={styles.areaName}>{areas[x].areaName}</Text>
              <Text style={styles.areaDesc}>{areas[x].description}</Text>
              <View style={styles.progress}>
                <Progress.Bar progress={0.0} width={null} color="#ff0000" borderColor="#ff0000"/>
              </View>
            </TouchableOpacity>
          )
        break;

        default:
        break;
      }
    }
    return areasArray;
  }

  render() {
    const { areas } = this.state;
    const { student, master, test } = this.props.route.params;
    return(
      <SafeAreaView style={styles.container}>
        <NavigationHeader
            backPress={() => {this.props.navigation.goBack()
              let parentScreen = store.getState().assessmentsList;
              if (parentScreen) {
                parentScreen._refresh();
              }
            }
            }
            title={student.node.firstname+" "+student.node.lastname+" - "+"VB-Mapp Areas"}
        />
        <Container>
          <ScrollView>
            <View style={styles.areasContainer}>
              {areas && areas.length > 0 && this.getAreas()}
            </View>
          </ScrollView>
          </Container>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor:Color.white
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  pageHeading: {
    fontSize: 24,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center'
  },
  heading: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 10
  },
  areasContainer: {
    marginTop:20
  },
  areaContainer: {
    borderWidth:1,
    borderRadius:10,
    borderColor:'#DDD',
    padding:20,
    marginBottom:10
  },
  areaName: {
    fontSize:18,
    fontWeight:'700',
    flex:1
  },
  progress: {
    marginTop:10
  }
});
const mapStateToProps = (state) => ({
	authResult: getAuthResult(state)
});

const mapDispatchToProps = (dispatch) => ({
	dispatchSetToken: (data) => dispatch(setToken(data)),
	dispatchSetVBMAPPSArea: (data) => dispatch(setVBMAPPSArea(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AreasList);
