import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Color from '../../utility/Color';
import store from "../../redux/store";

import { client, getMilestoneGroups } from '../../constants/therapist';
import * as Progress from 'react-native-progress';
import NavigationHeader from '../../components/NavigationHeader.js';
import {groupBy} from 'lodash'
import { Row, Container, Column } from '../../components/GridSystem';

class MilestoneGroups extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groups: []
    }
  }

  componentDidMount() {
    this.getResultData();
  }

  getResultData() {
    const { area } = this.props.route.params;
    client.query({
      query: getMilestoneGroups,
      variables: {
        areaID: area.id
      }
    }).then(result => {
      
      console.log("groups>>>>>",JSON.stringify(result.data.vbmappGroups));
      
      this.setState({
        groups: result.data.vbmappGroups.edges
      })
    }).catch(err => console.log(JSON.stringify(err)));
  }

  render() {
    const { groups } = this.state;
  console.log("props>>",this.props.route.params);

    const { student, area, master, test } = this.props.route.params;
    let nextScreen = '';
    switch(area.name) {
      case 'Milestones':
        nextScreen = 'MilestonesQuestions';
      break;

      case 'Barriers':
        nextScreen = 'BarriersQuestions';
      break;

      case 'Transition Assessment':
        nextScreen = 'TransitionQuestions';
      break;

      case 'EESA':
        nextScreen = 'EESAQuestions';
      break;

      case 'Task Analysis':
        nextScreen = 'TaskQuestions';
      break;

      default:
      break;
    }
    return (
      <SafeAreaView style={styles.container}>
        <NavigationHeader
            backPress={() => {
              this.props.navigation.goBack()  
              

     
              console.log("store>>>",store.getState());
      
      let parentScreen2 = store.getState().areasList;

      if (parentScreen2 ) {
        parentScreen2._refresh();       
      }
       
      
            }}
            title={student.node.firstname+" "+student.node.lastname+" - "+area.name}
        />
        <Container>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.areasContainer}>
              {groups && groups.length > 0 && groups.map(group =>{
                let score={}
                // console.log("group>>>>",group.node.vbmapRecordingSet.edges);
                // const dataobj=group.node.vbmapRecordingSet.edges.map(({node})=>{
                //   // let t=0
                //   // if(group.node.groupName===node.groups.groupName){
                //   //   t+=node.score
                //   // }
                //   // console.log("node>>",t,node.groups.groupName);
                //   const obj={
                //     score:node.score,
                //     group:node.groups.groupName
                //   }

                //   return obj
                // })
                // const groupData=groupBy(dataobj,'group')
                // Object.keys(groupData).map(item=>{
                //   let total=0
                //   groupData[item].forEach(t=>{
                //     console.log("tdata>>>",t);
                //     total+=t.score
                //   })
                //   console.log("t>>>>",total,item);
                // })
                
                console.log("score node>>>",group.node.groupName);
               return <TouchableOpacity onPress={() => this.props.navigation.navigate(nextScreen, {
                  student: student,
                  master: master,
                  area: area,
                  group: group,
                  test: test
                })} style={styles.areaContainer}>
                  <Text style={styles.groupName}>{group.node.groupName}</Text>
                  {/* <Text style={styles.groupDesc}>Questions: {group.node.noQuestion}</Text> */}
                  {/* <View style={styles.progress}>
                    <Progress.Bar progress={0.3} width={null} color="#4BAEA0" borderColor="#4BAEA0"/>
                  </View> */}
                </TouchableOpacity>
              }
              )}
            </View>
          </ScrollView>
        </Container>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.white
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
    marginTop: 20
  },
  areaContainer: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#DDD',
    padding: 20,
    marginBottom: 20
  },
  groupName: {
    fontSize: 18,
    fontWeight: '700',
    flex: 1
  },
  progress: {
    marginTop:10
  }
});

export default MilestoneGroups;