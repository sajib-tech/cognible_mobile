import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView, SafeAreaView } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Color from '../../utility/Color';
import { client, getQuestions, submitResponse } from '../../constants/therapist';
import NavigationHeader from '../../components/NavigationHeader.js';
import { Row, Container, Column } from '../../components/GridSystem';

class BarriersQuestions extends Component {
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
      loadingQuestion: true,
      questionLength:0,
      previous: 0,
      next: 0
    }
  }

  componentDidMount() {
    this.getQuestion();
  }

  handleAnswer(score) {
    this.setState({
      loadingQuestion: true
    })
    const { currentIndex, questions } = this.state;
    const { student, area, group, master } = this.props.route.params;
    var index = currentIndex;
    var newIndex = index + 1;
    client.mutate({
      mutation: submitResponse,
      variables: {
        master: master,
        areaID: area.id,
        groupID: group.node.id,
        question: newIndex,
        score: score
      }
    }).then(result => {
      this.getQuestion();
    }).catch(err => console.log(JSON.stringify(err)));

  }

  getQuestionByNumber = quesNum => {
    this.setState({
      loadingQuestion: true
    })
    const { student, area, group, master, test } = this.props.route.params;
    const { currentIndex } = this.state;
    client.mutate({
      mutation: getQuestions,
      variables: {
        master: master,
        studentID: student.node.id,
        areaID: area.id,
        groupID: group.node.id
      }
    }).then(result => {
      const questions = JSON.parse(result.data.vbmappGetQuestions.questions);
      let nextQuestionIndex = currentIndex;
      let x = 0;
      let currentLevel = 0;
      let complete = 0;
      //Looping through all questions
      for (x = 0; x < questions.length; x++) {
        if (quesNum === questions[x].questionNum) {
          this.setState({
            currentQuestion: questions[x],
            currentIndex: x,
            loadingQuestion: false
          });
          break;
        }
      }
      this.setState({
        questions: questions
      })

      if (x === 0) {
        this.setState({
          previous: 0,
          next: 1
        })
      }

      if (x > 0 && x < questions.length - 1) {
        this.setState({
          previous: 1,
          next: 1
        })
      }

      if (x >= questions.length - 1) {
        this.setState({
          previous: 1,
          next: 0
        })
      }

      if (x === questions.length) {
        complete = 1;
        this.setState({
          loadingQuestion: false
        })
      }
      this.getScoreboard(complete, questions, quesNum);
    }).catch(err => console.log(JSON.stringify(err)));
  }

  getQuestion() {
    const { student, area, group, master, test } = this.props.route.params;
    const { currentIndex } = this.state;
    let quesNum = 0;
    client.mutate({
      mutation: getQuestions,
      variables: {
        master: master,
        studentID: student.node.id,
        areaID: area.id,
        groupID: group.node.id
      }
    }).then(result => {
      const questions = JSON.parse(result.data.vbmappGetQuestions.questions);
      let nextQuestionIndex = currentIndex;
      let x = 0;
      let currentLevel = 0;
      let complete = 0;
    console.log("get>>>>",questions.length);
      this.setState({
        questionLength:questions.length
      })
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
            if (pa[y].score !== "") {
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
            loadingQuestion: false
          });
          break;
        }
        this.setState({
          questions: questions,
        })
      }

      if (x === 0) {
        this.setState({
          previous: 0,
          next: 1
        })
      }

      if (x > 0 && x < questions.length - 1) {
        this.setState({
          previous: 1,
          next: 1
        })
      }

      if (x >= questions.length - 1) {
        this.setState({
          previous: 1,
          next: 0
        })
      }

      if (x === questions.length) {
        complete = 1;
        this.setState({
          loadingQuestion: false
        })
      }
      this.getScoreboard(complete, questions, quesNum);
    }).catch(err => console.log(JSON.stringify(err)));
  }

  getScoreboard = (complete, questions, quesNum) => {
    const { test } = this.props.route.params;
    let totalScore = 0;
    let scoreboard = [];
    let answers = [];
    for (let y = 0; y < questions.length; y++) {
      let pa = questions[y].previous_assess;
      for (let z = 0; z < pa.length; z++) {
        if (pa[z].test === test) {
          switch (pa[z].score) {
            case "":
              if (quesNum === questions[y].questionNum) {
                answers.push(
                  <TouchableOpacity onPress={() => this.getQuestionByNumber(questions[y].questionNum)} style={[styles.emptyScore, styles.currentScore]}>
                    <Text style={styles.score}></Text>
                  </TouchableOpacity>
                )
              } else {
                answers.push(
                  <TouchableOpacity onPress={() => this.getQuestionByNumber(questions[y].questionNum)} style={styles.emptyScore}>
                    <Text style={styles.score}></Text>
                  </TouchableOpacity>
                )
              }
              break;

            case "0.0":
              if (quesNum === questions[y].questionNum) {
                answers.push(
                  <TouchableOpacity onPress={() => this.getQuestionByNumber(questions[y].questionNum)} style={[styles.greenScore, styles.currentScore]}>
                    <Text style={styles.score}></Text>
                  </TouchableOpacity>
                )
              } else {
                answers.push(
                  <TouchableOpacity onPress={() => this.getQuestionByNumber(questions[y].questionNum)} style={styles.greenScore}>
                    <Text style={styles.score}>0</Text>
                  </TouchableOpacity>
                )
              }
              break;

            case "1.0":
              totalScore = totalScore + 1;
              if (quesNum === questions[y].questionNum) {
                answers.push(
                  <TouchableOpacity onPress={() => this.getQuestionByNumber(questions[y].questionNum)} style={[styles.yellowScore, styles.currentScore]}>
                    <Text style={styles.score}>1</Text>
                  </TouchableOpacity>
                )
              } else {
                answers.push(
                  <TouchableOpacity onPress={() => this.getQuestionByNumber(questions[y].questionNum)} style={styles.yellowScore}>
                    <Text style={styles.score}>1</Text>
                  </TouchableOpacity>
                )
              }
              break;

            case "2.0":
              totalScore = totalScore + 2;
              if (quesNum === questions[y].questionNum) {
                answers.push(
                  <TouchableOpacity onPress={() => this.getQuestionByNumber(questions[y].questionNum)} style={[styles.yellowScore, styles.currentScore]}>
                    <Text style={styles.score}>2</Text>
                  </TouchableOpacity>
                )
              } else {
                answers.push(
                  <TouchableOpacity onPress={() => this.getQuestionByNumber(questions[y].questionNum)} style={styles.yellowScore}>
                    <Text style={styles.score}>2</Text>
                  </TouchableOpacity>
                )
              }
              break;

            case "3.0":
              totalScore = totalScore + 3;
              if (quesNum === questions[y].questionNum) {
                answers.push(
                  <TouchableOpacity onPress={() => this.getQuestionByNumber(questions[y].questionNum)} style={[styles.redScore, styles.currentScore]}>
                    <Text style={styles.score}>3</Text>
                  </TouchableOpacity>
                )
              } else {
                answers.push(
                  <TouchableOpacity onPress={() => this.getQuestionByNumber(questions[y].questionNum)} style={styles.redScore}>
                    <Text style={styles.score}>3</Text>
                  </TouchableOpacity>
                )
              }
              break;

            case "4.0":
              totalScore = totalScore + 4;
              if (quesNum === questions[y].questionNum) {
                answers.push(
                  <TouchableOpacity onPress={() => this.getQuestionByNumber(questions[y].questionNum)} style={[styles.redScore, styles.currentScore]}>
                    <Text style={styles.score}>4</Text>
                  </TouchableOpacity>
                )
              } else {
                answers.push(
                  <TouchableOpacity onPress={() => this.getQuestionByNumber(questions[y].questionNum)} style={styles.redScore}>
                    <Text style={styles.score}>4</Text>
                  </TouchableOpacity>
                )
              }
              break;

            default:
              break;
          }
        }
      }
    }

    scoreboard.push(
      <View style={styles.levelContainer}>
        <View style={styles.levelScores}>
          {answers}
        </View>
      </View>
    );
    this.setState({
      scoreboard: scoreboard,
      totalScore: totalScore
    })
    if (complete === 1) {
      this.setState({
        completed: 1
      })
    }
  }

  render() {
    const { area, group, student } = this.props.route.params;
    const { questions, currentQuestion, completed,questionLength, scoreboard,currentIndex, loadingQuestion, levels, totalScore, previous, next } = this.state;
    let assignment1 = { complete: 0, test: '' }
    let assignment2 = { complete: 0, test: '' }
    let assignment3 = { complete: 0, test: '' }
    let assignment4 = { complete: 0, test: '' }
    console.log("questionLength>>>",questions.length,questionLength);
    questions.forEach(({ previous_assess }) => {
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
    return (
      <SafeAreaView style={styles.container}>
        <NavigationHeader
          backPress={() => this.props.navigation.goBack()}
          title={heading}
        />
        <Container>
          <ScrollView style={styles.container}>
            {completed === 1 &&
              <View style={styles.questionContainer}>
                <Text>There are no more questions in this Assessment!</Text>
              </View>
            }
            {loadingQuestion && <ActivityIndicator />}
            {loadingQuestion === false && currentQuestion && Object.keys(currentQuestion).length > 0 && <View>
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

              <View style={styles.questionContainer}>
                <View style={styles.questionCategoryContainer}>
                  <View style={{ flexDirection: 'row' }}>
                    <View style={{ marginBottom: 5, flex: 1 }}>
                      <Text style={styles.groupName}>{group.node.groupName} . {currentQuestion.title}</Text>
                      <Text style={styles.groupName}>Question {currentQuestion.questionNum}</Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                      {previous === 1 && <TouchableOpacity onPress={() => this.getQuestionByNumber(currentQuestion.questionNum - 1)}>
                        <MaterialCommunityIcons
                          name='chevron-left'
                          size={28}
                          color={Color.grayFill}
                        />
                      </TouchableOpacity>}
                      <View style={{marginTop:5}}>
                        <Text style={styles.groupName}>
                          {currentIndex+1}/
                          {questionLength}
                        </Text>
                        </View>

                      {next === 1 && <TouchableOpacity onPress={() => this.getQuestionByNumber(currentQuestion.questionNum + 1)}>
                        <MaterialCommunityIcons
                          name='chevron-right'
                          size={28}
                          color={Color.grayFill}
                        />
                      </TouchableOpacity>}
                    </View>
                  </View>
                  <Text style={styles.question}>{currentQuestion.text}</Text>
                  <View style={styles.scoringDetails}>
                    {currentQuestion.responses.map(option =>
                      <Text style={styles.scoreDetail}>{option.score} - {option.text}</Text>
                    )}
                  </View>
                  <View style={styles.scoringContainer}>
                    {currentQuestion.responses.map(option =>
                      <TouchableOpacity style={styles.scoreContainer} onPress={() => this.handleAnswer(option.score)}>
                        <Text style={{ fontSize: 18 }}>{option.score}</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>

            </View>
            }
            <View style={styles.scoreboardContainer}>
              <View style={styles.scoreboardHeader}>
                <Text style={styles.scoreboardHeading}>Scoreboard</Text>
                <Text style={styles.scoreboardScore}>{loadingQuestion === false && totalScore}</Text>
              </View>
              <View style={styles.scoreboard}>
                {loadingQuestion === false && scoreboard.length > 0 ? scoreboard : <ActivityIndicator />}
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
    flex: 1,
    backgroundColor: Color.white
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
    marginTop: 20,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#DDD',
    padding: 20
  },
  question: {
    fontSize: 16,
    textAlign: 'justify',
    fontWeight: '700',
    color: '#45494E'
  },
  groupName: {
    textTransform: 'uppercase'
  },
  scoringContainer: {
    marginVertical: 20,
    flexDirection: 'row'
  },
  scoreContainer: {
    height: 40,
    width: 40,
    marginHorizontal: 10,
    borderWidth: 1,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#555'
  },
  scoreDetail: {
    marginVertical: 10
  },
  scoreboardContainer: {
    marginTop: 20,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#DDD',
    padding: 20
  },
  scoreboardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  scoreboardHeading: {
    fontSize: 16,
    flex: 4,
    fontWeight: '700',
    color: '#45494E'
  },
  scoreboardScore: {
    fontSize: 16,
    flex: 1,
    textAlign: 'right',
    fontWeight: '700',
    color: '#3E7BFA'
  },
  levelContainer: {
    flexDirection: 'row',
    flex: 1
  },
  level: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#DDD',
    padding: 10,
    marginVertical: 10,
    marginRight: 20
  },
  levelScores: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  currentScore: {
    borderWidth: 2,
    borderColor: '#000'
  },
  currentScorep: {
    borderWidth: 1,
    borderColor: '#33a5ff'
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
    alignItems: 'center'
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
    alignItems: 'center'
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
    alignItems: 'center'
  },
  whiteScore: {
    marginVertical: 10,
    backgroundColor: '#FFF',
    borderWidth: 1,
    minWidth: 32,
    borderColor: '#000',
    borderRadius: 10,
    marginRight: 5,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center'
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
    alignItems: 'center'
  },
  score: {
    color: '#FFFFFF',
    fontSize: 13
  }, scorep: {
    color: '#000',
    fontSize: 10
  }
})

export default BarriersQuestions;