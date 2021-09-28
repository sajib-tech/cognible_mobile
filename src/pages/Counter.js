import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View, Image,
  Text, Button, TextInput,
  StatusBar, TouchableOpacity
} from 'react-native';

import { connect } from 'react-redux';
import {increment, decrement} from '../redux/actions/index';
class Counter extends React.Component {
    constructor(props) {
        super(props);
        this.state = { count: 0 }
    }

  increment = () => {
    // this.setState({
    //   count: this.state.count + 1
    // });
    this.props.increment();
  }

  decrement = () => {
    // this.setState({
    //   count: this.state.count - 1
    // });
    this.props.decrement();
    if(this.props.count == 35) {
        // console.log("Value is 35")
    }
  }
  componentDidUpdate(prevProps){
      console.log(prevProps.count +"="+this.props.count)
     if(prevProps.value !== this.props.value){ 
        //  alert(prevProps.value);  
    }
  }  
  render() {
    return (
      <View style={{textAlign: 'center', justifyContent: 'center'}}>
        <Text>Counter</Text>
        <View>
        {/* {console.log(this.props)} */}
          <Text style={{padding: 20, textAlign: 'center', justifyContent: 'center', fontSize: 26}} onPress={this.decrement}>-</Text>
          <Text style={{padding: 20, textAlign: 'center', justifyContent: 'center', fontSize: 26}}>{this.props.count}</Text>
          <Text style={{padding: 20, textAlign: 'center', justifyContent: 'center', fontSize: 26}} onPress={this.increment}>+</Text>
        </View>
      </View>
    )
  }
}
const mapStateToProps = state => ({
  count: state.count
});
const mapDispatchToProps = {
  increment,
  decrement
};
export default connect(mapStateToProps, mapDispatchToProps)(Counter);
