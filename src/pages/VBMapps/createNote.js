import React, { Component } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, TextInput, Picker, SafeAreaView } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Color from '../../utility/Color';
import { client, getAreasList, createNotes } from '../../constants/therapist';
import NavigationHeader from '../../components/NavigationHeader.js';
import { Row, Container, Column } from '../../components/GridSystem';
import { Alert } from 'react-native';

class CreateNote extends Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
      area: '',
      note:'',
      areas: []
    }
  }

  componentDidMount() {
    this.getAreas();
  }

  handleSaveNote = () => {
    const { master, testNo,parent } = this.props.route.params;
    const { area, note } = this.state;
    client.mutate({
      mutation: createNotes,
      variables: {
        areaID: area,
        master: master,
        note: note
      }
    }).then(result => {
      console.log("result creating>>>",result.data);
      Alert.alert(
				'Notes',
				'Successfully Saved',
				[{
					text: 'OK', onPress: () => {
						console.log('OK Pressed');
            // getData()
            if(parent){
              parent.getResultData()
            }
            this.props.navigation.goBack()
           
						
					}
				}],
				{ cancelable: false }
			);
      // this.props.navigation.navigate('NotesList', {
      //   master: master,
      //   testNo: testNo
      // })
    }).catch(err => console.log(JSON.stringify(err)));
  }

  getAreas() {
    client.query({
      query: getAreasList,
    }).then(result => {
      console.log(result.data.vbmappAreas);
      this.setState({
        areas: result.data.vbmappAreas
      })
    }).catch(err => console.log(JSON.stringify(err)));
  }

  updateArea = (area) => {
    this.setState({ area: area })
 }

  render() {
    const { area, areas, note } = this.state;
    const { student } = this.props.route.params;
    return (
      <SafeAreaView style={styles.container}>
        <NavigationHeader
            backPress={() => this.props.navigation.goBack()}
            title="Create Note"
        />
        <Container>
          <View style={styles.formContainer}>
            <Picker
              selectedValue={area}
              onValueChange={this.updateArea}
            >
              {areas && areas.length > 0 && areas.map(area => 
                <Picker.Item label={area.areaName} value={area.id} />
              )}
            </Picker>
            <View style={styles.inputContainer}>
              <TextInput
                multiline={true}
                textAlignVertical={'top'}
                style={styles.textInput}
                value={note}
                onChangeText={(note) => this.setState({ note })}
                placeholder="Notes about assessment"
                numberOfLines={24}
              />
            </View>
            <TouchableOpacity onPress={this.handleSaveNote} style={styles.buttonFilled}>
              <Text style={styles.buttonText}>Save Note</Text>
            </TouchableOpacity>
          </View>
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
    marginTop: 30
  },
  inputContainer: {
    marginVertical: 10
  },
  legend: {
    fontSize: 20,
    fontWeight: '700'
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#D5D5D5',
    borderRadius: 10,
    marginTop: 10,
    padding: 10
  },
  buttonFilled: {
    marginTop: 20,
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#3E7BFA',
    marginBottom: 40
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center'
  }
});

export default CreateNote;