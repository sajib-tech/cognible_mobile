
import React, {Component} from 'react';

import {Text, View, StyleSheet, Image, SafeAreaView, ScrollView, TouchableOpacity} from 'react-native';
import {getStr} from '../../../locales/Locale';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

class DiscriminativeStimulus extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return(
            <View style={{textAlign: 'center', alignItems: 'center'}}>
                <Text>DiscriminativeStimulus screen flow starts from here</Text>
            </View>
        )
    }
}
const styles = StyleSheet.create({

});

export default DiscriminativeStimulus;