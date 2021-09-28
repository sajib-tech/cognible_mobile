import React, {Component} from 'react';

import {View, Text, FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Color from '../utility/Color';

class TherapySessionLink extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: props.title,
      duration: props.duration,
      targetCount: props.targetCount,
      index: props.index,
      totalSessions: props.totalSessions,
      parentCallback: props.parentCallback,
      sessionStatus: props.sessionStatus,
    };
    this.sendDataToCallback = this.sendDataToCallback.bind(this);
  }
  sendDataToCallback() {
    this.props.parentCallback(this.state.title, this.state.index);
  }
  render() {
    let {index, totalSessions, sessionStatus} = this.state;
    let showDivider = true;
    if (index + 1 == totalSessions) {
      showDivider = false;
    }
    return (
      <TouchableOpacity onPress={this.sendDataToCallback} activeOpacity={0.8}>
        <View style={styles.sessionLinkView}>
          <View style={styles.sessionLinkImageView}>
            <MaterialCommunityIcons
              name="checkbox-marked-circle-outline"
              size={20}
              color={Color.white}
            />
          </View>
          <View style={styles.sessionLinkInfoView}>
            <Text style={styles.sessionLinkInfoTitle}>
              {this.state.title} Session{' '}
              <FontAwesome5 name={'arrow-right'} style={styles.backIconText} />
            </Text>
            <View style={styles.sessionLinkInfo}>
              {this.state.duration && (
                <Text style={styles.sessionLinkInfoText}>
                  {this.state.duration}
                </Text>
              )}
              {this.state.duration && this.state.targetCount && (
                <View style={styles.dot} />
              )}
              {this.state.targetCount && (
                <Text style={styles.sessionLinkInfoText}>
                  {this.state.targetCount}{' '}
                  {this.state.targetCount == 1 ? 'target' : 'targets'}
                </Text>
              )}

              <Text
                style={[
                  styles.textSmall,
                  {
                    color:
                      sessionStatus == 'COMPLETED'
                        ? Color.success
                        : sessionStatus == 'PROGRESS'
                        ? Color.danger
                        : Color.warning,
                    marginLeft: 7,
                    paddingTop: 3,
                  },
                ]}>
                {sessionStatus}
              </Text>
            </View>
          </View>
        </View>
        {showDivider && <View style={styles.therapySessionDivider} />}
      </TouchableOpacity>
    );
  }
}
const styles = StyleSheet.create({
  sessionLinkView: {
    flexDirection: 'row',
    marginTop: 10,
  },
  sessionLinkImageView: {
    width: 32,
    height: 32,
    backgroundColor: Color.primary,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sessionLinkInfoView: {
    paddingLeft: 16,
  },
  sessionLinkInfoTitle: {
    color: '#3E7BFA',
    fontSize: 16,
    fontWeight: '500',
    fontStyle: 'normal',
  },
  sessionLinkInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sessionLinkInfoText: {
    color: Color.blackFont,
    fontSize: 10,
  },
  therapySessionDivider: {
    borderWidth: 0.5,
    borderColor: 'rgba(62, 123, 250, 0.05)',
    paddingTop: 0.5,
    marginTop: 10,
    paddingBottom: 0.5,
    backgroundColor: 'rgba(62, 123, 250, 0.05)',
    height: 0.5,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Color.gray,
    marginHorizontal: 8,
  },
  textSmall: {
    fontSize: 9,
  },
});
export default TherapySessionLink;
