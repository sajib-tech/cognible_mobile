import React, { Component } from "react";
import { View,Text,Dimensions,TouchableOpacity ,TextInput,StyleSheet,Image,Platform,ScrollView } from "react-native";
// import { styles } from "./style";
import { connect } from "react-redux";
import ClinicRequest from '../../../constants/ClinicRequest';
// import metrics from "../../utils/metrics";
// import { ScrollView } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/Entypo";
import RNPickerSelect from 'react-native-picker-select';
import Snackbar from "react-native-snackbar";
import ParentRequest from '../../../constants/ParentRequest';
let self;
const {
  height, width,
} = Dimensions.get('window');
class  CreateBlog extends React.PureComponent {
    componentDidMount() {
      let { route } = this.props;
      this.setState({groupId:route.params.categoryId})
      this.getData();
    }
        constructor(props) {
            super(props);
            this.state = {
                title:'',
                Content:'',
                faultArray :[],  
                isLoading:false,
                categoryList:[],
                categotyId:'',
                groupId:''
            }
        
              }


              createBlog() {
                let variables = {
                  title: this.state.title,
                  category: this.state.categotyId,
                  description: this.state.Content,
                  groupId:this.state.groupId
           };
           console.log('variables',JSON.stringify(variables))
             ParentRequest.addBlogs(variables).then(dataResult => {
                 console.log("Add Commnetes", JSON.stringify(dataResult));
                 alert("Blog Added!!!")
              
       this.setState({  title:'',
       Content:'',})
       this.props.navigation.goBack();
             }).catch(error => {
                 console.log(error, error.response);
                 this.setState({ isLoading: false });
             });
       
       
       
         }


              getData() {
                this.setState({ isLoading: true });
          
                ClinicRequest.getCategoryData().then(dashboardResult => {
                    console.log('DashboardResult', JSON.stringify(dashboardResult));
                  console.log('dashboardResult.length',dashboardResult.data.communityGroupsCategoryList.length)
                    for(let i = 0; i < dashboardResult.data.communityGroupsCategoryList.length; i++){
                      let dataCategory=dashboardResult.data.communityGroupsCategoryList[i];
                      this.state.faultArray.push({label:dataCategory.name,value:i})
                    }

                    this.setState({
                      faultArray:  this.state.faultArray,
                        isLoading: false,
                        categoryList: dashboardResult.data.communityGroupsCategoryList,
                    });
                    console.log('this.state.faultArray',this.state.faultArray)
                }).catch(error => {
                    console.log(error);
                    this.setState({ isLoading: false, isAttendanceLoading: false });
                    Alert.alert("Information", "Cannot Fetch Today Data\n" + error.toString());
                });
            }
              showSnackbar(title) {
                Snackbar.show({
                  title: title,
                  duration: Snackbar.LENGTH_LONG,
                  position: "top",
                  backgroundColor: "black",
                  color:"white",
                
                });
            }
            goBack(){
              this.props.navigation.goBack(); 
              }

