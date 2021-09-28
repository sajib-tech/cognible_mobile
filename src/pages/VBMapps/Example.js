import React from 'react';
import { View,Text,ScrollView,SafeAreaView,StyleSheet } from 'react-native';
import NavigationHeader from '../../components/NavigationHeader.js';


const Example=({example,goBack})=>{
    return (
        <SafeAreaView style={{backgroundColor: '#fff', flex: 1}}>
            <NavigationHeader
          backPress={() => goBack()}
          title={"Example"}
        />
        <ScrollView>
            <View>
                <Text style={styles.text}>{example}</Text>
            </View>
            </ScrollView>
        </SafeAreaView>
    );
}
const styles=StyleSheet.create({
    text:{
        fontSize:15,
        padding:10
    }

})
export default Example;