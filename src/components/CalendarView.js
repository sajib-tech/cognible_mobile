import React, {Component} from 'react';

import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import DateHelper from '../helpers/DateHelper';
import moment from 'moment';
import OrientationHelper from '../helpers/OrientationHelper';

class CalendarView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dateList: [],
      isFirst: true,
      selectedDate: moment().format('YYYY-MM-DD'),
      selectedMonth: moment().format('MMMM'),
    };
  }

  componentDidMount() {
    //init date list
    let dateList = [];

    for (let i = -15; i < 15; i++) {
      let date = moment(new Date()).add(i, 'day');
      dateList.push({
        date: moment(date).format('YYYY-MM-DD'),
        dateOfMonth: moment(date).format('DD'),
        dayName: moment(date).format('dd'),
        dayNameLong: moment(date).format('ddd'),
      });
    }

    this.setState({dateList});

    setTimeout(() => {
      if (this.myScroll) {
        let diffDay = 0;

        if (this.props.selectedDate) {
          var a = moment(this.props.selectedDate);
          var b = moment();
          diffDay = a.diff(b, 'days'); // =1
          //console.log("Diff", diffDay);
        }

        // console.log("Scrolling");
        this.myScroll.scrollTo({
          x: 50 * (15 + diffDay),
          y: 0,
          animated: true,
        });
      }
    }, 500);
  }

  selectTheDate(dateObject) {
    this.setState({
      selectedDate: dateObject.date,
      selectedMonth: moment(dateObject.date).format('MMMM'),
    });

    this.props.parentCallback(dateObject.date);
  }

  renderDate(dateObject, index) {
    let isSelected = false;

    if (this.props.selectedDate) {
      if (dateObject.date == this.props.selectedDate) {
        isSelected = true;
      }
    } else {
      if (dateObject.date == this.state.selectedDate) {
        isSelected = true;
      }
    }

    let textColor = styles.defaultTextColor;
    if (isSelected) {
      textColor = styles.selectedTextColor;
    }

    return (
      <View key={index} style={styles.dateValue}>
        <Text style={styles.dayName}>{dateObject.dayName}</Text>

        <TouchableOpacity
          style={styles.dateValueTouchable}
          onPress={() => {
            this.setState({isFirst: false});
            this.selectTheDate(dateObject);
          }}>
          {isSelected && (
            <Image
              source={require('../../android/img/date-highlight.png')}
              resizeMode="stretch"
              style={{
                width: 50,
                height: 50,
                position: 'absolute',
                top: 0,
                left: 0,
              }}
            />
          )}
          <Text style={textColor}>{dateObject.dateOfMonth}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    return (
      <View style={{height: 85, marginVertical: 5}}>
        <Text style={styles.monthName}>{this.state.selectedMonth}</Text>
        <ScrollView
          style={styles.calendarBox}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          ref={(ref) => {
            this.myScroll = ref;
            //this.myScroll.scrollTo(50 * 15, 0) // !!
            //console.log(ref);
            if (this.myScroll && this.state.isFirst) {
              // console.log("Scrolling....");
            }
          }}>
          {this.state.dateList.map((dateObject, index) => {
            return this.renderDate(dateObject, index);
          })}
        </ScrollView>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  calendarBox: {marginTop: 10},
  dayName: {
    textAlign: 'center',
    fontFamily: 'SF Pro Text',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 13,
  },
  dateValue: {
    width: 50,
    // padding: 10
    // textAlign: 'center',
    borderColor: 'black',
    // borderWidth: 1,
  },
  dateValueTouchable: {
    height: 50,
    width: 50,
    // backgroundColor: 'yellow',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 3,
  },
  dateValueTouchableSelected: {
    backgroundColor: '#3E7BFA',
    // color: '#FFFFFF'
  },
  defaultTextColor: {
    color: '#63686E',
  },
  selectedTextColor: {
    color: '#3E7BFA',
  },

  dateSelected: {
    backgroundColor: '#3E7BFA',
    color: '#FFFFFF',
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
  monthName: {
    fontFamily: 'SF Pro Text',
    fontStyle: 'normal',
    fontWeight: '900',
    fontSize: 13,
    color: '#3E7BFA',
  },
});
export default CalendarView;
