/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
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
 import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
 import NavigationHeader from '../../../components/NavigationHeader'
 import { getStr } from '../../../../locales/Locale'
 import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
// import SupportTicketField from './SupportTicketField';
import {Row, Column} from '../../../components/GridSystem'
import PickerModal from '../../../components/PickerModal'
import gql from 'graphql-tag'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { TICKET_QUERY, TICKET_PRIORITY } from './query'
import store from '../../../redux/store'


const DELETE_TICKET = gql`
  mutation($id: ID!) {
    deleteTicket(input: { pk: $id }) {
      status
    }
  }
`


 
 const SupportTicket = ({navigation}) => {

    const [
        deleteTicket,
        { data: deleteTicketData, error: deleteTicketError, loading: deleteTicketLoading },
      ] = useMutation(DELETE_TICKET)

    const userId = store.getState().user.id
    // console.log(userId)
    const { data: ticketQueryData, loading: ticketQueryLoading, error, refetch } = useQuery(TICKET_QUERY, {
        variables: {
          form:  null,
          to:  null,
        },
        fetchPolicy: 'network-only'
      })

     const statuses= [
        { id: "vgaAll", label: "(All)" },
        { id: "VGlja2V0U3RhdHVzVHlwZTox", label: "In Process" },
        { id: "VGlja2V0U3RhdHVzVHlwZToy", label: "Resolved" },
        { id: "VGlja2V0U3RhdHVzVHlwZToz", label: "Reopen" },
        { id: "VGlja2V0U3RhdHVzVHlwZTo0", label: "Closed" },
        { id: "VGlja2V0U3RhdHVzVHlwZTo1", label: "Pending Customer" },
        { id: "VGlja2V0U3RhdHVzVHlwZTo2", label: "Open" },
    ]
    const priorities = [
        { id: "vgaAll", label: "(All)" },
        { id: "VGlja2V0UHJpb3JpdHlUeXBlOjE=", label: "High" },
        { id: "VGlja2V0UHJpb3JpdHlUeXBlOjI=", label: "Medium" },
        { id: "VGlja2V0UHJpb3JpdHlUeXBlOjM=", label: "Low" },
    ]


    // const [priority, setPriority] = useState("UHJpb3JpdHlUeXBlOjE=")
    
    const [ticketData, setTicketData] = useState(ticketQueryData?.tickets.edges)
    const globalTicketData = ticketQueryData?.tickets.edges

    const priorityFunc = (id) => {
      
      if(id==="vgaAll"){
        setTicketData(globalTicketData)
      }
      else{
        let demoArray = []
        globalTicketData.map((value)=>{
        if(value.node.priority.id === id){
          demoArray.push(value)
        }
      })
      console.log('dadadda')
      console.log(demoArray)
      setTicketData(demoArray)
      }
    }

    const statusFunc = (id) => {
      
      if(id==="vgaAll"){
        setTicketData(globalTicketData)
      }
      else{
        let demoArray = []
        globalTicketData.map((value)=>{
        if(value.node.status.id === id){
          demoArray.push(value)
        }
      })
      console.log('dadadda')
      console.log(demoArray)
      setTicketData(demoArray)
      }
    }

    // const ticketData =  ticketQueryData?.tickets.edges
    
   
    console.log(ticketQueryData?.tickets.edges)
    
    // console.log(setTicketData)
    
    // if(ticketQueryLoading || ticketQueryData){
    //   return <Text>Laoding</Text>
    // }
    // let demoArray = []
    // ticketData  = ticketData.filter( i => priority.includes( i.node.priority.id ))
    
     return(
         <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
            {<NavigationHeader
            backPress={() => navigation.goBack()}
            title={getStr("TargetAllocate.SupportTicketList")}
            />}
            <ScrollView style={ styles.container}>
            <Row style={{ height: 90 }}>
            <Column>
                <PickerModal
                    label={getStr("BegaviourData.Status")}
                    placeholder="(All)"
                    data={statuses}
                    onValueChange={(value) => {
                      statusFunc(value)
                    }}
                />
            </Column>
            <Column>
                <PickerModal
                    label={getStr("TargetAllocate.Priority")}
                    placeholder="(All)"
                    data={priorities}
                    onValueChange={(value) => {
                      priorityFunc(value)
                      // console.log(value)
                    }}
                />
            </Column>
        </Row>
        <View>
        <FlatList
        data={ ticketData || globalTicketData}
        renderItem={({item}) => {
            // console.log(item.node.createdBy.id)
            return (
              <TouchableOpacity onPress={
                ()=> navigation.navigate('ViewSupportTicket', {
                    ticketId: item.node.id,
                    issueName: item.node.subject,
                    raiseBy: item.node.createdBy.firstName,
                    userId: item.node.createdBy.id,
                    status: item.node.status.status,
                    statuId: item.node.status.id,
                    priority: item.node.priority.priority,
                    priorityId: item.node.priority.id,
                    date: item.node.createdAt,
                    description: item.node.description,
                    assign: item.node.assignTo.team,
                    assignId: item.node.assignTo.id,
                    serviceIssue: item.node.service.service,
                    serviceIssueId: item.node.service.id
                  })
              }>
                <View style={styles.ticketfield}>
                    <View>
                        <Text style={{fontSize: 16, color: 'black'}}>{item.node.subject}</Text>
                        <Text style={{color: 'orange'}}>{item.node.priority.priority}</Text>
                    </View>
                    <View>
                    <TouchableOpacity style={{ padding: 5 }} onPress={() => {
                        Alert.alert(
                            'Information',
                            'Are you sure want to close this ticket?',
                            [
                                { text: 'No', onPress: () => { } },
                                {
                                    text: 'Yes', onPress: () => {
                                      deleteTicket({
                                        variables: {
                                          id: item.node.id
                                        },
                                      })
                                      refetch()
                                    }
                                },
                            ],
                            { cancelable: false }
                          );
                        }}>
                        <MaterialCommunityIcons name='check-circle-outline' size={30} color='green' />
                    </TouchableOpacity>
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
        marginLeft: 20,
        marginRight: 20,
        marginBottom: 10
    },
    ticketfield: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
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
    },
    addButton: {
        width: '100%',
        flexDirection: 'row',
        backgroundColor: 'white',
        borderRadius: 8,
        borderColor: '#3E7BFA',
        borderWidth: 1.5,
        marginBottom: 10,
        marginTop: 20,
        justifyContent: 'center'
    },
    icon2: {
        color: '#3E7BFA',
        paddingLeft: 20,
        paddingTop: 15,
        paddingBottom: 15,
        fontSize: 20,
        fontWeight: 'bold',
        marginRight: 10
    },
    
 })
 
 export default SupportTicket