import React from 'react';
import { View,Text,SafeAreaView,StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import NavigationHeader from '../../components/NavigationHeader.js';




const material=({material,goBack})=>{
    return (
        <SafeAreaView style={{backgroundColor: '#fff', flex: 1}}>
            <NavigationHeader
          backPress={() => goBack()}
          title={"Material"}
        />
        <ScrollView>
            <View>
                <Text style={styles.text}>{material}</Text>
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
export default material;