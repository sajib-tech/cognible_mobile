import 'react-native-gesture-handler';
import React, { Component } from 'react';
import {
    ActivityIndicator,
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View, Image,
    Text, TextInput,
    TouchableWithoutFeedback, RefreshControl,
    Dimensions,
    TouchableOpacity,
    Alert
} from 'react-native';
import Styles from '../../../utility/Style.js';
import PickerModal from '../../../components/PickerModal';
import { getAuthResult } from '../../../redux/reducers/index';
import { setToken } from '../../../redux/actions/index';
import { connect } from 'react-redux';
import NavigationHeader from '../../../components/NavigationHeader.js';
import { Row, Container, Column } from '../../../components/GridSystem';
import OrientationHelper from '../../../helpers/OrientationHelper.js';
import Color from '../../../utility/Color';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import TherapistRequest from '../../../constants/TherapistRequest'
import Button from '../../../components/Button';
import DateInput from '../../../components/DateInput';
import store from '../../../redux/store';
import moment from 'moment';

const screenWidth = Dimensions.get('window').width
const screenHeight = Dimensions.get('window').height


class CreateProgram extends Component {
    constructor(props) {
        super(props);
        this.state = {
            student: {},
            isLoading: false,
            programTitle: '',
            programDate: moment().format('YYYY-MM-DD'),
            titleError: '',
            dateError: '',
            cateogries: [
                { id: 'Direct', label: 'Direct' },
                { id: 'Generalization', label: 'Generalization' },
                { id: 'Transformation', label: 'Transformation' },
                { id: 'Equivalence', label: 'Equivalence' }

            ],
            equivalance: [
                { id: 'Basic', label: 'Basic' },
                { id: 'Intermediate', label: 'Intermediate' },
                { id: 'Advance', label: 'Advance' },

            ],
            selectedCategory: 'Direct',
            selectedCategoryError: '',
            eqivalanceFlag : false,
            euivalanceCategory:'',
            notes: '',
            notesError: '',
            placeholderText: 'Notes',

            isInLandscape: false


        }
    }
    _refresh() {
        this.setState({ isLoading: false })
        this.componentDidMount();
    }

    componentDidMount() {
        let student = this.props.route.params.student;
        console.log(JSON.stringify(student))
        let isInLandscape = false;
        if (this.props.route.params && this.props.route.params.isInLandscape) {
            isInLandscape = this.props.route.params.isInLandscape;
        }
        this.setState({
            student: student,
            isInLandscape: isInLandscape
        })
    }

    displayForm() {
        let { programTitle, cateogries, selectedCategory, euivalanceCategory,notes, equivalance,programDate ,eqivalanceFlag} = this.state;
        return (
            <>
                <Text style={Styles.grayText}>Program Title</Text>
                {this.state.titleError != '' && <Text style={{ color: Color.danger }}>{this.state.titleError}</Text>}
                <TextInput style={Styles.input}
                    multiline={true}
                    placeholder={'Title'}
                    defaultValue={programTitle}
                    onChangeText={(programTitle) => this.setState({ programTitle })}
                />
                {this.state.selectedCategoryError != '' && <Text style={{ color: Color.danger }}>{this.state.selectedCategoryError}</Text>}
                <PickerModal
                    label="Assessment Type"
                    error={this.state.categoryErrorMessage}
                    selectedValue={this.state.selectedCategory}
                    data={cateogries}
                    onValueChange={(itemValue, itemIndex) => {
                        if(selectedCategory==='Transformation'){
                            alert('Under Construction')
                        }
                        this.setState({ selectedCategory: itemValue });
                        if(selectedCategory ==='Equivalance'){
                            this.setState({eqivalanceFlag:true});
                            console.log("SSSSSSSSS",{selectedCategory} );

                        //
                        }else{
                            this.setState({eqivalanceFlag:false})
                        }
                    }}
                />
                {/*{this.state.eqivalanceFlag &&*/}
                {/*<PickerModal*/}
                {/*    label="Equivalance Type"*/}
                {/*    error={this.state.categoryErrorMessage}*/}
                {/*    selectedValue={euivalanceCategory}*/}
                {/*    data={equivalance}*/}
                {/*    onValueChange={(itemValue, itemIndex) => {*/}
                {/*        this.setState({selectedCategory: itemValue});*/}
                {/*    }}*/}
                {/*/>*/}
                {/*}*/}
                <DateInput
                    format='YYYY-MM-DD'
                    displayFormat='dddd, DD MMM YYYY'
                    value={programDate}
                    onChange={(programDate) => {
                        console.log('result', programDate);
                        this.setState({ programDate });
                    }} />

                <Text style={Styles.grayText}>Notes</Text>
                {this.state.notesError != '' && <Text style={{ color: Color.danger }}>{this.state.notesError}</Text>}

                <TextInput
                    style={[Styles.input,{height:60}]}
                    underlineColorAndroid="transparent"
                    placeholder={this.state.placeholderText}
                    numberOfLines={10}
                    defaultValue={this.state.notes}
                    onChangeText={(notes) => {
                        this.setState({ notes });
                    }}
                />
            </>
        )
    }
    validateForm() {
        let anyError = false;

        this.setState({
            titleError: '',
            notesError: '',
            dateError: '',
            selectedCategoryError: '',
            selectedequivalanceErrorMess:''
        });

        if (this.state.programTitle == '') {
            this.setState({ titleError: 'Please fill program title' });
            anyError = true;
        }

        if (this.state.programDate == '') {
            this.setState({ dateError: 'Please fill program date' });
            anyError = true;
        }

        if (this.state.notes == '') {
            this.setState({ notesError: 'Please fill notes' });
            anyError = true;
        }

        if (this.state.selectedCategory == '') {
            this.setState({ selectedCategoryError: 'Please select category' });
            anyError = true;
        }
        if(this.state.selectedequivalanceErrorMess == ''){
            this.setState({ selectedequivalanceErrorMess: 'Please select equivalnce' });
            anyError = true;
        }
        return anyError;
    }

