import React, {Component} from 'react';
import HTMLView from 'react-native-htmlview';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Color from '../../utility/Color';
import Button from '../../components/Button';
import Material from './Material';
import Objective from './Objective';
import Example from './Example';
import {client, getQuestions, getMilestoneGroups, submitResponse} from '../../constants/therapist';
import NavigationHeader from '../../components/NavigationHeader.js';
import {Row, Container, Column} from '../../components/GridSystem';
import  LoadingIndicator  from '../../components/LoadingIndicator';
import { Modal } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

class MilestonesQuestions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentIndex: 0,
      completed: 0,
      questions: [],
      questionsLength:0,
      currentQuestion: {},
      scoreboard: [],
      totalScore: 0.0,
      selected:'',
      levels: [],
      lastThree:[],
      groups:[],
      groupName:'',
      dbQuestionNumber: 1,
      loadingQuestion: true,
      modalGuide:false,
      material:'',
      example:'',
      objective:'',
      previous: 0,
      next: 0,
    };
  }

  componentDidMount() {
    let selected = ''
    const areaID = this.props.route.params.area.id
    client.query({
      query: getMilestoneGroups,
      variables: {
        areaID:this.props.route.params.area.id
      }
    })
      .then(result => {
        console.log(">>>>++",result.data.vbmappGroups.edges);
        selected = result.data.vbmappGroups.edges[0].node.id
        this.setState({
          groups: result.data.vbmappGroups.edges,          
        })
      })
    this.setState({
      selected: this.props.route.params.group.node.id,
      groupName:this.props.route.params.group.node.groupName
          
    })
    this.getQuestion(this.props.route.params.group.node.id);
  }

  handleAnswer(score) {
    const { selected } = this.state
    console.log("in handle answer>>>",selected);

    this.setState({
      loadingQuestion: true,
    });
    const {dbQuestionNumber} = this.state;
    const {area, group, master} = this.props.route.params;
    const temp = this.state.lastThree
    if (temp.length === 3) {
      temp.shift()
    }
    client
      .mutate({
        mutation: submitResponse,
        variables: {
          master: master,
          areaID: area.id,
          groupID: selected,
          question: dbQuestionNumber,
          score: score,
        },
      })
      .then((result) => {
        console.log("result answer>>>",result.data);
        this.setState(
          prevState => ({
            lastThree: [...prevState.lastThree, score],
          }),
          () => {
            console.log("lastThree",this.state.lastThree);
            const sum = this.state.lastThree.reduce((total, num) => total + num)
            if (sum === 0 && this.state.lastThree.length === 3) {
              this.getNextGroup(selected)
            } else {
              this.getQuestion(selected)
            }
          },
        )
        // this.getQuestion();
      })
      .catch((err) => console.log(JSON.stringify(err)));
  }
  getNextGroup = selected => {
    console.log("in get next group");
    let selectedIdx
    this.state.groups.forEach(({ node }, index) =>
      node.id === selected ? (selectedIdx = index) : null,
    )
    console.log('yeah maan ')
    if (selectedIdx + 1 < this.state.groups.length) {
      this.handleGroupChange(
        this.state.groups[selectedIdx + 1].node.id,
        this.state.groups[selectedIdx + 1].node.groupName,
      )
    } else {
      this.getQuestion(selected)
    }
  }
  handleGroupChange = (groupID) => {
    console.log("in handle group");
    const filter=this.state.groups.filter(item=>{
      console.log("item>>>",item);
      return item.node.id===groupID
    })
    console.log("filter>>>",filter);
    this.setState({
      loadingQuestion: true,
      completed: 0,
      selected: groupID,
      groupName:filter[0].node.groupName,
      scoreboard: [],
      currentIndex: 0,
      questions: [],
      currentQuestion: {},
      totalScore: 0.0,
      dbQuestionNumber: 1,
      lastThree: [],
    })
    this.getQuestion(groupID)
  }
  getQuestionByNumber = (quesNum) => {
    this.setState({
      loadingQuestion: true,
    });
    const {student, area, group, master, test} = this.props.route.params;
    const {currentIndex} = this.state;
    client
      .mutate({
        mutation: getQuestions,
        variables: {
          master: master,
          studentID: student.node.id,
          areaID: area.id,
          groupID: group.node.id,
        },
      })
      .then((result) => {
        const questions = JSON.parse(result.data.vbmappGetQuestions.questions);
        //console.log(JSON.stringify(questions));
       
        let x = 0;
        let complete = 0;
        //Looping through all questions
        for (x = 0; x < questions.length; x++) {
          if (questions[x].questionNum === quesNum) {
            this.setState({
              currentQuestion: questions[x],
              currentIndex: x,
              dbQuestionNumber: questions[x].questionNum,
              loadingQuestion: false,
            });
            break;
          }
        }
        this.setState({
          questions: questions,
        });

        if (x === 0) {
          this.setState({
            previous: 0,
            next: 1,
          });
        }

        if (x > 0 && x < questions.length - 1) {
          this.setState({
            previous: 1,
            next: 1,
          });
        }

        if (x >= questions.length - 1) {
          this.setState({
            previous: 1,
            next: 0,
          });
        }

        if (x === questions.length) {
          //console.log("Done");
          complete = 1;
          this.setState({
            loadingQuestion: false,
          });
        }
        this.getScoreboard(complete, questions, quesNum);
      })
      .catch((err) => console.log(err));
  };

  getQuestion=(selected)=> {
    const {student, area, group, master, test} = this.props.route.params;
    const {currentIndex} = this.state;
    console.log("slected>>>",selected);
    let quesNum = 0;
    client
      .mutate({
        mutation: getQuestions,
        variables: {
          master: master,
          studentID: student.node.id,
          areaID: area.id,
          groupID: selected,
        },
      })
      .then((result) => {
        const questions = JSON.parse(result.data.vbmappGetQuestions.questions);
        console.log("result questions>>>",questions.length);
        console.log(">>>>>",questions.length);
        this.setState({
          questionsLength:questions.length
        })
        let x = 0;
        let complete = 0;
        //Looping through all questions
        for (x = 0; x < questions.length; x++) {
          //Getting previous assessments for this question
          let pa = questions[x].previous_assess;
          let already_assessed = false;
          //Looping through all the previous assessments for a question
          for (let y = 0; y < pa.length; y++) {
            //If there exists an assessment for this question and this test
            if (pa[y].test === test) {
              //If a score was given earlier
              if (pa[y].score !== '') {
                //Set flag to true
                already_assessed = true;
                break;
              }
            }
          }
          if (!already_assessed) {
            quesNum = questions[x].questionNum;
            this.setState({
              currentQuestion: questions[x],
              currentIndex: x,
              dbQuestionNumber: questions[x].questionNum,
              loadingQuestion: false,
            });
            break;
          }
          this.setState({
            questions: questions,
          });
        }
        if (x === 0) {
          this.setState({
            previous: 0,
            next: 1,
          });
        }

        if (x > 0 && x < questions.length - 1) {
          this.setState({
            previous: 1,
            next: 1,
          });
        }

        if (x >= questions.length - 1) {
          this.setState({
            previous: 1,
            next: 0,
          });
        }

        if (x === questions.length) {
          //console.log("Done");
          complete = 1;
          this.setState({
            loadingQuestion: false,
          });
        }
        this.getScoreboard(complete, questions, quesNum);
      })
      .catch((err) => console.log(err));
  }

  vbmappGuideModal=()=>{
    return <Modal
    animationType="slide"
        transparent={true}
        // visible={this.state.modalTherapySession}
        visible={this.state.modalGuide}
        onRequestClose={() => this.setState({modalGuide: false})}
        style={{flex: 1}}
    >
      <TouchableOpacity
      activeOpacity={1}
      onPress={() => this.setState({modalGuide: false})}
      style={{flex: 1, backgroundColor: Color.blackOpacity}}>
        <View style={{
                flex: 1,
                backgroundColor: Color.white,
                padding: 16,
                position: 'absolute',
                bottom: 0,
                right: 0,
                left: 0,
              }}>
                <Button
                style={{marginTop: 5, marginBottom: 20}}
                theme="secondary"
                labelButton="Example"
                onPress={() => {
                  this.setState({
                    modalGuide:false
                  })
                  this.props.navigation.navigate('Example',{
                       material:this.state.material,
                       example:this.state.example,
                       objective:this.state.objective
                     })
                }}
              />
              <Button
                style={{marginTop: 5, marginBottom: 20}}
                theme="secondary"
                labelButton="Material"
                onPress={() => {
                  
                this.setState({
                  modalGuide:false
                })
                this.props.navigation.navigate('Material',{
                     material:this.state.material,
                     example:this.state.example,
                     objective:this.state.objective
                   })
              }}
              />
              <Button
                style={{marginTop: 5, marginBottom: 20}}
                theme="secondary"
                labelButton="Objective"
                onPress={() => {
                  this.setState({
                    modalGuide:false
                  })
                  this.props.navigation.navigate('Objective',{
                       material:this.state.material,
                       example:this.state.example,
                       objective:this.state.objective
                     })
                }}
              />
          
        </View>
        <Tab.Navigator 
            screenOptions={({route}) => ({
                tabBarIcon: ({focused, color, size}) => {
                  let iconName;
                  if (route.name === 'Material') {
                    iconName = 'cart-outline';
                  } else if (route.name === 'Example') {
                    iconName = 'book-outline';
                  } else if (route.name === 'Objective') {
                    iconName = 'tree-outline';
                  } 
                  return (
                    <MaterialCommunityIcons
                      name={iconName}
                      color={color}
                      size={24}
                    />
                  );
                },
              })}>
                <Tab.Screen name="Material" 
                children={()=><Material material={this.state.material} goBack={()=>this.setState({
                  modalGuide:false
                })}/>}
                 />
                <Tab.Screen name="Example" children={()=><Example example={this.state.example} goBack={()=>this.setState({
                  modalGuide:false
                })}/>} />
                <Tab.Screen name="Objective" children={()=><Objective objective={this.state.objective} goBack={()=>this.setState({
                  modalGuide:false
                })}/>}
                />

                {/* <Tab.Screen name="Calendar" component={HomeScreen} />
                <Tab.Screen name="Profile" component={HomeScreen} /> */}
            </Tab.Navigator>

      </TouchableOpacity>
    </Modal>
  }

  getScoreboard = (complete, questions, quesNum) => {
    console.log("getscoreBoard>>>",complete,quesNum);
    const {test} = this.props.route.params;
    let currentLevel = 0;
    let levels = [];
    let totalScore = 0;
    console.log(questions.length);
    for (let i = 0; i < questions.length; i++) {
      if (questions[i].level !== currentLevel) {
        currentLevel = questions[i].level;
        levels.push(questions[i].level);
      }
    }
    let scoreboard = [];
    for (let x = 0; x < levels.length; x++) {
      let answers = [];
      for (let y = 0; y < questions.length; y++) {
        if (questions[y].level === levels[x]) {
          let pa = questions[y].previous_assess;
          for (let z = 0; z < pa.length; z++) {
            if (pa[z].test === test) {
              switch (pa[z].score) {
                case '':
                  if (quesNum === questions[y].questionNum) {
                    answers.push(
                      <TouchableOpacity
                        onPress={() =>
                          this.getQuestionByNumber(questions[y].questionNum)
                        }
                        style={[styles.emptyScore, styles.currentScore]}>
                        <Text style={styles.score}></Text>
                      </TouchableOpacity>,
                    );
                  } else {
                    answers.push(
                      <TouchableOpacity
                        onPress={() =>
                          this.getQuestionByNumber(questions[y].questionNum)
                        }
                        style={styles.emptyScore}>
                        <Text style={styles.score}></Text>
                      </TouchableOpacity>,
                    );
                  }
                  break;

                case '0.0':
                  if (quesNum === questions[y].questionNum) {
                    answers.push(
                      <TouchableOpacity
                        onPress={() =>
                          this.getQuestionByNumber(questions[y].questionNum)
                        }
                        style={[styles.redScore, styles.currentScore]}>
                        <Text style={styles.score}>0</Text>
                      </TouchableOpacity>,
                    );
                  } else {
                    answers.push(
                      <TouchableOpacity
                        onPress={() =>
                          this.getQuestionByNumber(questions[y].questionNum)
                        }
                        style={styles.redScore}>
                        <Text style={styles.score}>0</Text>
                      </TouchableOpacity>,
                    );
                  }
                  break;

                case '0.5':
                  totalScore = totalScore + 0.5;
                  if (quesNum === questions[y].questionNum) {
                    answers.push(
                      <TouchableOpacity
                        onPress={() =>
                          this.getQuestionByNumber(questions[y].questionNum)
                        }
                        style={[styles.yellowScore, styles.currentScore]}>
                        <Text style={styles.score}>0.5</Text>
                      </TouchableOpacity>,
                    );
                  } else {
                    answers.push(
                      <TouchableOpacity
                        onPress={() =>
                          this.getQuestionByNumber(questions[y].questionNum)
                        }
                        style={styles.yellowScore}>
                        <Text style={styles.score}>0.5</Text>
                      </TouchableOpacity>,
                    );
                  }
                  break;

                case '1.0':
                  totalScore = totalScore + 1.0;
                  if (quesNum === questions[y].questionNum) {
                    answers.push(
                      <TouchableOpacity
                        onPress={() =>
                          this.getQuestionByNumber(questions[y].questionNum)
                        }
                        style={[styles.greenScore, styles.currentScore]}>
                        <Text style={styles.score}>1</Text>
                      </TouchableOpacity>,
                    );
                  } else {
                    answers.push(
                      <TouchableOpacity
                        onPress={() =>
                          this.getQuestionByNumber(questions[y].questionNum)
                        }
                        style={styles.greenScore}>
                        <Text style={styles.score}>1</Text>
                      </TouchableOpacity>,
                    );
                  }
                  break;

                default:
                  break;
              }
            }
          }
        }
      }

      scoreboard.push(
        <View style={styles.levelContainer}>
          <View style={styles.level}>
            <Text style={{fontSize: 13}}>L - {levels[x]}</Text>
          </View>
          <View style={styles.levelScores}>{answers}</View>
        </View>,
      );
    }
    this.setState({
      scoreboard: scoreboard,
      totalScore: totalScore,
    });
    if (complete === 1) {
      this.setState({
        completed: 1,
      });
    }
  };

  render() {
    const {area, group, student} = this.props.route.params;
    const {
      questions,
      questionsLength,
      groupName,
      currentQuestion,
      completed,
      scoreboard,
      currentIndex,
      loadingQuestion,
      levels,
      totalScore,
      previous,
      next,
    } = this.state;

    let assignment1 = {complete: 0, test: ''};
    let assignment2 = {complete: 0, test: ''};
    let assignment3 = {complete: 0, test: ''};
    let assignment4 = {complete: 0, test: ''};
    questions.forEach(({previous_assess}) => {
      assignment1.complete += previous_assess[0]
        ? previous_assess[0].score.length === 0
          ? 0
          : parseFloat(previous_assess[0]?.score)
        : null;
      assignment1.test = previous_assess[0] ? previous_assess[0].test_no : null;
      assignment2.complete += previous_assess[1]
        ? previous_assess[1].score.length === 0
          ? 0
          : parseFloat(previous_assess[1]?.score)
        : null;

      assignment2.test = previous_assess[1] ? previous_assess[1].test_no : null;
      assignment3.complete += previous_assess[2]
        ? previous_assess[2].score.length === 0
          ? 0
          : parseFloat(previous_assess[2]?.score)
        : null;
      assignment3.test = previous_assess[2] ? previous_assess[2].test_no : null;
      assignment4.complete += previous_assess[3]
        ? previous_assess[3].score.length === 0
          ? 0
          : parseFloat(previous_assess[3]?.score)
        : null;
      assignment4.test = previous_assess[3] ? previous_assess[3].test_no : null;
    });

    let heading = area.name + ' Assessment';
    return (
      <SafeAreaView style={styles.container}>
        <NavigationHeader
          backPress={() => this.props.navigation.goBack()}
          title={heading}
        />
        <Container>
          <ScrollView showsVerticalScrollIndicator={false}>
            {/*{completed === 1 &&*/}
            {/*  <View style={styles.questionContainer}>*/}
            {/*    <Text>There are no more questions in this Assessment!</Text>*/}
            {/*  </View>*/}
            {/*}*/}
            {loadingQuestion && <ActivityIndicator />}
            {currentQuestion && Object.keys(currentQuestion).length > 0 && (
              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text
                    style={[
                      styles.question,
                      {
                        marginTop: 10,
                        alignSelf: 'flex-start',
                        fontSize: 15,
                      },
                    ]}>
                    {'Learner : ' +
                      student.node.firstname +
                      ' ' +
                      student.node.lastname}
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-evenly',
                    }}>
                    <View>
                      <TouchableOpacity
                        style={[styles.whiteScore, styles.currentScorep]}>
                        <Text style={styles.scorep}>
                          {assignment1.complete}
                        </Text>
                      </TouchableOpacity>
                      <Text
                        style={{
                          fontSize: 9,
                          textAlign: 'center',
                          marginTop: -5,
                        }}>
                        {assignment1.test}
                      </Text>
                    </View>
                    <View>
                      <TouchableOpacity
                        style={[styles.whiteScore, styles.currentScorep]}>
                        <Text style={styles.scorep}>
                          {assignment2.complete}
                        </Text>
                      </TouchableOpacity>
                      <Text
                        style={{
                          fontSize: 9,
                          textAlign: 'center',
                          marginTop: -5,
                        }}>
                        {assignment2.test}
                      </Text>
                    </View>
                    <View>
                      <TouchableOpacity
                        style={[styles.whiteScore, styles.currentScorep]}>
                        <Text style={styles.scorep}>
                          {assignment3.complete}
                        </Text>
                      </TouchableOpacity>
                      <Text
                        style={{
                          fontSize: 9,
                          textAlign: 'center',
                          marginTop: -5,
                        }}>
                        {assignment3.test}
                      </Text>
                    </View>
                    <View>
                      <TouchableOpacity
                        style={[styles.whiteScore, styles.currentScorep]}>
                        <Text style={styles.scorep}>
                          {assignment4.complete}
                        </Text>
                      </TouchableOpacity>
                      <Text
                        style={{
                          fontSize: 9,
                          textAlign: 'center',
                          marginTop: -5,
                        }}>
                        {assignment4.test}
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={styles.questionContainer}>
                  <View style={styles.questionCategoryContainer}>
                    <View style={{flexDirection: 'row'}}>
                      <View style={{flex: 1, marginBottom: 5,flexDirection:'row'}}>
                        <Text style={styles.groupName}>
                          {groupName} . Level {currentQuestion.level}
                        </Text>
                        
                      </View>
                      <View style={{flexDirection: 'row'}}>
                        {previous === 1 && (
                          <TouchableOpacity
                            onPress={() =>
                              this.getQuestionByNumber(
                                currentQuestion.questionNum - 1,
                              )
                            }>
                            <MaterialCommunityIcons
                              name="chevron-left"
                              size={28}
                              color={Color.grayFill}
                            />
                          </TouchableOpacity>
                        )}
                        <View style={{marginTop:5}}>
                        <Text style={styles.groupName}>
                          {currentIndex+1}/
                          {questionsLength}
                        </Text>
                        </View>
               
                        {next === 1 && (
                          <TouchableOpacity
                            onPress={() =>
                              this.getQuestionByNumber(
                                currentQuestion.questionNum + 1,
                              )
                            }>
                            <MaterialCommunityIcons
                              name="chevron-right"
                              size={28}
                              color={Color.grayFill}
                            />
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                    <View>
                    <Text style={styles.groupName}>
                          Question {' '}{currentQuestion.questionNum}
                        </Text>
                    </View>
                    <View style={{
                      flexDirection:'row',

                    }}>
                      
                      <View style={{
                        width:'90%'
                      }}>
                      <HTMLView
                        stylesheet={styles}
                        value={`<div>${currentQuestion.text}</div>`}
                      />
                      </View>
                      <View style={{
                        width:'10%'
                      }}>
                      <TouchableOpacity
                            onPress={() =>
                              this.setState({
                                modalGuide:true,
                                material:currentQuestion.materials,
                               example:currentQuestion.example,
                               objective:currentQuestion.objective
                              })
                            //  this.props.navigation.navigate('VbmappGuide',{
                            //    material:currentQuestion.materials,
                            //    example:currentQuestion.example,
                            //    objective:currentQuestion.objective
                            //  })
                            }>
                            <MaterialCommunityIcons
                              name="chevron-right"
                              size={28}
                              color={Color.grayFill}
                            />
                          </TouchableOpacity>
                      </View>
                      
                    </View>
                    <View style={styles.scoringContainer}>
                      {currentQuestion.responses.map((option) => (
                        <TouchableOpacity
                          style={styles.scoreContainer}
                          onPress={() => this.handleAnswer(option.score)}>
                          <Text style={{fontSize: 18}}>{option.score}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                    <View style={styles.scoringDetails}>
                      {currentQuestion.responses.map((option) => (
                        <Text style={styles.scoreDetail}>- {option.text}</Text>
                      ))}
                    </View>
                  </View>
                </View>
              </View>
            )}
            <View style={styles.scoreboardContainer}>
              <View style={styles.scoreboardHeader}>
                <Text style={styles.scoreboardHeading}>Scoreboard</Text>
                <Text style={styles.scoreboardScore}>
                  {loadingQuestion === false && totalScore}        

                </Text>
              </View>

              {scoreboard.length===0 && <LoadingIndicator />}
              <View style={styles.scoreboard}>
                {loadingQuestion && <ActivityIndicator />}
                {loadingQuestion === false &&
                  scoreboard.length > 0 &&
                  scoreboard}
                {loadingQuestion === false && scoreboard.length === 0 && (
                  <Text>Start answering questions to see the scoreboard</Text>
                )}
              </View>
              {this.vbmappGuideModal()}
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
    backgroundColor: Color.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pageHeading: {
    fontSize: 20,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
  },
  heading: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 10,
  },
  questionContainer: {
    marginTop: 20,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#DDD',
    padding: 20,
  },
  question: {
    fontSize: 16,
    textAlign: 'justify',
    fontWeight: '700',
    color: '#45494E',
  },
  div: {
    fontSize: 16,
    textAlign: 'justify',
    fontWeight: '700',
    color: '#45494E',
  },

  groupName: {
    textTransform: 'uppercase',
    flex: 1,
  },
  scoringContainer: {
    marginVertical: 20,
    flexDirection: 'row',
  },
  scoreContainer: {
    height: 50,
    width: 50,
    marginHorizontal: 10,
    borderWidth: 1,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#555',
  },
  scoreDetail: {
    marginVertical: 10,
  },
  scoreboardContainer: {
    marginVertical: 20,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#DDD',
    padding: 20,
  },
  scoreboardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scoreboardHeading: {
    fontSize: 16,
    flex: 4,
    fontWeight: '700',
    color: '#45494E',
  },
  scoreboardScore: {
    fontSize: 16,
    flex: 1,
    textAlign: 'right',
    fontWeight: '700',
    color: '#3E7BFA',
  },
  levelContainer: {
    flexDirection: 'row',
  },
  level: {
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#DDD',
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginVertical: 5,
    marginRight: 20,
  },
  levelScores: {
    flexDirection: 'row',
  },
  emptyScore: {
    marginVertical: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    width: 32,
    borderColor: '#DDD',
    padding: 5,
    borderRadius: 10,
    marginRight: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  currentScore: {
    borderWidth: 2,
    borderColor: '#000',
  },

  redScore: {
    marginVertical: 10,
    backgroundColor: '#FF8080',
    borderWidth: 1,
    width: 32,
    borderColor: '#FF8080',
    padding: 5,
    borderRadius: 10,
    marginRight: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  yellowScore: {
    marginVertical: 10,
    backgroundColor: '#FF9C52',
    borderWidth: 1,
    width: 32,
    borderColor: '#FF9C52',
    borderRadius: 10,
    marginRight: 5,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
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
    alignItems: 'center',
  },
  scorep: {
    color: '#000',
    fontSize: 10,
  },
  currentScorep: {
    borderWidth: 1,
    borderColor: '#33a5ff',
  },
  greenScore: {
    marginVertical: 10,
    backgroundColor: '#4BAEA0',
    borderWidth: 1,
    width: 32,
    borderColor: '#4BAEA0',
    borderRadius: 10,
    marginRight: 5,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  score: {
    color: '#FFFFFF',
    fontSize: 13,
  },
});

export default MilestonesQuestions;
