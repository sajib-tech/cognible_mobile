import 'react-native-gesture-handler';
import { useMutation } from '@apollo/react-hooks';
import { Overlay } from 'react-native-elements';
import React, { Component } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View, Image, Alert,
    Modal,
    Picker, ActivityIndicator,
    Text, TouchableOpacity
} from 'react-native';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { ListItem } from 'react-native-elements';
import { ApolloProvider, Mutation } from 'react-apollo';
import { client, createPrefItem, preferredItems } from '../../constants/index';
import store from '../../redux/store';
import { connect } from 'react-redux';
import { getAuthResult, getAuthTokenPayload } from '../../redux/reducers/index';
import { setToken, setTokenPayload } from '../../redux/actions/index';
import TokenRefresher from '../../helpers/TokenRefresher';
import { Row, Container, Column } from '../../components/GridSystem';
import OrientationHelper from '../../helpers/OrientationHelper';
import NavigationHeader from '../../components/NavigationHeader';
import Button from '../../components/Button';
import Color from '../../utility/Color';
import TextInput from '../../components/TextInput';
import PickerModal from '../../components/PickerModal';
import { getStr } from "../../../locales/Locale";
import ParentRequest from '../../constants/ParentRequest';

class PreferredItemNew extends Component {
    // const [ selectedValue, setSelectedValue ] = useState("java");
    constructor(props) {
        super(props);

        this.params = this.props.route.params;
        console.log("Params", this.params);

        let studentId = store.getState().studentId;
        if (studentId == null || studentId == "") {
            studentId = this.params.studentId;
        }

        this.item = this.params.item;

        this.state = {
            isSaving: false,
            itemName: '',
            description: '',
            relationshipId: '',
            selectedOption: '',
            choosenIndex: 0,
            options: [],
            value: '',
            programAreaId: '',
            itemNameError: '',
            categoryError: '',
            descriptionError: '',
            isSavingCategory:false,
            errorModalNameMessage:'',
            
            isShowModal:false,
            modalType: 'category',
            dataText: '',
            studentId
        };
        this.goBack = this.goBack.bind(this);
    }

    goBack() {
        this.props.navigation.goBack();
    }

    componentDidMount() {
        let { route } = this.props;

        // let options = route.params.categoryOptions.map(element => {
        //     return {
        //         label: element.node.name,
        //         id: element.node.id
        //     };
        // });

        this.getData()

        this.setState({ programAreaId: route.params.programAreaId}, () => {
            if (this.item) {
                this.setState({
                    programAreaId: this.item.node.programArea.id,
                    value: this.item.node.category.id,
                    description: this.item.node.description,
                    itemName: this.item.node.itemName,
                })
            }
        });

        ParentRequest.setDispatchFunction(this.props.dispatchSetToken);
    }

    getData() {

		this.setState({ isCategoryLoading: true });
		let variables = {
			student: this.state.studentId,
		};
		ParentRequest.getPreferredCategories(variables).then((result) => {
			let categories = result.data.preferredItemsCategory.edges;
            const options=categories.map(({node})=>{
                console.log("node>>>",node.id,node.name);
                return {
                    label:node.name,
                    id:node.id
                    
                }
            })
			this.setState({
				options,
			});
		}).catch((err) => {
			console.log("Err", err);
			Alert.alert("Information", err.toString());
		});
	}


    isFormInValid() {
        let isError = false;
        if (this.state.itemName === "") {
            this.setState({ itemNameError: getStr('Therapy.pleaseError') });
            isError = true;
        } else {
            this.setState({ itemNameError: "" });
        }
        if (this.state.value === "") {
            this.setState({ categoryError: getStr('Therapy.SelectCategory') });
            isError = true;
        } else {
            this.setState({ categoryError: "" });
        }
        if (this.state.description === "") {
            this.setState({ descriptionError: getStr('Therapy.Please_ERROR') });
            isError = true;
        } else {
            this.setState({ descriptionError: "" });
        }
        return isError;
    }

    saveItem() {
        if (this.isFormInValid()) {
            console.log("yes, form is Not valid")
            return;
        }

        this.setState({ isSaving: true });

        let variables = {
            studentId: this.state.studentId,
            programAreaId: this.state.programAreaId,
            categoryId: this.state.value,
            itemName: this.state.itemName,
            description: this.state.description===null ? '':this.state.description
        };

        let promise = null;
        if (this.item) {
            variables.id = this.item.node.id;
            promise = ParentRequest.updatePrefItem(variables);
        } else {
            promise = ParentRequest.createPrefItem(variables);
        }

        console.log("Vars", variables);

        promise.then((result) => {
            this.setState({ isSaving: false });
            Alert.alert(
                'Information',
                'Preferred Item Successfully Saved',
                [{
                    text: 'OK', onPress: () => {
                        console.log('OK Pressed');
                        this.props.navigation.goBack();
                    }
                }],
                { cancelable: false }
            );
        }).catch((err) => {
            console.log("Err", JSON.stringify(err));
            Alert.alert('Information', err.toString());
            this.setState({ isSaving: false });
        });
    }

    showModal(modalType) {
        this.setState({
          isShowModal: true,
          modalType,
          dataText: '',
        });
      }
    