    saveProgram() {
        if (this.validateForm()) {
            return;
        }

        // createProgram($studentId: ID!, $title: String!, $category: String!, $notes: String!){
        let queryString = {
            studentId: this.state.student.node.id,
            title: this.state.programTitle,
            date: this.state.programDate,
            category: this.state.selectedCategory,
            notes: this.state.notes,
        };

        console.log(queryString);

        this.setState({ isLoading: true });

        TherapistRequest.createProgram(queryString).then(createProgramData => {
            console.log('createProgramData', createProgramData);

            this.setState({
                isLoading: false,
                programTitle: '',
                selectedCategory: '',
                notes: '',
            });
            let parentScreen = store.getState().peakPrograms;
            if (parentScreen) {
                parentScreen._refresh();
            }
            Alert.alert('Information', 'New Program Added Successfully.');
            if(!this.props.route.params.isInLandscape) {
                this.props.navigation.goBack();
            }

        }).catch(error => {
            console.log(error, error.response);
            console.log(JSON.stringify(error));
            this.setState({ isLoading: false });

            Alert.alert('Information', error.toString());
        });
    }

    render() {
        let { isLoading, isInLandscape } = this.state;
        return (
            <SafeAreaView style={styles.container}>
                <NavigationHeader
                    backPress={() => this.props.navigation.goBack()}
                    title="Create Assessment"
                    enable={this.props.disableNavigation != true}
                    disabledTitle={true}
                />

                <Container enablePadding={this.props.disableNavigation != true}>
                    <ScrollView keyboardShouldPersistTaps='handled' showsVerticalScrollIndicator={false} contentInsetAdjustmentBehavior="automatic"
                        style={{ backgroundColor: '#FFFFFF' }}>
                        {this.displayForm()}
                    </ScrollView>

                    <Button
                        style={{ marginBottom: 10 }}
                        labelButton="Create Assessment"
                        onPress={() => {
                            this.saveProgram()
                        }}
                    />
                </Container>
                {isLoading && (
                    <ActivityIndicator size="large" color="black" style={{
                        zIndex: 9999999,
                        // backgroundColor: '#ccc',
                        opacity: 0.9,
                        position: 'absolute',
                        top: 0, left: 0, right: 0, bottom: 0,
                        height: screenHeight,
                        justifyContent: "center"
                    }} />
                )}
            </SafeAreaView>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Color.white
    },
    TextInputStyleClass: {
        borderWidth: 1,
        borderColor: Color.gray,
        borderRadius: 5,
        height: 110,
        marginVertical: 5,
        paddingHorizontal: 10,
        textAlignVertical: 'top'
    },
});
const mapStateToProps = (state) => ({
    authResult: getAuthResult(state)
});

const mapDispatchToProps = (dispatch) => ({
    dispatchSetToken: (data) => dispatch(setToken(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateProgram);

