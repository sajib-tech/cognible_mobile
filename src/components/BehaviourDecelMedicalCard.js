import React, { Component } from 'react';

import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import moment from 'moment';
import OrientationHelper from '../helpers/OrientationHelper';

class BehaviourDecelMedicalCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: props.title,
            description: props.description,
            time: props.time,
            riskType: props.riskType
        };
    }
    render() {
        let { riskType } = this.state;
        let rstyle = '';
        if (riskType && riskType === 'Moderate') {
            rstyle = eval('styles.moderate');
        } else if (riskType && riskType === 'Severe') {
            rstyle = eval('styles.severe');
        } else if (riskType && riskType === 'Mild') {
            rstyle = eval('styles.mild');
        }

        let timeString = moment(this.state.time).format("MMM DD, YYYY");

        if(this.props.time && this.props.time2){
            timeString = moment(this.props.time).format("MMM DD") + " - " + moment(this.props.time2).format("MMM DD, YYYY");
        }

        if (OrientationHelper.getDeviceOrientation() == 'portrait') {
            return (
                <TouchableOpacity activeOpacity={0.9} style={styles.card} onPress={()=>{
                    this.props.onPress();
                }}>
                    <Text style={styles.title}>{this.state.title}</Text>
                    <Text style={styles.description}>{this.state.description}</Text>
                    <View style={{ flexDirection: 'row', paddingTop: 10 }}>
                        <Text style={{ color: '#63686E', fontSize: 13, fontWeight: '500' }}>{timeString}</Text>
                        <Text style={{ top: -7, paddingLeft: 10, color: '#C4C4C4', fontSize: 18, fontWeight: '700' }}>.</Text>
                        <Text style={[styles.risk, rstyle]}>{this.state.riskType}</Text>
                    </View>
                </TouchableOpacity>
            );
        } else {
            return (
                <TouchableOpacity activeOpacity={0.9} style={styles.card} onPress={()=>{
                    this.props.onPress();
                }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={[styles.title, { flex: 1 }]}>{this.state.title}</Text>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ color: '#63686E', fontSize: 13, fontWeight: '500' }}>{timeString}</Text>
                            <Text style={{ top: -7, paddingLeft: 10, color: '#C4C4C4', fontSize: 18, fontWeight: '700' }}>.</Text>
                            <Text style={[styles.risk, rstyle]}>{this.state.riskType}</Text>
                        </View>
                    </View>
                    <Text style={styles.description}>{this.state.description}</Text>
                </TouchableOpacity>
            );
        }
    }
}
const styles = StyleSheet.create({
    card: {
        padding: 16,
        borderRadius: 5,
        margin: 5,
        marginBottom: 10,
        flex: 1,
        backgroundColor: '#fff',

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,

        elevation: 3,
    },
    title: {
        color: '#45494E',
        fontSize: 16,
        fontWeight: '700'
    },
    description: {
        paddingTop: 10,
        color: 'rgba(95, 95, 95, 0.75)',
        fontSize: 13,
        fontWeight: 'normal'
    },
    risk: {
        paddingLeft: 10,
        color: '#63686E',
        fontSize: 13,
        fontWeight: '500'
    },
    moderate: {
        color: '#FF9C52'
    },
    severe: {
        color: '#FF8080'
    },
    mild: {
        color: '#5F6CAF'
    }
});
export default BehaviourDecelMedicalCard;