      saveCategory() {
        this.setState({
          errorModalNameMessage: '',
        });
    
        if (this.state.dataText == '') {
          this.setState({errorModalNameMessage: 'Please fill category name'});
          return;
        }

        if(this.state.dataText.length>0){
            if(this.props.route.params.categoryOptions){
                let options = this.props.route.params.categoryOptions.map(element => {
                    return {
                        label: element.node.name,
                        id: element.node.id
                    };
                });
                const isExist=options.filter(label=>{
                    return label.label.toLowerCase() ===this.state.dataText.toLowerCase() })
                if(isExist.length!==0){
                    this.setState({errorModalNameMessage: 'Category is Already Exist'});
                      
                }
                if(isExist.length===0){
          this.setState({errorModalNameMessage: ''});

                    this.setState({isSavingCategory: true});
    
        let variables = {
          student: this.props.route.params.studentId,
          name: this.state.dataText,
        };
        ParentRequest.createPreferredItemsCategory(variables)
          .then((result) => {
            this.setState({
              isSavingCategory: false,
              isShowModal: false,
            });
    
         this.getData();
          })
          .catch((error) => {
            this.setState({
              isShowModal: false,
            });
          });

                }

            }
        }

    
        
      }
      renderModal() {
        return (
          <Modal
            animationType="fade"
            transparent={true}
            visible={this.state.isShowModal}
            onRequestClose={() => {
              this.setState({isShowModal: false});
            }}>
            <TouchableOpacity
              style={styles.modalWrapper}
              activeOpacity={1}
              onPress={() => {
                this.setState({isShowModal: false});
              }}>
              <View style={styles.modalContent}>
                <TextInput
                  label={'Enter ' + this.state.modalType + ' name :'}
                  error={this.state.errorModalNameMessage}
                  autoFocus={true}
                  onChangeText={(dataText) => {
                    this.setState({dataText});
                  }}
                  value={this.state.dataText}
                />
    
                
    
                <Button
                  labelButton="Submit"
                  isLoading={this.state.isSavingCategory}
                  onPress={() => {
                    if (this.state.modalType == 'category') {
                      this.saveCategory();
                    } 
                  }}
                />
              </View>
            </TouchableOpacity>
          </Modal>
        );
      }
    

    render() {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: Color.white }}>
                <NavigationHeader
                    backPress={() => {
                        this.props.navigation.goBack();
                    }}
                    title={this.item ? "Edit Preferred Items" : getStr('Therapy.NewPreferred')}
                />

                <Container>
                    <ScrollView contentInsetAdjustmentBehavior="automatic">
                        <View style={{ height: 10 }} />

                        <TextInput
                            label={getStr('Therapy.PreferredItemName')}
                            error={this.state.itemNameError}
                            underlineColorAndroid="transparent"
                            placeholder={getStr('Therapy.Name')}
                            numberOfLines={1}
                            value={this.state.itemName}
                            onChangeText={(itemNameTxt) => {
                                this.setState({ itemName: itemNameTxt, itemNameError: "" });
                            }}
                        />

                        <PickerModal
                            label={getStr('Therapy.CategoryName')}
                            error={this.state.categoryError}
                            selectedValue={this.state.value}
                            placeholder={getStr('Therapy.Category')}
                            data={this.state.options}
                            onValueChange={(value, itemIndex) => {
                                this.setState({ value, categoryError: '' })
                            }}
                            onAdded={() => {
                                this.showModal('category');
                              }}
                        />

                        <TextInput
                            label={getStr('BegaviourData.Description')}
                            error={this.state.descriptionError}
                            underlineColorAndroid="transparent"
                            placeholder={getStr('BegaviourData.WriteSomething')}
                            numberOfLines={10}
                            style={{ minHeight: 100 }}
                            multiline={true}
                            value={this.state.description}
                            onChangeText={(description) => {
                                this.setState({ description, descriptionError: "" });
                            }}
                        />
                        {/* </View> */}
                    </ScrollView>
                    <Button labelButton={getStr('Therapy.SaveItem')}
                        isLoading={this.state.isSaving}
                        style={{ marginBottom: 10 }}
                        onPress={() => {
                            this.saveItem();
                        }}
                    />
                    {this.renderModal()}
                </Container>
            </SafeAreaView>
        );
    }
};

const styles = StyleSheet.create({
    itemName: {
        borderWidth: 1,
        borderColor: Color.gray,
        borderRadius: 5,
        backgroundColor: "#FFFFFF",
        marginTop: 10,
        marginBottom: 15,
        paddingHorizontal: 16
    },
    textArea: {
        borderWidth: 1,
        borderColor: Color.gray,
        borderRadius: 5,
        height: 150,
        textAlignVertical: 'top',
        marginTop: 10,
        marginBottom: 15,
        paddingHorizontal: 16
    },
    modalWrapper: {
        backgroundColor: 'rgba(0,0,0,0.1)',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
      },
      modalContent: {
        backgroundColor: Color.white,
        width: 300,
        borderRadius: 5,
        padding: 8,
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
});

const mapStateToProps = (state) => ({
    authResult: getAuthResult(state),
    authTokenPayload: getAuthTokenPayload(state)
});

const mapDispatchToProps = (dispatch) => ({
    dispatchSetToken: (data) => dispatch(setToken(data)),
    dispatchSetTokenPayload: (data) => dispatch(setTokenPayload(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PreferredItemNew);
