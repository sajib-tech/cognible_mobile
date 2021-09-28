import React, {Component} from 'react';

import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

class TargetProgress extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: props.current,
      total: props.total,
      fromPage: props.fromPage,
      parentCallback: props.parentCallback,
    };
    this.sendData = this.sendData.bind(this);
  }

  sendData(direction) {
    this.props.parentCallback(direction);
  }

  render() {
    let {current, total} = this.state;
    let percentage = 100 / total;
    let progressPercentage = current * percentage;
    // console.log("progressPercentage:"+progressPercentage);

    return (
      <View style={styles.targetBlock}>
        <View style={styles.targetView}>
          <Text style={styles.targetText}>
            Target {this.state.current} of {this.state.total}
          </Text>
          <View style={styles.targetProgress}>
            <View
              style={[
                styles.targetProgressColor,
                {width: progressPercentage + '%'},
              ]}></View>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => {
            this.sendData('previous');
          }}>
          <Text style={styles.arrowButton}>
            <FontAwesome5
              name={'chevron-left'}
              style={styles.arrowButtonText}
            />
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            this.sendData('next');
          }}>
          <Text style={styles.arrowButton}>
            <FontAwesome5
              name={'chevron-right'}
              style={styles.arrowButtonText}
            />
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
  gotoNextPage() {
    let {navigation} = this.props;
    navigation.navigate('DiscriminativeStimulus');
  }
  handleClick(event) {
    let {onChildClick} = this.state;
    console.log('TargetResponse:' + event);
    onChildClick(); // pass any argument to the callback
  }
}

const styles = StyleSheet.create({
  targetBlock: {
    flexDirection: 'row',

    width: '100%',
  },
  targetView: {
    flex: 1,
    paddingHorizontal: 16,
    marginBottom: 20,

    justifyContent: 'center',
    height: 40,

    backgroundColor: 'rgba(62, 123, 250, 0.05)',
    borderColor: 'rgba(62, 123, 250, 0.05)',
    //borderColor: 'black',
    borderWidth: 1,
    borderRadius: 4,
  },
  targetText: {
    paddingBottom: 5,
    color: '#3E7BFA',
    fontSize: 13,
    fontWeight: '500',
    fontStyle: 'normal',
  },
  targetProgress: {
    height: 1,
    width: '100%',
    backgroundColor: 'rgba(95, 95, 95, 0.1)',
  },
  targetProgressColor: {
    height: 1,
    backgroundColor: '#3E7BFA',
  },
  arrowButton: {
    justifyContent: 'center',
    width: 40,
    height: 40,
    backgroundColor: '#3E7BFA',
    borderRadius: 4,
    marginLeft: 8,
    paddingTop: 10,
    textAlign: 'center',
  },
  arrowButtonText: {
    fontSize: 20,
    fontWeight: 'normal',
    color: '#fff',
  },
});

export default TargetProgress;
