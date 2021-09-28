import React, { Component } from 'react';
import { Text, TouchableOpacity, View, Alert, Linking, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Color from '../utility/Color';
import FeedbackButton from './FeedbackButton';
import moment from 'moment';

class AppointmentCard extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }

    render() {
        let appointment = this.props.appointment;
        let isApprooved = appointment ?.node ?.isApproved == true ? 'Open' : 'Close';
        let statusColor = "green";
        // console.log("Appointment", appointment);

        let studentName = "-";
        if (appointment.node.student) {
            studentName = (appointment.node.student ?.firstname + " " + appointment.node.student ?.lastname).trim();
        }
        if (appointment.node?.appointmentStatus?.appointmentStatus) {
            switch (appointment?.node?.appointmentStatus?.appointmentStatus) {
                case "Pending":
                    statusColor = Color.darkOrange
                    break;
                case "Completed":
                    statusColor = "green"
                    break;
                case "Cancelled":
                    statusColor = "red"
                    break;
            }
        }

        return (
            <TouchableOpacity activeOpacity={0.9}
                onPress={() => {
                    this.props.onPress();
                }}>
                <View style={styles.contentBox}>
                    <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
                        onPress={() => {
                            if (appointment.node.student.mobileno) {
                                if (Linking.canOpenURL("tel:" + appointment.node.student.mobileno)) {
                                    Linking.openURL("tel:" + appointment.node.student.mobileno)
                                } else {
                                    Alert.alert("Information", "Sorry, your device can't make a phone call");
                                }
                            }
                        }}>
                        <Text style={styles.textSmall}>
                            {moment(appointment.node.start).format("hh:mm A")} - {moment(appointment.node.end).format("hh:mm A")}
                        </Text>
                        {appointment ?.node ?.student ?.mobileno != null &&
                            <MaterialCommunityIcons
                                name='phone'
                                size={20}
                            />}
                    </TouchableOpacity>
                    <View style={styles.line} />
                    <View style={{ alignSelf: "flex-end" }}>
                        <Text style={{ fontSize: 12, color: statusColor }}>{appointment ?.node ?.appointmentStatus ?.appointmentStatus} </Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 4 }}>
                        <Image style={styles.smallImage} source={require('../../android/img/Image.png')} />
                        <View style={{ marginHorizontal: 8 }}>
                            <Text style={styles.title}>{appointment.node.title}</Text>
                            <Text style={[styles.textSmall, { color: Color.grayFont }]}>{appointment.node.purposeAssignment}</Text>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={[styles.textMedium, { color: Color.primary }]}>Learner : {studentName}</Text>
                            </View>
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 4 }}>
                        <Text style={[styles.textSmall, { color: Color.primaryButton }]}>{appointment.node.purposeAssignment}</Text>
                        <View style={styles.dot} />
                        <Text style={[styles.textSmall, {}]}>{appointment ?.node ?.location ?.location}</Text>
                        <View style={styles.dot} />
                        <Text style={[styles.textSmall, { color: isApprooved == 'Open' ? Color.success : Color.danger }]}>{isApprooved}</Text>


                        <View style={{ flex: 1 }} />
                        <FeedbackButton
                            appointment={appointment}
                            onPress={() => {
                                this.props.onFeedbackPress();
                            }} />
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}
const styles = {
    contentBox: {
        flex: 1,
        marginTop: 12,
        marginHorizontal: 2,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        backgroundColor: Color.white,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,

        elevation: 3,
    },
    contentBoxTitle: {
        fontSize: 17,
        color: '#344356',
        marginBottom: 5
    },
    contentBoxSubtitle: {
        fontSize: 14,
        color: '#808080'
    },
    contentBoxLocation: {
        fontSize: 14,
        color: Color.primary,
        marginTop: 5
    },
    title: {
        fontSize: 14,
        color: Color.blackFont
    },
    textSmall: {
        fontSize: 11,
    },
    textMedium: {
        fontSize: 12
    },
    line: {
        height: 1,
        backgroundColor: Color.silver,
        marginVertical: 4
    },
    smallImage: {
        width: 50,
        height: 50,
        borderRadius: 3,
    },
    dot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: Color.gray,
        marginHorizontal: 6
    }
}


export default AppointmentCard;