import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView, SafeAreaView, Alert } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Color from '../../utility/Color';
import { client, getQuestions, submitResponse } from '../../constants/therapist';
import NavigationHeader from '../../components/NavigationHeader.js';
import { Row, Container, Column } from '../../components/GridSystem';

class EESAQuestions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      questions:[],
      loadingQuestions: false,
      total: 0.0
    }
  }

  componentDidMount() {
    this.getQuestion();
  }

  handleAnswer(score, questionNum) {
    const { total } = this.state;
      this.setState({
          loadingQuestions: true
      })
    console.log("score>>>",score);
    const { area, group, master } = this.props.route.params;
    client.mutate({
      mutation: submitResponse,
      variables: {
        master: master,
        areaID: area.id,
        groupID: group.node.id,
        question: questionNum,
        score: score
      }
    }).then(result => {
     
      let newTotal = total + score;
      this.setState({
        total: newTotal
      })
      this.getQuestion();
    }).catch(err => console.log(JSON.stringify(err)));
    
  }

  getQuestion() {
    const { student, area, group, master, test } = this.props.route.params;
    client.mutate({
      mutation: getQuestions,
      variables: {
        master: master,
        studentID: student.node.id,
        areaID: area.id,
        groupID: group.node.id
      }
    }).then(result => {
        let questions = JSON.parse(result.data.vbmappGetQuestions.questions);
        let ques = [];
        let totalScore=0.0
        //Looping through all questions
        for(let x=0;x<questions.length;x++) {
            let responseCount = questions[x].responses.length;
            let options = [];
            //Getting previous assessments for this question
            let pa = questions[x].previous_assess;
            //Looping through all the previous assessments for a question
            for(let y=0;y<pa.length;y++) {

                //If there exists an assessment for this question and this test
                if(pa[y].test === test) {
                    switch(pa[y].score) {
                        case "0.0":
                          if(responseCount === 2) {
                            options.push(
                                <View style={styles.options}>
                                    <TouchableOpacity style={styles.redOption} onPress={() => this.handleAnswer(questions[x].responses[0].score, questions[x].questionNum)}> 
                                        <Text style={styles.optionText}>0</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.option} onPress={() => this.handleAnswer(questions[x].responses[1].score, questions[x].questionNum)}> 
                                        <Text style={styles.optionText}>x</Text>
                                    </TouchableOpacity>
                                </View>
                            )
                          } else {
                            options.push(
                              <View style={styles.options}>
                                  <TouchableOpacity style={styles.redOption} onPress={() => this.handleAnswer(questions[x].responses[0].score, questions[x].questionNum)}> 
                                      <Text style={styles.optionTextx}>0</Text>
                                  </TouchableOpacity>
                                  <TouchableOpacity style={styles.option} onPress={() => this.handleAnswer(questions[x].responses[1].score, questions[x].questionNum)}> 
                                      <Text style={styles.optionText}>/</Text>
                                  </TouchableOpacity>
                                  <TouchableOpacity style={styles.option} onPress={() => this.handleAnswer(questions[x].responses[2].score, questions[x].questionNum)}> 
                                      <Text style={styles.optionText}>x</Text>
                                  </TouchableOpacity>
                              </View>
                          )
                          }
                        break;

                        case "0.5":
                          totalScore += 0.5

                          if(responseCount === 2) {
                            options.push(
                                <View style={styles.options}>
                                    <TouchableOpacity style={styles.option} onPress={() => this.handleAnswer(questions[x].responses[0].score, questions[x].questionNum)}> 
                                        <Text style={styles.optionText}>0</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.yellowOption} onPress={() => this.handleAnswer(questions[x].responses[1].score, questions[x].questionNum)}> 
                                        <Text style={styles.optionTextx}>x</Text>
                                    </TouchableOpacity>
                                </View>
                            )
                          } else {
                            options.push(
                              <View style={styles.options}>
                                  <TouchableOpacity style={styles.option} onPress={() => this.handleAnswer(questions[x].responses[0].score, questions[x].questionNum)}> 
                                      <Text style={styles.optionText}>0</Text>
                                  </TouchableOpacity>
                                  <TouchableOpacity style={styles.yellowOption} onPress={() => this.handleAnswer(questions[x].responses[1].score, questions[x].questionNum)}> 
                                      <Text style={styles.optionTextx}>/</Text>
                                  </TouchableOpacity>
                                  <TouchableOpacity style={styles.option} onPress={() => this.handleAnswer(questions[x].responses[2].score, questions[x].questionNum)}> 
                                      <Text style={styles.optionText}>x</Text>
                                  </TouchableOpacity>
                              </View>
                          )
                          }
                        break;

                        case "1.0":
                          totalScore += 1.0

                          if(responseCount === 2) {
                            options.push(
                                <View style={styles.options}>
                                    <TouchableOpacity style={styles.option} onPress={() => this.handleAnswer(questions[x].responses[0].score, questions[x].questionNum)}> 
                                        <Text style={styles.optionText}>0</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.greenOption} onPress={() => this.handleAnswer(questions[x].responses[1].score, questions[x].questionNum)}> 
                                        <Text style={styles.optionText}>x</Text>
                                    </TouchableOpacity>
                                </View>
                            )
                          } else {
                            options.push(
                              <View style={styles.options}>
                                  <TouchableOpacity style={styles.option} onPress={() => this.handleAnswer(questions[x].responses[0].score, questions[x].questionNum)}> 
                                      <Text style={styles.optionText}>0</Text>
                                  </TouchableOpacity>
                                  <TouchableOpacity style={styles.option} onPress={() => this.handleAnswer(questions[x].responses[1].score, questions[x].questionNum)}> 
                                      <Text style={styles.optionText}>/</Text>
                                  </TouchableOpacity>
                                  <TouchableOpacity style={styles.greenOption} onPress={() => this.handleAnswer(questions[x].responses[2].score, questions[x].questionNum)}> 
                                      <Text style={styles.optionTextx}>x</Text>
                                  </TouchableOpacity>
                              </View>
                          )
                          }
                        break;

                        default:
                          if(responseCount === 2) {
                            options.push(
                                <View style={styles.options}>
                                    <TouchableOpacity style={styles.option} onPress={() => this.handleAnswer(questions[x].responses[0].score, questions[x].questionNum)}> 
                                        <Text style={styles.optionText}>0</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.option} onPress={() => this.handleAnswer(questions[x].responses[1].score, questions[x].questionNum)}> 
                                        <Text style={styles.optionText}>x</Text>
                                    </TouchableOpacity>
                                </View>
                            )
                          } else {
                            options.push(
                              <View style={styles.options}>
                                  <TouchableOpacity style={styles.option} onPress={() => this.handleAnswer(questions[x].responses[0].score, questions[x].questionNum)}> 
                                      <Text style={styles.optionText}>0</Text>
                                  </TouchableOpacity>
                                  <TouchableOpacity style={styles.option} onPress={() => this.handleAnswer(questions[x].responses[1].score, questions[x].questionNum)}> 
                                      <Text style={styles.optionText}>/</Text>
                                  </TouchableOpacity>
                                  <TouchableOpacity style={styles.option} onPress={() => this.handleAnswer(questions[x].responses[2].score, questions[x].questionNum)}> 
                                      <Text style={styles.optionText}>x</Text>
                                  </TouchableOpacity>
                              </View>
                          )
                          }
                        break;
                    }
                }
            }
            ques.push(
                <View style={styles.question}>
                    <Text style={styles.questionText}>{questions[x].text}</Text>
                    {options}
                </View>
            );
        }
        this.setState({
            questionsJSON: questions,
            questions: ques,
            loadingQuestions: false,
            total:totalScore
        })
    }).catch(err => console.log(err));
  }
  
  render() {
    const { area, group,student } = this.props.route.params;
    const { questions, questionsJSON, loadingQuestions, total } = this.state;
    let assignment1 = { complete: 0, test: '' }
    let assignment2 = { complete: 0, test: '' }
    let assignment3 = { complete: 0, test: '' }
    let assignment4 = { complete: 0, test: '' }

    questionsJSON?.forEach(({ previous_assess }) => {
      assignment1.complete += previous_assess[0]
        ? previous_assess[0].score.length === 0
          ? 0
          : parseFloat(previous_assess[0]?.score)
        : null
      assignment1.test = previous_assess[0] ? previous_assess[0].test_no : null
      assignment2.complete += previous_assess[1]
        ? previous_assess[1].score.length === 0
          ? 0
          : parseFloat(previous_assess[1]?.score)
        : null

      assignment2.test = previous_assess[1] ? previous_assess[1].test_no : null
      assignment3.complete += previous_assess[2]
        ? previous_assess[2].score.length === 0
          ? 0
          : parseFloat(previous_assess[2]?.score)
        : null
      assignment3.test = previous_assess[2] ? previous_assess[2].test_no : null
      assignment4.complete += previous_assess[3]
        ? previous_assess[3].score.length === 0
          ? 0
          : parseFloat(previous_assess[3]?.score)
        : null
      assignment4.test = previous_assess[3] ? previous_assess[3].test_no : null
    })
  
    let heading = area.name + ' Assessment';
    return(
      <SafeAreaView style={styles.container}>
        <NavigationHeader
            backPress={() => this.props.navigation.goBack()}
            title={heading}
        />
        <Container>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={[styles.question, { marginTop: 10, alignSelf: 'flex-start', fontSize: 15, fontFamily: 'SF Pro Display' }]}>
                  {"Learner : " + student.node.firstname + " " + student.node.lastname}
                </Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                  <View>
                    <TouchableOpacity style={[styles.whiteScore, styles.currentScorep]}>
                      <Text style={styles.scorep}>{assignment1.complete}</Text>
                    </TouchableOpacity>
                    <Text style={{ fontSize: 9, textAlign: 'center', marginTop: -5 }}>{assignment1.test}</Text>
                  </View>
                  <View>
                    <TouchableOpacity style={[styles.whiteScore, styles.currentScorep]}>
                      <Text style={styles.scorep}>{assignment2.complete}</Text>
                    </TouchableOpacity>
                    <Text style={{ fontSize: 9, textAlign: 'center', marginTop: -5 }}>{assignment2.test}</Text>
                  </View>
                  <View>
                    <TouchableOpacity style={[styles.whiteScore, styles.currentScorep]}>
                      <Text style={styles.scorep}>{assignment3.complete}</Text>
                    </TouchableOpacity>
                    <Text style={{ fontSize: 9, textAlign: 'center', marginTop: -5 }}>{assignment3.test}</Text>
                  </View>
                  <View>
                    <TouchableOpacity style={[styles.whiteScore, styles.currentScorep]}>
                      <Text style={styles.scorep}>{assignment4.complete}</Text>
                    </TouchableOpacity>
                    <Text style={{ fontSize: 9, textAlign: 'center', marginTop: -5 }}>{assignment4.test}</Text>
                  </View>
                </View>
              </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.questionContainer}>
                <View style={styles.questionCategoryContainer}>
                  <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                    <Text style={styles.groupName}>{group.node.groupName}</Text>
                    <Text style={styles.totalScore}>{"score: "+total}</Text>
                  </View>
                    {questionsJSON && questionsJSON.length > 0 && questionsJSON[0].responses.map(response => 
                        <Text style={styles.directions}>{response.score} - {response.text}</Text>
                    )}
                    {questions && questions.length === 0 && <ActivityIndicator />}
                    {loadingQuestions && <ActivityIndicator />}
                    {loadingQuestions === false && questions.length > 0 && questions}
                </View>
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
    fontSize: 20,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center'
  },
  heading: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 10
  },
  questionContainer: {
    marginTop:20,
    borderWidth:1,
    borderRadius:10,
    borderColor:'#DDD',
    padding:20
  },
  question: {
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    marginVertical:10
  },
  questionText: {
    fontSize:18,
    color:'#777',
    flex:1
  },
  groupName: {
    textTransform:'uppercase',
    flex:1,
    color: '#45494E',
    fontWeight:'700'
  },
  options: {
      flexDirection:'row'
  },
  option: {
      marginHorizontal:5,
      borderWidth:1,
      borderColor:'#DDD',
      borderRadius:10,
      padding:10
  },
  redOption: {
    backgroundColor:'#FF8080',
    marginHorizontal:5,
    borderWidth:1,
    borderColor:'#DDD',
    borderRadius:10,
    padding:10
    
},
yellowOption: {
    backgroundColor:'#FF9C52',
    marginHorizontal:5,
    borderWidth:1,
    borderColor:'#DDD',
    borderRadius:10,
    padding:10
},
greenOption: {
    backgroundColor:'#4BAEA0',
    marginHorizontal:5,
    borderWidth:1,
    borderColor:'#DDD',
    borderRadius:10,
    padding:10
},
  optionText: {
      fontSize:15,
      paddingHorizontal:5
  },
  optionTextx: {
    fontSize:15,
    color:'#FFFFFF',
    paddingHorizontal:5
},
  directions: {
      marginVertical:10
  },
  totalScore: {
    fontSize:16,
    flex:1,
    textAlign:'right',
    fontWeight:'700',
    color:'#3E7BFA'
  },
  whiteScore: {
    marginVertical: 10,
    backgroundColor: '#FFF',
    borderWidth: 1,
    //width: 32,
    minWidth: 32,
    borderColor: '#3333FF',
    borderRadius: 10,
    marginRight: 5,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  scorep: {
    color: '#000',
    fontSize: 10
  },
  currentScorep: {
    borderWidth: 1,
    borderColor: '#33a5ff'
  },
})

export default EESAQuestions;