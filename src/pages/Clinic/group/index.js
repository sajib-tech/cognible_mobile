import React, { Component } from "react";
import { View,Text,Button,ScrollView,StyleSheet,Dimensions,TouchableOpacity ,TextInput,Image,FlatList} from "react-native";
// import { styles } from "./style";
import { connect } from "react-redux";
import Icon from "react-native-vector-icons/Entypo";
import ClinicRequest from '../../../constants/ClinicRequest';
import ParentRequest from '../../../constants/ParentRequest';

import CardView from "react-native-cardview";
let self;
const {
  height, width,
} = Dimensions.get('window');
let willFocusSubscription;

class  Group extends React.PureComponent {

    componentDidMount() {
      
      const {navigation} = this.props;
      navigation.addListener('focus', () => {
      // do something
      this.getData();
    });
    }

    componentWillUnmount() {
    }
    getData() {
      this.setState({ isLoading: true });

      ClinicRequest.getGroupsData().then(dashboardResult => {
          console.log('DashboardResult', JSON.stringify(dashboardResult));

          this.setState({
              isLoading: false,
              groupsList: dashboardResult.data.communityGroups,
          });
      }).catch(error => {
          console.log(error);
          this.setState({ isLoading: false, isAttendanceLoading: false });
          Alert.alert("Information", "Cannot Fetch Today Data\n" + error.toString());
      });
  }
    goBack(){
      this.props.navigation.goBack(); 
      }
    constructor(props) {
        super(props);
        this.state = {
              array:[{Name:'Test',Description:'superb',},{Name:'Test123',Description:'osm',},{Name:'Test111',Description:'superb',},{Name:'Test44',Description:'osm',}],
        Description:'',
        Name:'',
        groupsList:[]
      }
  }

  deleteGroup(groupId) {
    let variables = {
      pk: groupId,
};
console.log('variables',JSON.stringify(variables))
 ParentRequest.deleteGroup(variables).then(dataResult => {
     console.log("Add Commnetes", JSON.stringify(dataResult));
     this.getData();

     
 }).catch(error => {
     console.log(error, error.response);
     this.setState({ isLoading: false });
 });



}
  render()
  {   

  return (
  
  
  
    <ScrollView style={styles.scorollView}>
  
    <View style={ { backgroundColor:'white', flex:1,}}>
    
    <View style={styles.containerHeader}>
                    <TouchableOpacity
                      style={{
                        marginBottom: 10,
                        marginTop: Platform.OS === "ios" ? 20 : 12,
                        paddingTop: Platform.OS === "ios" ? 5 : 0,
                        paddingLeft: 5
                      }}
                      onPress={() => this.goBack()}
                    >
                      <Icon color="black" name="chevron-thin-left" size={30} />
      
                      {/* <MaterialIcon name="chevron-thin-left" size={50} color="white" /> */}
                    </TouchableOpacity>
                    <View style={{flexDirection:'row',width:250}}>
                    <Text style={styles.grouptextstyle}>Groups   </Text>

                 </View>
                 <TouchableOpacity
                          onPress={() => {
                            let {navigation} = this.props;
                            navigation.navigate('AddBlog',{
                              categoryId: '',name: '',description:''});
                          }}> 
                           <Image source= {require("../../../assets/images/plus.png")} style ={{marginTop:10,alignSelf:'flex-end', width:20,
              height:20,margin:20,alignSelf:'center',alignItems:'center',marginBottom:10
                  }}/>
                  </TouchableOpacity>
                </View>
                             
                             {/* <View style={styles.blankview}> */}
  {/* </View> */}
  <FlatList
          data={this.state.groupsList}
            showsVerticalScrollIndicator={false}
                 onEndReachedThreshold={0.5}  
                      renderItem={({ item }) => (
                        
                        <TouchableOpacity onPress={() => {}
                        }>
  
                          <View style={{backgroundColor:'white'}}>
         
                     
                        <View style={styles.viewParentTextStyle}>
                        <CardView
                        style={styles.gridViewContainderStyle}
                        cardElevation={2}
                        cardMaxElevation={2}
                        cornerRadius={5}
                      >
 <View style={{flexDirection:'row',alignSelf:'flex-end'}}>

     
<TouchableOpacity
                          onPress={() => {
                            this.deleteGroup(item.id)
                          }}> 
                           <Image source= {require("../../../assets/images/delete.png")} style ={{marginTop:10,alignSelf:'flex-end', width:20,
              height:20,margin:20,alignItems:'flex-end',justifyContent:'flex-end',
                  }}/>
                  </TouchableOpacity>
                  <TouchableOpacity
                          onPress={() => {
                            let {navigation} = this.props;
                            navigation.navigate('AddBlog',{
                              categoryId: item.id,name: item.name,description:item.description});

                          }}> 
                           <Image source= {require("../../../assets/images/edit.png")} style ={{marginTop:10,alignSelf:'flex-end', width:20,
              height:20,margin:20,
                  }}/>
                  </TouchableOpacity>
                  <TouchableOpacity
                          onPress={() => {
                            let {navigation} = this.props;
                            navigation.navigate('CreateBlog',{
                              categoryId: item.id});
                          }}> 
                           <Image source= {require("../../../assets/images/plus.png")} style ={{marginTop:10,alignSelf:'flex-end', width:20,
              height:20,margin:20,
                  }}/>
                  </TouchableOpacity>
</View>
<Text
                                style={styles.GroupNameStyleModel}
                                  numberOfLines={1}
                                                   >                                                   
                                            {item.name}                                                                               
</Text>
                                                   <Text
                               style={styles.descriptionStyleModel}
                                    numberOfLines={8}
                                                      > 
                                                      
                                                      {item.description}
                                                       {/* {item.description} */}
                                                                  </Text>
                                                     
                                                 
                                                                  </CardView>
                        </View>
                            
                                                         {/* </View> */}
                               
  
                      
   </View>
     <View
  />
                          
                    </TouchableOpacity>
                  )}
                  keyExtractor={item => item.id}
                />
                
          </View>
     </ScrollView>
  
  
  
    
           )       
           
    }}
    const styles = StyleSheet.create({

        scorollView:{
          width:width,
          height:height,
            backgroundColor:'gainsboro'
              },
      
              
      
        GroupNameStyleModel: {
          margin:10,
          color:'black',
          fontSize: 17,
          paddingLeft:6,
          fontFamily: 'italic',
      fontWeight:'bold',
      flexDirection:'row'
        },
        descriptionStyleModel: {
          margin:10,
          color: 'black',
          fontSize: 14,
          paddingLeft:6,
          // alignSelf:'center',
          fontFamily: 'italic',
          
      
        },
      
        containerHeader: {
          flexDirection: "row"
        }, 
      
      
                view:{
                  flexDirection:'row',
                },
                
                viewParentTextStyle:{
                  flexDirection: 'column',
                   padding:10,
                   alignSelf:'center',
                   backgroundColor:'gainsboro'
                },
                blankview:{
                  flexDirection:'row',
              // paddingLeft:10,
            padding:20,
            backgroundColor:'gainsboro'
                    },
                    gridViewContainderStyle: {
                      width: width-30,
                      backgroundColor:"white",
                    
                    },grouptextstyle:{
                      alignSelf:'flex-start',
                      fontSize:18,color:'black',
                  // borderBottomColor:'black'
                     padding:12,
                      // borderWidth: 2,
                      width:width*100,
                     
                    },
                  
      
      
      })
      
    const mapStateToProps = state => ({
    })
    const mapDispatchToProps = dispatch => ({
    });
    export default connect(
      mapStateToProps,
      mapDispatchToProps
    )(Group);    