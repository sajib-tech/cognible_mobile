import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Alert,
  Modal,
  TouchableOpacity,
} from 'react-native';
import {upperFirst} from 'lodash';
import {TextInput} from 'react-native-gesture-handler';
import Button from '../../../components/Button';
import Color from '../../../utility/Color';
import PreferredItemView from '../../../components/PreferredItemView';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import TherapistRequest from '../../../constants/TherapistRequest';
import ParentRequest from '../../../constants/ParentRequest';
import NoData from '../../../components/NoData';
import LoadingIndicator from '../../../components/LoadingIndicator.js';
import {connect} from 'react-redux';
import {setToken, setTokenPayload} from '../../../redux/actions/index';
import {
  getAuthResult,
  getAuthTokenPayload,
} from '../../../redux/reducers/index';


const PreferenceAttachment = (props) => {
    const {studentId,program}=props
  const [addCat, setAddCat] = useState(false);
  const [addItem,setAddItem]=useState(false)
  const [catName, setCatName] = useState('');
  const [itemName,setItemName]=useState('')
  const [isCategoryLoading, setIsCategoryLoading] = useState(false);
  const [isContentLoading,setIsContentLoading]=useState(false)
  const [categories, setCategories] = useState([]);
  const [selectedTab, setSelectedTab] = useState();
  const [preferredItemsArray,setPreferredItemArray]=useState([])
  const [editItem,setEditItem]=useState(null)

  useEffect(() => {
    getData();
  }, []);
  useEffect(()=>{
      if(editItem){
          setItemName(editItem.itemName)
      }

  },[editItem])
  const getData = () => {
    ParentRequest.setDispatchFunction(props.dispatchSetToken);

    setIsCategoryLoading(true);
    let variables = {
      student: studentId,
    };
    console.log('Vars', variables);
    ParentRequest.getPreferredCategories(variables)
      .then((result) => {
        console.log('getPreferredCategories', result.data.preferredItemsCategory.edges[0].node.id);
        setCategories(result.data.preferredItemsCategory.edges);
        setSelectedTab(result.data.preferredItemsCategory.edges[0].node.id)
        setIsCategoryLoading(false)
        getItem(result.data.preferredItemsCategory.edges[0].node.id)
      })
      .catch((err) => {
        console.log('Err', err);
        Alert.alert('Information', err.toString());
      });
  };

  const getItem=(selectedTabdata)=>{
      console.log("getItem",selectedTabdata);
		if (selectedTab) {
      setIsContentLoading(true)

			let variables = {
				student:studentId,
				
			};
			console.log("Vars>>>", variables);
			ParentRequest.getPItems(variables).then((result) => {
				console.log("getPreferredItems", result.data.preferredItems);
                setPreferredItemArray(result.data.preferredItems.edges)
                setIsContentLoading(false)
			}).catch((err) => {
				console.log("Err", err);
				Alert.alert("Information", err.toString());
                setIsContentLoading(false)

			});
		}
  }

  const handleItemSubmit=()=>{
      console.log("itemSUbmit");
      
      let variables = {
        studentId,
        programAreaId: program.id,
        categoryId: selectedTab,
        itemName:itemName,
    };
    console.log("variable add>>",variables);
    let promise
    if(editItem !== null){        
        variables.id = editItem.id;
        console.log("variable to update>>",variables);
        promise=ParentRequest.updatePrefItem(variables)         
    }
    else{
    promise=ParentRequest.createPrefItem(variables)
    }
    promise.then(res=>{
        console.log("res.data>>>",res.data);
        getItem(selectedTab)
        setAddItem(false)
    })
    .catch(err=>{
        setAddItem(false)
    })
  }

  const handleSubmit = () => {
    const variables = {
      student: studentId,
      name: catName,
    };
    ParentRequest.createPreferredItemsCategory(variables)
      .then((result) => {
        setAddCat(false);

        getData();
      })
      .catch((error) => {
        setAddCat(false);
      });
  };
  return (
    <ScrollView style={{flex: 1}}>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'center',
        }}>
        <Button
          style={{
            width: '50%',
            margin: 5,
          }}
          labelButton={'Add Category'}
          onPress={() => {
            setAddCat(true);
          }}
        />

        {addCat && (
          <Modal
            animationType="fade"
            transparent={true}
            visible={addCat}
            onRequestClose={() => {
              setAddCat(false);
            }}>
            <TouchableOpacity
              style={styles.modalWrapper}
              activeOpacity={1}
              onPress={() => {
                setAddCat(false);
              }}>
              <View
                style={{
                  ...styles.modalContent,
                  justifyContent: 'center',
                  padding: 10,
                }}>
                <View style={{alignItems: 'center'}}>
                  <Text style={styles.modalTitle}>Add Category</Text>
                </View>
                <TextInput
                style={styles.modalInput}
                  label="Add Category"
                  placeholder={'Enter Category Name'}
                  defaultValue={catName}
                  onChangeText={(text) => setCatName(text)}
                />
                <Button
                  labelButton={'Add'}
                  onPress={() => {
                    handleSubmit();
                    setAddCat(false);
                  }}
                />
              </View>
            </TouchableOpacity>
          </Modal>
        )}
    </View>
    

        <View style={{height: 50, paddingTop: 10}}>
    {isCategoryLoading && <LoadingIndicator />}

        {!isCategoryLoading && <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            {categories.length !== 0 ? (
                <>
              {categories.map((el, index) => (
                <TouchableOpacity
                  onPress={() => {
                      console.log("category>>>",el.node.id);
                    setSelectedTab(el.node.id);
                    getItem();
                  }}
                  key={index}>
                  <Text
                    style={[
                      styles.tabView,
                      selectedTab === el.node.id
                        ? styles.selectedTabView
                        : '',
                    ]}>
                    {upperFirst(el.node.name)}
                  </Text>

                </TouchableOpacity>
              ))
                }
                <TouchableOpacity
              onPress={() => {
                console.log("plus");
                setAddItem(true)
                setEditItem(null)
              }}
              >
              <Text
                style={[styles.arrowButton, {marginTop: 0, marginBottom: -10}]}>
                <FontAwesome5
                  name={'plus'}
                  style={styles.arrowButtonText}
                />
              </Text>
            </TouchableOpacity>
            {addItem && (
          <Modal
            animationType="fade"
            transparent={true}
            visible={addItem}
            onRequestClose={() => {
              setAddItem(false);
            }}>
            <TouchableOpacity
              style={styles.modalWrapper}
              activeOpacity={1}
              onPress={() => {
                setAddItem(false);
              }}>
              <View
                style={{
                  ...styles.modalContent,
                  justifyContent: 'center',
                  padding: 10,
                }}>
                <View style={{alignItems: 'center'}}>
                  <Text style={styles.modalTitle}>Add Item</Text>
                </View>
                <TextInput
                style={styles.modalInput}
                  label="Add Item"
                  placeholder={'Enter Item Name'}
                  defaultValue={itemName}
                  onChangeText={(text) => setItemName(text)}
                />
                <Button
                  labelButton={'Add'}
                  onPress={() => {
                    handleItemSubmit();
                    setAddItem(false);
                  }}
                />
              </View>
            </TouchableOpacity>
          </Modal>
        )}

            </>
            ) : (
              <View style={{height: 500, justifyContent: 'center'}}>
                <NoData>No Item Available</NoData>
              </View>
            )}
          </ScrollView> }
          </View>
          {isContentLoading && <LoadingIndicator />}
        <View style={{height:100,paddingTop: 10}}>

          {!isContentLoading && <ScrollView>

								{preferredItemsArray.length == 0 && (
									<View style={{ justifyContent: 'center' }}>
										<NoData>No Item Available</NoData>
									</View>
								)}
								{preferredItemsArray && preferredItemsArray.map((elItem, itemIndex) => {
                                    console.log("node>>>>",elItem);
                                    if(elItem.node.category.id === selectedTab){
									return <PreferredItemView
										key={itemIndex}
										title={elItem.node.itemName}
										itemId={elItem.node.id}
										getData={()=>getItem()}
										onPress={() => {
											setAddItem(true)
                                            setEditItem(elItem.node)
                                            
										}} />
                                    }
                                    return null
									})}
							</ScrollView>}
           
        </View>



    </ScrollView>
  );
};
const styles = StyleSheet.create({
  modalWrapper: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Color.white,
    width: '95%',
    borderRadius: 5,
    padding: 0,
    height: 'auto',
  },
  modalTitle: {
    fontSize: 16,
    color: '#000',
  },
  modalInput: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Color.gray,
    marginTop: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  tabView: {
    padding: 5,
    marginLeft: 15,
    fontFamily: 'SF Pro Text',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 16,
    color: 'rgba(95, 95, 95, 0.75)',
  },
  selectedTabView: {
    color: '#3E7BFA',
    borderBottomWidth: 2,
    borderBottomColor: '#3E7BFA',
  },
  arrowButton: {
    justifyContent: 'center',
    width: 40,
    height: 40,
    // backgroundColor: '#3E7BFA',
    borderRadius: 4,
    marginLeft: 8,
    paddingTop: 10,
    textAlign: 'center',
  },
  arrowButtonText: {
    fontSize: 20,
    fontWeight: 'normal',
    // color: '#fff'
  },
});

const mapStateToProps = (state) => ({
	authResult: getAuthResult(state),
	authTokenPayload: getAuthTokenPayload(state)
});

const mapDispatchToProps = (dispatch) => ({
	dispatchSetToken: (data) => dispatch(setToken(data)),
	dispatchSetTokenPayload: (data) => dispatch(setTokenPayload(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PreferenceAttachment);
