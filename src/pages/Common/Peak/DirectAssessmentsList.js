import 'react-native-gesture-handler';
import React, { Component } from 'react';
import {
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
import { getAuthResult } from '../../../redux/reducers/index'
import { setToken } from '../../../redux/actions/index';
import { connect } from 'react-redux';
import NavigationHeader from '../../../components/NavigationHeader.js';
import { Row, Container, Column } from '../../../components/GridSystem';
import OrientationHelper from '../../../helpers/OrientationHelper.js';
import Color from '../../../utility/Color';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Button from '../../../components/Button';
import TherapistRequest from '../../../constants/TherapistRequest'

const screenWidth = Dimensions.get('window').width
const screenHeight = Dimensions.get('window').height

class DirectAssessmentsList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            student: {}
        }
    }
    _refresh() {
        this.setState({ isLoading: false })
        this.componentDidMount();
    }

    componentDidMount() {
        let student = this.props.route.params.student;
        this.setState({
            student: student
        });
        TherapistRequest.setDispatchFunction(this.props.dispatchSetToken);
    }
    render() {
        return(
            <SafeAreaView style={styles.container}>
                <NavigationHeader
                    backPress={() => this.props.navigation.goBack()}
                    title="PEAK DT-1"
                />
                <ScrollView keyboardShouldPersistTaps='handled' showsVerticalScrollIndicator={false} contentInsetAdjustmentBehavior="automatic"
                    style={{backgroundColor: '#FFFFFF'}}>

                </ScrollView>
                <View style={{paddingVertical: 5}}>
                    <Button
                        labelButton="Create Assessment"
                        onPress={() => {
                            this.props.navigation.navigate("PeakScreen", {student: this.state.student})
                        }}
                    />
                </View>
            </SafeAreaView >
        )
    }

}

const styles = StyleSheet.create({
});

const mapStateToProps = (state) => ({
    authResult: getAuthResult(state)
});

const mapDispatchToProps = (dispatch) => ({
    dispatchSetToken: (data) => dispatch(setToken(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(DirectAssessmentsList);
