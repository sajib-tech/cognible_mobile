import 'react-native-gesture-handler';
import React, {useState} from 'react';
import {
    Alert,
    Dimensions,
    SafeAreaView, 
    Container,
    StyleSheet,
    ScrollView, ActivityIndicator,
    View, Image,
    Text, Linking, TextInput, TouchableOpacity, FlatList

} from 'react-native';
import gql from 'graphql-tag'
import NavigationHeader from '../../../components/NavigationHeader'
import { useSelector } from 'react-redux'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { Avatar } from 'react-native-elements';
import LoadingIndicator from '../../../components/LoadingIndicator'

const GET_STAFF_LIST = gql`
query {
  staffs {
    edges {
      node {
        id
        name
        surname
        isActive
        workExp
      }
    }
  }
}
`



const Appointment = ({navigation}) => {
  // const obj = useSelector(state => state)
  
  const { data: staffListData, loading: staffListLoading, error, refetch } = useQuery(GET_STAFF_LIST)
  if(staffListLoading){
    return <LoadingIndicator />
  }
  console.log('data in', staffListData)
  return(
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
            {<NavigationHeader
            backPress={() => navigation.goBack()}
            title="Book Appointment"
            />}
            <ScrollView>
              <View style={styles.container}>
              <View style={{margin: 10}}>
                <Text style={{color: 'black', fontSize: 20, fontWeight: "900"}}>Choose Therapist</Text>
              </View>
              <FlatList
                data={staffListData.staffs.edges}
                renderItem={(item) => {
                  return (
                    <TouchableOpacity onPress={
                      ()=> navigation.navigate('BookAppointmentStep2', {
                          therapistId: item?.item.node.id,
                          therapistName: item?.item.node.name
                        })
                    }>
                    <View style={styles.containerField}>
                    <View style={{paddingRight: 7, paddingLeft: 7}}>
                      <Avatar
                      size="medium"
                      rounded
                      activeOpacity={0.7}
                      source={{
                        uri:
                          'https://www.thewodge.com/wp-content/uploads/2019/11/avatar-icon.png',
                      }}
                      />
                    </View>
                    <View>
                      <Text style={{color: 'black', fontSize: 20, fontWeight: "600"}}>{item?.item.node.name} {item?.item.node.surname}</Text>
                      <View style={{flexDirection: 'row'}}>
                        <Text style={{fontSize: 17}}>{item?.item.node.workExp ? `${item?.item.node.workExp} years Exp` : '0 years Exp'}</Text>
                        <Text> | </Text>
                        <Text style={{fontSize: 17}}>{item?.item.node.isActive ? 'Available' : 'Not Available'}</Text>
                      </View>
                    </View>
                  </View>
                    </TouchableOpacity>
                  )
              }}
              />
              </View>
            </ScrollView>
         </SafeAreaView>
  )
}


const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    paddingLeft: 15,
    paddingRight: 15
  },
  containerField: {
    height: 80,
    flexDirection: 'row',
    shadowColor: "#000",
    shadowOffset: {
          width: 0,
          height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 10,
    margin: 5,
    marginBottom: 10
  }
})

export default Appointment