import React,{useEffect, useState} from 'react';
import {View, Text, StyleSheet, SafeAreaView,TouchableOpacity, Alert,ScrollView} from 'react-native';
import moment from 'moment';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Color from '../../utility/Color';
import NavigationHeader from '../NavigationHeader';
import  LoadingIndicator  from '../LoadingIndicator';
import { client, GUIDE } from '../../constants/therapist';





const VbmappToc=(props)=> {
    const [dataGuide,setDataGuide]=useState([])
    const [isLoading,setIsLoading]=useState(false)

    useEffect(() => {
        setIsLoading(true)
        client.mutate({
			mutation: GUIDE,
			variables: {				
			},
		})
        .then(res => {
          const d = JSON.parse(res.data.vbmappGuide.details)
          setDataGuide(d)
          setIsLoading(false)
        })
        .catch(err=>{
            setIsLoading(false)
        })
      }, [])

    return (
        <SafeAreaView style={{backgroundColor: '#fff', flex: 1}}>
            <NavigationHeader
        title={'TOC'}
        backPress={() => props.navigation.goBack()}
      />
      {isLoading && <LoadingIndicator />}
      <ScrollView>
          {dataGuide.length!==0 && dataGuide.chapters.map(item=>{
              return <View>
                  <View style={styles.box}><Text style={styles.title} >{item.title}</Text></View>
                  {item.sections.map(i=>{
                      return <View style={styles.box}>
                          <Text style={styles.subtitle}>{i.title}</Text>
                          </View>
                  })}
              </View>
          })}
      </ScrollView>
            
        </SafeAreaView>
    );
}

const styles=StyleSheet.create({
    box: {
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderRadius: 5,
        borderBottomWidth:2,
        borderBottomColor:Color.grayWhite
    },
    title: {
        fontSize: 20,
        color:'black',
        fontWeight: 'bold',
        marginBottom: 5
    },
    subtitle: {
        fontSize: 15,
        color:'grey',
        marginBottom:5
    },
})

export default VbmappToc;