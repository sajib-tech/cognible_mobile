import React, {Component} from 'react';

import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import OrientationHelper from '../helpers/OrientationHelper';
import Color from '../utility/Color';

class NavigationHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    if (this.props.enable == false) {
      if (this.props.disabledTitle) {
        return null;
      } else {
        return (
          <Text
            style={{
              color: '#000',
              fontSize: 16,
              marginBottom: 5,
              marginTop: 10,
            }}>
            {this.props.title}
          </Text>
        );
      }
    } else {
      return (
        <View style={styles.container}>
          <TouchableOpacity
            onPress={this.props.backPress}
            style={{flexDirection: 'row', alignItems: 'center'}}>
            <MaterialCommunityIcons name="chevron-left" size={30} />

            {OrientationHelper.getDeviceOrientation() == 'landscape' && (
              <Text style={{color: Color.primary, fontSize: 15}}>Back</Text>
            )}
          </TouchableOpacity>

          <Text style={styles.headerText}>{this.props.title}</Text>

          {this.props.dotsPress != null && !this.props.isNotification &&  (
            <TouchableOpacity onPress={this.props.dotsPress}>
              <MaterialCommunityIcons
                name={
                  this.props.materialCommunityIconsName != null
                    ? this.props.materialCommunityIconsName
                    : 'dots-horizontal'
                }
                size={30}
              />
            </TouchableOpacity>
          ) 
          }

          {this.props.dotsPress !== null && this.props.isNotification && (
            <View style={{position: 'absolute', right: 10, alignSelf: "center"}}>
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity
                onPress={this.props.dotsPress}>
                <MaterialCommunityIcons
                  name={this.props.materialCommunityIconsName}
                  size={30}
                  style={{alignSelf: 'flex-end'}}
                />
              </TouchableOpacity>
              <View
                style={{
                  height: 22,
                  width: 22,
                  backgroundColor: 'red',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 11,
                  marginLeft: -7
                }}>
              {this.props.unreadCount < 99 ?<Text style={{color: 'white', fontWeight: 'bold'}}>
                  {this.props.unreadCount}
                  {/* 123 */}
                </Text> : <Text style={{color: 'white', fontWeight: 'bold'}}>99+</Text>}
              </View>
            </View>
          </View>
          )}

          {this.props.dotsPress == null &&
            this.props.customRightMenu == null && <View style={{width: 30}} />}

          {this.props.customRightMenu}
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomColor: '#dddddd',
    borderBottomWidth: 1,
  },
  headerText: {
    flex: 1,
    fontSize: 16,
    textAlign: 'center',
    color: '#45494E',
    fontWeight: 'bold',
    paddingTop: 3,
  },
});

export default NavigationHeader;
