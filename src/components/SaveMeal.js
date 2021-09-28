

import React, { Component } from 'react';

import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View, Image,
  Text, TextInput, TouchableOpacity
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import SearchableDropdown from 'react-native-searchable-dropdown';


var items = [
  { id: 1, name: 'angellist' },
  { id: 2, name: 'codepen' },
  { id: 3, name: 'envelope' },
  { id: 4, name: 'etsy' },
  { id: 5, name: 'facebook' },
  { id: 6, name: 'foursquare' },
  { id: 7, name: 'github-alt' },
  { id: 8, name: 'github' },
  { id: 9, name: 'gitlab' },
  { id: 10, name: 'instagram' },
];
class SaveMeal extends Component {
  constructor() {
    super();
    this.state = {
      serverData: [],
    };
  }
  componentDidMount() {
    fetch('https://aboutreact.herokuapp.com/demosearchables.php')
      .then(response => response.json())
      .then(responseJson => {
        this.setState({
          serverData: [...this.state.serverData, ...responseJson.results],
        });
      })
      .catch(error => {
        console.error(error);
      });
  }

  render() {
    return (

      <View >
        <ScrollView contentInsetAdjustmentBehavior="automatic" style={styles.scrollView}>
          <View style={styles.wrapper}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.backIcon}>
                <FontAwesome5 name={'chevron-left'} style={styles.backIconText} />
              </Text>
              <Text style={styles.headerTitle}>New Meal Data </Text>
            </View>



          </View></ScrollView>
        <Text style={{ marginTop: 30, marginLeft: 19, }}>
          Meal
      </Text>
        <SearchableDropdown
          onTextChange={text => console.log(text)}
          onItemSelect={item => alert(JSON.stringify(item))}
          containerStyle={{ padding: 5 }}
          textInputStyle={{

            paddingLeft: 20,
            borderWidth: 1,
            borderRadius: 8,
            borderColor: '#DCDCDC',
            backgroundColor: '#FFFFFF',
            marginLeft: 15,
            marginRight: 15
          }}
          itemStyle={{

            padding: 10,
            marginTop: 2,
            backgroundColor: '#FFFFFF',
            borderColor: '#bbb',
            borderWidth: 1,
          }}

          itemTextStyle={{
            color: '#222',
          }}
          itemsContainerStyle={{
            maxHeight: '60%',
          }}
          //  items={items}
          //mapping of item array
          items={this.state.serverData}

          defaultIndex={2}

          placeholder="Select Meal"

          resetValue={false}

          underlineColorAndroid="transparent"

        />
        <Text style={{ marginLeft: 19, }}>
          Food Type
      </Text>
        <SearchableDropdown
          onTextChange={text => console.log(text)}
          onItemSelect={item => alert(JSON.stringify(item))}
          containerStyle={{ padding: 5 }}
          textInputStyle={{

            paddingLeft: 20,
            borderWidth: 1,
            borderRadius: 8,
            borderColor: '#DCDCDC',
            backgroundColor: '#FFFFFF',
            marginLeft: 15,
            marginRight: 15
          }}
          itemStyle={{

            padding: 10,
            marginTop: 2,
            backgroundColor: '#FFFFFF',
            borderColor: '#bbb',
            borderWidth: 1,
          }}
          itemTextStyle={{
            color: '#222',
          }}
          itemsContainerStyle={{
            maxHeight: '50%',
          }}
          items={this.state.serverData}
          defaultIndex={2}
          placeholder="Select Food Type"
          resetValue={false}
          underlineColorAndroid="transparent"
        />
        <Text style={{ marginLeft: 19, marginTop: 10 }}>
          Meal Details
        </Text>

        <TextInput
          style={styles.TextInputStyleClass}
          underlineColorAndroid="transparent"
          placeholder={"What did Kunal eat ?"}
          placeholderTextColor={"#9E9E9E"}


          numberOfLines={10}
          multiline={true}
        />
        <View style={styles.continueView}>
          <TouchableOpacity style={styles.continueViewTouchable} activeOpacity={.5} onPress={this.showSignin}>
            <Text style={styles.continueViewText}>New Meal</Text>
          </TouchableOpacity>
        </View>
      </View>


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
  TextInputStyleClass: {


    paddingLeft: 15,
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    height: 110,
    margin: 20,
    marginBottom: 180

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
  }

});
export default SaveMeal;



