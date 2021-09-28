import 'react-native-gesture-handler';
import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Image,
  Text,
  TextInput as LegacyTextInput,
  Dimensions,
  TouchableOpacity,
  Alert,
  Platform,
  Modal,
  Switch
} from 'react-native';
import axios from 'axios';
import RNFetchBlob from 'rn-fetch-blob';

import RnModal from 'react-native-modal';
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import {
  check,
  request,
  requestMultiple,
  checkMultiple,
  PERMISSIONS,
  RESULTS,
} from 'react-native-permissions';

import Styles from '../../../utility/Style.js';
import Color from '../../../utility/Color';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import NavigationHeader from '../../../components/NavigationHeader.js';
import PickerModal from '../../../components/PickerModal';
import store from '../../../redux/store';
import {connect} from 'react-redux';
import {getAuthResult} from '../../../redux/reducers/index';
import {setToken, setTokenPayload} from '../../../redux/actions/index';
import {Row, Container, Column} from '../../../components/GridSystem';
import OrientationHelper from '../../../helpers/OrientationHelper';
import TherapistRequest from '../../../constants/TherapistRequest';
import DateHelper from '../../../helpers/DateHelper';
import Button from '../../../components/Button.js';
import HTML from 'react-native-render-html';
import {RichEditor} from 'react-native-pell-rich-editor';
import {CheckBox} from 'react-native-elements';
import TextInput from '../../../components/TextInput';
import LoadingIndicator from '../../../components/LoadingIndicator';
import {Picker} from 'react-native';

const width = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