               render()
              {   
             return ( 

              // <ScrollView >
<View style={styles.parentView}>
  
<View style={styles.containerHeader}>
                    <TouchableOpacity
                      style={{
                        marginBottom: 20,
                        marginTop: Platform.OS === "ios" ? 20 : 12,
                        paddingTop: Platform.OS === "ios" ? 5 : 0,
                        paddingLeft: 5
                      }}
                      onPress={() => this.goBack()}
                    >
                      <Icon color="black" name="chevron-thin-left" size={25} />
      
                    </TouchableOpacity>
                    {/* <View style={styles.rightContainer}> */}
                    <Text style={styles.Blogtextstyle}> Create A Blog   </Text>

                 {/* </View> */}
                </View>
 {/* <View style={{flexDirection:'row'}}>
    
<Text style={styles.Blogtextstyle}> Create A Blog   </Text>

                  </View> */}
<Text style={styles.textstylename}> Title:   </Text>


  

<TextInput
style={styles.editStyle1}
      onChangeText={text => this.setState({title:text})}
      placeholder="Give the blog title"
      value={this.state.title}
      placeholderTextColor = "#8F90A6"
      underlineColorAndroid="transparent"
      


    />
<View style={styles.RNPicker}>
  
<Text style={styles.textstyle}> Catagory :   </Text>
<RNPickerSelect  ref={e => this.picker = e} 
  useNativeAndroidPickerStyle={false} 
  
  placeholder={{
    label: 'Select a blog catagory',
    value: null,
}}

  style={{
            placeholder: {color:'#8F90A6',textAlign:'left',padding:10,fontSize:16,},
            inputAndroid: { 
              height:height*0.070,
              width:width*0.80,
               backgroundColor:'white',
               marginTop:10,  
               textAlign:'center',                      
               alignSelf:'center',
               borderRadius:12,
               borderColor:'#D5D5D5',
              borderWidth:2,
              color:'black',
              
              },
          }}
          
            onValueChange={(value) => {
              this.setState({categotyId:this.state.categoryList[value].id})
              console.log(this.state.categoryList[value].id)}}
            items={this.state.faultArray}

        />
</View>

<Text style={styles.textstyle}>Content: </Text>
<TextInput
style={styles.editStyleContent}
      onChangeText={text => this.setState({Content:text})}
      placeholder=""
      value={this.state.Content}
      placeholderTextColor = "#8F90A6"
      underlineColorAndroid="transparent"
      


    />

<TouchableOpacity style={styles.createbtnview}

onPress={() => {
    if(this.state.title==undefined || this.state.title==''){
        this.showSnackbar ("please fill Title first.");

      }
      else if(this.state.faultArray==undefined || this.state.faultArray==''){
        this.showSnackbar ("please fill Select a blog catagory first.");

      }
     
     else if(this.state.Content==undefined || this.state.Content==''){
        this.showSnackbar ("please fill Content first.");

      }
      
      else{
        this.createBlog();
             }
       
      }}> 
        
    <Text style={styles.btntext}>Create</Text>
        </TouchableOpacity> 
        
        <View style={styles.view}></View>
</View>
  // </ScrollView>

  
    
           )       
           
    }}
    const styles = StyleSheet.create({
     
      parentView:{
        backgroundColor:'#EEEEF4',
      flex:1,
      },
      // scorollView:{
      //   width:metrics.DEVICE_WIDTH,
      //   height:metrics.HEIGHT_SPLASH,
      //     backgroundColor:'#FFFFFF'
      //       },
    
       containerHeader: {
        flexDirection: "row"
      }, 
      
    editStyle1:{
        color:'black',
        fontSize:16,
        borderRadius:8,
    marginTop:6,
    borderWidth:2,
         padding:10,
        backgroundColor:'white',
        width:width*0.80,
        borderColor:'#D5D5D5',
        height:height*0.070,
    alignSelf:'center'
      },
      Blogtextstyle:{
        alignSelf:'flex-start',
        fontSize:18,
        color:'#45494E',
    padding:10,
      
        width:width*100,
      fontStyle:'normal',
      fontWeight:'600',

      },
      textstylename:{
        alignSelf:'center',
        fontSize:16,
        color:'black',
        paddingTop:20,
        borderBottomColor:'black',
        width:width*0.80,
       
      },
      
      textstyle:{
        alignSelf:'center',
        fontSize:16,
        color:'black',
        paddingTop:12,
        borderBottomColor:'black',
        width:width*0.80,
       
      },
      editStyleContent:{
        color:'black',
        fontSize:16,
        borderRadius:6,
    marginTop:6,
    borderWidth:2,
         padding:10,
        backgroundColor:'#FFFFFF',
        width:width*0.80,
        borderColor:'#D5D5D5',
        height:height*0.2,
    alignSelf:'center',textAlignVertical: 'top'
      },
   
      createbtnview:{
        height:height*0.070,     
        width:width*0.80,
        backgroundColor:'white',
        justifyContent:'center',
        alignSelf:'flex-start' ,
        alignItems:'center',
      marginLeft:40,
        marginTop:20,
        backgroundColor:'#3E7BFA',
        borderRadius:8,
                    },
                    btntext:{  
                        alignSelf:'center',
                           color:'#FFFFFF',
                           fontSize:17,
                
                    },       
    
    })
    const mapStateToProps = state => ({
    })
    const mapDispatchToProps = dispatch => ({
    });
    export default connect(
      mapStateToProps,
      mapDispatchToProps
    )(CreateBlog);    