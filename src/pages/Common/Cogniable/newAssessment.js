import React, {Component} from 'react';
import {
  Alert,
  ActivityIndicator,
  Dimensions,
  Text,
  View,
  TextInput,
  StyleSheet,
  Image,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Color from '../../../utility/Color';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import TherapistRequest from '../../../constants/TherapistRequest';
import Styles from '../../../utility/Style.js';
import { getStr } from '../../../../locales/Locale';

class NewAssessmentCogniable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      notes: '',
      notesError: '',
      placeholderText: getStr("TargetAllocate.Notes"),
      titleError:''

    };
  }

  handleNewAssessment = () => {
    const {student, areas, program} = this.props.route.params;
    console.log(JSON.stringify(areas));
    const {name, notes} = this.state;
    let variables = {
      studentID: student.node.id,
      name: name,
      notes: notes,
    };
    TherapistRequest.startCogniableAssessment(variables).then(result => {
      console.log(JSON.stringify(result));
      this.props.navigation.navigate('QuestionsCogniable', {
        student: student,
        pk: result.data.startCogniableAssess.details.id,
        areas: areas,
        program: program,
      });
    });
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <MaterialCommunityIcons
                name="chevron-left"
                size={40}
                color={Color.grayFill}
              />
            </TouchableOpacity>
    <Text style={styles.pageHeading}>{getStr("homeScreenAutism.NewAssesment")}</Text>
            <Text />
          </View>
          <View style={styles.formContainer}>
    <Text style={[Styles.grayText,{marginHorizontal:10}]}>{getStr("TargetAllocate.Title")}</Text>
                {this.state.titleError != '' && <Text style={{ color: Color.danger }}>{this.state.titleError}</Text>}
                <TextInput style={[styles.input,{marginHorizontal:10}]}
                    multiline={true}
                    placeholder={getStr("TargetAllocate.Title")}
                    defaultValue={this.state.name}
                    onChangeText={(name) => this.setState({ name:name })}
                />
            <Text style={[Styles.grayText,{marginHorizontal:10}]}>{getStr("TargetAllocate.Notes")}</Text>
                {this.state.notesError != '' && <Text style={{ color: Color.danger,marginHorizontal:10 }}>{this.state.notesError}</Text>}

                <TextInput
                    style={[styles.input,{height:40,marginHorizontal:10}]}
                    underlineColorAndroid="transparent"
                    placeholder={this.state.placeholderText}
                    placeholderTextColor={"#9E9E9E"}
                    numberOfLines={10}
                    value={this.state.notes}
                    onChangeText={(notes) => {
                        this.setState({ notes });
                    }}
                />
            <TouchableOpacity
              onPress={this.handleNewAssessment}
              style={[styles.buttonFilled,{marginHorizontal:10}]}>
              <Text style={styles.buttonText}>{getStr("program.startAssessment_btn")}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pageHeading: {
    fontSize: 24,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
  },
  formContainer: {
    marginTop: 30,
  },
  inputContainer: {
    marginVertical: 10,
  },
  legend: {
    fontSize: 20,
    fontWeight: '700',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#D5D5D5',
    borderRadius: 10,
    marginTop: 10,
    padding: 10,
  },
  colors: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  buttonFilled: {
    marginTop: 20,
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#3E7BFA',
    marginBottom: 40,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  TextInputStyleClass: {
    borderWidth: 1,
    borderColor: Color.gray,
    borderRadius: 5,
    backgroundColor: "#FFFFFF",
    height: 110,
    marginVertical: 5,
    paddingHorizontal: 10,
    textAlignVertical: 'top'
},
  input: {
    marginVertical: 10,
    padding: 6,
    borderRadius: 6,
    borderColor: '#DCDCDC',
    borderWidth: 1,
    flex: 1,
    flexDirection: 'row'
  },
});

export default NewAssessmentCogniable;