class EquivalanceTarget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      targetName: '',
      targetNameError: '',
      targetType: '',
      types: [],
      selectedTypeError: '',
      masteryData: [],
      isLoading: false,
      selectedMasteryError: '',
      selectedMastery: '',
      shortTermGoals: [],
      shortTermError: '',
      peakTypes: [{id: 'Equivalence', label: 'EQUIVALENCE'}],
      selectedPeakType: 'Equivalence',
      dailyTrials: 5,
      dailyTrialsError: '',
      consecutiveDays: 25,
      consecutiveDaysError: '',
      peakBlocks: 1,
      targetStatusData: [],
      targetInstr: '',
      selectedStatusError: '',
      selectedStatus: 'U3RhdHVzVHlwZToz',
      targetVideoLink: '',
      maxSD: 0,
      stimulessList: [],
      targetVideoLinkError: '',
      targetInstrError: '',
      makeValue: false,
      shortTermGoalId: '',
      student: '',
      program: '',
      editorHeight: 100,
      selectedFiles: [],
      showmanualModal: false,
      fromStatus: '',
      toStatus: '',
      resPercent: '0',
      resPercentData: [
        {
          id: 0,
          label: '>=',
        },
        {
          id: 1,
          label: '<=',
        },
      ],
      resPerValue: '',
      consecutiveDaysData: [
        {
          id: 0,
          label: 'Cumulative',
          isEdit: true,
        },
        {
          id: 1,
          label: 'Daily',
          isEdit: false,
        },
      ],
      selConsecutive: '0',
      minTrial: '',
      cumConsecutiveDays: '',
      manualMasteryConditions: [],
      fromStatuslabel: '',
      toStatuslabel: '',
      resPercentlabel: '',
      cardType: 0,
      cardIndex: 0,
      isEdit: false,
      editIndex: 0,
      uploadedFiles: [],
      manualFromStatusErr: '',
      manualToStatusErr: '',
      manualResPercentErr: '',
      manualConsecutiveDayErr: '',
      manualMinTrialErr: '',
      showAttachmentModal: false,
      showImageAttachmentModal: false,
      fileUrl: '',
      isAllocateDirectly: false,
      defaultGoalId: '',
    };
  }
  fetchTargetTypes() {
    TherapistRequest.getTargetTypes()
      .then((targetTypes) => {
        console.log('dsdsdsdsdsdsd', targetTypes.data);
        let typesList;
        let typesList1 = targetTypes.data.types.map((type) => {
          return {
            id: type.id,
            label: type.typeTar,
          };
        });

        for (let i = 0; i < typesList1.length; i++) {
          typesList = typesList1.filter((e) => e.label === 'Peak');
        }

        this.setState({
          types: typesList,
          targetType: typesList.length > 0 ? typesList[0] : '',
        });

        this.fetchMasteryData();
      })
      .catch((error) => {
        console.log('mastery error: ' + error);
        this.setState({isLoading: false});
      });
  }

  componentDidMount() {
    const {
      student,
      program,
      target,
      shortTermGoalId,
      maxSD,
      simuless,
    } = this.props.route.params;
    this.setState({isLoading: true});

    console.log(
      '--------------log for query params xy-------',
      JSON.stringify(this.props.route.params),
    );

    console.log('targets---->', JSON.stringify(target));

    let classlist = [];
    classlist = simuless.map((item) => {
      return {
        id: item.node.id,
        name: item.node.name,
        stimuluses: item.node.stimuluses.edges.map((i) => {
          return {option: i.node.option, stimulusName: i.node.stimulusName};
        }),
      };
    });

    this.setState(
      {
        student: student,
        program: program,
        maxSD: maxSD,
        shortTermGoalId: shortTermGoalId ? shortTermGoalId : '',
        stimulessList: classlist,
        targetName: target?.targetMain?.targetName,
        targetVideoLink:
          target?.targets?.edges[0]?.node?.video == null
            ? ''
            : target?.targets?.edges[0]?.node?.video,
        targetInstr: target?.targetInstr,
      },
      () => {
        console.log(
          'student id in Equivalence target-->' +
            JSON.stringify(this.state.student),
        );
        this.fetchTargetTypes();
        this.fetchTargetStatusList();
        this.getShortTermGoals();
        this.getDefaultGoals();
      },
    );
  }
  getShortTermGoals() {
    const {student, program} = this.props.route.params;
    // Alert.alert(JSON.stringify(program))
    let variables = {
      studentId: student?.node?.id,
      program: program.id,
    };
    let shortTerms = [];
    TherapistRequest.getFilteredShortTermGoals(variables)
      .then((longTermGoalsData) => {
        // let longTermGoals =
        //   longTermGoalsData.data.programDetails.longtermgoalSet.edges;
        // for (let x = 0; x < longTermGoals.length; x++) {
          let shortTermGoals = longTermGoalsData?.data?.shortTerm?.edges;
          console.log(shortTermGoals[0]);
          for (let y = 0; y < shortTermGoals.length; y++) {
            // if (shortTermGoals[y]?.node?.goalStatus?.status === 'In Progress') {
              shortTerms.push({
                id: shortTermGoals[y].node.id,
                label: shortTermGoals[y].node.goalName,
              });
            // }
          }
        // }
        this.setState({
          shortTermGoals: shortTerms,
          isLoading: false,
        });
      })
      .catch((error) => {
        console.log(error);
        this.setState({isLoading: false});
      });
  }

  getDefaultGoals = () => {
    const {student, program} = this.props.route.params;

    let variables = {
      studentId: student?.node?.id,
      program: program?.id,
    };

    console.log(variables);
    TherapistRequest.getDefaultGoals(variables)
      .then(({data}) => {
        console.log('response', data);
        if (program) {
          if (data && data?.shortTerm && data?.shortTerm?.edges.length > 0) {
            data?.shortTerm?.edges.map(({node}) => {
              this.setState({defaultGoalId: node?.id});
            });
          }
        } else {
          let isabaAvailable = false;
          if (data && data?.shortTerm && data?.shortTerm?.edges.length > 0) {
            data?.shortTerm?.edges.map(({node}) => {
              if (node?.longTerm?.program?.name === 'ABA') {
                isabaAvailable = true;
                this.setState({defaultGoalId: node.id});
              }
            });

            if (!isabaAvailable) {
              data?.shortTerm?.edges.map(({node}) => {
                this.setState({defaultGoalId: node.id});
              });
            }
          }
        }
      })
      .catch((err) => {
        console.error('err', err);
      });
  };

  fetchMasteryData() {
    TherapistRequest.getMasteryData()
      .then((masteryData) => {
        console.log('masteryData', JSON.stringify(masteryData));
        let masteryList = masteryData.data.masteryCriteria.map((mastery) => {
          return {
            id: mastery.id,
            label: mastery.name,
          };
        });
        this.setState({masteryData: masteryList});
        // let value = 1;
        // value = this.state.allSd.length - this.state.maxSD
        // console.log("klsksksksksk", value);
        // {
        //     this.state.allSd.map((item, key) => {
        //         let allSd = this.state.allSd;
        //         allSd.splice(key, 1);
        //         this.setState({ allSd });
        //     })
        // }

        // this.fetchTargetSettingdata();
      })
      .catch((error) => {
        console.log('mastery error: ' + error);
        this.setState({isLoading: false});
      });
  }

  fetchTargetSettingdata() {
    const {student} = this.props.route.params;
    let v = {
      studentId: student?.node?.id,
    };
    TherapistRequest.getAllTargetSettingData(v)
      .then((settingData) => {
        console.log('settingData', JSON.stringify(settingData));
        let settingdata =
          settingData?.data?.getAllocateTargetSettings?.edges[0]?.node;
        this.setState({
          settingData:
            settingData?.data?.getAllocateTargetSettings?.edges[0]?.node,
          dailyTrials: settingdata?.dailyTrials ? settingdata.dailyTrials : 5,
          consecutiveDays: settingdata?.consecutiveDays
            ? settingdata.consecutiveDays
            : 25,
          selectedType: settingdata?.targetType?.id
            ? settingdata.targetType.id
            : typesData[0]?.id,
          selectedMastery: settingdata?.masteryCriteria?.id
            ? settingdata.masteryCriteria.id
            : this.state.masteryData[0]?.id,
          selectedStatus: settingdata?.status?.id
            ? settingdata.status.id
            : this.state.targetStatusData[0]?.id,
        });

        this.getShortTermGoals();
      })
      .catch((error) => {
        console.log('mastery error: ' + error);
        this.setState({isLoading: false});
      });
  }

  fetchTargetStatusList() {
    TherapistRequest.getTargetStatusList()
      .then((targetStatusList) => {
        let statusList = targetStatusList.data.targetStatus.map((status) => {
          return {
            id: status.id,
            label: status.statusName,
          };
        });

        this.setState({targetStatusData: statusList});

        this.fetchTargetTypes();
      })
      .catch((error) => {
        console.log('mastery error: ' + error);
        this.setState({isLoading: false});
      });
  }

  addClass = () => {
    let classes = this.state.stimulessList;
    const maxid = this.state.maxSD;
    const number = classes.length + 1;
    let sampleArray = [];
    let alpha = [
      'A',
      'B',
      'C',
      'D',
      'E',
      'F',
      'G',
      'H',
      'I',
      'J',
      'K',
      'L',
      'M',
      'N',
      'O',
      'P',
    ];
    for (var i = 0; i < maxid; i++) {
      sampleArray.push({
        option: alpha[i],
        stimulusName: '',
      });
    }
    const emptyObj = {
      // id: this.makeid(36),
      name: 'Class ' + number,
      stimuluses: sampleArray,
    };
    classes.push(emptyObj);

    this.setState({stimulessList: classes});
  };

  removeClass = (label) => {
    let classes = this.state.stimulessList;

    for (var i = 0; i < classes.length; i++) {
      var obj = classes[i];
      if (obj.name === label) {
        classes.splice(i, 1);
      }
    }
    this.setState({stimulessList: classes});
  };

  onchange = (label, text, sid) => {
    let classes = this.state.stimulessList;

    console.log('Stimulus classes -->' + JSON.stringify(classes));

    // let obj = {};
    let array = [...classes];

    let index = array.findIndex((item) => item.name == label);
    if (index >= 0) {
      array[index].stimuluses.forEach((stimulus) => {
        if (stimulus.option == sid) {
          stimulus.stimulusName = text;
        }
      });
    }

    this.setState({stimulessList: array}, () => {
      console.log(
        'after modification class4 -->' +
          JSON.stringify(this.state.stimulessList),
      );
    });
  };

  allocateTarget() {
    if (this.isFormInValid()) {
      return;
    }

    let target = this.props.route.params.target;
    let tId = '';
    if (target != null) {
      tId = target.id;
    }

    console.log('Stimulus list -->' + JSON.stringify(this.state.stimulessList));
    let classArray = [];
    this.state.stimulessList.forEach((item) => {
      let obj = {};
      obj.name = item.name;
      obj.stimuluses = [...item.stimuluses];
      classArray.push(obj);
    });

    console.log('Class array -->' + JSON.stringify(classArray));

    console.log(
      'student in alloctae target->' + JSON.stringify(this.state.student),
    );

    this.setState({showLoading: true});

    const {manualMasteryConditions} = this.state;

    let manualMastery = [];

    manualMasteryConditions.map((condition) => {
      console.log('conditions', condition);
      manualMastery.push({
        sd: '',
        step: '',
        isDaily: condition.isDaily,
        responsePercentage: condition.responseTypeValue,
        consecutiveDays: condition.isDaily ? '1' : condition.cumConsecutiveDays,
        minTrial: condition.minTrails,
        fromStatus: condition.fromStatusId,
        toStatus: condition.toStatusId,
        gte: condition.responseType == '0' ? condition.responseTypeValue : 0,
        lte: condition.responseType == '1' ? condition.responseTypeValue : 100,
      });
    });

    let queryParams = {
      studentId: this.state.student.node.id,
      shortTerm: this.state.isAllocateDirectly ? this.state.defaultGoalId :this.state.shortTermGoalId,
      targetId: tId,
      targetName: this.state.targetName,
      dailyTrials: this.state.dailyTrials,
      consecutiveDays: this.state.consecutiveDays,
      masteryCriteria: this.state.selectedMastery,
      date: DateHelper.getTodayDate(),
      video: this.state.targetVideoLink,
      targetInstr: this.state.targetInstr,
      default: this.state.makeValue,
      targetType: this.state.targetType.id,
      targetStatus: this.state.selectedStatus,
      precaution: 'Precaution Text',
      sd: [],
      steps: [],
      peakBlocks: this.state.peakBlocks,
      peakType: this.state.selectedPeakType,
      classes: classArray,
      equiCode: null,
      manualMastery: manualMastery,
      targetDocs: this.state.uploadedFiles,
    };

    console.log(
      '------------------Modified for student 2 y--------------',
      JSON.stringify(queryParams),
    );
    TherapistRequest.allocateNewTarget(queryParams)
      .then((newTargetData) => {
        console.log(
          'newTargetData after saving -->',
          JSON.stringify(newTargetData),
        );
        this.setState({showLoading: false});
        if (newTargetData.data.createTargetAllocate2.target.id) {
          //refresh list request
          let parentScreen = store.getState().shortTermsGoals;
          if (parentScreen) {
            parentScreen._refresh();
          }
          Alert.alert(
            'Target Allocation',
            'Successfully Added',
            [
              {
                text: 'OK',
                onPress: () => {
                  console.log('OK Pressed');
                  // this.props.navigation.goBack();
                  this.props.navigation.navigate('ShortTermGoals', {
                    student: this.state.student,
                    program: this.state.program,
                  });
                },
              },
            ],
            {cancelable: false},
          );
        }
      })
      .catch((error) => {
        this.setState({showLoading: false});
        console.log(error, error.response);
        this.setState({isSaving: false});

        Alert.alert('Information', JSON.stringify(error.message));
      });
  }

  isFormInValid() {
    let isError = false;

    if (this.state.shortTermGoalId === '') {
      this.setState({shortTermError: ' (Cant be empty)'});
      isError = true;
    } else {
      this.setState({shortTermError: ''});
    }

    if (this.state.targetName === '') {
      this.setState({targetNameError: ' (Cant be empty)'});
      isError = true;
    } else {
      this.setState({targetNameError: ''});
    }
    if (this.state.dailyTrials === 0) {
      this.setState({dailyTrialsError: ' (Cant be zero)'});
      isError = true;
    } else {
      this.setState({dailyTrialsError: ''});
    }
    if (this.state.consecutiveDays === 0) {
      this.setState({consecutiveDaysError: ' (Cant be zero)'});
      isError = true;
    } else {
      this.setState({consecutiveDaysError: ''});
    }

    if (this.state.selectedMastery === '') {
      this.setState({selectedMasteryError: ' Please select Mastery Criteria'});
      isError = true;
    } else {
      this.setState({selectedMasteryError: ''});
    }

    if (this.state.selectedStatus === '') {
      this.setState({selectedStatusError: ' Please select Target Status'});
      isError = true;
    } else {
      this.setState({selectedStatusError: ''});
    }

    if (this.state.targetInstr === '') {
      this.setState({targetInstrError: ' (Cant be empty)'});
      isError = true;
    } else {
      this.setState({targetInstrError: ''});
    }

    if (this.state.targetInstr == null || this.state.targetInstr == undefined) {
      this.setState({targetInstrError: 'Please enter target instruction'});
      isError = true;
    }

    return isError;
  }

  makeid(length) {
    var result = '';
    var characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  requestPermission = async () => {
    if (Platform.OS === 'ios') {
      try {
        const granted = await requestMultiple([PERMISSIONS.IOS.PHOTO_LIBRARY]);

        if (granted === RESULTS.GRANTED) {
          return true;
        } else if (granted === RESULTS.DENIED) {
          return false;
        } else if (granted === RESULTS.BLOCKED) {
          return false;
        } else {
          return false;
        }
      } catch (error) {
        console.log('erorr in permissions', error);
      }
    } else {
      try {
        const granted = await request(
          PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
        );

        if (granted === RESULTS.GRANTED) {
          return true;
        } else if (granted === RESULTS.DENIED) {
          return false;
        } else if (granted === RESULTS.BLOCKED) {
          return false;
        } else {
          return false;
        }
      } catch (error) {
        console.log('eror in permissions', error);
        return false;
      }
    }
  };

  checkPermissions = async () => {
    if (Platform.OS === 'ios') {
      try {
        const granted = await check(PERMISSIONS.IOS.PHOTO_LIBRARY);

        if (granted === RESULTS.GRANTED) {
          return true;
        } else if (granted === RESULTS.DENIED) {
          this.requestPermission();
        } else if (granted === RESULTS.BLOCKED) {
          this.requestPermission();
        } else {
          return false;
        }
      } catch (error) {
        console.log('error in checking permission', error);
        return false;
      }
    } else {
      try {
        const granted = await check(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);

        if (granted === RESULTS.GRANTED) {
          return true;
        } else if (granted === RESULTS.DENIED) {
          this.requestPermission();
        } else if (granted === RESULTS.BLOCKED) {
          this.requestPermission();
        } else {
          return false;
        }
      } catch (error) {
        console.log('error in checking permission', error);
        return false;
      }
    }
  };

  selectFile = async () => {
    if (await this.checkPermissions()) {
      const response = await DocumentPicker.pickMultiple({
        type: [DocumentPicker.types.images, DocumentPicker.types.pdf],
      });

      console.log('res from file picekr', response);

      if (this.state.selectedFiles.length > 0) {
        this.setState(
          {selectedFiles: this.state.selectedFiles.concat(response)},
          () => {
            this.uploadFile();
          },
        );
      } else {
        this.setState({selectedFiles: response}, () => {
          this.uploadFile();
        });
      }
    }
  };

  manageFile = (type, index) => {
    const {selectedFiles} = this.state;
    if (type === 'd') {
      selectedFiles.splice(index, 1);
      this.setState({selectedFiles});
    } else if (type === 'v') {
      let urlComponents = selectedFiles[index].url.split('/');
      let name = urlComponents[urlComponents.length - 1];
      let type = name.split('.')[1];

      if (type === 'pdf') {
        this.setState({
          showAttachmentModal: true,
          fileUrl: selectedFiles[index].url,
        });
      } else {
        this.setState({
          showImageAttachmentModal: true,
          fileUrl: selectedFiles[index].url,
        });
      }
    }
  };

  uploadFile = async () => {
    this.setState({isLoading: true});
    const {selectedFiles} = this.state;
    let fileUri = [];
    let tempFiles = selectedFiles;

    selectedFiles.map(async (file, index) => {
      if (Platform.OS === 'android') {
        if (file.fileCopyUri.startsWith('content://')) {
          const uriComponents = file.fileCopyUri.split('/');
          const fileNameAndExtension = uriComponents[uriComponents.length - 1];
          console.log('file name ext', fileNameAndExtension);
          let tempname = fileNameAndExtension.replace('%', 'd');

          console.log('filename  extension edit', tempname);

          const destPath = `${RNFS.TemporaryDirectoryPath}/${tempname}`;
          await RNFS.copyFile(file.fileCopyUri, destPath);

          console.log('tempResponse', destPath);

          file = {...file, path: `file:/${destPath}`, url: `file:/${destPath}`};
        }
      }

      console.log('file upload ', file);

      if (Platform.OS === 'android') {
        let uploadParams = [
          {
            name: 'file',
            filename: file.name,
            type: file.type,
            data: RNFetchBlob.wrap(file.path),
          },
        ];

        RNFetchBlob.fetch(
          'POST',
          'https://application.cogniable.us/apis/target-files/',
          {
            'Content-Type': 'multipart/form-data',
          },
          uploadParams,
        )
          .uploadProgress((progress) => {
            console.log('upload progress', progress);
          })
          .then((response) => {
            this.setState({isLoading: false});
            console.log('upload response', response);
            let temp = JSON.parse(response.data);
            console.log('upload response', temp);
            fileUri.push({url: temp.fileUrl[0]});
            alert('File uploaded sucessfully');

            file = {
              ...file,
              url: temp.fileUrl[0],
            };

            tempFiles[fileIndex] = file;
            this.setState({selectedFiles: tempFiles});
          });
      } else {
        let uploadParams = [
          {
            name: 'file',
            filename: file.name,
            type: file.type,
            data: file.uri,
          },
        ];

        RNFetchBlob.fetch(
          'POST',
          'https://application.cogniable.us/apis/target-files/',
          {
            'Content-Type': 'multipart/form-data',
          },
          uploadParams,
        )
          .uploadProgress((progress) => {
            console.log('upload progress', progress);
          })
          .then((response) => {
            this.setState({isLoading: false});
            console.log('upload response', response);
            let temp = JSON.parse(response.data);
            console.log('upload response', temp);
            fileUri.push({url: temp.fileUrl[0]});
            alert('File uploaded sucessfully');
            file = {
              ...file,
              url: temp.fileUrl[0],
            };
            tempFiles[fileIndex] = file;
            this.setState({selectedFiles: tempFiles});
          })
          .catch((err) => console.log('error', err));
      }
    });
  };

  /*
  .########..########.##....##.########..########.########.
  .##.....##.##.......###...##.##.....##.##.......##.....##
  .##.....##.##.......####..##.##.....##.##.......##.....##
  .########..######...##.##.##.##.....##.######...########.
  .##...##...##.......##..####.##.....##.##.......##...##..
  .##....##..##.......##...###.##.....##.##.......##....##.
  .##.....##.########.##....##.########..########.##.....##
  */

  showImageAttachmentModal = (type, index, url) => {
    const {fileUrl} = this.state;

    return (
      <Modal
        animationType={'slide'}
        transparent={false}
        visible={this.state.showImageAttachmentModal}
        onRequestClose={() => {
          this.setState({
            showImageAttachmentModal: false,
          });
        }}>
        <SafeAreaView style={{flex: 1}}>
          <TouchableOpacity
            style={{padding: 7, alignSelf: 'flex-end'}}
            onPress={() => this.setState({showImageAttachmentModal: false})}>
            <MaterialCommunityIcons name="close" size={28} />
          </TouchableOpacity>

          <View
            style={{
              marginHorizontal: 7,
              borderRadius: 10,
              overflow: 'hidden',
              justifyContent: 'center',
              flex: 1,
            }}>
            <Image
              source={{
                uri: fileUrl,
              }}
              style={{height: '80%', width: '100%', resizeMode: 'contain'}}
              progressiveRenderingEnabled
            />
          </View>

          {/*  */}
        </SafeAreaView>
      </Modal>
    );
  };

  showAttachmentModal = (type, index, url) => {
    const {fileUrl} = this.state;

    return (
      <Modal
        animationType={'slide'}
        transparent={false}
        visible={this.state.showAttachmentModal}
        onRequestClose={() => {
          this.setState({
            showAttachmentModal: false,
          });
        }}>
        <SafeAreaView style={{flex: 1}}>
          <TouchableOpacity
            style={{padding: 7, alignSelf: 'flex-end'}}
            onPress={() => this.setState({showAttachmentModal: false})}>
            <MaterialCommunityIcons name="close" size={28} />
          </TouchableOpacity>

          <View style={{marginHorizontal: 7}}>
            <Pdf
              source={{
                uri: fileUrl,
              }}
              style={{height: '100%', width: '100%'}}
            />
          </View>

          {/*  */}
        </SafeAreaView>
      </Modal>
    );
  };

  deleteRow = (index, cardType, cardIndex) => {
    console.log('edit index', index);
    console.log('edit cardType', cardType);
    console.log('edit cardIndex', cardIndex);
    const {manualMasteryConditions, allSteps, allSd} = this.state;

    if (cardType === 0) {
      manualMasteryConditions.splice(index, 1);
      this.setState({manualMasteryConditions: manualMasteryConditions});
    } else if (cardType === 1) {
      allSteps[cardIndex].masteryConditions.splice(index, 1);
      this.setState({allSteps: allSteps});
    } else {
      allSd[cardIndex].masteryConditions.splice(index, 1);
      this.setState({allSd: allSd});
    }
  };

  editRow = (index, cardType, cardIndex) => {
    console.log('edit index', index);
    console.log('edit cardType', cardType);
    console.log('edit cardIndex', cardIndex);
    const {
      manualMasteryConditions,
      allSteps,
      allSd,
      targetStatusData,
    } = this.state;

    if (cardType === 0) {
      this.setState({
        fromStatus:
          targetStatusData[manualMasteryConditions[index].FromStatus].id,
        toStatus: targetStatusData[manualMasteryConditions[index].toStatus].id,
        resPercent: manualMasteryConditions[index].responseType,
        resPerValue: manualMasteryConditions[index].responseTypeValue,
        selConsecutive: manualMasteryConditions[index].selDaysType,
        cumConsecutiveDays: manualMasteryConditions[index].cumConsecutiveDays,
        minTrial: manualMasteryConditions[index].minTrails,
        showmanualModal: true,
        isEdit: true,
        editIndex: index,
        cardType,
      });
    } else if (cardType === 1) {
      this.setState({
        fromStatus:
          targetStatusData[
            allSteps[cardIndex].masteryConditions[index].FromStatus
          ].id,
        toStatus:
          targetStatusData[
            allSteps[cardIndex].masteryConditions[index].toStatus
          ].id,
        resPercent: allSteps[cardIndex].masteryConditions[index].responseType,
        resPerValue:
          allSteps[cardIndex].masteryConditions[index].responseTypeValue,
        selConsecutive:
          allSteps[cardIndex].masteryConditions[index].selDaysType,
        cumConsecutiveDays:
          allSteps[cardIndex].masteryConditions[index].cumConsecutiveDays,
        minTrial: allSteps[cardIndex].masteryConditions[index].minTrails,
        showmanualModal: true,
        isEdit: true,
        editIndex: index,
        cardType,
      });
    } else {
      this.setState({
        fromStatus:
          targetStatusData[allSd[cardIndex].masteryConditions[index].FromStatus]
            .id,
        toStatus:
          targetStatusData[allSd[cardIndex].masteryConditions[index].toStatus]
            .id,
        resPercent: allSd[cardIndex].masteryConditions[index].responseType,
        resPerValue:
          allSd[cardIndex].masteryConditions[index].responseTypeValue,
        selConsecutive: allSd[cardIndex].masteryConditions[index].selDaysType,
        cumConsecutiveDays:
          allSd[cardIndex].masteryConditions[index].cumConsecutiveDays,
        minTrail: allSd[cardIndex].masteryConditions[index].minTrails,
        showmanualModal: true,
        isEdit: true,
        editIndex: index,
        cardType,
      });
    }
  };

  validateManualMastery = () => {
    const {
      fromStatus,
      toStatus,
      resPerValue,
      cumConsecutiveDays,
      minTrial,
    } = this.state;

    if (fromStatus === '') {
      this.setState({manualFromStatusErr: 'Select From Status'});
      return false;
    }

    if (toStatus === '') {
      this.setState({manualToStatusErr: 'Select To Status'});
      return false;
    }

    if (resPerValue === '') {
      this.setState({manualResPercentErr: "Can't be Empty"});
      return false;
    }

    if (cumConsecutiveDays === '') {
      this.setState({manualConsecutiveDayErr: "Can't be Empty"});
      return false;
    }

    if (minTrial === '') {
      this.setState({manualMinTrialErr: "Can't be Empty"});
      return false;
    }

    return true;
  };

  renderManualModal = () => {
    const {
      showmanualModal,
      selectedMastery,
      masteryData,
      fromStatus,
      toStatus,
      targetStatusData,
      selectedStatus,
      resPercent,
      resPercentData,
      resPerValue,
      minTrial,
      selConsecutive,
      consecutiveDaysData,
      cumConsecutiveDays,
      manualConsecutiveDayErr,
      manualFromStatusErr,
      manualToStatusErr,
      manualResPercentErr,
      manualMinTrialErr,
    } = this.state;

    const tempData = [
      {
        id: 0,
        label: '>=',
      },
      {
        id: 1,
        label: '<=',
      },
    ];

    return (
      <RnModal
        isVisible={showmanualModal}
        onBackButtonPress={() => this.setState({showmanualModal: false})}>
        <View
          style={{
            height: screenHeight - 250,
            width: '95%',
            backgroundColor: Color.white,
            alignSelf: 'center',
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: 7,
              borderBottomWidth: 0.5,
            }}>
            <View>
              <Text style={{fontSize: 18}}>Manual Mastery Criteria</Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                this.setState({
                  showmanualModal: false,
                  fromStatuslabel: '',
                  toStatuslabel: '',
                  resPerValue: '',
                  selConsecutive: '0',
                  minTrial: '0',
                  cumConsecutiveDays: '',
                  fromStatus: '',
                  toStatus: '',
                  resPercent: '0',
                });
              }}>
              <MaterialCommunityIcons name="close" size={25} />
            </TouchableOpacity>
          </View>
          <ScrollView
            style={{
              height: '80%',
              width: '90%',
              alignSelf: 'center',
              marginTop: 15,
            }}>
            <View
              style={{padding: 7, borderBottomWidth: StyleSheet.hairlineWidth}}>
              <Text style={{fontSize: 16}}>Status Transition</Text>
            </View>
            <View>
              <PickerModal
                label={'From Status'}
                error={manualFromStatusErr}
                placeholder="From Status"
                selectedValue={fromStatus}
                data={targetStatusData}
                onValueChange={(itemValue, itemIndex) => {
                  console.log('item index', itemIndex);
                  this.setState({
                    fromStatus: itemValue,
                    fromStatuslabel: itemIndex,
                    manualFromStatusErr: '',
                  });
                }}
              />
              <PickerModal
                label={'To Status'}
                error={manualToStatusErr}
                placeholder="To Status"
                selectedValue={toStatus}
                data={targetStatusData}
                onValueChange={(itemValue, itemIndex) => {
                  this.setState({
                    toStatus: itemValue,
                    toStatuslabel: itemIndex,
                    manualToStatusErr: '',
                  });
                }}
              />

              <View style={{}}>
                <Text style={{marginBottom: -15}}>Response %</Text>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <View style={{width: '45%'}}>
                    <PickerModal
                      label={''}
                      error={''}
                      placeholder=""
                      selectedValue={resPercent}
                      data={resPercentData}
                      onValueChange={(itemValue, itemIndex) => {
                        console.log('item value respercente', itemIndex);
                        this.setState({resPercent: itemValue});
                      }}
                    />
                  </View>
                  <View style={{width: '45%'}}>
                    <TextInput
                      label={''}
                      error={manualResPercentErr}
                      multiline={true}
                      placeholder={'0'}
                      defaultValue={resPerValue}
                      onChangeText={(resPerValue) =>
                        this.setState({resPerValue, manualResPercentErr: ''})
                      }
                    />
                  </View>
                </View>
              </View>

              <View style={{}}>
                <Text style={{marginBottom: -15}}>Consecutive Days</Text>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <View style={{width: '45%'}}>
                    <PickerModal
                      label={''}
                      error={''}
                      placeholder=""
                      selectedValue={selConsecutive}
                      data={consecutiveDaysData}
                      onValueChange={(itemValue, itemIndex) => {
                        this.setState({selConsecutive: itemValue});
                      }}
                    />
                  </View>

                  <View style={{width: '45%'}}>
                    <TextInput
                      label={''}
                      error={manualConsecutiveDayErr}
                      multiline={true}
                      placeholder={'0'}
                      defaultValue={
                        selConsecutive == '0' ? cumConsecutiveDays : '1'
                      }
                      onChangeText={(cumConsecutiveDays) =>
                        this.setState({
                          cumConsecutiveDays,
                          manualConsecutiveDayErr: '',
                        })
                      }
                      editable={selConsecutive == '0' ? true : false}
                    />
                  </View>
                </View>
              </View>
              <View>
                <Text style={{marginBottom: -15}}>Minimum Trails</Text>
                <TextInput
                  label={''}
                  error={''}
                  multiline={true}
                  placeholder={'0'}
                  defaultValue={minTrial}
                  onChangeText={(minTrial) =>
                    this.setState({minTrial, manualMinTrialErr: ''})
                  }
                />
              </View>
              <TouchableOpacity
                onPress={() => {
                  if (this.validateManualMastery()) {
                    if (this.state.isEdit) {
                      const {
                        allSd,
                        allSteps,
                        manualMasteryConditions,
                        editIndex,
                        cardIndex,
                      } = this.state;
                      let obj = {};
                      obj.FromStatus = this.state.fromStatuslabel;
                      obj.toStatus = this.state.toStatuslabel;
                      obj.responseType = this.state.resPercent;
                      obj.responseTypeValue = this.state.resPerValue;
                      obj.selDaysType = this.state.selConsecutive;
                      obj.cumConsecutiveDays =
                        this.state.selConsecutive != '0'
                          ? 1
                          : this.state.cumConsecutiveDays;
                      obj.minTrails = this.state.minTrial;
                      obj.fromStatusId = this.state.fromStatus;
                      (obj.toStatusId = this.state.toStatus),
                        (obj.isDaily =
                          this.state.selConsecutive == '0' ? true : false);
                      if (this.state.cardType === 0) {
                        manualMasteryConditions[editIndex] = obj;

                        this.setState({
                          manualMasteryConditions: manualMasteryConditions,
                          showmanualModal: false,
                        });
                      } else if (this.state.cardType === 1) {
                        allSteps[cardIndex].masteryConditions[editIndex] = obj;
                        this.setState({
                          allSteps: allSteps,
                          showmanualModal: false,
                        });
                      } else {
                        allSd[cardIndex].masteryConditions[editIndex] = obj;

                        this.setState({allSd: allSd, showmanualModal: false});
                      }
                    } else {
                      let obj = {};
                      let tempArr = [];

                      obj.FromStatus = this.state.fromStatuslabel;
                      obj.toStatus = this.state.toStatuslabel;
                      obj.responseType = this.state.resPercent;
                      obj.responseTypeValue = this.state.resPerValue;
                      obj.selDaysType = this.state.selConsecutive;
                      obj.cumConsecutiveDays =
                        this.state.selConsecutive != '0'
                          ? 1
                          : this.state.cumConsecutiveDays;
                      obj.minTrails = this.state.minTrial;
                      obj.fromStatusId = this.state.fromStatus;
                      obj.toStatusId = this.state.toStatus;
                      obj.isDaily =
                        this.state.selConsecutive == '0' ? false : true;

                      console.log('obj manual condition', obj);
                      tempArr.push(obj);

                      if (this.state.manualMasteryConditions.length > 0) {
                        if (this.state.cardType === 0) {
                          this.setState({
                            manualMasteryConditions: this.state.manualMasteryConditions.concat(
                              tempArr,
                            ),
                            showmanualModal: false,
                            fromStatuslabel: '',
                            toStatuslabel: '',
                            resPerValue: '',
                            selConsecutive: '0',
                            minTrial: '0',
                            cumConsecutiveDays: '',
                            fromStatus: '',
                            toStatus: '',
                            resPercent: '0',
                          });
                        } else if (this.state.cardType === 1) {
                          const allSteps = this.state.allSteps;
                          allSteps[
                            this.state.cardIndex
                          ]?.masteryConditions.push(obj);
                          this.setState({
                            showmanualModal: false,
                            fromStatuslabel: '',
                            toStatuslabel: '',
                            resPerValue: '',
                            selConsecutive: '0',
                            minTrial: '0',
                            cumConsecutiveDays: '',
                            fromStatus: '',
                            toStatus: '',
                            resPercent: '0',
                          });
                        } else {
                          console.log('setted in stimulus');
                          const allSd = this.state.allSd;
                          allSd[this.state.cardIndex]?.masteryConditions.push(
                            obj,
                          );
                          this.setState({
                            showmanualModal: false,
                            fromStatuslabel: '',
                            toStatuslabel: '',
                            resPerValue: '',
                            selConsecutive: '0',
                            minTrial: '0',
                            cumConsecutiveDays: '',
                            fromStatus: '',
                            toStatus: '',
                            resPercent: '0',
                          });
                        }
                      } else {
                        if (this.state.cardType === 0) {
                          this.setState({
                            manualMasteryConditions: tempArr,
                            showmanualModal: false,
                            fromStatuslabel: '',
                            toStatuslabel: '',
                            resPerValue: '',
                            selConsecutive: '0',
                            minTrial: '0',
                            cumConsecutiveDays: '',
                            fromStatus: '',
                            toStatus: '',
                            resPercent: '0',
                          });
                        } else if (this.state.cardType === 1) {
                          console.log('setted in steps');
                          const allSteps = this.state.allSteps;
                          allSteps[
                            this.state.cardIndex
                          ]?.masteryConditions.push(obj);
                          this.setState({
                            showmanualModal: false,
                            fromStatuslabel: '',
                            toStatuslabel: '',
                            resPerValue: '',
                            selConsecutive: '0',
                            minTrial: '0',
                            cumConsecutiveDays: '',
                            fromStatus: '',
                            toStatus: '',
                            resPercent: '0',
                          });
                        } else {
                          console.log('setted in stimulus');
                          const allSd = this.state.allSd;
                          allSd[this.state.cardIndex]?.masteryConditions.push(
                            obj,
                          );
                          this.setState({
                            showmanualModal: false,
                            fromStatuslabel: '',
                            toStatuslabel: '',
                            resPerValue: '',
                            selConsecutive: '0',
                            minTrial: '0',
                            cumConsecutiveDays: '',
                            fromStatus: '',
                            toStatus: '',
                            resPercent: '0',
                          });
                        }
                      }
                    }
                  }
                }}
                style={{
                  backgroundColor: Color.primary,
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 40,
                  borderRadius: 7,
                  marginBottom: 10,
                }}>
                <Text style={{color: Color.white, fontSize: 16}}>Add</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </RnModal>
    );
  };

  render() {
    const {
      targetName,
      shortTermGoalId,
      shortTermGoals,
      targetInstr,
      stimulessList,
      targetVideoLink,
      targetType,
      targetStatusData,
      selectedStatus,
      selectedMastery,
      masteryData,
      selectedPeakType,
      peakTypes,
      dailyTrials,
      peakBlocks,
      consecutiveDays,
      isAllocateDirectly,
    } = this.state;
    console.log('log --->', targetInstr);
    return (
      <>
        {this.state.isLoading && <LoadingIndicator />}

        {!this.state.isLoading && (
          <SafeAreaView style={styles.container}>
            <NavigationHeader
              backPress={() => {
                this.setState({isLoading: true});
                this.props.navigation.goBack();
              }}
              title="New Target Allocate (Equi)"
            />
            <Container enablePadding={this.props.disableNavigation != true}>
              <ScrollView
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                contentInsetAdjustmentBehavior="automatic">
               <View>
          <Text style={{color: 'grey'}}>Allocate Target Directly</Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: 0.7,
              borderColor: 'grey',
              borderRadius: 7,
              marginVertical: 7,
              overflow: 'hidden'
            }}>
            <TouchableOpacity
            onPress={() => this.setState({isAllocateDirectly: false})}
            activeOpacity={0.7}
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                padding: 10,
                backgroundColor: !isAllocateDirectly
                  ? Color.primary
                  : Color.white,
                  flex: 1
              }}>
              <Text
                style={{
                  color: !isAllocateDirectly ? Color.white : Color.primary,
                }}>
                Goal
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.setState({isAllocateDirectly: true})}
              activeOpacity={0.7}
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                padding: 10,
                backgroundColor: isAllocateDirectly
                  ? Color.primary
                  : Color.white,
                  flex: 1
              }}>
              <Text
                style={{
                  color: isAllocateDirectly ? Color.white : Color.primary,
                }}>
                Direct
              </Text>
            </TouchableOpacity>
          </View>
        </View>

                {!isAllocateDirectly && (
                  <View>
                    <PickerModal
                      label="Short Term Goal"
                      error={this.state.shortTermError}
                      selectedValue={shortTermGoalId}
                      placeholder="(Select Short Term Goal)"
                      data={shortTermGoals}
                      onValueChange={(itemValue, itemIndex) => {
                        this.setState({shortTermGoalId: itemValue});
                      }}
                    />
                  </View>
                )}

                {/* <PickerModal
                  label="Short Term Goal"
                  placeholder="(Select Short Term Goal)"
                  selectedValue={shortTermGoalId}
                  data={shortTermGoals}
                  onValueChange={(itemValue, itemIndex) => {
                    // setShortTermGoalId(itemValue);
                    this.setState({shortTermGoalId: itemValue});
                  }}
                /> */}

                <TextInput
                  label="Target Name"
                  error={this.state.targetNameError}
                  multiline={true}
                  placeholder={'Target Name'}
                  defaultValue={targetName}
                  onChangeText={(targetName) => this.setState({targetName})}
                />

                {targetType.label ? (
                  <>
                    <Text>Target Type</Text>
                    <Picker
                      selectedValue={targetType.label}
                      enabled={false}
                      style={{paddingTop: 5}}
                      itemStyle={{
                        height: 50,
                        width: '100%',
                        color: '#000',
                        borderWidth: 1,
                        borderColor: '#ddd',
                      }}>
                      <Picker.Item
                        label={targetType.label}
                        value={targetType.id}
                      />
                    </Picker>
                  </>
                ) : null}

                <PickerModal
                  label="Mastery Criteria"
                  error={this.state.selectedMasteryError}
                  placeholder="(Select Mastery Criteria)"
                  selectedValue={
                    selectedMastery ? selectedMastery : masteryData[0]?.id
                  }
                  data={masteryData}
                  onValueChange={(itemValue, itemIndex) => {
                    this.setState({selectedMastery: itemValue});
                  }}
                  onAdded={() =>
                    this.setState({
                      showmanualModal: true,
                      cardType: 0,
                      isEdit: false,
                    })
                  }
                />

                {this.state.manualMasteryConditions.length > 0 && (
                  <View style={{width: '100%', flexDirection: 'row'}}>
                    <View style={styles.tableCell}>
                      <Text style={{textAlign: 'center'}}>From Status</Text>
                    </View>
                    <View style={styles.tableCell}>
                      <Text style={{textAlign: 'center'}}>To Status</Text>
                    </View>
                    <View style={[styles.tableCell, {flex: 0.6}]}>
                      <Text style={{textAlign: 'center'}}>Res. Per.</Text>
                    </View>
                    <View style={[styles.tableCell, {flex: 0.6}]}>
                      <Text style={{textAlign: 'center'}}>Cons. Days</Text>
                    </View>
                    <View style={[styles.tableCell, {flex: 0.6}]}>
                      <Text style={{textAlign: 'center'}}>Min. Trail</Text>
                    </View>
                    <View style={[styles.tableCell, {flex: 0.6}]}>
                      <Text style={{textAlign: 'center'}}>Actions</Text>
                    </View>
                  </View>
                )}

                {this.state.manualMasteryConditions.length > 0 &&
                  this.state.manualMasteryConditions.map((condition, index) => {
                    return (
                      <>
                        <View style={{width: '100%', flexDirection: 'row'}}>
                          <View style={styles.tableCell}>
                            <Text style={{textAlign: 'center'}}>
                              {targetStatusData[condition.FromStatus]?.label}
                            </Text>
                          </View>
                          <View style={styles.tableCell}>
                            <Text style={{textAlign: 'center'}}>
                              {targetStatusData[condition?.toStatus]?.label}
                            </Text>
                          </View>
                          <View style={[styles.tableCell, {flex: 0.6}]}>
                            <Text style={{textAlign: 'center'}}>
                              {
                                this.state.resPercentData[
                                  condition?.responseType
                                ]?.label
                              }
                              {condition?.responseTypeValue}
                            </Text>
                          </View>
                          <View style={[styles.tableCell, {flex: 0.6}]}>
                            <Text style={{textAlign: 'center'}}>
                              {condition?.cumConsecutiveDays}
                            </Text>
                          </View>
                          <View style={[styles.tableCell, {flex: 0.6}]}>
                            <Text style={{textAlign: 'center'}}>
                              {condition?.minTrails}
                            </Text>
                          </View>
                          <View
                            style={[
                              styles.tableCell,
                              {
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-around',
                                flex: 0.6,
                              },
                            ]}>
                            <TouchableOpacity
                              onPress={() => this.editRow(index, 0)}>
                              <MaterialCommunityIcons
                                name="pencil-outline"
                                size={18}
                                color={Color.primary}
                                onPress={() => this.editRow(index, 0)}
                              />
                            </TouchableOpacity>
                            <TouchableOpacity
                              onPress={() => this.deleteRow(index, 0)}>
                              <MaterialCommunityIcons
                                name="delete-outline"
                                size={18}
                                color={Color.red}
                                onPress={() => this.deleteRow(index, 0)}
                              />
                            </TouchableOpacity>
                          </View>
                        </View>
                      </>
                    );
                  })}

                <Text>Category</Text>
                <Picker
                  selectedValue={selectedPeakType.id}
                  enabled={false}
                  style={{paddingTop: 5}}
                  itemStyle={{
                    backgroundColor: 'white',
                    height: 50,
                    width: '100%',
                    color: '#000',
                    borderWidth: 1,
                    borderColor: '#ddd',
                  }}>
                  <Picker.Item
                    label={'EQUIVALENCE'}
                    value={selectedPeakType.id}
                  />
                </Picker>

                <View style={{marginVertical: 10}}>
                  <RenderIncrDecr
                    label={'Daily Trails'}
                    incr={() => this.setState({dailyTrials: dailyTrials + 1})}
                    decr={() =>
                      this.setState({
                        dailyTrials:
                          this.state.dailyTrials != 0
                            ? dailyTrials - 1
                            : dailyTrials,
                      })
                    }
                    value={dailyTrials}
                  />
                  <Text style={{color: 'red'}}>
                    {this.state.dailyTrialsError}
                  </Text>
                </View>

                <View style={{marginBottom: 10}}>
                  <RenderIncrDecr
                    label={'Consecutive Days'}
                    incr={() =>
                      this.setState({consecutiveDays: consecutiveDays + 1})
                    }
                    decr={() =>
                      this.setState({
                        consecutiveDays:
                          this.state.consecutiveDays != 0
                            ? consecutiveDays - 1
                            : consecutiveDays,
                      })
                    }
                    value={consecutiveDays}
                  />
                  <Text style={{color: 'red'}}>
                    {this.state.consecutiveDaysError}
                  </Text>
                </View>

                <View style={{marginBottom: 10}}>
                  <RenderIncrDecr
                    label={'Peak Blocks'}
                    incr={() => this.setState({peakBlocks: peakBlocks + 1})}
                    decr={() =>
                      this.setState({
                        peakBlocks:
                          this.state.peakBlocks != 0
                            ? peakBlocks - 1
                            : peakBlocks,
                      })
                    }
                    value={peakBlocks}
                  />
                  {/* <Text style={{ color: 'red' }}>{this.state.}</Text> */}
                </View>
                <PickerModal
                  label="Target Status"
                  error={this.state.selectedStatusError}
                  placeholder="(Select Target Status)"
                  selectedValue={
                    selectedStatus ? selectedStatus : targetStatusData[0]?.id
                  }
                  data={targetStatusData}
                  onValueChange={(itemValue, itemIndex) => {
                    this.setState({selectedStatus: itemValue});
                  }}
                />
                <View>
                  {stimulessList.length > 0
                    ? stimulessList.map((i, index) => {
                        return (
                          <View style={{marginBottom: 10}} key={index}>
                            <Stimuless
                              label={i.name}
                              values={i.stimuluses}
                              remove={() => this.removeClass(i.name)}
                              onchange={(text, sid) =>
                                this.onchange(i.name, text, sid)
                              }
                            />
                          </View>
                        );
                      })
                    : null}
                </View>

                <View
                  style={{
                    marginVertical: 10,
                    flex: 5,
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                  }}>
                  <View style={{flex: 1}}>
                    <Text> </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => this.addClass()}
                    style={{
                      flex: 4,
                      width: '100%',
                      height: 40,
                      borderRadius: 6,
                      borderWidth: 1,
                      borderColor: '#ddd',
                      borderStyle: 'dotted',
                      backgroundColor: '#fff',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Text style={{color: '#000', fontSize: 16}}>+ ADD</Text>
                  </TouchableOpacity>
                </View>

                <TextInput
                  label="Target Video Link"
                  // error={targetVideoLinkError}
                  multiline={true}
                  placeholder={'Target Video Link'}
                  defaultValue={targetVideoLink}
                  onChangeText={(targetVideoLink) =>
                    this.setState({targetVideoLink})
                  }
                />

                <Text>Attachments</Text>
                <TouchableOpacity
                  onPress={() => this.selectFile()}
                  style={{
                    width: '100%',
                    borderWidth: 1,
                    borderStyle: 'dashed',
                    borderRadius: 8,
                    marginVertical: 7,
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 7,
                  }}>
                  <MaterialCommunityIcons
                    name="file-upload"
                    color={Color.primary}
                    size={28}
                  />
                  <Text
                    style={{
                      color: Color.gray,
                      fontSize: 12,
                      textAlign: 'center',
                    }}>
                    Support for a single or bulk upload. Strictly prohibit from
                    uploading company data or other band files
                  </Text>
                </TouchableOpacity>

                {this.state.selectedFiles.map((file, index) => {
                  return (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderWidth: StyleSheet.hairlineWidth,
                        padding: 7,
                        marginVertical: 3,
                        borderRadius: 5,
                      }}>
                      <View>
                        <Text numberOfLines={1}>
                          {file.name && file.name.length > 25
                            ? file.name.substr(0, 24).concat('...')
                            : file.name}
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-evenly',
                          alignItems: 'center',
                        }}>
                        <MaterialCommunityIcons
                          name="eye-outline"
                          size={20}
                          color={Color.primary}
                          onPress={() => this.manageFile('v', index)}
                        />
                        <MaterialCommunityIcons
                          name="delete-outline"
                          size={20}
                          color={Color.red}
                          onPress={() => this.manageFile('d', index)}
                        />
                      </View>
                    </View>
                  );
                })}
                <Text style={styles.sectionTitle}>
                  Target Instructions
                  <Text style={{textAlign: 'left', color: 'red'}}>
                    {this.state.targetInstrError}
                  </Text>
                </Text>
                {!this.state.isLoading && targetInstr.length > 0 && (
                  <RichEditor
                    ref={(r) => (this.richText = r)}
                    initialContentHTML={targetInstr}
                    style={{
                      ...styles.richEditor,
                      height: this.state.editorHeight,
                    }}
                    onChange={(targetInstr) => {
                      this.setState({targetInstr});
                    }}
                  />
                )}

                <CheckBox
                  containerStyle={{
                    margin: 0,
                    borderWidth: 0,
                    backgroundColor: Color.white,
                    marginBottom: 20,
                  }}
                  title="Make Value Default"
                  checkedColor={Color.primary}
                  checked={this.state.makeValue}
                  onPress={() =>
                    this.setState({makeValue: !this.state.makeValue})
                  }
                />
              </ScrollView>

              <Button
                labelButton="Allocate Target"
                style={{marginBottom: 10}}
                isLoading={this.state.showLoading}
                onPress={() => {
                  this.allocateTarget();
                }}
              />
            </Container>
            {this.renderManualModal()}
            {this.state.showAttachmentModal && this.showAttachmentModal()}
            {this.state.showImageAttachmentModal &&
              this.showImageAttachmentModal()}
          </SafeAreaView>
        )}
      </>
    );
  }
}

