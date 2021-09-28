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
  Alert,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Color from '../../utility/Color';
import {
  client,
  getQuestions,
  submitResponseTask,
  getReportVbmapps,
} from '../../constants/therapist';
import HTML from 'react-native-render-html';
import NavigationHeader from '../../components/NavigationHeader.js';
import {Row, Container, Column} from '../../components/GridSystem';
import LoadingIndicator from '../../components/LoadingIndicator';

class TaskQuestions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentIndex: 0,
      completed: 0,
      questions: [],
      currentQuestion: {},
      scoreboard: [],
      totalScore: 0.0,
      levels: [],
      dbQuestionNumber: 1,
      loadingQuestion: true,
      questionLength:0,
      previous: 0,
      next: 0,
      answered: [],
      isSubmitAnswer: false,
    };
  }

  componentDidMount() {
    console.log(this.props.route.params);
    this.getQuestion();
  }

  getAnswers() {
    const {master,group} = this.props.route.params;
    let answered = [];   
    client
      .mutate({
        mutation: getReportVbmapps,
        variables: {
          master: master,
          area: 'VmJtYXBwQXJlYTo1',
          groupId:group.node.id
        },
      })
      .then((res) => {
        answered = res.data.vbmappGetReport.details.records.edges;
        this.setState({answered: res.data.vbmappGetReport});
      })
      .catch((err) => console.log(err));
  }

  getQuestion() {
    const {student, area, group, master, test} = this.props.route.params;
    const {currentIndex} = this.state;
    let answered = [];
    let quesNum = 0;
    
    client
      .mutate({
        mutation: getReportVbmapps,
        variables: {
          master: master,
          area: 'VmJtYXBwQXJlYTo1',
          groupId:group.node.id
        },
      })
      .then((res) => {
        answered = res.data.vbmappGetReport.details.records.edges;
        this.setState({answered: res.data.vbmappGetReport});
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
            const questions = JSON.parse(
              result.data.vbmappGetQuestions.questions,
            );
            console.log({questions});
            let x = 0;
            //Looping through all questions
            questions.forEach((element) => {
              answered?.details?.records?.edges?.forEach((e) => {
                //if(element.)
              });
            });
            this.setState({
              questionLength:questions.length
            })
            for (x = 0; x < questions.length; x++) {
              let already_assessed = false;
              for (let y = 0; y < answered.length; y++) {
                if (answered[y].node.questionNum === questions[x].questionNum) {
                  already_assessed = true;
                  break;
                }
              }
              console.log(already_assessed, 'o');
              if (!already_assessed) {
                quesNum = questions[x].questionNum;
                console.log(questions[x]);
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
              this.setState({
                loadingQuestion: false,
              });
            }
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  }

  handleAnswer(skill) {
    this.setState({
      isSubmitAnswer: true,
    });
    const {dbQuestionNumber} = this.state;
    const {area, group, master} = this.props.route.params;
    client
      .mutate({
        mutation: submitResponseTask,
        variables: {
          master: master,
          areaID: 'VmJtYXBwQXJlYTo1',
          groupID: group.node.id,
          question: dbQuestionNumber,
          code: skill,
        },
      })
      .then((result) => {
        console.log(result);
        this.setState({isSubmitAnswer: false});
      })
      .catch((err) => {
        this.setState({isSubmitAnswer: false});
        console.log(JSON.stringify(err));
      });
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
        console.log(questions);
        let x = 0;
        let complete = 0;
        //Looping through all questions
        for (x = 0; x < questions.length; x++) {
          if (questions[x].questionNum === quesNum) {
            // questions[x].color="#000"
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

        this.getAnswers();
      })
      .catch((err) => console.log(err));
  };

  renderAnswer(currentQuestion) {
    if (this.state.isSubmitAnswer) {
      return <LoadingIndicator />;
    }
    currentQuestion.skills.forEach((element) => {
      console.log('element', element);
      this.state.answered?.details?.records?.edges?.forEach((e) => {
        if (element.id == e.node?.code) {
          element.color = '#4BAEA0';
        }
      });
    });

    let co=[]
    if(this.props.route.params.group.node.groupName==='Echoic'){
      co=this.state.answered?.details?.records?.edges.filter(({node})=>{       
        return node.questionNum===currentQuestion.questionNum
      })
    }

    

    

    // Alert.alert(JSON.stringify(this.state.answered?.details?.records?.edges))
    return (
      <>
       {this.props.route.params.group.node.groupName==='Echoic' && 
                        <View>
                          <View style={{flexDirection: 'row', marginVertical: 10}}>
            {/* <Text>{JSON.stringify(skill)}</Text> */}
            <Text style={{fontWeight: '700', flex: 1}}>{currentQuestion.questionNum}-M</Text>
            <View style={{width: '65%'}}>
            </View>

            {/* <Text style={{ flex:5 }}>{skill.skill}</Text> */}
            <TouchableOpacity
             
              style={[
                styles.scoreContainer,
                {flex: 1, 
                backgroundColor: co.length !==0  && co[0].node.questionNum === currentQuestion.questionNum ? 'green' : 'white',
                }

              ]}></TouchableOpacity>
          </View>
                        </View>
                        }
        {currentQuestion.skills.map((skill, key) => (
          <View style={{flexDirection: 'row', marginVertical: 10}} key={key}>
            {/* <Text>{JSON.stringify(skill)}</Text> */}
            <Text style={{fontWeight: '700', flex: 1}}>{skill.id}</Text>
            <View style={{width: '65%'}}>
              <HTML html={skill.skill}></HTML>
            </View>

            {/* <Text style={{ flex:5 }}>{skill.skill}</Text> */}
            <TouchableOpacity
              onPress={() => {
                this.handleAnswer(skill.id);
                skill.color = '#4BAEA0';
                // this.getQuestionByNumber(currentQuestion.questionNum + 1)
              }}
              style={[
                styles.scoreContainer,
                {flex: 1, backgroundColor: skill.color},
              ]}></TouchableOpacity>
          </View>
        ))}
      </>
    );
  }

  render() {
    const {area, group, student} = this.props.route.params;
    const {
      questions,
      currentQuestion,
      completed,
      scoreboard,
      loadingQuestion,
      currentIndex,
      questionLength,
      levels,
      totalScore,
      previous,
      next,
      answered,
    } = this.state;
    let heading = area.name + ' Assessment';
    // console.log(questions, currentQuestion, completed, scoreboard, loadingQuestion, levels, totalScore, previous, next, answered);
    // Alert.alert(JSON.stringify(currentQuestion))
    console.log({currentQuestion});
    return (
      <SafeAreaView style={styles.container}>
        <NavigationHeader
          backPress={() => this.props.navigation.goBack()}
          title={heading}
        />

        {loadingQuestion && <LoadingIndicator />}

        {!loadingQuestion && (
          <Container>
            <ScrollView>
              {completed === 1 && (
                <View style={styles.questionContainer}>
                  <Text>There are no more questions in this Assessment!</Text>
                </View>
              )}
              {completed === 0 &&
                currentQuestion &&
                Object.keys(currentQuestion).length > 0 && (
                  <View>
                    <Text
                      style={[
                        styles.question,
                        {marginTop: 10, alignSelf: 'center'},
                      ]}>
                      {'Learner : ' +
                        student.node.firstname +
                        ' ' +
                        student.node.lastname}
                    </Text>
                    <View style={styles.questionContainer}>
                      <View style={styles.questionCategoryContainer}>
                        <View style={{flexDirection: 'row'}}>
                          <View style={{flex: 1, marginBottom: 5}}>
                            {/* <Text>{JSON.stringify(answered?.details?.records?.edges)}</Text> */}
                            <Text style={styles.groupName}>
                              {group.node.groupName} • Level{' '}
                              {currentQuestion.level}
                            </Text>
                            <Text style={styles.groupName}>
                              Question {currentQuestion.questionNum}
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
                          {questionLength}
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
                        {/* <Text>{JSON.stringify(currentQuestion)}</Text> */}
                        <Text>{currentQuestion.responses?.score}</Text>
                        <View>
                          <HTMLView
                            stylesheet={styles}
                            value={`<div>${currentQuestion.text}</div>`}
                          />
                        </View>                      
                        
                        <View>{this.renderAnswer(currentQuestion)}</View>
                      </View>
                    </View>
                  </View>
                )}
            </ScrollView>
          </Container>
        )}
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
    borderRadius: 10,
    borderColor: '#DDD',
    padding: 10,
    marginVertical: 10,
    marginRight: 20,
  },
  levelScores: {
    flexDirection: 'row',
  },
  emptyScore: {
    marginVertical: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    width: 40,
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
    width: 40,
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
    width: 40,
    borderColor: '#FF9C52',
    borderRadius: 10,
    marginRight: 5,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  greenScore: {
    marginVertical: 10,
    backgroundColor: '#4BAEA0',
    borderWidth: 1,
    width: 40,
    borderColor: '#4BAEA0',
    borderRadius: 10,
    marginRight: 5,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  score: {
    color: '#FFFFFF',
  },
});

export default TaskQuestions;
