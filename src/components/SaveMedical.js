
import 'react-native-gesture-handler';
import React, { Component } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View, Image,
  Text, TextInput, TouchableOpacity
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import ToggleSwitch from 'toggle-switch-react-native';
class SaveMedical extends Component {
  constructor(props) {
    super(props)
    //set value in state for initial date
    this.state = { date: "15-05-2018" }
  }
  render() {
    let data = [{
      value: 'Banana',
    }, {
      value: 'Mango',
    }, {
      value: 'Pear',
    }];
    return (
      <SafeAreaView>
        <ScrollView contentInsetAdjustmentBehavior="automatic" style={styles.scrollView}>
          <View style={styles.wrapper}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.backIcon}>
                <FontAwesome5 name={'chevron-left'} style={styles.backIconText} />
              </Text>
              <Text style={styles.headerTitle}>New Medical Data </Text>
            </View>
            <View style={{ marginLeft: 19, marginRight: 19, marginBottom: 150 }}>
              <Text >Medical Condition</Text>
              <TextInput style={styles.input} />
              <Text >Start & End Date</Text>

              <View style={{ flex: 1, flexDirection: 'row', marginBottom: 20 }}>
                <View style={{ width: 50, height: 50, paddingTop: 35, paddingLeft: 10 }}>
                  <FontAwesome5 name={'calendar'} style={styles.backIconText1} />
                </View>
                <View style={{ width: 250, height: 50, }}>
                  {/* <Dropdown
                    label='28 April 2019 - 8 May 2019'
                    data={data}

                  /> */}
                </View>
              </View>


              <Text >Severity</Text>
               <Dropdown
                label="Select Severity"
                data={data}
                defaultValue="Mild"

              /> 

              <Text >Prescripton Drug</Text>
              <TextInput style={styles.input} />
              <Text >Dosage</Text>
              <View style={{ flex: 1, flexDirection: 'row', }}>
                <View style={{ width: 160, height: 60, marginRight: 20 }} >
                  <TextInput style={styles.input1}  >
                    60                      mg
        </TextInput>
                </View>
                <View style={{ width: 160, height: 60, marginRight: 20 }} >
                  <TextInput style={styles.input1}  >
                    2          times a day
        </TextInput>

                </View>

              </View>
              <ToggleSwitch isOn={true} onColor="blue" offColor="red" label="Reminders for Medicine" labelStyle={{ color: 'black', fontWeight: '900' }}
                size="small"
                onToggle={isOn => console.log("changed to:", isOn)} />
              <Text style={styles.text1} >Remind me for medicine dosage</Text>
              <View style={{ flex: 1, flexDirection: 'row', }}>
                <View style={{ width: 150, height: 60, marginRight: 20 }} >
                  <View style={{ width: 150, height: 60, marginRight: 20, }} >
                    <View style={{ alignItems: 'center', flexDirection: 'row', }}>
                      <FontAwesome5 name={'clock'} style={styles.backIconText} />
                      <TextInput style={styles.input1}  >
                        6:00 AM
        </TextInput>
                    </View>

                  </View>
                </View>
                <View style={{ width: 150, height: 60, marginRight: 20 }} >
                  <TextInput style={styles.input1}  >
                    2          times a day
        </TextInput>

                </View>

              </View>
              <View style={{ flex: 1, flexDirection: 'row', }}>
                <View style={{ width: 150, height: 60, marginRight: 20, }} >
                  <View style={{ alignItems: 'center', flexDirection: 'row', }}>
                    <FontAwesome5 name={'clock'} style={styles.backIconText} />
                    <TextInput style={styles.input1}  >
                      6:00 AM
        </TextInput>
                  </View>

                </View>
                <View style={{ width: 150, height: 60, marginRight: 20 }} >
                  <TextInput style={styles.input1}  >
                    2          times a day
        </TextInput>

                </View>

              </View>

            </View>
            <View style={styles.continueView}>
              <TouchableOpacity style={styles.continueViewTouchable} activeOpacity={.5} onPress={this.showSignin}>
                <Text style={styles.continueViewText}>New Data</Text>
              </TouchableOpacity>
            </View>

          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 16
  },

  header: {
    flexDirection: 'row',
    height: 50,
    width: '100%',

  },
  backIcon: {
    fontSize: 50,
    fontWeight: 'normal',
    color: '#fff',
    width: '10%',
    paddingTop: 15
  },
  backIconText: {
    fontSize: 20,
    fontWeight: 'normal',
    color: '#63686E'
  },
  headerTitle: {
    textAlign: 'center',
    width: '85%',
    fontSize: 22,
    fontWeight: 'bold',
    paddingTop: 10,
    color: '#45494E'
  },

  TextStyle: {
    marginTop: 24,
    marginBottom: 16,
    color: 'rgba(95, 95, 95, 0.75)',
    fontSize: 17,
    fontStyle: 'normal',
    fontWeight: 'normal'
  },
  input: {
    marginTop: 10,
    marginBottom: 10,
    padding: 6,
    fontSize: 22,
    fontStyle: 'normal',
    fontWeight: '500',
    textAlign: 'left',
    color: '#10253C',
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    borderColor: '#DCDCDC',
    borderWidth: 1,
    flex: 1,
    flexDirection: 'row'
  },
  input1: {
    marginTop: 10,
    marginBottom: 10,

    fontSize: 15,
    fontStyle: 'normal',

    textAlign: 'left',
    color: '#10253C',
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    borderColor: '#DCDCDC',
    borderWidth: 1,
    flex: 1,
    flexDirection: 'row', paddingLeft: 15
  },

  backIconText1: {
    fontSize: 15,
    fontWeight: 'normal',
    color: '#63686E',

  },
  continueViewTouchable: {
    marginTop: 28,
    paddingTop: 10,
    paddingBottom: 20,
    marginLeft: 12,
    marginRight: 12,
    marginBottom: 15,
    backgroundColor: '#1E90FF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff'
  },
  continueView: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
    marginTop: 500

  },
  continueViewText: {
    color: '#fff',
    fontSize: 20,
    textAlign: 'center',
  },
  text1: {
    marginLeft: 10, marginRight: 19
  }

});

export default SaveMedical;