export class RenderIncrDecr extends Component {
  render() {
    const {label, value, incr, decr} = this.props;
    return (
      <View style={[styles.rowspacebetween]}>
        <View>
          <Text style={styles.labelStyle}>{label}</Text>
        </View>
        <View style={[styles.rowspacebetween]}>
          <TouchableOpacity onPress={() => decr()} style={styles.buttonStyle}>
            <Text style={styles.buttonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.textStyle}>{value}</Text>
          <TouchableOpacity onPress={() => incr()} style={styles.buttonStyle}>
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export class Stimuless extends Component {
  render() {
    const {label, values, remove, onchange} = this.props;
    return (
      <View
        style={{
          flex: 6,
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
        }}>
        <View style={{flex: 1.5, flexDirection: 'row', marginRight: 5}}>
          <Text style={{fontSize: 15}}>{label} :</Text>
          <TouchableOpacity
            onPress={() => remove()}
            style={{
              borderWidth: 1,
              borderColor: '#ddd',
              height: 20,
              width: 20,
              borderRadius: 4,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={{color: 'red'}}>-</Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            flex: 4.5,
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'stretch',
          }}>
          {values?.map((i, index) => {
            return (
              <TextInput
                value={i.stimulusName}
                key={index}
                onChangeText={(val) => onchange(val, i.option)}
              />
            );
          })}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.white,
  },
  targetView: {
    marginBottom: 0,
  },
  rowspacebetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buttonStyle: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
  },
  buttonText: {fontSize: 20, color: '#000'},
  textStyle: {fontSize: 15, color: '#000', padding: 15},
  labelStyle: {fontSize: 15},
  incrBlock: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  targetViewImage: {
    width: '100%',
    height: 200,
    borderRadius: 5,
    marginBottom: 10,
  },
  targetViewTitle: {
    fontSize: 17,
    color: Color.blackFont,
  },
  targetViewDomain: {
    fontSize: 15,
    color: Color.primary,
  },
  sectionTitle: {
    fontSize: 15,
    color: '#63686E',
  },
  hrButton: {
    justifyContent: 'center',
    width: 40,
    height: 40,
    // backgroundColor: '#3E7BFA',
    borderRadius: 4,
    // marginLeft: 8,
    paddingTop: 10,
    textAlign: 'center',
  },
  plusButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3E7BFA',
  },
  minusButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#63686E',
  },
  richEditor: {
    borderWidth: 1,
    borderColor: Color.gray,
    borderRadius: 5,
    marginVertical: 5,
  },
  profile: {
    alignItems: 'center',
    padding: 16,
    borderRadius: 4,
    marginVertical: 8,
    marginHorizontal: 3,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },

  card: {
    backgroundColor: Color.white,
    borderRadius: 5,
    borderColor: Color.gray,
    borderWidth: 1,
    paddingVertical: 0,
    paddingLeft: 15,
    paddingRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    marginBottom: 16,
  },

  cardIcon: {
    width: 35,
  },

  cardTitle: {
    flex: 5,
    fontSize: 14,
    color: '#45494E',
  },
  tableCell: {
    flex: 1,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'grey',
  },
  pickerWrapper: {
    height: 50,
    borderColor: Color.gray,
    borderWidth: 1,
    borderRadius: 6,
    marginVertical: 4,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 16,
    paddingRight: 8,
    flexDirection: 'row',
  },
});
const mapStateToProps = (state) => ({
  authResult: getAuthResult(state),
});

const mapDispatchToProps = (dispatch) => ({
  dispatchSetToken: (data) => dispatch(setToken(data)),
  dispatchSetTokenPayload: (data) => dispatch(setTokenPayload(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EquivalanceTarget);
