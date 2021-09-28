import 'react-native-gesture-handler';
import React, { Component } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View, Image,
    Text, TextInput,
    TouchableWithoutFeedback
} from 'react-native';

class ClinicStudentHome extends Component {

    constructor(props) {
        super(props);
    }
    render() {
        return (
            <SafeAreaView>
                <ScrollView contentInsetAdjustmentBehavior="automatic" style={styles.scrollView}>
                    <Text>ClinicStudentHome page</Text>
                </ScrollView>
            </SafeAreaView>
        )
    }
}
const styles = StyleSheet.create({});
export default ClinicStudentHome;
