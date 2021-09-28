import React, { Component } from 'react';
import { Alert, ActivityIndicator, Dimensions, Text, View, TextInput, StyleSheet, Image, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import Color from '../../../utility/Color';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import TherapistRequest from '../../../constants/TherapistRequest';

class NewAssessmentBehavior extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            notes: ''
        }
    }

    handleNewAssessment = () => {
        const { student, areas, program } = this.props.route.params;
        console.log(JSON.stringify(areas));
        const { name, notes } = this.state;
        console.log("1234444555888"+student.node.id+name+areas+program);
        let variables = {
            title: name,
            studentID: student.node.id,

        };
        TherapistRequest.startBehaviourlAssessment(variables).then(result => {
            console.log("BEASSESSSSDDS"+JSON.stringify(result));
            this.props.navigation.navigate('QuestionsBehavior', {

                student: student,
                pk: result.data.behStartAssessment.details.id,
                areas: areas,
                program: program
            });
        });
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <ScrollView>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                        <MaterialCommunityIcons
                        name='chevron-left'
                        size={40}
                        color={Color.grayFill}
                        />
                    </TouchableOpacity>
                    <Text style={styles.pageHeading}>New Assessment</Text>
                    <Text></Text>
                    </View>
                    <View style={styles.formContainer}>
                        <View style={styles.inputContainer}>
                            <Text style={styles.legend}>Title</Text>
                            <TextInput
                                style={styles.textInput}
                                onChangeText={(val) => this.setState({ name: val })}
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.legend}>Notes</Text>
                            <TextInput
                                style={styles.textInput}
                                numberOfLines={4}
                                onChangeText={(val) => this.setState({ notes: val })}
                            />
                        </View>
                        <TouchableOpacity onPress={this.handleNewAssessment} style={styles.buttonFilled}>
                            <Text style={styles.buttonText}>Start Assessment</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
        paddingTop: 20,
        paddingHorizontal: 20
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
        fontSize:20,
        fontWeight:'700'
      },
      textInput: {
        borderWidth:1,
        borderColor:'#D5D5D5',
        borderRadius:10,
        marginTop:10,
        padding:10
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
        fontSize: 16,
        fontWeight: '700',
        textAlign: 'center'
      }
});

export default NewAssessmentBehavior;
