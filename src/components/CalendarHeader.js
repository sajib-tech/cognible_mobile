import React, { Component } from 'react';

import { View, Text, Image, StyleSheet, TouchableOpacity, Modal, Platform } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import DateHelper from '../helpers/DateHelper';
import Styles from '../utility/Style';
import moment from 'moment';
import OrientationHelper from '../helpers/OrientationHelper';
import Color from '../utility/Color';
import Button from './Button';
import { Column, Row } from './GridSystem';

class CalendarHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dateList: [],
            isFirst: true,
            label: '',
            currentWeekDate: moment().startOf('week'),
            currentDate: moment().format("YYYY-MM-DD"),
            currentTime: moment().toDate(),
            show: false,
        };
    }

    componentDidMount() {
        let date = moment(new Date());
        this.changeWeek();
        this.selectTheDate({
            date: moment(date).format("YYYY-MM-DD"),
            dateOfMonth: moment(date).format("DD"),
            dayName: moment(date).format("dd"),
        });
    }

    selectTheDate(dateObject) {
        this.setState({ currentDate: dateObject.date });
        this.props.parentCallback(dateObject.date);
    }

    getDateView(dateObject, index) {
        let isSelected = false;
        // console.log({
        //     selectedValue: this.props.selectedValue,
        //     date: dateObject.date,
        //     currentDate: this.state.currentDate
        // });
        if (this.props.selectedValue) {
            isSelected = this.props.selectedValue == dateObject.date ? true : false;
        } else {
            isSelected = dateObject.date == this.state.currentDate ? true : false;
        }

        let textColor = styles.defaultTextColor;
        if (isSelected) {
            textColor = styles.selectedTextColor;
        }

        return (
            <View key={index} style={styles.dateValue}>
                <Text style={styles.dayName}>{dateObject.dayNameLong}</Text>

                <TouchableOpacity
                    style={styles.dateValueTouchable}
                    onPress={() => {
                        this.setState({ isFirst: false });
                        this.selectTheDate(dateObject);
                    }}>
                    {isSelected && <View style={styles.circleStyle} />}
                    <Text style={textColor}>{dateObject.dateOfMonth}</Text>
                </TouchableOpacity>
            </View>
        );
    }

    prevWeek() {
        let currentWeekDate = this.state.currentWeekDate.subtract(1, 'week');
        this.setState({ currentWeekDate }, () => {
            this.changeWeek();
        });
    }

    nextWeek() {
        let currentWeekDate = this.state.currentWeekDate.add(1, 'week');
        this.setState({ currentWeekDate }, () => {
            this.changeWeek();
        });
    }

    changeWeek() {
        // console.log(dateObject);
        let dateList = [];

        let firstDate = this.state.currentWeekDate.startOf('week').unix() * 1000;

        // console.log(firstDate);

        let oneDay = 24 * 3600 * 1000;

        for (let i = firstDate; i < firstDate + 7 * oneDay; i += oneDay) {
            let date = moment(i);
            // console.log(i, date.format("YYYY-MM-DD HH:mm:ss"));

            let dateString = date.format("YYYY-MM-DD");

            dateList.push({
                date: dateString,
                dateOfMonth: date.format("DD"),
                dayName: date.format("dd"),
                dayNameLong: date.format("ddd")
            });
        }

        this.setState({
            dateList,
            label: this.state.currentWeekDate.startOf('week').format("MMM DD") + " - " + this.state.currentWeekDate.endOf('week').format("MMM DD 'YY"),
        });
    }

    render() {
        let currentTime = this.state.currentTime;

        if (this.props.selectedValue) {
            currentTime = moment(this.props.selectedValue).toDate();
        }

        return (
            <View style={styles.box}>
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 10 }}>
                    <TouchableOpacity onPress={() => { this.prevWeek() }}>
                        <MaterialCommunityIcons
                            name='chevron-left'
                            size={20}
                            color={Color.grayFill}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { this.setState({ show: true }) }}>
                        <Text style={styles.label}>{this.state.label}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { this.nextWeek() }}>
                        <MaterialCommunityIcons
                            name='chevron-right'
                            size={20}
                            color={Color.grayFill}
                        />
                    </TouchableOpacity>
                </View>

                <View style={styles.calendarBox}>
                    {this.state.dateList.map((dateObject, index) => {
                        return this.getDateView(dateObject, index);
                    })}
                </View>

                {Platform.OS == 'android' && this.state.show && (
                    <DateTimePicker
                        testID="dateTimePicker"
                        timeZoneOffsetInMinutes={0}
                        value={currentTime}
                        mode='date'
                        is24Hour={true}
                        display="default"
                        onChange={(result) => {
                            if (result.type == "set") {
                                let time = result.nativeEvent.timestamp;
                                this.setState({ currentTime: time, show: false });
                                let selectedValue = moment(time).format("YYYY-MM-DD");
                                this.setState({ currentWeekDate: moment(time) }, () => {
                                    this.changeWeek();
                                });
                                this.props.parentCallback(selectedValue);
                            } else {
                                this.setState({ show: false });
                            }
                        }}
                    />
                )}

                {Platform.OS == 'ios' && (
                    <Modal
                        animationType="fade"
                        transparent={true}
                        visible={this.state.show}
                        onRequestClose={() => {
                            this.setState({ show: false });
                        }} >
                        <TouchableOpacity activeOpacity={0.9} onPress={() => {
                            this.setState({ show: true })
                        }} style={styles.modalRoot}>
                            <View style={styles.modalContent}>
                                <DateTimePicker
                                    testID="dateTimePicker"
                                    // timeZoneOffsetInMinutes={0}
                                    value={currentTime}
                                    mode='date'
                                    is24Hour={true}
                                    display="default"
                                    onChange={(result, selectedDate) => {
                                        console.log("selected", selectedDate);
                                        if (selectedDate) {
                                            this.setState({ currentTime: selectedDate });
                                            let selectedValue = moment(selectedDate).format("YYYY-MM-DD");
                                            this.setState({ currentWeekDate: moment(selectedDate) }, () => {
                                                this.changeWeek();
                                            });
                                            this.props.parentCallback(selectedValue);
                                        }
                                    }}
                                />
                                <View style={{ height: 1, backgroundColor: Color.primary, marginVertical: 5 }} />
                                <Row>
                                    <Column>
                                        <Button labelButton='Cancel' theme='secondary'
                                            onPress={() => {
                                                this.setState({ show: false });
                                            }} />
                                    </Column>
                                    <Column>
                                        <Button labelButton='Ok' theme='primary'
                                            onPress={() => {
                                                let time = this.state.currentTime;
                                                console.log("Selected Time", time);
                                                let selectedValue = moment(time).format("YYYY-MM-DD");
                                                this.setState({ currentWeekDate: moment(time) }, () => {
                                                    this.changeWeek();
                                                });
                                                this.props.parentCallback(selectedValue);
                                                this.setState({ show: false });
                                            }} />
                                    </Column>
                                </Row>
                            </View>
                        </TouchableOpacity>
                    </Modal>
                )}
            </View>
        );
    }
}
const styles = StyleSheet.create({
    box: {
        marginHorizontal: 3,
        backgroundColor: '#fff',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,

        elevation: 3,
        padding: 8,
        marginVertical: 8,
        borderRadius: 5
    },
    calendarBox: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    label: {
        fontFamily: 'SF Pro Text',
        color: Color.black,
        fontSize: 15
    },
    dayName: {
        textAlign: 'center',
        fontFamily: 'SF Pro Text',
        fontStyle: 'normal',
        fontWeight: '500',
        fontSize: 13,
    },
    dateValue: {
        // backgroundColor: 'yellow'
    },
    dateValueTouchable: {
        height: 50,
        width: 40,
        // backgroundColor: 'red',
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dateValueTouchableSelected: {
        backgroundColor: '#3E7BFA',
        // color: '#FFFFFF'
    },
    defaultTextColor: {
        color: '#3E7BFA',
    },
    selectedTextColor: {
        color: '#FFF',
    },

    dateSelected: {
        backgroundColor: '#3E7BFA',
        color: '#FFFFFF',
    },

    circleStyle: {
        width: 40,
        height: 40,
        backgroundColor: Color.primary,
        position: 'absolute',
        borderRadius: 20
    },


    dayNameTablet: {
        textAlign: 'center',
        fontFamily: 'SF Pro Text',
        fontStyle: 'normal',
        fontWeight: '500',
        fontSize: 13,
        color: '#63686E',
    },
    dayNameTabletSelected: {
        textAlign: 'center',
        fontFamily: 'SF Pro Text',
        fontStyle: 'normal',
        fontWeight: '500',
        fontSize: 13,
        color: '#3E7BFA',
    },
    dateValueTablet: {
        width: 50,
        // padding: 10
        // textAlign: 'center',
        borderColor: 'black',
        // borderWidth: 1,
    },
    dateValueTabletTouchable: {
        height: 50,
        width: 50,
        // backgroundColor: 'yellow',
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dateValueTabletTouchableSelected: {
        backgroundColor: '#3E7BFA',
        // color: '#FFFFFF'
    },

    defaultTextColorTablet: {
        color: '#63686E',
        fontSize: 25,
        fontFamily: 'SF Pro Text',
    },
    selectedTextColorTablet: {
        color: '#3E7BFA',
        fontSize: 25,
        fontFamily: 'SF Pro Text',
    },

    modalRoot: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.1)'
    },
    modalContent: {
        width: 300,
        padding: 16,
        borderRadius: 5,
        backgroundColor: Color.white
    },
});
export default CalendarHeader;
