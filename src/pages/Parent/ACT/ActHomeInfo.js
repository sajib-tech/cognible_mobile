import React, {Component} from 'react';

import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import Color from '../../../utility/Color';
import ImageHelper from '../../../helpers/ImageHelper';
import StudentHelper from '../../../helpers/StudentHelper';

class ActHomeInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <>
        {/* {selectedFamily && (
                                <View style={styles.header}>
                                    <Image source={{ uri: ImageHelper.getImage("") }} style={styles.photo} />
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.headerText}>{selectedFamily.node.memberName}</Text>
                                        <Text style={styles.subheaderText}>{StudentHelper.getStudentName()}'s {selectedFamily.node.relationship.name}</Text>
                                    </View>
                                </View>
                            )} */}

        <View style={styles.header}>
          <Image
            source={{uri: ImageHelper.getImage('')}}
            style={styles.photo}
          />
          <View style={{flex: 1}}>
            <Text style={styles.headerText}>
              {StudentHelper.getStudentName()}
            </Text>
            <Text style={styles.subheaderText}>Learner</Text>
          </View>
        </View>

        <View style={{alignItems: 'center', marginBottom: 20}}>
          <View style={styles.spectrumWrapper}>
            <Image
              source={require('../../../../android/img/act-polygon.png')}
              style={styles.shape}
            />

            <Text
              style={[
                styles.spectrumText,
                {left: 30, top: 35, transform: [{rotate: '-30deg'}]},
              ]}>
              Acceptance
            </Text>
            <Text
              style={[
                styles.spectrumText,
                {right: 50, top: 35, transform: [{rotate: '30deg'}]},
              ]}>
              Present
            </Text>
            <Text
              style={[
                styles.spectrumText,
                {left: -20, top: 150, transform: [{rotate: '-90deg'}]},
              ]}>
              Defusion
            </Text>
            <Text
              style={[
                styles.spectrumText,
                {right: -10, top: 150, transform: [{rotate: '90deg'}]},
              ]}>
              Values
            </Text>
            <Text
              style={[
                styles.spectrumText,
                {left: 25, top: 280, transform: [{rotate: '30deg'}]},
              ]}>
              Self as Context
            </Text>
            <Text
              style={[
                styles.spectrumText,
                {right: 20, top: 280, transform: [{rotate: '-30deg'}]},
              ]}>
              Committed Action
            </Text>

            <View
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {/* <Text style={{ fontSize: 40, fontWeight: 'bold', color: Color.primary }}>
                                        12 %
                                    </Text> */}
              <Text style={{color: Color.grayFill, fontSize: 18}}>
                Psycological
              </Text>
              <Text style={{color: Color.grayFill, fontSize: 18}}>
                Flexibility
              </Text>
            </View>
          </View>
        </View>

        {/* <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                            <Text style={{ flex: 1, fontSize: 18, color: Color.blackFont }}>Courses</Text>
                            <MaterialCommunityIcons name='arrow-right' size={25} color={Color.blackFont} />
                        </TouchableOpacity> */}

        <View style={styles.sectionDescription}>
          <Text style={styles.sectionDescriptionText}>
            This self help program is for parents of special Needs.
          </Text>
          <Text style={styles.sectionDescriptionText}>
            Parents can do this program at their own pace from the comfort of
            their home.
          </Text>
          <Text style={styles.sectionDescriptionText}>
            It is made of interesting videos ,stories and simple exercises.It
            helps parents to cope up with stress and anxiety which one may go
            through while parenting their child with special needs.
          </Text>
          <Text style={styles.sectionDescriptionText}>
            You will be reading 6 core processes and will be practicing hands on
            exercises, doing step by step. Starting with step 1 to step 6 as
            given below
          </Text>
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.white,
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    marginVertical: 10,
    alignItems: 'center',
  },
  sectionDescription: {
    backgroundColor: Color.primaryTransparent,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginBottom: 10,
    borderRadius: 5,
  },
  sectionDescriptionText: {
    fontSize: 17,
    color: Color.blackFont,
    marginVertical: 5,
  },
  modalList: {
    flexDirection: 'row',
    marginVertical: 10,
    alignItems: 'center',
  },
  photo: {
    marginRight: 10,
    width: 50,
    height: 50,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    // elevation: 4,
  },
  headerText: {
    fontSize: 18,
    color: Color.blackFont,
  },
  subheaderText: {
    fontSize: 14,
    color: Color.grayDarkFill,
  },
  spectrumWrapper: {
    width: 300,
    height: 330,
    // backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shape: {
    width: 250,
    height: 280,
  },
  spectrumText: {
    position: 'absolute',
    fontSize: 16,
    color: Color.blackFont,
  },
});

export default ActHomeInfo;
