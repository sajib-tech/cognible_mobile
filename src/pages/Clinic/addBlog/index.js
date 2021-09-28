import React, { Component } from "react";
import { View,Text,Button,TouchableOpacity ,TextInput,StyleSheet,Image,Platform,Dimensions} from "react-native";
// import { styles } from "./style";
import { connect } from "react-redux";

import Icon from "react-native-vector-icons/Entypo";

import Snackbar from "react-native-snackbar";
import ParentRequest from '../../../constants/ParentRequest';
import store from '../../../redux/store';

let self;
const {
  height, width,
} = Dimensions.get('window');

class  AddBlog extends React.PureComponent {
    componentDidMount() {
      let { route } = this.props;
      console.log('route.params.categoryId',route.params.categoryId)
      if(route.params.categoryId!=undefined && route.params.categoryId!=''){
        this.setState({groupId:route.params.categoryId,Name:route.params.name,Description:route.params.description})
        this.setState({btnText:'Update'})
    }}
        constructor(props) {
            super(props);
            this.state = {
                Name:'',
                Description:'',
                btnText:'Add',
                groupId:''
                
            }
  

        
              }
              createGroup() {
                let variables = {
                  name: this.state.Name,
                  description: this.state.Description,
           };
           console.log('variables',JSON.stringify(variables))
             ParentRequest.addGroup(variables).then(dataResult => {
                 console.log("Add Commnetes", JSON.stringify(dataResult));
                 
              alert("Group Added!!!")
       this.setState({  Name:'',
       Description:'',})
       this.props.navigation.goBack();
             }).catch(error => {
                 console.log(error, error.response);
                 this.setState({ isLoading: false });
             });
       
       
       
         }

         updateGroup(groupId) {
          let variables = {
            name: this.state.Name,
            description: this.state.Description,
            pk:groupId,
            userId:store.getState().user.id
     };
     console.log('variables',JSON.stringify(variables))
       ParentRequest.updateGroup(variables).then(dataResult => {
           console.log("Add Commnetes", JSON.stringify(dataResult));
           
        alert("Group Updated!!!")
 this.setState({  Name:'',
 Description:'',})
 this.props.navigation.goBack();
       }).catch(error => {
           console.log(error, error.response);
           this.setState({ isLoading: false });
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
      
                      {/* <MaterialIcon name="chevron-thin-left" size={50} color="white" /> */}
                    </TouchableOpacity>
                    <View style={styles.rightContainer}>
                    <Text style={styles.Blogtextstyle}> Create A Group   </Text>

                 </View>
                </View>
                  
<Text style={styles.textstyle}> Name:   </Text>


  

<TextInput
style={styles.editStyle1}
      onChangeText={text => this.setState({Name:text})}
      placeholder=""
      value={this.state.Name}
      placeholderTextColor = "#d3d3d3"
      underlineColorAndroid="transparent"
      


    />

<Text style={styles.textstyle}> Description: </Text>
<TextInput
style={styles.editStyledescription}
      onChangeText={text => this.setState({Description:text})}
      placeholder=""
      value={this.state.Description}
      placeholderTextColor = "#d3d3d3"
      underlineColorAndroid="transparent"
      


    />

<TouchableOpacity style={styles.updatebtnview}

onPress={() => {
    if(this.state.Name==undefined || this.state.Name==''){
        this.showSnackbar ("please fill Name first.");

      }
     else if(this.state.Description==undefined || this.state.Description==''){
        this.showSnackbar ("please fill Description first.");

      }
      
      else{
        if(this.state.groupId!=''){
          this.updateGroup(this.state.groupId);
        }else{
          this.createGroup();
        }
       
             }
       
      }}> 
        
    <Text style={styles.btntext}>{this.state.btnText}</Text>
        </TouchableOpacity> 
        
        <View style={styles.view}></View>
</View>
  
  
    
           )       
           
    }}
    const styles = StyleSheet.create({
      containerHeader: {
        flexDirection: "row"
      }, 
      parentView:{
        backgroundColor:'#EEEEF4',
      flex:1,
      },
      
      editStyle1:{
        color:'#45494E',
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
      
      textstyle:{
        alignSelf:'center',
        fontSize:16,
        color:'black',
        paddingTop:12,
        borderBottomColor:'black',
        width:width*0.80,
       
       
      },
      editStyledescription:{
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
   
      updatebtnview:{
        height:height*0.070,     
        width:width*0.80,
        backgroundColor:'white',
        justifyContent:'center',
        alignSelf:'flex-start' ,
        alignItems:'center',
      marginLeft:40,
        marginTop:20,
        backgroundColor:'#213077',
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
    )(AddBlog);    