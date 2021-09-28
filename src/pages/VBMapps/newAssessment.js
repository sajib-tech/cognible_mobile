import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TextInput,
  SafeAreaView,
  Alert
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Color from '../../utility/Color';
import { client, createAssessment } from '../../constants/therapist';
import store from '../../redux/store';
import { connect } from 'react-redux';
import { getAuthResult } from '../../redux/reducers/index';
import { setToken, setTokenPayload } from '../../redux/actions/index';
import NavigationHeader from '../../components/NavigationHeader.js';
import { Row, Container, Column } from '../../components/GridSystem';

const colors = ['#FF9C52', '#3E7BFA', '#5F6CAF', '#4BAEA0', '#FF8080', '#7480FF', '#AAAAAA', '3E7BFA'];

class NewAssessment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedColor:'#FF9C52'
    }
  }

  _refresh() {
    this.componentDidMount();
  }

  handleNewAssessment = () => {
    // // debugger
    const { selectedColor } = this.state;
    const{ student } = this.props.route.params;
    client.mutate({
      mutation: createAssessment,
      variables: {
        studentID: student.node.id,
        color: selectedColor
      }
    }).then(result => {
      // // debugger
      console.log("uhhuuuuuhhhh",JSON.stringify(result));
      let parentScreen = store.getState().assessmentsList;
      if (parentScreen) {
        parentScreen._refresh();
      }
      this.props.navigation.navigate('AreasList', {
        student: student,
        master: result.data.vbmappCreateAssessment.details.id,
        test: result.data.vbmappCreateAssessment.details.testNo
      });
    }).catch(err => console.log("uhhuuuuuhhhh",student.node.id,selectedColor));
  }

  getColors = () => {
    const { selectedColor } = this.state;
    let colorsView = [];
    for(let x=0;x<colors.length;x++) {
      if(colors[x] === selectedColor) {
        colorsView.push(
          <TouchableOpacity style={{ backgroundColor: colors[x], height: 40, width: 40, borderRadius: 8, borderWidth:3, borderColor:'blue' }}></TouchableOpacity>
        )
      } else {
        colorsView.push(
          <TouchableOpacity onPress={() => this.setState({ selectedColor: colors[x] })} style={{ backgroundColor: colors[x], height: 40, width: 40, borderRadius: 8 }}></TouchableOpacity>
        )
      }
    }
    return colorsView;
  }

  render() {
    const assessmentName = "Assessment " + this.props.route.params.assessmentNumber;
    return (
      <SafeAreaView style={styles.container}>
        <NavigationHeader
            backPress={() => this.props.navigation.goBack()}
            title="New Assessment"
        />
        <Container>
          <ScrollView>
            <View style={styles.formContainer}>
              <View style={styles.inputContainer}>
                <Text style={styles.legend}>Assessment Title</Text>
                <View style={[styles.textInput,{}]}>
                <Text style={{marginTop:8}}>
                  {assessmentName}
                </Text>
                </View>
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.legend}>Notes</Text>
                <TextInput
                  style={styles.textInput}
                  numberOfLines={4}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.legend}>Colors</Text>
                <View style={styles.colors}>
                  {this.getColors()}
                </View>
              </View>
              <TouchableOpacity onPress={this.handleNewAssessment} style={styles.buttonFilled}>
                <Text style={styles.buttonText}>Start Assessment</Text>
              </TouchableOpacity>
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
  formContainer: {
    marginTop:30
  },
  inputContainer: {
    marginVertical:10
  },
  legend: {
    fontSize:16,
    fontWeight:'700'
  },
  textInput: {
    borderWidth:1,
    borderColor:'#D5D5D5',
    borderRadius:10,
    height:40,
    paddingLeft:10
  },
  colors: {
    marginTop:10,
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    flexWrap:'wrap'
  },
  buttonFilled: {
    marginTop:20,
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#3E7BFA',
    marginBottom: 40
  },
  buttonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center'
  }
});

const mapStateToProps = (state) => ({
  authResult: getAuthResult(state)
});

const mapDispatchToProps = (dispatch) => ({
  dispatchSetToken: (data) => dispatch(setToken(data)),
  dispatchSetTokenPayload: (data) => dispatch(setTokenPayload(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(NewAssessment);
