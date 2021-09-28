import React, {Component, useEffect, useState} from 'react';
// import {useMutation, useQuery} from 'react-apollo';
// import {gql} from 'apollo-boost';
// import client from 'apollo/config';
// import {Button, Input, Modal, Form, Select, notification} from 'antd';
// import {PlusCircleOutlined} from '@ant-design/icons';

import {
  View,
  Text,
  SafeAreaView,
  Animated,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
} from 'react-native';
import Button from './Button';
import Color from '../utility/Color';
import ParentRequest from '../constants/ParentRequest';
import PickerModal from './PickerModal';
import MultiPickerModal from './MultiPickerModal';
import {getStr} from '../../locales/Locale';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
  input: {
    width: 200,
    borderBottomColor: 'red',
    borderBottomWidth: 1,
  },
  labelStyle: {
    color: Color.grayFill,
    fontSize: 14,
  },
  header: {
    flexDirection: 'row',
    height: 50,
    width: '100%',
  },
  backIcon: {
    fontSize: 50,
    fontWeight: 'normal',
    color: '#fff',
    width: '10%',
    paddingTop: 15,
  },
  backIconText: {
    fontSize: 20,
    fontWeight: 'normal',
    color: '#63686E',
  },
  headerTitle: {
    textAlign: 'center',
    width: '80%',
    fontSize: 22,
    paddingTop: 10,
    color: '#45494E',
  },
  rightIcon: {
    paddingVertical: 5,
    paddingHorizontal: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  continueViewTouchable: {
    marginTop: 28,
    paddingTop: 10,
    paddingBottom: 10,
    marginLeft: 12,
    marginRight: 12,
    marginBottom: 15,
    backgroundColor: '#1E90FF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff',
  },
  continueView: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
  },
  continueViewText: {
    color: '#fff',
    fontSize: 20,
    textAlign: 'center',
  },
  textareaContainer: {
    height: 100,
    padding: 5,
    backgroundColor: '#fff',
    borderRadius: 5,
    marginVertical: 10,
    borderColor: Color.gray,
    borderWidth: 1,
  },
  textarea: {
    textAlignVertical: 'top',
    height: 90,
    fontSize: 14,
    color: '#333',
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
  reminderTitle: {
    fontSize: 15,
  },
  reminderSubtitle: {
    fontSize: 12,
  },
});

// Container / Presenter architecture

const AddEnvironmentView = (props) => {
  //   ^^^  This functional component is responsible only to show Data (Presenter)

  // view props and callbacks passed from parent caller
  // const { envList, getFieldDecorator, createNewEnvironment, layout, onChange } = props
  const {envList, createNewEnvironment, onChange} = props;

  // console.log(getFieldDecorator)

  // own states
  const [addEnvNameModal, setAddEnvNameModal] = useState(false);
  // const [disableNewEnvButton, setDisableNewEnvButton] = useState(true);
  const [newEnvName, setNewEnvName] = useState('');

  const handelCreateNewEnv = () => {
    if (newEnvName.length > 0) {
      createNewEnvironment(newEnvName);
      setAddEnvNameModal(false);
    }
  };

  return (
    <View style={{flexDirection: 'row', width: '100%', flex: 1}}>
      <PickerModal
        style={{flexDirection: 'row', width: '94%', margin: '3%', flex: 1}}
        label={getStr('BegaviourData.Environments')}
        // error={this.state.errorEnvironmentMessage}
        placeholder={getStr('NewChanges.SelectEnvironment')}
        data={envList}
        // value={[]}
        // onSelect={(values) => {
        //   console.log('Values', values);
        //   this.setState({environmentValue: values});
        // }}
        onAdded={() => {
          setAddEnvNameModal(true);
        }}
        // error={errMsg}
        // selectedValue={unit}
        // placeholder={getStr('BegaviourData.BehaviorUnit')}
        // data={data}
        onValueChange={(value, itemIndex) => {
          onChange(value);
        }}
      />

      <Modal
        animationType="fade"
        transparent={true}
        visible={addEnvNameModal}
        onRequestClose={() => {
          setAddEnvNameModal(false);
        }}>
        <TouchableOpacity
          style={styles.modalWrapper}
          activeOpacity={1}
          onPress={() => {
            setAddEnvNameModal(false);
          }}>
          <View style={styles.modalContent}>
            <TextInput
              label={'New Environment name :'}
              placeholder={'Enter New Environment name'}
              // error={this.state.errorModalNameMessage}
              autoFocus={true}
              onChangeText={(dataText) => {
                setNewEnvName(dataText);
              }}
              value={newEnvName}
            />

            {/* <TextInput
              label="Description :"
              placeholder="Enter Description"
              // error={this.state.errorModalDescriptionMessage}
              onChangeText={(descriptionText) => {
                // this.setState({descriptionText});
              }}
              // value={this.state.descriptionText}
            /> */}

            <Button
              labelButton="Submit"
              // isLoading={this.state.isSavingBehaviour}
              onPress={() => {
                handelCreateNewEnv();
                setAddEnvNameModal(false);
              }}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

class AddEnvironmentContainer extends Component {
  //    ^^^  This Class component is responsible to fetch ,create, set Data (Container)

  constructor(props) {
    super(props);
    this.state = {
      envList: [],
    };
  }

  componentDidMount() {
    // fetch envs list promise
    this.fetchEnvironments();
  }

  fetchEnvironments = () => {
    ParentRequest.getEnvironment()
      .then((responce) => {
        console.log('environment', responce);
        let environmentList = responce.data.getEnvironment.map((item) => {
          return {
            id: item.id,
            label: item.name,
          };
        });
        this.setState({
          envList: environmentList,
          // loading: false,
        });
        // onClose()
      })
      .catch((error) => {
        // setIsSaving(false);
        Alert.alert('Information', error.toString());
      });
  };

  createNewEnvironment = (newEnvName) => {
    this.setState({isSavingBehaviour: true});

    let variables = {
      studentId: this.props.studentId,
      name: newEnvName,
      description: newEnvName,
    };

    ParentRequest.createEnvironmentData(variables)
      .then((responce) => {
        if (responce.data?.decelEnvironment) {
          //       isSavingBehaviour: false,
          //       isShowModal: false,

          this.fetchEnvironments(); // refetch envs

          Alert.alert(
            'Create New Environment',
            'New Environment Created Successfully',
            [
              {
                text: 'OK',
                onPress: () => {
                  console.log('OK Pressed');
                  // if (props.disableNavigation) {
                  // } else {
                  //   props.navigation.goBack();
                  // }
                },
              },
            ],
            {cancelable: false},
          );
        }
      })
      .catch((error) => {
        Alert.alert(
          'Create New Environment',
          error.toString(),
          [
            {
              text: 'OK',
              onPress: () => {
                console.log('OK Pressed');
                // if (props.disableNavigation) {
                // } else {
                //   props.navigation.goBack();
                // }
              },
            },
          ],
          {cancelable: false},
        );

        //       isShowModal: false,
      });
  };

  render() {
    const {envList} = this.state;
    const {onChange} = this.props;

    return (
      <AddEnvironmentView
        envList={envList}
        createNewEnvironment={(name) => this.createNewEnvironment(name)}
        onChange={(e) => onChange(e)}
      />
    );
  }
}

export default AddEnvironmentContainer;
