import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Image,
  Text,
  TextInput as LegacyTextInput,
  Modal,
  Dimensions,
  TouchableOpacity,
  Alert,
  Platform,
  Switch
} from 'react-native';
import RnModal from 'react-native-modal';
import axios from 'axios';
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import FilePickerManager from 'react-native-file-picker';
import RNFetchBlob from 'rn-fetch-blob';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import {
  check,
  request,
  requestMultiple,
  checkMultiple,
  PERMISSIONS,
  RESULTS,
} from 'react-native-permissions';

import {CheckBox} from 'react-native-elements';
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
import {RichEditor} from 'react-native-pell-rich-editor';
import Icon from 'react-native-vector-icons/Ionicons';
import TextInput from '../../../components/TextInput';
import LoadingIndicator from '../../../components/LoadingIndicator';
import {StackActions} from '@react-navigation/native';
import {getStr} from '../../../../locales/Locale';
import MultiPickerModal from '../../../components/MultiPickerModal';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

class ManualTargetAllocationNew extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      showLoading: false,
      shortTermGoalId: '',
      student: {},
      selectedSteps: [],
      selectedSd: [],
      stepsSuggestions: [],
      sdSuggestions: [],
      isSd: true,
      isSteps: true,
      showSteps: false,
      showSd: false,
      steps: [],
      sd: [],
      targetName: '',
      dailyTrials: store.getState().user.userType.name == 'parents' ? 5 : 5,
      consecutiveDays:
        store.getState().user.userType.name == 'parents' ? 10 : 25,
      masteryData: [],
      selectedMastery: '',
      objective: '',
      targetInstr: '',
      goodPractices: '',
      steps: '',
      gernalizationCriteria: '',
      targetVideoLink: '',
      targetVideoLinkError: '',
      targetNameError: '',
      dailyTrialsError: '',
      consecutiveDaysError: '',
      selectedMasteryError: '',
      objectiveError: '',
      targetInstrError: '',
      goodPracticesError: '',
      gernalizationCriteriaError: '',
      targetStatusData: [],
      targetStatusParent: [],
      selectedStatus: 'U3RhdHVzVHlwZToz',
      typesData: [],
      typesDataNew: [],
      selectedType: 'VGFyZ2V0RGV0YWlsVHlwZTo2',
      selectedTypeError: '',
      selectedStatusError: '',
      shortTermGoals: [],
      shortTermError: '',
      makeValue: false,
      isPeak: false,
      isPeakEqu: false,
      selectedPeakType: '',
      selectedPeakTypeError: '',
      modalVisible: false,
      isCircle: false,
      sdError: '',
      peakTypes: [
        {id: 'Direct', label: 'DIRECT'},
        {id: 'Equivalence', label: 'EQUIVALENCE'},
        {id: 'Transformation', label: 'TRANSFORM'},
        {id: 'Generalization', label: 'GENERALIZATION'},
      ],
      selectectedPeakBlock: 1,
      allLearners: [],
      selectedLearnerId: [],
      allSd: [],
      allSDClass: [],
      allSteps: [],
      selectedSdKey: -1,
      selectedStepKey: -1,
      studentNew: {},
      selectedShortTermGoalType: '',
      domainDropdownList: [],
      selectedDomain: '',
      domainDone: 0,
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
      showSteps: false,
      showStimulus: true,
      showBehaviourReductionInput: false,
      showBehaviourRecordingInput: false,
      behaviourR1: '',
      behaviourR2: '',
      behaviourR1Err: '',
      behaviourR2Err: '',
      recordingTypeData: [],
      selRecordingType: [],
      recordingTypeError: false,
      trialDuration: 0,
      behaviourDataList: [],
      stepErr: '',
      behPromptList: [],
      promptList: [],
      selPrompts: [],
      selBehPrompts: [],
      stepPrompts: [],
      selStepPrompts: [],
      sdPrompts: [],
      selSdPrompts: [],
      isAllocateDirectly: false,
      defaultGoalId: '',
      peakSdErr: '',
      showStep:false,
      showStepId:'',
      sbtStatus:[],
      sbtStep:[]
    };
  }

  _refresh() {
    this.componentDidMount();
  }

  componentDidMount() {
    console.log('props manualtargetallocationnew 124', this.props);
    
    const {
      student,
      program,
      target,
      shortTermGoalId,
      studentNew,
      fromParent,
      newPrograms,
    } = this.props.route.params;
    console.log('Target: ', target);
    this.setState({
      studentNew: studentNew,
      student: student,
      program: program,
      shortTermGoalId: shortTermGoalId,
      targetName: target?.node?.targetMain?.targetName,
    });
    TherapistRequest.setDispatchFunction(this.props.dispatchSetToken);
    this.fetchStudentList();

    if (
      program &&
      program?.domain &&
      program?.domain?.edges &&
      program?.domain?.edges?.length > 0
    ) {
      this.saveDomainDropdown(program?.domain?.edges);
      this.fetchTargetsByDomainInit(program?.domain?.edges[0]?.node.id);
      this.getShortTermGoals(); 
      this.getPromptCodes();
      this.getBehPromptCode();
      this.getDefaultGoals();
    }

    if (
      fromParent &&
      newPrograms &&
      newPrograms.edges &&
      newPrograms.edges.length > 0
    ) {
      this.saveDomainDropdown(newPrograms?.edges);
      this.fetchTargetsByDomainInit(newPrograms?.edges[0]?.node.id);
      this.getShortTermGoals();
      this.getPromptCodes();
      this.getBehPromptCode();
      this.getDefaultGoals();
    }
  }

  getDefaultGoals = () => {
    const {student, program} = this.props.route.params;

    let variables = {
      studentId: student?.node?.id,
      program: program?.id,
    };

    console.log(variables);
    ;

    TherapistRequest.getDefaultGoals(variables)
      .then(({data}) => {
        console.log('response', data);
        ;

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


  getSbtSteps=()=>{
    const {sbtStep}=this.state
    const tempSbt = []
    const sbtStatus=[]


    if(sbtStep.length===0){
      TherapistRequest.getSbtDefaultSteps()
      .then(res=>{
        res.data?.getSbtDefaultSteps.forEach((item, index) => {
          console.log("sbtSteps id>>>>",item.id);
          if (item.isActive) {
            tempSbt.push({
              id: item.id,
              step: item.description,              
              k: index + 1,
              status: item.status? item.status?.id:'U0JUU3RlcFN0YXR1c1R5cGU6MQ==',
              masteryConditions: [item.mastery],
              reinforce: item.reinforce ? item.reinforce.edges.map(item => item.node.id) : [],
            })
          }
       
      })

      TherapistRequest.getSbtStatusList()
      .then(res=>{
        res.data.getSbtStepStatus?.map(i=>
          sbtStatus.push({
            id:i.id,
            label:i.statusName
          }))
      })
      this.setState({
        sbtStep:tempSbt,
        sbtStatus
      })
    })
    }

  }

  fetchRecordingType = () => {
    TherapistRequest.getRecordingTypeList().then((res) => {
      let tempArr = [];

      if (res?.data?.recordingType.length > 0) {
        res?.data?.recordingType.map((item) => {
          tempArr.push({...item, label: item.name});
        });
      }

      this.setState({recordingTypeData: tempArr});
    });
  };

  getPromptCodes = () => {
    const {
      showBehaviourRecordingInput,
      showBehaviourReductionInput,
    } = this.state;
    let tempArr = [];
    let tempSelArr = [];
    TherapistRequest.getPromptCodes().then((res) => {
      res?.data?.promptCodes.map((code) => {
        tempArr.push({...code, label: code.promptName});
        tempSelArr.push(code.id);
      });

      if (showBehaviourRecordingInput) {
        console.log(':behavolur recording');
        this.setState({
          promptList: tempArr,
          selPrompts: tempSelArr,
          stepPrompts: tempArr,
          selStepPrompts: tempSelArr,
          sdPrompts: [],
          selSdPrompts: [],
        });
      } else if (showBehaviourReductionInput) {
        console.log('behav iour reduction');
        this.setState(
          {
            promptList: tempArr,
            selPrompts: tempSelArr,
            stepPrompts: [],
            selStepPrompts: [],
          },
          () => this.getBehPromptCode(),
        );
      } else {
        console.log('else');
        this.setState(
          {
            promptList: tempArr,
            selPrompts: tempSelArr,
            stepPrompts: tempArr,
            selStepPrompts: tempSelArr,
            sdPrompts: tempArr,
            selSdPrompts: [],
          },
          () => this.getBehPromptCode(),
        );
      }
    });
  };

  getBehPromptCode = () => {
    const {
      showBehaviourReductionInput,
      showBehaviourRecordingInput,
      selPrompts,
    } = this.state;

    let tempArr = [];
    // TherapistRequest.getBehPromptCodes().then((res) => {
    //   console.log('res behavioiur prompts', res);
    //   res?.data?.getBehPrompts.map((code) => {
    //     tempArr.push({...code, label: code.name});
    //   });

      TherapistRequest.getBehReinforces().then((res) => {
        console.log('res behavioiur prompts', res);
        res?.data?.getSbtReinforces.map((code) => {
          tempArr.push({...code, label: code.name});
        });

      if (showBehaviourReductionInput) {
        this.setState({
          behPromptList: tempArr,
          stepPrompts: tempArr,
          selStepPrompts: [],
        });
      } else if (showBehaviourRecordingInput) {
        this.setState({selStepPrompts: selPrompts});
      } else {
        this.setState({behPromptList: tempArr});
      }
    });
  };

  fetchBehaviourList = () => {
    TherapistRequest.getBehaviourList().then((res) => {
      console.log('response behaviour', res);
      let tempArr = [];

      if (res?.data?.getBehaviour?.edges.length > 0) {
        res?.data?.getBehaviour?.edges.map((item) => {
          tempArr.push({...item.node, label: item.node.behaviorName});
        });
      }

      console.log('tempArr', tempArr);
      this.setState({behaviourDataList: tempArr});
    });
  };

  saveDomainDropdown(domains) {
    let domainList = domains.map((domain, index) => {
      let name = domain.node.domain;
      if (name.length > 25) {
        name = name.substring(0, 25) + '...';
      }

      if (index === 0) {
        this.setState({selectedDomain: domain.node.id});
      }
      return {
        id: domain.node.id,
        label: name,
      };
    });
    this.setState({domainDropdownList: domainList});
  }

  fetchTargetsByDomainInit(domainId) {
    let variables = {
      domain: domainId,
    };
    this.setState({targets: [], isLoading: false});
  }

  fetchTargetsByDomain(domainId) {
    let variables = {
      domain: domainId,
    };

    this.setState({isLoading: false, targets: []});
  }

  fetchTargets(domainId, targetAreaId) {
    this.setState({
      isLoading: true,
    });
    let variables = {
      domain: domainId,
      targetArea: '',
    };

    TherapistRequest.getTargets(variables)
      .then((targetsData) => {
        this.setState({isLoading: false});
        if (
          targetsData &&
          targetsData.data &&
          targetsData.data.target &&
          targetsData.data.target.edges &&
          targetsData.data.target.edges.length > 0
        ) {
          this.setState({targets: targetsData.data.target.edges});
          this.setState({isLoading: false});
        } else {
          this.setState({noDataText: 'No targets found'});
        }
      })
      .catch((error) => {
        console.log('fetchTargets error:' + JSON.stringify(error));
        this.setState({isLoading: false});
      });
  }

  searchByFilter() {
    this.fetchTargets(this.state.selectedDomain, '');
    var Text = '';
  }

  fetchStudentList() {
    this.setState({isLoading: true});
    console.log('get data is called');
    TherapistRequest.getStudentList()
      .then((studentList) => {
        this.setState({allLearners: studentList.data.student_data.edges});
        this.fetchTargetStatusList();
      })
      .catch((error) => {
        console.log('================: ' + error);
        this.setState({isLoading: false, isAttendanceLoading: false});
        Alert.alert('Information', error.message.toString());
      });
  }

  fetchTargetStatusList() {
    TherapistRequest.getTargetStatusList()
      .then((targetStatusList) => {
        console.log('targetStatusList', JSON.stringify(targetStatusList));
        let statusList = targetStatusList.data.targetStatus.map((status) => {
          return {
            id: status.id,
            label: status.statusName,
          };
        });

        let statusListFinal = statusList.filter(
          (item) => item.label === 'In-Therapy',
        );

        this.setState({
          targetStatusData: statusList,
          targetStatusParent: statusListFinal,
        });

        this.fetchTargetTypes();
      })
      .catch((error) => {
        console.log('target status list error: ' + error);
        this.setState({isLoading: false});
      });
  }

  fetchTargetTypes() {
    TherapistRequest.getTargetTypes()
      .then((targetTypes) => {
        console.log('targetTypes', JSON.stringify(targetTypes));
        debugger
        let typesList = targetTypes.data.types.map((type) => {
          return {
            id: type.id,
            label: type.typeTar,
          };
        });

        // Discrete Trial Training
        // Natural Environment Training

        let typesDataNew = typesList.filter(
          (item) =>
            item.label == 'Discrete Trial Training' ||
            item.label == 'Natural Environment Training',
        );
        this.setState({typesData: typesList, typesDataNew: typesDataNew});

        this.fetchMasteryData();
      })
      .catch((error) => {
        console.log('target types error: ' + error);
        this.setState({isLoading: false});
      });
  }

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
        console.log(masteryList);
        this.setState({masteryData: masteryList}, () => {
          this.setState({selectedMastery: this.state.masteryData[0]?.id});
        });

        
      })
      .catch((error) => {
        console.log('mastery error: ' + error);
        this.setState({isLoading: false});
      });
  }

  getShortTermGoals() {
    const {student, program} = this.props.route.params;
    // Alert.alert(JSON.stringify(program))
    console.log('student manualtargetallocation 459', student);
    console.log('program manualtargetallocation 459', program);
    let variables = {
      studentId: student.node ? student.node.id : student,
      program: student.node ? program.id : program,
    };
    let shortTerms = [];
    TherapistRequest.getFilteredShortTermGoals(variables)
      .then((longTermGoalsData) => {
        // let longTermGoals =
        //   longTermGoalsData.data.programDetails.longtermgoalSet.edges;
        // for (let x = 0; x < longTermGoals.length; x++) {
          let shortTermGoals = longTermGoalsData?.data?.shortTerm?.edges ;
          console.log(shortTermGoals[0]);
          for (let y = 0; y < shortTermGoals.length; y++) {

            console.log(shortTermGoals[y].node)
            
            if(shortTermGoals[y]?.node?.goalStatus?.status === "In Progress") {
              shortTerms.push({
                id: shortTermGoals[y].node.id,
                label: shortTermGoals[y].node.goalName,
              });
            }
          }
        // }
        this.setState({
          shortTermGoals: shortTerms,
          isLoading: false,
        });
        this.fetchTargetSettingdata();
      })
      .catch((error) => {
        console.log('short terms goal error', error);
        this.setState({isLoading: false});
      });
  }
  fetchTargetSettingdata() {
    const {student} = this.props.route.params;

    const {typesData, masteryData, targetStatusData} = this.state;

    console.log('student id is -->' + student.node.id);
    let v = {
      studentId: student.node.id,
    };
    TherapistRequest.getAllTargetSettingData(v)
      .then((settingData) => {
        console.log('settingData--->', JSON.stringify(settingData));
        debugger

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
            : masteryData[0]?.id,
          selectedStatus: settingdata?.status?.id
            ? settingdata?.status.id
            : targetStatusData[0]?.id,
          isLoading: false,
        }, () => {
          if(settingdata?.targetType?.typeTar === "Peak") {
            this.setState({isPeak: true})
          }
        });
      })
      .catch((error) => {
        console.log('target setting data error: ' + error);
        this.setState({isLoading: false});
      });
  }

  isFormInValid() {
    let isError = false;
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

    if (store.getState().user.userType.name != 'parents') {
      if (this.state.selectedMastery === '') {
        this.setState({
          selectedMasteryError: ' Please select Mastery Criteria',
        });
        isError = true;
      } else {
        this.setState({selectedMasteryError: ''});
      }
    }

    if (this.state.shortTermGoalId === '') {
      this.setState({shortTermError: ' Please select Mastery Criteria'});
      isError = true;
    } else {
      this.setState({shortTermError: ''});
    }

    if (this.state.selectedStatus === '') {
      this.setState({selectedStatusError: ' Please select Target Status'});
      isError = true;
    } else {
      this.setState({selectedStatusError: ''});
    }

    if (this.state.selectedType === '') {
      this.setState({selectedTypeError: ' Please select Target Type'});
      isError = true;
    } else {
      this.setState({selectedTypeError: ''});
    }
    if (store.getState().user.userType.name != 'parents') {
      if (this.state.targetInstr === '') {
        this.setState({targetInstrError: ' (Cant be empty)'});
        isError = true;
      } else {
        this.setState({targetInstrError: ''});
      }
    }

    if (this.state.allSd.length == 0 && this.state.isCircle) {
      this.setState({sdError: ' (Cant be empty)'});
    } else {
      this.setState({sdError: ''});
    }

    // if (
    //   this.state.showBehaviourReductionInput &&
    //   this.state.allSteps.length === 0
    // ) {
    //   this.setState({
    //     stepErr: 'Atleast one Step is required for type Behaviour Reduction',
    //   });
    //   isError = true;
    // } else {
    //   this.setState({stepErr: ''});
    // }

    if(this.state.isPeak && this.state.allSd.length === 0) {
      this.setState({peakSdErr: "Atleast one Stimulus is required for type Peak"})
      isError = true
    } else {
      this.setState({peakSdErr: ''})
    }

    return isError;
  }

  allocateTarget() {
    const {allSd, allSteps, selectedFiles,stepPrompts,sbtStep} = this.state;

    if (this.isFormInValid()) {
      return;
    }
    const alphaList = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

    this.setState({showLoading: true});

    const classes = [];
    const sampleStimulus = [];
    const sampleStimulus11 = [];
    const manualMasterySd = [];
    const manualMastery = [];
    const tempAllSd = [];
    const tempAllSteps = [];
    const manualMasteryStep = [];
    const uploadedFiles = [];

    this.state.allSDClass.map((alpha, alphaIndex) => {
      sampleStimulus.push({
        option: alphaList[alphaIndex],
        stimulusName: this.state.allSDClass,
      });
    });
    this.state.allSDClass.map((alpha, alphaIndex) => {
      classes.push({
        name: 'Class' + (alphaIndex + 1),
        stimuluses: sampleStimulus,
      });
    });

    this.state.manualMasteryConditions.map((condition) => {
      manualMastery.push({
        sd: '',
        step: '',
        isDaily: condition.isDaily,
        responsePercentage: condition.responseTypeValue,
        consecutiveDays: condition.isDaily ? '1' : condition.cumConsecutiveDays,
        minTrial: !this.state.showBehaviourRecordingInput
          ? condition.minTrails
          : 0,
        fromStatus: condition.fromStatusId,
        toStatus: condition.toStatusId,
        gte: condition.responseType == '0' ? condition.responseTypeValue : 0,
        lte: condition.responseType == '1' ? condition.responseTypeValue : 100,
        masteryType: condition.masteryType,
        duration: condition.responseTypeValue || '0',
        noOfProblemBehavior: condition.responseTypeValue || '0',
      });
    });

    this.state.allSd.map((sd, index) => {
      console.log('sd', sd);
      sd.masteryConditions.map((condition) => {
        manualMasterySd.splice(index, 0, {
          sd: sd.sd,
          step: '',
          isDaily: condition.isDaily,
          responsePercentage: condition.responseTypeValue,
          consecutiveDays: condition.isDaily
            ? '1'
            : condition.cumConsecutiveDays,
          minTrial: !this.state.showBehaviourRecordingInput
            ? condition.minTrails
            : 0,
          fromStatus: condition.fromStatusId,
          toStatus: condition.toStatusId,
          gte: condition.responseType == '0' ? condition.responseTypeValue : 0,
          lte:
            condition.responseType == '1' ? condition.responseTypeValue : 100,
          masteryType: condition.masteryType,
          duration: condition.duration || 0,
          noOfProblemBehavior: condition.noOfProblemBehavior || 0,
        });
      });
    });

    this.state.allSd.map((sd, index) => {
      tempAllSd.splice(index, 0, {
        ...sd,
        manualMastery: manualMasterySd,
      });
    });

    this.state.allSteps.map((step, index) => {
      step.masteryConditions.map((condition) => {
        manualMasteryStep.splice(index, 0, {
          sd: '',
          step: step.step,
          isDaily: condition.isDaily,
          responsePercentage: condition.responseTypeValue,
          consecutiveDays: condition.isDaily
            ? '1'
            : condition.cumConsecutiveDays,
          minTrial: !this.state.showBehaviourRecordingInput
            ? condition.minTrails
            : 0,
          fromStatus: condition.fromStatusId,
          toStatus: condition.toStatusId,
          gte: condition.responseType == '0' ? condition.responseTypeValue : 0,
          lte:
            condition.responseType == '1' ? condition.responseTypeValue : 100,
          masteryType: condition.masteryType,
          duration: condition.duration || 0,
          noOfProblemBehavior: condition.noOfProblemBehavior || 0,
        });
      });
    });

    this.state.allSteps.map((step, index) => {
      tempAllSteps.splice(index, 0, {
        ...step,
        manualMastery: manualMasteryStep,
      });
    });

    if (
      selectedFiles.length > 0 &&
      allSteps.length === 0 &&
      allSd.length === 0
    ) {
      selectedFiles.map((file) => {
        uploadedFiles.push({
          sd: '',
          step: '',
          url: file.url,
        });
      });
    } else if (allSteps.length > 0) {
      if (selectedFiles.length > 0) {
        selectedFiles.map((file) => {
          uploadedFiles.push({
            sd: '',
            step: '',
            url: file.url,
          });
        });

        allSteps.map((step, index) => {
          step.stepsFiles.map((file) => {
            uploadedFiles.push({
              step: step.step,
              sd: '',
              url: file.url,
            });
          });
        });
      } else {
        allSteps.map((step, index) => {
          step.stepsFiles.map((file) => {
            uploadedFiles.push({
              step: step.step,
              sd: '',
              url: file.url,
            });
          });
        });
      }
    } else if (allSd.length > 0) {
      if (selectedFiles.length > 0) {
        selectedFiles.map((file) => {
          uploadedFiles.push({
            sd: '',
            step: '',
            url: file.url,
          });
        });

        allSd.map((sd, index) => {
          sd.sdFiles.map((file) => {
            uploadedFiles.push({
              sd: sd.sd,
              step: '',
              url: file.url,
            });
          });
        });
      } else {
        allSd.map((sd, index) => {
          sd.sdFiles.map((file) => {
            uploadedFiles.push({
              sd: sd.sd,
              step: '',
              url: file.url,
            });
          });
        });
      }
    }

    console.log('sdasdasdasdad', tempAllSteps);
    console.log('sdasdasdasdad>>>>>>>', this.state.dailyTrials);

    tempAllSteps.map((step) => {
      delete step.masteryConditions;
      delete step.stepsFiles;
    });
    tempAllSd.map((sd) => {
      delete sd.masteryConditions;
      delete sd.sdFiles;
    });

    const sbtStepResponse = []

    sbtStep.forEach((item, index) => {
      sbtStepResponse.push({
        id:item.id,
        orderNo: item.k,
        description: item.step,
        statusId: item.status,
        mastery:item.masteryConditions.length>0 ? 
           {
              gte:item.masteryConditions[0].gte,
              lte: item.masteryConditions[0].lte,
              isDaily: item.masteryConditions[0].masteryType === 'Daily',
              masteryType: item.masteryConditions[0].masteryType,
              consecutiveDays: item.masteryConditions[0].consecutiveDays || 0,
              noOfProblemBehavior: item.masteryConditions[0].noOfProblemBehavior || 0,
              minTrial: item.masteryConditions[0].minTrial || 0,
              fromStatus: item.masteryConditions[0].fromStatus.id,
              toStatus: item.masteryConditions[0].toStatus.id,
            }
          : {},
        reinforce: item.reinforce.length>0?item.reinforce.map(i=>{
           let reinforceName=stepPrompts.filter(p=>p.id===i)
           return {
             name:reinforceName[0]?.label
           }

        }):[],
      })
    })


    let queryParams = {
      shortTerm: this.state.isAllocateDirectly ? this.state.defaultGoalId : this.state.shortTermGoalId,
      targetId: this.state.target?.node?.id,
      targetName: this?.state?.targetName,
      dailyTrials: this?.state?.dailyTrials,
      consecutiveDays: this?.state?.consecutiveDays,
      studentId:
        this?.state?.student?.node?.id != undefined
          ? this?.state?.student?.node?.id
          : this?.state?.studentNew,
      masteryCriteria: this?.state?.selectedMastery,
      date: DateHelper.getTodayDate(),
      sd: tempAllSd,
      steps: tempAllSteps,
      video: this?.state?.targetVideoLink,
      targetInstr: this?.state?.targetInstr,
      targetType: this?.state?.selectedType,
      targetStatus: this?.state?.selectedStatus,
      peakType: this?.state?.selectedPeakType,
      circleLearners: this?.state?.selectedLearnerId,
      classes: this.state.classes,
      peakBlocks: this.state.selectectedPeakBlock,
      domain:
        this.state.selectedDomain !== ''
          ? this.state.selectedDomain
          : this.state.domainDropdownList[0].id,
      targetDocs: uploadedFiles,
      manualMastery: manualMastery,
      trialDuration: this.state.trialDuration,
      r1: this.state.showBehaviourReductionInput
        ? this.state.behaviourR1
        : null,
      r2: this.state.showBehaviourReductionInput
        ? this.state.behaviourR2
        : null,
      recordingType: this.state.selRecordingType,
      prompts: this.state.selPrompts,
      sbtSteps:sbtStepResponse

    };
    console.log(
      'query params before manual ---------------->' +
        JSON.stringify(queryParams),
      queryParams,
    );
    TherapistRequest.allocateManualTarget(queryParams)
      .then((newTargetData) => {
        console.log(
          'newTargetData*/*/*/*//*/**/*/*/****/*/*/*/*/**/',
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
        console.log(JSON.stringify(error));
        this.setState({isSaving: false});

        Alert.alert('Information', JSON.stringify(error.message));
      });
  }
  changeDailyTrials(changeType) {
    if (changeType === 'I' && this.state.dailyTrials < 30) {
      this.setState({dailyTrials: this.state.dailyTrials + 1});
    } else if (changeType === 'D' && this.state.dailyTrials > 0) {
      this.setState({dailyTrials: this.state.dailyTrials - 1});
    }
  }
  changeConsecutiveDays(changeType) {
    if (changeType === 'I' && this.state.consecutiveDays < 30) {
      this.setState({consecutiveDays: this.state.consecutiveDays + 1});
    } else if (changeType === 'D' && this.state.consecutiveDays > 0) {
      this.setState({consecutiveDays: this.state.consecutiveDays - 1});
    }
  }

  handleChangeSteps = (text, key) => {
    let allSteps = this.state.allSteps;
    allSteps[key].step = text;
    this.setState({
      allSteps: allSteps,
      selectedStepKey: key,
    });
    if (text === '') {
      this.setState({
        steps: '',
      });
    } else {
      this.setState({isSd: false});
      let variables = {
        text: text,
      };
      TherapistRequest.getStepsForTarget(variables).then((result) => {
        console.log(JSON.stringify(result));
        let steps = result.data.targetStep.edges;
        let finalSteps = [];
        for (let x = 0; x < steps.length; x++) {
          finalSteps.push({id: steps[x].node.id, name: steps[x].node.step});
        }
        console.log(finalSteps);
        this.setState({
          steps: finalSteps,
        });
      });
    }
  };

  handleStepClick = (step, key) => {
    let allSteps = this.state.allSteps;
    allSteps[key].step = step.name;
    this.setState({
      allSteps: allSteps,
      steps: [],
      selectedSd: [],
    });
  };

  handleSdClick = (sd, key) => {
    let allSd = this.state.allSd;
    allSd[key].sd = sd.name;
    this.setState({
      allSd: allSd,
      sd: [],
      selectedSteps: [],
    });
  };

  handleChangeSd = (text, key) => {
    let allSd = this.state.allSd;
    allSd[key].sd = text;
    this.setState({
      allSd: allSd,
      selectedSdKey: key,
    });
    if (text === '') {
      this.setState({
        sd: [],
      });
    } else {
      this.setState({isSteps: false});
      let variables = {
        text: text,
      };
      TherapistRequest.getSdForTarget(variables).then((result) => {
        console.log(JSON.stringify(result));
        let sd = result.data.targetSd.edges;
        let finalSd = [];
        for (let x = 0; x < sd.length; x++) {
          finalSd.push({id: sd[x].node.id, name: sd[x].node.sd});
        }
        console.log(finalSd);
        this.setState({
          sd: finalSd,
        });
      });
    }
    console.log('jatinyt' + allSd);
  };

  handleRemoveStep = (step) => {
    const {selectedSteps} = this.state;
    let updatedSteps = [];
    for (let x = 0; x < selectedSteps.length; x++) {
      if (selectedSteps[x].id !== step.id) {
        updatedSteps.push(selectedSteps[x]);
      }
    }
    this.setState({
      selectedSteps: updatedSteps,
    });
    if (this.state.selectedSteps.length == 0) {
      this.setState({isSd: true});
    }
  };

  handleRemoveSd = (sd) => {
    const {selectedSd} = this.state;
    let updatedSd = [];
    for (let x = 0; x < selectedSd.length; x++) {
      if (selectedSd[x].id !== sd.id) {
        updatedSd.push(selectedSd[x]);
      }
    }
    this.setState({
      selectedSd: updatedSd,
    });
    if (this.state.selectedSd.length == 0) {
      this.setState({isSteps: true});
    }
  };

  changePeakBlocks(changeType) {
    if (changeType === 'I' && this.state.selectectedPeakBlock < 30) {
      this.setState({
        selectectedPeakBlock: this.state.selectectedPeakBlock + 1,
      });
    } else if (changeType === 'D' && this.state.selectectedPeakBlock > 1) {
      this.setState({
        selectectedPeakBlock: this.state.selectectedPeakBlock - 1,
      });
    }
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

  selectFile = async (cardType, cardIndex) => {
    const {allSteps, allSd} = this.state;
    if (await this.checkPermissions()) {
      const response = await DocumentPicker.pickMultiple({
        type: [DocumentPicker.types.images, DocumentPicker.types.pdf],
      });

      console.log('res from file picekr', response);

      if (cardType === 0) {
        if (this.state.selectedFiles.length > 0) {
          this.setState(
            {selectedFiles: this.state.selectedFiles.concat(response)},
            () => {
              this.uploadFile(cardType);
            },
          );
        } else {
          this.setState({selectedFiles: response}, () => {
            this.uploadFile(cardType);
          });
        }
      } else if (cardType === 1) {
        if (allSteps.length > 0 && allSteps[cardIndex].stepsFiles.length > 0) {
          let tempArr = allSteps;
          tempArr[cardIndex].stepsFiles = allSteps[cardIndex].stepsFiles.concat(
            response,
          );
          this.setState({allSteps: tempArr}, () => {
            this.uploadFile(cardType, cardIndex);
          });
        } else {
          allSteps[cardIndex].stepsFiles = response;
          this.setState({allSteps}, () => {
            this.uploadFile(cardType, cardIndex);
          });
        }
      } else {
        if (allSd.length > 0 && allSd[cardIndex].sdFiles.length > 0) {
          let tempArr = allSd;
          tempArr[cardIndex].sdFiles = allSd[cardIndex].sdFiles.concat(
            response,
          );
          this.setState({allSd: tempArr}, () => {
            this.uploadFile(cardType, cardIndex);
          });
        } else {
          allSd[cardIndex].sdFiles = response;
          this.setState({allSd}, () => {
            this.uploadFile(cardType, cardIndex);
          });
        }
      }
    }
  };

  manageFile = (type, index, cardType, cardIndex) => {
    const {selectedFiles, allSteps, allSd} = this.state;
    if (cardType === 0) {
      if (type === 'd') {
        selectedFiles.splice(index, 1);
        this.setState({selectedFiles});
      } else if (type === 'v') {
        console.log('view files', selectedFiles);
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
    } else if (cardType === 1) {
      if (type === 'd') {
        allSteps[cardIndex].stepsFiles.splice(index, 1);
        this.setState({allSteps});
      } else if (type === 'v') {
        console.log('view file');
        let urlComponents = allSteps[cardIndex].stepsFiles[index].url.split(
          '/',
        );
        let name = urlComponents[urlComponents.length - 1];
        let type = name.split('.')[1];

        if (type === 'pdf') {
          this.setState({
            showAttachmentModal: true,
            fileUrl: allSteps[cardIndex].stepsFiles[index].url,
          });
        } else {
          this.setState({
            showImageAttachmentModal: true,
            fileUrl: allSteps[cardIndex].stepsFiles[index].url,
          });
        }
      }
    } else if (cardType === 2) {
      if (type === 'd') {
        allSd[cardIndex].sdFiles.splice(index, 1);
        this.setState({allSd});
      } else if (type === 'v') {
        let urlComponents = allSteps[cardIndex].stepsFiles[index].url.split(
          '/',
        );
        let name = urlComponents[urlComponents.length - 1];
        let type = name.split('.')[1];

        if (type === 'pdf') {
          this.setState({
            showAttachmentModal: true,
            fileUrl: allSteps[cardIndex].stepsFiles[index].url,
          });
        } else {
          this.setState({
            showImageAttachmentModal: true,
            fileUrl: allSteps[cardIndex].stepsFiles[index].url,
          });
        }
      }
    }
  };

  uploadFile = async (cardType, cardIndex) => {
    this.setState({isLoading: true})
    const {selectedFiles, sdFiles, stepsFiles, allSteps, allSd} = this.state;
    let tempFiles = [];

    if (cardType === 0) {
      tempFiles = selectedFiles;

      selectedFiles.map(async (file, fileIndex) => {
        if (Platform.OS === 'android') {
          if (file.fileCopyUri.startsWith('content://')) {
            const uriComponents = file.fileCopyUri.split('/');
            const fileNameAndExtension =
              uriComponents[uriComponents.length - 1];
            console.log('file name ext', fileNameAndExtension);
            let tempname = fileNameAndExtension.replace('%', 'd');

            console.log('filename  extension edit', tempname);

            const destPath = `${RNFS.TemporaryDirectoryPath}/${tempname}`;
            await RNFS.copyFile(file.fileCopyUri, destPath);

            console.log('tempResponse', destPath);

            file = {
              ...file,
              path: `file:/${destPath}`,
              url: `file:/${destPath}`,
            };
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
              this.setState({isLoading: false})
              console.log('upload response', response);
              let temp = JSON.parse(response.data);
              console.log('upload response', temp);
              alert('File uploaded sucessfully');
              // this.setState({uploadedFiles: fileUri})
              file = {
                ...file,
                url: temp.fileUrl[0],
              };
              tempFiles[fileIndex] = file;
              this.setState({selectedFiles: tempFiles});
            })
            .catch((err) => alert(err));
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
              this.setState({isLoading: false})
              let temp = JSON.parse(response.data);
              console.log('upload response', temp);
              alert('File uploaded sucessfully');
              file = {
                ...file,
                url: temp.fileUrl[0],
              };
              tempFiles[fileIndex] = file;
              this.setState({selectedFiles: tempFiles});
            })
            .catch((err) => alert(err));
        }
      });
    } else if (cardType === 1) {
      tempFiles = allSteps[cardIndex].stepsFiles;
      allSteps[cardIndex].stepsFiles.map(async (file, fileIndex) => {
        if (Platform.OS === 'android') {
          if (file.fileCopyUri.startsWith('content://')) {
            const uriComponents = file.fileCopyUri.split('/');
            const fileNameAndExtension =
              uriComponents[uriComponents.length - 1];
            console.log('file name ext', fileNameAndExtension);
            let tempname = fileNameAndExtension.replace('%', 'd');

            console.log('filename  extension edit', tempname);

            const destPath = `${RNFS.TemporaryDirectoryPath}/${tempname}`;
            await RNFS.copyFile(file.fileCopyUri, destPath);

            console.log('tempResponse', destPath);

            file = {
              ...file,
              path: `file:/${destPath}`,
            };
          }
        }

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
              this.setState({isLoading: false})
              console.log('upload response', response);
              let temp = JSON.parse(response.data);
              console.log('upload response', temp);
              alert('File uploaded sucessfully');
              // this.setState({uploadedFiles: fileUri})
              file = {
                ...file,
                url: temp.fileUrl[0],
              };
              allSteps[cardIndex].stepsFiles[fileIndex] = file;
              this.setState({allSteps});
            })
            .catch((err) => alert(err));
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
              this.setState({isLoading: false})
              let temp = JSON.parse(response.data);
              console.log('upload response', temp);
              alert('File uploaded sucessfully');
              file = {
                ...file,
                url: temp.fileUrl[0],
              };
              allSteps[cardIndex].stepsFiles[fileIndex] = file;
              this.setState({allSteps});
            })
            .catch((err) => alert(err));
        }
      });
    } else {
      tempFiles = allSd[cardIndex].sdFiles;

      allSd[cardIndex].sdFiles.map(async (file, fileIndex) => {
        if (Platform.OS === 'android') {
          if (file.fileCopyUri.startsWith('content://')) {
            const uriComponents = file.fileCopyUri.split('/');
            const fileNameAndExtension =
              uriComponents[uriComponents.length - 1];
            console.log('file name ext', fileNameAndExtension);
            let tempname = fileNameAndExtension.replace('%', 'd');

            console.log('filename  extension edit', tempname);

            const destPath = `${RNFS.TemporaryDirectoryPath}/${tempname}`;
            await RNFS.copyFile(file.fileCopyUri, destPath);

            console.log('tempResponse', destPath);

            file = {
              ...file,
              path: `file:/${destPath}`,
              url: `file:/${destPath}`,
            };
          }
        }

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
              this.setState({isLoading: false})
              console.log('upload response', response);
              let temp = JSON.parse(response.data);
              console.log('upload response', temp);
              alert('File uploaded sucessfully');
              // this.setState({uploadedFiles: fileUri})
              file = {
                ...file,
                url: temp.fileUrl[0],
              };
              allSd[cardIndex].sdFiles[fileIndex] = file;
              this.setState({allSd});
            })
            .catch((err) => alert(err));
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
              this.setState({isLoading: false})
              let temp = JSON.parse(response.data);
              console.log('upload response', temp);
              alert('File uploaded sucessfully');
              file = {
                ...file,
                url: temp.fileUrl[0],
              };
              allSd[cardIndex].sdFiles[fileIndex] = file;
              this.setState({allSd});
            })
            .catch((err) => alert(err));
        }
      });
    }
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

  renderLernerModal = () => {
    const {allLearners, selectedLearnerId} = this.state;
    return (
      <Modal
        animationType={'slide'}
        transparent={true}
        visible={this.state.modalVisible}
        onRequestClose={() => {
          console.log('Modal has been closed.');
        }}>
        <View
          onPress={() => this.setState({modalVisible: false})}
          style={styles.modal}>
          <View style={styles.modalInnerView}>
            <Text style={styles.modalHeader}>Select Learners</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              {allLearners.map((item, index) => (
                <TouchableOpacity
                  onPress={() => {
                    if (
                      selectedLearnerId.length > 0 &&
                      selectedLearnerId.includes(item.node.id)
                    ) {
                      const removedData = selectedLearnerId.filter(
                        (itema) => itema != item.node.id,
                      );
                      this.setState({selectedLearnerId: removedData});
                    } else {
                      this.setState({
                        selectedLearnerId: [...selectedLearnerId, item.node.id],
                      });
                    }
                  }}
                  style={{margin: 10, flexDirection: 'row'}}>
                  <Icon
                    name={
                      selectedLearnerId.includes(item.node.id)
                        ? 'ios-checkmark-circle'
                        : 'ios-radio-button-off'
                    }
                    size={30}
                    color={Color.primary}
                  />
                  <Text style={{marginTop: 5, marginLeft: 10}}>
                    {item.node.firstname + ' ' + item.node.lastname}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <View style={{width: '100%', alignItems: 'center'}}>
              <Button
                labelButton="Done"
                style={{marginBottom: 10, height: 35, width: '70%'}}
                isLoading={this.state.showLoading}
                onPress={() => {
                  this.setState({modalVisible: false});
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  renderPeak() {
    return (
      <View>
        <Text style={{textAlign: 'left', color: 'red'}}>
          {this.state.selectedPeakTypeError}
        </Text>
        <PickerModal
          label="Peak Type"
          iconLeft="folder-open"
          selectedValue={this.state.selectedPeakType}
          data={this.state.peakTypes}
          onValueChange={(itemValue, itemIndex) => {
            console.log('ksksks', itemValue);
            if (itemValue == 'Equivalance') {
              this.setState({isPeakEqu: true});
            } else {
              this.setState({isPeakEqu: false});
            }
            this.setState({selectedPeakType: itemValue});
          }}
        />
        <View
          style={{
            borderWidth: 1,
            borderColor: '#bcbcbc',
            padding: 5,
            borderRadius: 5,
          }}>
          {/* Daily Trails */}
          <View style={{flexDirection: 'row', marginBottom: 10}}>
            <View style={{flexDirection: 'row', width: '60%'}}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '500',
                  color: '#63686E',
                  paddingTop: 12,
                  flex: 1,
                }}>
                Peak Blocks
                <Text style={{textAlign: 'left', color: 'red'}}>
                  {this.state.dailyTrialsError}
                </Text>
              </Text>
            </View>
            <View style={{flexDirection: 'row', width: '40%', paddingTop: 10}}>
              <TouchableOpacity
                onPress={() => {
                  this.changePeakBlocks('D');
                }}>
                <Text style={styles.hrButton}>
                  <MaterialCommunityIcons
                    name="minus"
                    size={14}
                    color={Color.gray}
                    style={styles.minusButtonText}
                  />
                </Text>
              </TouchableOpacity>
              <Text
                style={{
                  paddingLeft: 10,
                  paddingRight: 10,
                  alignSelf: 'center',
                  fontSize: 18,
                  borderWidth: 1,
                  borderColor: Color.gray,
                }}>
                {this.state.selectectedPeakBlock}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  this.changePeakBlocks('I');
                }}>
                <Text style={styles.hrButton}>
                  <MaterialCommunityIcons
                    name="plus"
                    size={24}
                    color={Color.gray}
                    style={styles.plusButtonText}
                  />
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  }

  renderBehaviourReductionInput = () => {
    const {
      behaviourR1,
      behaviourR2,
      behaviourR1Err,
      behaviourR2Err,
      behaviourDataList,
      trialDuration,
    } = this.state;

    console.log('beviour data list', behaviourDataList);
    return (
      <View>
        <PickerModal
          label="Behaviour R1"
          error={behaviourR1Err}
          placeholder=""
          selectedValue={this.state.selectedStatus || ''}
          data={behaviourDataList}
          onValueChange={(itemValue, itemIndex) => {
            this.setState({behaviourR1: itemValue});
          }}
        />
        <PickerModal
          label="Behaviour R2"
          error={behaviourR2Err}
          placeholder=""
          selectedValue={behaviourR2 || ''}
          data={behaviourDataList}
          onValueChange={(itemValue, itemIndex) => {
            this.setState({behaviourR2: itemValue});
          }}
        />
        <View style={styles.card}>
          <View style={{flex: 5}}>
            <Text style={[styles.cardTitle, {flex: 0}]}>Trial Duration</Text>
          </View>
          <View
            style={{
              flex: 4.5,
              marginVertical: 15,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              style={{
                width: 50,
                height: 50,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => this.changeTrialDuration('D')}>
              <MaterialCommunityIcons
                name={'minus'}
                size={20}
                color="#45494E"
              />
            </TouchableOpacity>
            <View
              style={{
                borderWidth: 0.5,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-around',
                paddingHorizontal: 5,
              }}>
              <LegacyTextInput
                style={{
                  // flex: 0.4,
                  textAlign: 'center',
                  fontSize: 20,
                  color: Color.primary,
                  borderWidth: 0,
                  borderColor: Color.gray,
                  borderRadius: 4,
                  height: 50,
                }}
                value={trialDuration.toString()}
                keyboardType="number-pad"
                onChangeText={(text) => {
                  if (text !== '') {
                    let num = parseInt(text);
                    if (num > 30) {
                      Alert.alert('value should not be >30');
                      this.setState({trialDuration: 0});
                    } else if (num < 1) {
                      this.setState({trialDuration: 0});
                    } else {
                      this.setState({trialDuration: num});
                    }
                  } else {
                    this.setState({trialDuration: 0});
                  }
                }}
              />
              <View style={{marginLeft: 5}}>
                <Text>SEC</Text>
              </View>
            </View>
            <TouchableOpacity
              style={{
                width: 50,
                height: 50,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => {
                this.changeTrialDuration('I');
              }}>
              <MaterialCommunityIcons name={'plus'} size={20} color="#45494E" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  changeTrialDuration = (changeType) => {
    const {trialDuration} = this.state;
    if (changeType === 'I') {
      this.setState({trialDuration: trialDuration + 1});
    } else if (changeType === 'D' && trialDuration > 0) {
      this.setState({trialDuration: trialDuration - 1});
    }
  };

  renderBehaviourRecordingInput = () => {
    const {
      recordingTypeData,
      selRecordingType,
      recordingTypeError,
      trialDurationErr,
      trialDuration,
    } = this.state;
    return (
      <View>
        <MultiPickerModal
          label="Recording Type"
          data={recordingTypeData}
          value={selRecordingType}
          onSelect={(selRecordingType) => {
            console.log('selRecordingType', selRecordingType);
            if (selRecordingType.length > 0) {
              this.setState({selRecordingType, recordingTypeError: false});
            } else {
              this.setState({recordingTypeError: true});
            }
          }}
        />

        <View style={styles.card}>
          <View style={{flex: 5}}>
            <Text style={[styles.cardTitle, {flex: 0}]}>Trial Duration</Text>
          </View>
          <View
            style={{
              flex: 4.5,
              marginVertical: 15,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              style={{
                width: 50,
                height: 50,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => this.changeTrialDuration('D')}>
              <MaterialCommunityIcons
                name={'minus'}
                size={20}
                color="#45494E"
              />
            </TouchableOpacity>
            <View
              style={{
                borderWidth: 0.5,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-around',
                paddingHorizontal: 5,
              }}>
              <LegacyTextInput
                style={{
                  // flex: 0.4,
                  textAlign: 'center',
                  fontSize: 20,
                  color: Color.primary,
                  borderWidth: 0,
                  borderColor: Color.gray,
                  borderRadius: 4,
                  height: 50,
                }}
                defaultValue={trialDuration.toString()}
                value={trialDuration}
                keyboardType="number-pad"
                onChangeText={(text) => {
                  if (text !== '') {
                    let num = parseInt(text);
                    if (num > 30) {
                      Alert.alert('value should not be >30');
                      this.setState({trialDuration: 0});
                    } else if (num < 1) {
                      this.setState({trialDuration: 0});
                    } else {
                      this.setState({trialDuration: num});
                    }
                  }
                }}
              />
              <View style={{marginLeft: 5}}>
                <Text>SEC</Text>
              </View>
            </View>
            <TouchableOpacity
              style={{
                width: 50,
                height: 50,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => {
                this.changeTrialDuration('I');
              }}>
              <MaterialCommunityIcons name={'plus'} size={20} color="#45494E" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  renderInput1() {
    let target = this.props.route.params.target;
    // console.log("target:"+JSON.stringify( target))
    let {
      targetName,
      targetVideoLink,
      targetVideoLinkError,
      selectedSdKey,
      selectedStepKey,
      selectedSteps,
      selectedSd,
      steps,
      sd,
      shortTermGoalId,
      shortTermError,
      shortTermGoals,
      dailyTrials,
      consecutiveDays,
      masteryData,
      selectedMastery,
      objective,
      targetInstr,
      goodPractices,
      gernalizationCriteria,
      targetStatusData,
      selectedStatus,
      typesData,
      targetStatusParent,
      typesDataNew,
      selectedType,
      promptList,
      behPromptList,
      selPrompts,
      selBehPrompts,
      stepPrompts,
      selStepPrompts,
      isAllocateDirectly,
      sbtStatus
    } = this.state;

    let defaults = this.props.route.params.defaults;
    console.log('unique', shortTermGoals[0]?.id);
    return (
      <>
        <View style={styles.targetView}>
          <Image
            style={styles.targetViewImage}
            source={require('../../../../android/img/Image.png')}
          />
          <Text style={styles.targetViewTitle}>
            {target?.node?.targetMain?.targetName}
          </Text>
          <Text style={styles.targetViewDomain}>
            {target?.node?.domain?.domain}
          </Text>
        </View>

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
            label={getStr('TargetAllocate.ShortTermGoal')}
            placeholder="(Select Short Term Goal)"
            selectedValue={shortTermGoalId}
            data={shortTermGoals}
            onValueChange={(itemValue, itemIndex) => {
              this.setState({shortTermGoalId: itemValue});
            }}
          />
        </View>
        )}

        

        <TextInput
          label={getStr('TargetAllocate.TargetName')}
          error={this.state.targetNameError}
          multiline={true}
          placeholder={'Target Name'}
          defaultValue={targetName}
          onChangeText={(targetName) => this.setState({targetName})}
        />

        <PickerModal
          label={getStr('TargetAllocate.TargetType')}
          error={this.state.selectedTypeError}
          selectedValue={this.state.selectedType}
          data={
            store.getState().user.userType.name != 'parents'
              ? typesData
              : typesDataNew
          }
          onValueChange={(itemValue, itemIndex) => {
            console.log(typesData[itemIndex]);
            if (typesData[itemIndex].label === 'Peak') {
              this.setState({isPeak: true});
            } else {
              this.setState({isPeak: false});
            }

            this.setState({
              selectedType: itemValue,
              showBehaviourReductionInput: false,
              showBehaviourRecordingInput: false,
            });

            if (typesData[itemIndex].label === 'Time Circle') {
              this.setState({showStimulus: true, showSteps: false});
            } else if (typesData[itemIndex].label === 'Skill Based Treatment') {
              this.setState(
                {
                  showStimulus: false,
                  showSteps: true,
                  showBehaviourReductionInput: true,
                },
                () => {
                  this.getSbtSteps()

                  this.fetchBehaviourList();
                  this.getPromptCodes();
                },
              );
            } else if (typesData[itemIndex].label === 'Behavior Recording') {
              this.setState(
                {
                  showStimulus: false,
                  showSteps: false,
                  showBehaviourRecordingInput: true,
                },
                () => {
                  this.fetchRecordingType();
                  this.getPromptCodes();
                },
              );
            } else if (typesData[itemIndex].label === 'Task Analysis') {
              this.setState({showStimulus: true, showSteps: true});
            } else {
              this.setState({showSteps: false, showStimulus: true})
            }
          }}
        />

        <View>
          <PickerModal
            label={getStr('TargetAllocate.Domain')}
            iconLeft="folder-open"
            // placeholder={this.state.selectedDomain}
            selectedValue={this.state.selectedDomain}
            data={this.state.domainDropdownList}
            onValueChange={(itemValue, itemIndex) => {
              this.setState({selectedDomain: itemValue, domainDone: 1});
              // this.fetchTargetsByDomain(itemValue);
            }}
          />
        </View>

        {this.state.showBehaviourReductionInput &&
          this.renderBehaviourReductionInput()}

        {this.state.showBehaviourRecordingInput &&
          this.renderBehaviourRecordingInput()}

        {this.state.isPeak && this.renderPeak()}

        <PickerModal
          label={getStr('TargetAllocate.TargetStatus')}
          error={this.state.selectedStatusError}
          placeholder="(Select Target Status)"
          selectedValue={this.state.selectedStatus}
          data={
            store.getState().user.userType.name != 'parents'
              ? targetStatusData
              : targetStatusParent
          }
          onValueChange={(itemValue, itemIndex) => {
            this.setState({selectedStatus: itemValue});
          }}
        />

        <View style={styles.card}>
          <View style={{flex: 5}}>
            <Text style={[styles.cardTitle, {flex: 0}]}>
              {getStr('TargetAllocate.DailyTrails')}
            </Text>
            {this.state.dailyTrialsError != null && (
              <Text style={{textAlign: 'left', color: Color.danger}}>
                {this.state.dailyTrialsError}
              </Text>
            )}
          </View>
          <View
            style={{
              flex: 4,
              marginVertical: 15,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              style={{
                width: 50,
                height: 50,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => this.changeDailyTrials('D')}>
              <MaterialCommunityIcons
                name={'minus'}
                size={20}
                color="#45494E"
              />
            </TouchableOpacity>
            <LegacyTextInput
              style={{
                flex: 1,
                textAlign: 'center',
                fontSize: 20,
                color: Color.primary,
                borderWidth: 1,
                borderColor: Color.gray,
                borderRadius: 4,
                height: 50,
              }}
              defaultValue={dailyTrials?.toString()}
              value={dailyTrials}
              keyboardType="number-pad"
              onChangeText={(text) => {
                if (text !== '') {
                  let num = parseInt(text);
                  if (num > 30) {
                    Alert.alert('value should not be >30');

                    this.setState({dailyTrials: 0});
                  } else if (num < 1) {
                    this.setState({dailyTrials: 0});
                  } else if (num) {
                    this.setState({dailyTrials: parseInt(num)});
                  }
                }
                
              }}
            />
            <TouchableOpacity
              style={{
                width: 50,
                height: 50,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => {
                this.changeDailyTrials('I');
              }}>
              <MaterialCommunityIcons name={'plus'} size={20} color="#45494E" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.card}>
          <View style={{flex: 5}}>
            <Text style={[styles.cardTitle, {flex: 0}]}>
              {getStr('TargetAllocate.ConsecutiveDays')}
            </Text>
            {this.state.consecutiveDaysError != null && (
              <Text style={{textAlign: 'left', color: Color.danger}}>
                {this.state.consecutiveDaysError}
              </Text>
            )}
          </View>
          <View
            style={{
              flex: 4,
              marginVertical: 15,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              style={{
                width: 50,
                height: 40,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => this.changeConsecutiveDays('D')}>
              <MaterialCommunityIcons
                name={'minus'}
                size={20}
                color="#45494E"
              />
            </TouchableOpacity>
            <LegacyTextInput
              style={{
                flex: 1,
                textAlign: 'center',
                fontSize: 20,
                color: Color.primary,
                borderWidth: 1,
                borderColor: Color.gray,
                borderRadius: 4,
                height: 50,
              }}
              defaultValue={consecutiveDays?.toString()}
              value={consecutiveDays}
              keyboardType="number-pad"
              onChangeText={(text) => {
                if (text !== '') {
                  let num = parseInt(text);
                  if (num > 30) {
                    Alert.alert('value should not be >30');

                    this.setState({consecutiveDays: 0});
                  } else if (num < 1) {
                    this.setState({consecutiveDays: 0});
                  } else if (num) {
                    this.setState({consecutiveDays: parseInt(num)});
                  }
                }
              }}
            />
            <TouchableOpacity
              style={{
                width: 50,
                height: 40,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => {
                this.changeConsecutiveDays('I');
              }}>
              <MaterialCommunityIcons name={'plus'} size={20} color="#45494E" />
            </TouchableOpacity>
          </View>
        </View>

        <MultiPickerModal
          label="Prompt"
          data={promptList}
          value={selPrompts}
          onSelect={(selPrompts) => {
            console.log('selected prompts', selPrompts);
            this.setState({selPrompts});
          }}
        />

        {store.getState().user.userType.name != 'parents' &&
          !this.state.showBehaviourRecordingInput &&
          !this.state.showBehaviourReductionInput && (
            <PickerModal
              label={getStr('TargetAllocate.MasteryCriteria')}
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
          )}
        {/* {this.state.showBehaviourReductionInput && (
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 0.8,
              borderColor: Color.gray,
              paddingVertical: 5,
              marginVertical: 7,
              borderRadius: 5,
            }}
            onPress={() =>
              this.setState({showmanualModal: true, cardType: 0, isEdit: false})
            }>
            <MaterialCommunityIcons
              name="plus"
              size={20}
              color={Color.primary}
            />
            <Text style={{color: Color.primary}}>
              Add Behaviour Reduction Mastery
            </Text>
          </TouchableOpacity>
        )} */}

        {this.state.showBehaviourRecordingInput && (
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 0.8,
              borderColor: Color.gray,
              paddingVertical: 5,
              marginVertical: 7,
              borderRadius: 5,
            }}
            onPress={() =>
              this.setState({showmanualModal: true, cardType: 0, isEdit: false})
            }>
            <MaterialCommunityIcons
              name="plus"
              size={20}
              color={Color.primary}
            />
            <Text style={{color: Color.primary}}>
              Add Behaviour Recording Mastery
            </Text>
          </TouchableOpacity>
        )}

        {this.state.manualMasteryConditions.length > 0 && (
          <View style={{width: '100%', flexDirection: 'row'}}>
            <View style={styles.tableCell}>
              <Text style={{textAlign: 'center'}}>From Status</Text>
            </View>
            <View style={styles.tableCell}>
              <Text style={{textAlign: 'center'}}>To Status</Text>
            </View>
            <View style={[styles.tableCell, {flex: 0.6}]}>
              {this.state.showBehaviourRecordingInput ? (
                <Text style={{textAlign: 'center'}}>Duration</Text>
              ) : this.state.showBehaviourReductionInput ? (
                <Text style={{textAlign: 'center'}}>Prob Behavior</Text>
              ) : (
                <Text style={{textAlign: 'center'}}>Res. Per.</Text>
              )}
            </View>
            <View style={[styles.tableCell, {flex: 0.6}]}>
              <Text style={{textAlign: 'center'}}>Cons. Days</Text>
            </View>
            {!this.state.showBehaviourRecordingInput && (
              <View style={[styles.tableCell, {flex: 0.6}]}>
                <Text style={{textAlign: 'center'}}>Min. Trail</Text>
              </View>
            )}
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
                        this.state.resPercentData[condition?.responseType]
                          ?.label
                      }
                      {condition?.responseTypeValue}
                    </Text>
                  </View>
                  <View style={[styles.tableCell, {flex: 0.6}]}>
                    <Text style={{textAlign: 'center'}}>
                      {condition?.cumConsecutiveDays}
                    </Text>
                  </View>
                  {!this.state.showBehaviourRecordingInput && (
                    <View style={[styles.tableCell, {flex: 0.6}]}>
                      <Text style={{textAlign: 'center'}}>
                        {condition?.minTrails}
                      </Text>
                    </View>
                  )}
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
                    <TouchableOpacity onPress={() => this.editRow(index, 0)}>
                      <MaterialCommunityIcons
                        name="pencil-outline"
                        size={18}
                        color={Color.primary}
                        onPress={() => this.editRow(index, 0)}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.deleteRow(index, 0)}>
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

        {this.state.isPeakEqu === true && (
          <View style={{marginTop: 10}}>
            <View
              style={{flexDirection: 'row', height: 42, alignItems: 'center'}}>
              <Text style={{fontSize: 18, fontWeight: '500', color: '#63686E'}}>
                Class
              </Text>
              <Text style={{textAlign: 'left', color: 'red'}}>
                {this.state.sdError}
              </Text>
              <View
                style={{flex: 0, width: 120, position: 'absolute', right: 0}}>
                <Button
                  theme="secondary"
                  style={{height: 42}}
                  labelButton="Add"
                  onPress={() => {
                    let allSDClass = this.state.allSDClass;
                    let abc = (this.state.maxSD = 2
                      ? {
                          Stimulus1: this.state.stimulus1,
                          Stimulus2: this.state.stimulus2,
                        }
                      : {
                          Stimulus1: this.state.stimulus1,
                          Stimulus2: this.state.stimulus2,
                          Stimulus3: this.state.stimulus3,
                        });

                    // console.log("allSD", allSd.length)
                    if (allSDClass.length > 0) {
                      console.log('allSD', allSDClass.length);
                      let lastIndex = allSDClass.length - 1;
                      let lastsd = allSDClass[lastIndex];
                      if (
                        lastsd?.Stimulus1?.length > 0 &&
                        lastsd?.Stimulus2?.length > 0
                      ) {
                        allSDClass.push(abc);
                        this.setState({allSDClass});
                      } else {
                        Alert.alert(
                          'Fill Stimulus',
                          'Please Fill above stimulus',
                        );
                      }
                    } else {
                      allSDClass.push(abc);
                      this.setState({allSDClass});
                    }
                  }}
                />
              </View>
            </View>
            {this.state.allSDClass.map((item, key) => {
              return (
                <View key={key} style={styles.profile}>
                  <Button
                    theme="danger"
                    style={{
                      height: 20,
                      position: 'absolute',
                      right: 10,
                      top: 5,
                    }}
                    labelButton={
                      <MaterialCommunityIcons
                        name="minus"
                        size={20}
                        color={Color.danger}
                      />
                    }
                    onPress={() => {
                      let allSDClass = this.state.allSDClass;
                      allSDClass.splice(key, 1);
                      this.setState({allSDClass});
                    }}
                  />
                  <View style={{width: '100%', marginTop: 20}}>
                    {item.sdError != '' && (
                      <Text style={{color: Color.danger}}>{item.sdError}</Text>
                    )}
                  </View>
                  {sd.length > 0 && selectedSdKey == key && (
                    <View style={{backgroundColor: '#EEE', borderRadius: 10}}>
                      {sd.map((sd) => (
                        <TouchableOpacity
                          style={{padding: 10}}
                          onPress={() => this.handleSdClick(sd, key)}>
                          <Text>{sd.name}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                  <View style={{marginTop: -35, width: '100%'}}>
                    <Text
                      style={{
                        textAlign: 'left',
                        color: 'red',
                      }}>
                      {this.state.selectedMasteryError}
                    </Text>
                    <Text
                      style={{
                        paddingLeft: 5,
                        textAlign: 'left',
                        color: 'grey',
                      }}>
                      {getStr('TargetAllocate.Stimulus')} 1
                    </Text>
                    <LegacyTextInput
                      label={`${getStr('TargetAllocate.Stimulus')} 1`}
                      style={Styles.input}
                      multiline={true}
                      value={item.Stimulus1}
                      onChangeText={(itemValue, itemIndex) => {
                        let allSDClass = this.state.allSDClass;
                        allSDClass[key].Stimulus1 = itemValue;
                        this.setState({
                          allSDClass: allSDClass,
                        });
                      }}
                    />
                  </View>
                  <View style={{marginTop: -15, width: '100%'}}>
                    <Text
                      style={{
                        textAlign: 'left',
                        color: 'red',
                      }}>
                      {this.state.selectedStatusError}
                    </Text>
                    <Text
                      style={{
                        paddingLeft: 5,
                        textAlign: 'left',
                        color: 'grey',
                      }}>
                      {getStr('TargetAllocate.Stimulus')} 2
                    </Text>
                    <LegacyTextInput
                      label={`${getStr('TargetAllocate.Stimulus')} 2`}
                      style={Styles.input}
                      multiline={true}
                      value={item.Stimulus2}
                      onChangeText={(itemValue, itemIndex) => {
                        let allSDClass = this.state.allSDClass;
                        allSDClass[key].Stimulus2 = itemValue;
                        this.setState({
                          allSDClass: allSDClass,
                        });
                      }}
                    />
                  </View>
                  {this.state.maxSD > 2 && (
                    <View style={{marginTop: -15, width: '100%'}}>
                      <Text
                        style={{
                          textAlign: 'left',
                          color: 'red',
                        }}>
                        {this.state.selectedStatusError}
                      </Text>
                      <Text
                        style={{
                          paddingLeft: 5,
                          textAlign: 'left',
                          color: 'grey',
                        }}>
                        {getStr('TargetAllocate.Stimulus')} 3
                      </Text>
                      <LegacyTextInput
                        label={`${getStr('TargetAllocate.Stimulus')} 3`}
                        style={Styles.input}
                        multiline={true}
                        value={item.Stimulus3}
                        onChangeText={(itemValue, itemIndex) => {
                          let allSDClass = this.state.allSDClass;
                          allSDClass[key].Stimulus3 = itemValue;
                          this.setState({
                            allSDClass: allSDClass,
                          });
                        }}
                      />
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        )}

        {/*// STEPSSSSS*/}

        


        {this.state.allSd.length == 0 &&
          this.state.isPeakEqu === false &&
          this.state.showSteps &&  (
            <View>
              <Text style={{fontSize: 14, fontWeight: '500', color: Color.red}}>
                {this.state.stepErr}
              </Text>
              {store.getState().user.userType.name != 'parents' && (
                <View
                  style={{
                    flexDirection: 'row',
                    height: 42,
                    alignItems: 'center',
                    marginTop: 10,
                  }}>
                  <Text
                    style={{fontSize: 14, fontWeight: '500', color: '#63686E'}}>
                    {getStr('TargetAllocate.Steps')}
                  </Text>
                  <Text style={{textAlign: 'left', color: 'red'}}>
                    {this.state.sdError}
                  </Text>
                 {!this.state.showBehaviourReductionInput && <View
                    style={{
                      flex: 0,
                      width: 120,
                      position: 'absolute',
                      right: 0,
                    }}>
                    <Button
                      theme="secondary"
                      style={{height: 42}}
                      labelButton="Add"
                      onPress={() => {
                        let allSteps = this.state.allSteps;
                        allSteps.push({
                          step: '',
                          mastery: '',
                          status: '',
                          masteryConditions: [],
                          stepsFiles: [],
                          prompts: [],
                          behPrompts: [],
                        });
                        this.setState({allSteps});
                      }}
                    />
                  </View>}
                </View>
              )}
            {this.state.showBehaviourReductionInput && this.state.sbtStep.map((item,key)=>{
              // console.log("sbt step>>",item.status,sbtStatus);
              let description=item.step
              return <View key={key} style={{...styles.profile,paddingTop:0}}>
              {/* <Button
                theme="danger"
                style={{
                  height: 30,
                  position: 'absolute',
                  right: 10,
                  top: 5,
                }}
                labelButton={
                  <MaterialCommunityIcons
                    name="minus"
                    size={30}
                    color={Color.danger}
                  />
                }
                onPress={() => {
                  let allSteps = this.state.allSteps;
                  // allSteps.splice(key, 1);
                  this.setState({allSteps});
                }}
              /> */}
             <View style={{width: '100%', marginTop: 3}}>
                {item.sdError != '' && (
                  <Text style={{color: Color.danger}}>{item.sdError}</Text>
                )}
                <Text style={styles.sectionTitle}>Step {key+1}</Text>
                <View
                  style={{
                    flexDirection: 'row',
                    borderWidth: 1,
                    height: 50,
                    borderColor: '#DDD',
                    marginTop: 5,
                    borderRadius: 5,
                    alignItems: 'center',
                  }}>
                  <View style={{marginLeft: 10}}>
                    <MaterialCommunityIcons name="magnify" size={24} />
                  </View>
                  <LegacyTextInput
                    defaultValue={item.step}
                    // value={description}
                    style={{flex: 1}}
                    onChangeText={(text) =>{
                      console.log("text>>>",text);
                      //this.handleChangeSteps(text, key)
                      let sbtStep = this.state.sbtStep;
                        sbtStep[key].step = text;
                      
                    }}
                  />
                </View>
                <View style={{flex:1,width:'100%',flexDirection:'row'}}><TouchableOpacity
                onPress={() => {
                  this.setState({
                    showStep:this.state.showStepId === item.id?!this.state.showStep:true,
                    showStepId:item.id
                  })
                  // this.moveSBTstepTo('next');
                }}>
                  <View style={{flexDirection:'row'}}> 
                <Text style={styles.arrowButton}>
                 {this.state.showStep && this.state.showStepId === item.id ? <FontAwesome5
                    name={'chevron-down'}
                    style={styles.arrowButtonText}
                  /> : <FontAwesome5
                  name={'chevron-right'}
                  style={styles.arrowButtonText}
                />}                
                </Text>
                <Text style={{marginTop:5}}>Show More</Text>
                </View>
              </TouchableOpacity>
              </View>
               
              {this.state.showStep && item.id === this.state.showStepId &&  
              <><View style={{width: '100%'}}>
                    <MultiPickerModal
                      label="Prompt"
                      data={stepPrompts}
                      
                      // defaultValue={item.reinforce}
                      value={
                        this.state.showBehaviourReductionInput
                          ? item.reinforce
                          : item.prompts
                      }
                      onSelect={(prompts) => {
                        console.log('selected prompts', prompts);
                        // this.setState({selPrompts});
                        let sbtStep = this.state.sbtStep;
                        if (this.state.showBehaviourReductionInput && prompts.length>0) {
                          sbtStep[key].reinforce = prompts;
                        } 
                        // else {
                        //   this.setState({
                        //     selectedStatusError:'Reinforce is required'
                        //   })
                        // }
                        this.setState({sbtStep: sbtStep});
                      }}
                    />
                  </View>
                  <View style={{marginTop: -15, width: '100%'}}>
                    <Text style={{textAlign: 'left', color: 'red'}}>
                      {this.state.showStepId===item.id  && this.state.selectedStatusError}
                    </Text>
                    <PickerModal
                      label="Target Status"
                      iconLeft="folder-open"
                      selectedValue={
                        item.status
                         
                      }
                      data={sbtStatus}
                      onValueChange={(itemValue, itemIndex) => {
                        let sbtStep = this.state.sbtStep;
                        sbtStep[key].status = itemValue;
                        this.setState({
                          sbtStep,
                        });
                      }}
                    />
                  </View>

                  {item.masteryConditions.length > 0 && (
                    <View style={{width: '100%', flexDirection: 'row'}}>
                      <View style={styles.tableCell}>
                        <Text style={{textAlign: 'center'}}>From Status</Text>
                      </View>
                      <View style={styles.tableCell}>
                        <Text style={{textAlign: 'center'}}>To Status</Text>
                      </View>
                      <View style={[styles.tableCell, {flex: 0.6}]}>
                        {this.state.showBehaviourRecordingInput ? (
                          <Text style={{textAlign: 'center'}}>Duration</Text>
                        ) : this.state.showBehaviourReductionInput ? (
                          <Text style={{textAlign: 'center'}}>
                            Prob. Behavior
                          </Text>
                        ) : (
                          <Text style={{textAlign: 'center'}}>Res. Per.</Text>
                        )}
                      </View>
                      <View style={[styles.tableCell, {flex: 0.6}]}>
                        <Text style={{textAlign: 'center'}}>Cons. Days</Text>
                      </View>
                      {!this.state.showBehaviourRecordingInput && (
                        <View style={[styles.tableCell, {flex: 0.6}]}>
                          <Text style={{textAlign: 'center'}}>Min. Trail</Text>
                        </View>
                      )}
                      <View style={[styles.tableCell, {flex: 0.6}]}>
                        <Text style={{textAlign: 'center'}}>Actions</Text>
                      </View>
                    </View>
                  )}

                  {item.masteryConditions.length > 0 &&

                   item.masteryConditions.map(
                      (condition, index) => {
                          return <>
                            <View style={{width: '100%', flexDirection: 'row'}}>
                              <View style={styles.tableCell}>
                                <Text style={{textAlign: 'center'}}>
                                  {
                                    condition.fromStatus?.statusName
                                  }
                                </Text>
                              </View>
                              <View style={styles.tableCell}>
                                <Text style={{textAlign: 'center'}}>
                                  {condition?.toStatus?.statusName}
                                </Text>
                              </View>
                              <View style={[styles.tableCell, {flex: 0.6}]}>
                                <Text style={{textAlign: 'center'}}>
                                  {'>='}
                                  {condition?.noOfProblemBehavior}
                                </Text>
                              </View>
                              <View style={[styles.tableCell, {flex: 0.6}]}>
                                <Text style={{textAlign: 'center'}}>
                                  {condition?.consecutiveDays}
                                </Text>
                              </View>
                              {!this.state.showBehaviourRecordingInput && (
                                <View style={[styles.tableCell, {flex: 0.6}]}>
                                  <Text style={{textAlign: 'center'}}>
                                    {condition?.minTrial}
                                  </Text>
                                </View>
                              )}
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
                                  onPress={() => this.editRow(index, 1, key)}>
                                  <MaterialCommunityIcons
                                    name="pencil-outline"
                                    size={18}
                                    color={Color.primary}
                                    onPress={() => this.editRow(index, 1, key)}
                                  />
                                </TouchableOpacity>
                                <TouchableOpacity
                                  onPress={() => this.deleteRow(index, 1, key)}>
                                  <MaterialCommunityIcons
                                    name="delete-outline"
                                    size={18}
                                    color={Color.red}
                                    onPress={() =>
                                      this.deleteRow(index, 1, key)
                                    }
                                  />
                                </TouchableOpacity>
                              </View>
                            </View>
                          </>
                   })
                  }

                 
</>
                  
                  }

              </View>
              </View>
            })}
              {this.state.allSteps.map((item, key) => {
                return (
                  <View key={key} style={styles.profile}>
                    <Button
                      theme="danger"
                      style={{
                        height: 30,
                        position: 'absolute',
                        right: 10,
                        top: 5,
                      }}
                      labelButton={
                        <MaterialCommunityIcons
                          name="minus"
                          size={30}
                          color={Color.danger}
                        />
                      }
                      onPress={() => {
                        let allSteps = this.state.allSteps;
                        allSteps.splice(key, 1);
                        this.setState({allSteps});
                      }}
                    />
                    <View style={{width: '100%', marginTop: 20}}>
                      {item.sdError != '' && (
                        <Text style={{color: Color.danger}}>
                          {item.sdError}
                        </Text>
                      )}
                      <Text style={styles.sectionTitle}>Steps</Text>
                      <View
                        style={{
                          flexDirection: 'row',
                          borderWidth: 1,
                          height: 50,
                          borderColor: '#DDD',
                          marginTop: 5,
                          borderRadius: 5,
                          alignItems: 'center',
                        }}>
                        <View style={{marginLeft: 10}}>
                          <MaterialCommunityIcons name="magnify" size={24} />
                        </View>
                        <TextInput
                          value={item.steps}
                          style={{
                            width: 290,
                            height: 50,
                            position: 'relative',
                            top: 4,
                            borderWidth: 0,
                          }}
                          onChangeText={(text) =>
                            this.handleChangeSteps(text, key)
                          }
                        />
                      </View>
                    </View>
                    {/* {steps.length > 0 && selectedStepKey == key && (
                      <View style={{backgroundColor: '#EEE', borderRadius: 10}}>
                        {steps.map((step) => (
                          <TouchableOpacity
                            style={{padding: 10}}
                            onPress={() => this.handleStepClick(step, key)}>
                            <Text>{step.name}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )} */}
                    <View style={{marginTop: -15, width: '100%'}}>
                      <Text
                        style={{
                          textAlign: 'left',
                          color: 'red',
                        }}>
                        {this.state.selectedMasteryError}
                      </Text>
                      <View style={{width: '100%'}}>
                        <MultiPickerModal
                          label="Prompt"
                          data={stepPrompts}
                          value={
                            this.state.showBehaviourReductionInput
                              ? item.behPrompts
                              : item.prompts
                          }
                          onSelect={(prompts) => {
                            console.log('selected prompts', prompts);
                            // this.setState({selPrompts});
                            let allSteps = this.state.allSteps;
                            if (this.state.showBehaviourReductionInput) {
                              allSteps[key].behPrompts = prompts;
                            } else {
                              allSteps[key].prompts = prompts;
                            }
                            this.setState({allSteps: allSteps});
                          }}
                        />
                      </View>

                      {!this.state.showBehaviourReductionInput &&
                        !this.state.showBehaviourRecordingInput && (
                          <PickerModal
                            label={getStr('TargetAllocate.MasteryCriteria')}
                            iconLeft="folder-open"
                            selectedValue={
                              selectedMastery
                                ? selectedMastery
                                : masteryData[0]?.id
                            }
                            data={masteryData}
                            onValueChange={(itemValue, itemIndex) => {
                              let allSteps = this.state.allSteps;
                              allSteps[key].mastery = itemValue;
                              this.setState({
                                allSteps: allSteps,
                              });
                            }}
                            onAdded={() =>
                              this.setState({
                                showmanualModal: true,
                                cardType: 1,
                                cardIndex: key,
                              })
                            }
                          />
                        )}

                      {this.state.showBehaviourReductionInput && (
                        <TouchableOpacity
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderWidth: 0.8,
                            borderColor: Color.gray,
                            paddingVertical: 5,
                            marginVertical: 7,
                            borderRadius: 5,
                            width: '100%',
                          }}
                          onPress={() =>
                            this.setState({
                              showmanualModal: true,
                              cardType: 1,
                              cardIndex: key,
                            })
                          }>
                          <MaterialCommunityIcons
                            name="plus"
                            size={20}
                            color={Color.primary}
                          />
                          <Text style={{color: Color.primary}}>
                            Add Behaviour Reduction Mastery
                          </Text>
                        </TouchableOpacity>
                      )}

                      {this.state.showBehaviourRecordingInput && (
                        <TouchableOpacity
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderWidth: 0.8,
                            borderColor: Color.gray,
                            paddingVertical: 5,
                            marginVertical: 7,
                            borderRadius: 5,
                            width: '100%',
                          }}
                          onPress={() =>
                            this.setState({
                              showmanualModal: true,
                              cardType: 1,
                              cardIndex: key,
                            })
                          }>
                          <MaterialCommunityIcons
                            name="plus"
                            size={20}
                            color={Color.primary}
                          />
                          <Text style={{color: Color.primary}}>
                            Add Behaviour Recording Mastery
                          </Text>
                        </TouchableOpacity>
                      )}

                      {this.state.allSteps[key].masteryConditions.length >
                        0 && (
                        <View style={{width: '100%', flexDirection: 'row'}}>
                          <View style={styles.tableCell}>
                            <Text style={{textAlign: 'center'}}>
                              From Status
                            </Text>
                          </View>
                          <View style={styles.tableCell}>
                            <Text style={{textAlign: 'center'}}>To Status</Text>
                          </View>
                          <View style={[styles.tableCell, {flex: 0.6}]}>
                            {this.state.showBehaviourRecordingInput ? (
                              <Text style={{textAlign: 'center'}}>
                                Duration
                              </Text>
                            ) : this.state.showBehaviourReductionInput ? (
                              <Text style={{textAlign: 'center'}}>
                                Prob. Behavior
                              </Text>
                            ) : (
                              <Text style={{textAlign: 'center'}}>
                                Res. Per.
                              </Text>
                            )}
                          </View>
                          <View style={[styles.tableCell, {flex: 0.6}]}>
                            <Text style={{textAlign: 'center'}}>
                              Cons. Days
                            </Text>
                          </View>
                          {!this.state.showBehaviourRecordingInput && (
                            <View style={[styles.tableCell, {flex: 0.6}]}>
                              <Text style={{textAlign: 'center'}}>
                                Min. Trail
                              </Text>
                            </View>
                          )}
                          <View style={[styles.tableCell, {flex: 0.6}]}>
                            <Text style={{textAlign: 'center'}}>Actions</Text>
                          </View>
                        </View>
                      )}

                      {this.state.allSteps[key]?.masteryConditions.length > 0 &&
                        this.state.allSteps[key]?.masteryConditions.map(
                          (condition, index) => {
                            return (
                              <>
                                <View
                                  style={{width: '100%', flexDirection: 'row'}}>
                                  <View style={styles.tableCell}>
                                    <Text style={{textAlign: 'center'}}>
                                      {
                                        targetStatusData[condition.FromStatus]
                                          ?.label
                                      }
                                    </Text>
                                  </View>
                                  <View style={styles.tableCell}>
                                    <Text style={{textAlign: 'center'}}>
                                      {
                                        targetStatusData[condition?.toStatus]
                                          ?.label
                                      }
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
                                  {!this.state.showBehaviourRecordingInput && (
                                    <View
                                      style={[styles.tableCell, {flex: 0.6}]}>
                                      <Text style={{textAlign: 'center'}}>
                                        {condition?.minTrails}
                                      </Text>
                                    </View>
                                  )}
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
                                      onPress={() =>
                                        this.editRow(index, 1, key)
                                      }>
                                      <MaterialCommunityIcons
                                        name="pencil-outline"
                                        size={18}
                                        color={Color.primary}
                                        onPress={() =>
                                          this.editRow(index, 1, key)
                                        }
                                      />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                      onPress={() =>
                                        this.deleteRow(index, 1, key)
                                      }>
                                      <MaterialCommunityIcons
                                        name="delete-outline"
                                        size={18}
                                        color={Color.red}
                                        onPress={() =>
                                          this.deleteRow(index, 1, key)
                                        }
                                      />
                                    </TouchableOpacity>
                                  </View>
                                </View>
                              </>
                            );
                          },
                        )}
                    </View>
                    <View style={{marginTop: -15, width: '100%'}}>
                      <Text
                        style={{
                          textAlign: 'left',
                          color: 'red',
                        }}>
                        {this.state.selectedStatusError}
                      </Text>
                      <PickerModal
                        label={getStr('TargetAllocate.TargetStatus')}
                        iconLeft="folder-open"
                        selectedValue={
                          selectedStatus
                            ? selectedStatus
                            : targetStatusParent[0]?.id
                        }
                        data={
                          store.getState().user.userType.name != 'parents'
                            ? targetStatusData
                            : targetStatusParent
                        }
                        onValueChange={(itemValue, itemIndex) => {
                          let allSteps = this.state.allSteps;
                          allSteps[key].status = itemValue;
                          this.setState({
                            allSteps: allSteps,
                          });
                        }}
                      />
                    </View>
                    <Text style={{alignSelf: 'flex-start'}}>Attachments</Text>
                    <TouchableOpacity
                      onPress={() => this.selectFile(1, key)}
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
                        Support for a single or bulk upload. Strictly prohibit
                        from uploading company data or other band files
                      </Text>
                    </TouchableOpacity>
                    {this.state.allSteps[key]?.stepsFiles.length > 0 &&
                      this.state.allSteps[key]?.stepsFiles.map(
                        (file, index) => {
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
                                width: '100%',
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
                                  onPress={() => this.manageFile('v', index, 0)}
                                />
                                <MaterialCommunityIcons
                                  name="delete-outline"
                                  size={20}
                                  color={Color.red}
                                  onPress={() => this.manageFile('d', index, 0)}
                                />
                              </View>
                            </View>
                          );
                        },
                      )}
                  </View>
                );
              })}
            </View>
          )}
        {this.state.allSteps.length == 0 &&
          this.state.isPeakEqu === false &&
          this.state.showStimulus && (
            <View style={{marginTop: 10}}>
                <Text style={{textAlign: 'left', color: 'red', marginBottom: 3}}>
                  {this.state.isPeak ? this.state.peakSdErr :this.state.sdError}
                </Text>
              {store.getState().user.userType.name != 'parents' && (
                <View
                  style={{
                    flexDirection: 'row',
                    height: 42,
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{fontSize: 14, fontWeight: '500', color: '#63686E'}}>
                    {getStr('TargetAllocate.Stimulus')}
                  </Text>
                  <View
                    style={{
                      flex: 0,
                      width: 120,
                      position: 'absolute',
                      right: 0,
                    }}>
                    <Button
                      theme="secondary"
                      style={{height: 42}}
                      labelButton="Add"
                      onPress={() => {
                        let allSd = this.state.allSd;
                        allSd.push({
                          sd: '',
                          mastery: '',
                          status: '',
                          masteryConditions: [],
                          sdFiles: [],
                          prompts: [],
                        });
                        this.setState({allSd});
                      }}
                    />
                  </View>
                </View>
              )}
              {this.state.allSd.map((item, key) => {
                return (
                  <View key={key} style={styles.profile}>
                    <Button
                      theme="danger"
                      style={{
                        height: 30,
                        position: 'absolute',
                        right: 10,
                        top: 5,
                      }}
                      labelButton={
                        <MaterialCommunityIcons
                          name="minus"
                          size={30}
                          color={Color.danger}
                        />
                      }
                      onPress={() => {
                        let allSd = this.state.allSd;
                        allSd.splice(key, 1);
                        this.setState({allSd});
                      }}
                    />
                    <View style={{width: '100%', marginTop: 20}}>
                      {item.sdError != '' && (
                        <Text style={{color: Color.danger}}>
                          {item.sdError}
                        </Text>
                      )}
                      <Text style={styles.sectionTitle}>
                        {getStr('TargetAllocate.Stimulus')}
                      </Text>
                      <View
                        style={{
                          flexDirection: 'row',
                          borderWidth: 1,
                          height: 50,
                          borderColor: '#DDD',
                          marginTop: 5,
                          borderRadius: 5,
                          alignItems: 'center',
                        }}>
                        <View style={{marginLeft: 10}}>
                          <MaterialCommunityIcons name="magnify" size={24} />
                        </View>
                        {/*<Text style={{ marginRight:5 }}>{item.sd}</Text>*/}
                        <LegacyTextInput
                          editable={this.state.isSd}
                          value={item.sd}
                          style={{flex: 1}}
                          onChangeText={(text) =>
                            this.handleChangeSd(text, key)
                          }
                        />
                      </View>
                    </View>
                    {/* {sd.length > 0 && selectedSdKey == key && (
                      <View style={{backgroundColor: '#EEE', borderRadius: 10}}>
                        {sd.map((sd) => (
                          <TouchableOpacity
                            style={{padding: 10}}
                            onPress={() => this.handleSdClick(sd, key)}>
                            <Text>{sd.name}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )} */}
                    <View style={{width: '100%'}}>
                      <MultiPickerModal
                        label="Prompt"
                        data={this.state.sdPrompts}
                        value={item.prompts}
                        onSelect={(prompts) => {
                          console.log('selected prompts', prompts);
                          // this.setState({selPrompts});
                          let allSd = this.state.allSd;
                          allSd[key].prompts = prompts;
                          this.setState({allSd: allSd});
                        }}
                      />
                    </View>
                    {!this.state.showBehaviourRecordingInput &&
                      !this.state.showBehaviourReductionInput && (
                        <View style={{marginTop: -15, width: '100%'}}>
                          <Text style={{textAlign: 'left', color: 'red'}}>
                            {this.state.selectedMasteryError}
                          </Text>

                          <PickerModal
                            label={getStr('TargetAllocate.MasteryCriteria')}
                            iconLeft="folder-open"
                            selectedValue={
                              item.mastery ? item.mastery : masteryData[0]?.id
                            }
                            data={masteryData}
                            onValueChange={(itemValue, itemIndex) => {
                              let allSd = this.state.allSd;
                              allSd[key].mastery = itemValue;
                              this.setState({
                                allSd: allSd,
                              });
                            }}
                            onAdded={() =>
                              this.setState({
                                showmanualModal: true,
                                cardType: 2,
                                cardIndex: key,
                              })
                            }
                          />
                        </View>
                      )}
                    {/* {this.state.showBehaviourReductionInput && (
                      <TouchableOpacity
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderWidth: 0.8,
                          borderColor: Color.gray,
                          marginVertical: 7,
                          borderRadius: 5,
                          paddingVertical: 5,
                          width: '100%',
                        }}
                        onPress={() =>
                          this.setState({
                            showmanualModal: true,
                            cardType: 2,
                            cardIndex: key,
                          })
                        }>
                        <MaterialCommunityIcons
                          name="plus"
                          size={20}
                          color={Color.primary}
                        />
                        <Text style={{color: Color.primary}}>
                          Add Behaviour Reduction Mastery
                        </Text>
                      </TouchableOpacity>
                    )} */}

                    {this.state.showBehaviourRecordingInput && (
                      <TouchableOpacity
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderWidth: 0.8,
                          borderColor: Color.gray,
                          marginVertical: 7,
                          borderRadius: 5,
                          paddingVertical: 5,
                          width: '100%',
                        }}
                        onPress={() =>
                          this.setState({
                            showmanualModal: true,
                            cardType: 2,
                            cardIndex: key,
                          })
                        }>
                        <MaterialCommunityIcons
                          name="plus"
                          size={20}
                          color={Color.primary}
                        />
                        <Text style={{color: Color.primary}}>
                          Add Behaviour Recording Mastery
                        </Text>
                      </TouchableOpacity>
                    )}


                    {this.state.allSd[key].masteryConditions.length > 0 && (
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
                        {!this.state.showBehaviourRecordingInput && (
                          <View style={[styles.tableCell, {flex: 0.6}]}>
                            <Text style={{textAlign: 'center'}}>
                              Min. Trail
                            </Text>
                          </View>
                        )}
                        <View style={[styles.tableCell, {flex: 0.6}]}>
                          <Text style={{textAlign: 'center'}}>Actions</Text>
                        </View>
                      </View>
                    )}

                    {this.state.allSd[key]?.masteryConditions.length > 0 &&
                      this.state.allSd[key]?.masteryConditions.map(
                        (condition, index) => {
                          return (
                            <>
                              <View
                                style={{width: '100%', flexDirection: 'row'}}>
                                <View style={styles.tableCell}>
                                  <Text style={{textAlign: 'center'}}>
                                    {
                                      targetStatusData[condition.FromStatus]
                                        ?.label
                                    }
                                  </Text>
                                </View>
                                <View style={styles.tableCell}>
                                  <Text style={{textAlign: 'center'}}>
                                    {
                                      targetStatusData[condition?.toStatus]
                                        ?.label
                                    }
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
                                {!this.state.showBehaviourRecordingInput && (
                                  <View style={[styles.tableCell, {flex: 0.6}]}>
                                    <Text style={{textAlign: 'center'}}>
                                      {condition?.minTrails}
                                    </Text>
                                  </View>
                                )}
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
                                    onPress={() => this.editRow(index, 2, key)}>
                                    <MaterialCommunityIcons
                                      name="pencil-outline"
                                      size={18}
                                      color={Color.primary}
                                      onPress={() =>
                                        this.editRow(index, 2, key)
                                      }
                                    />
                                  </TouchableOpacity>
                                  <TouchableOpacity
                                    onPress={() =>
                                      this.deleteRow(index, 2, key)
                                    }>
                                    <MaterialCommunityIcons
                                      name="delete-outline"
                                      size={18}
                                      color={Color.red}
                                      onPress={() =>
                                        this.deleteRow(index, 2, key)
                                      }
                                    />
                                  </TouchableOpacity>
                                </View>
                              </View>
                            </>
                          );
                        },
                      )}

                    <View style={{marginTop: -15, width: '100%'}}>
                      <Text style={{textAlign: 'left', color: 'red'}}>
                        {this.state.selectedStatusError}
                      </Text>
                      <PickerModal
                        label={getStr('TargetAllocate.TargetStatus')}
                        iconLeft="folder-open"
                        selectedValue={
                          item.status ? item.status : targetStatusData[0]?.id
                        }
                        data={
                          store.getState().user.userType.name != 'parents'
                            ? targetStatusData
                            : targetStatusParent
                        }
                        onValueChange={(itemValue, itemIndex) => {
                          let allSd = this.state.allSd;
                          allSd[key].status = itemValue;
                          this.setState({
                            allSd: allSd,
                          });
                        }}
                      />
                    </View>
                    <Text style={{alignSelf: 'flex-start'}}>Attachments</Text>
                    <TouchableOpacity
                      onPress={() => this.selectFile(2, key)}
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
                        Support for a single or bulk upload. Strictly prohibit
                        from uploading company data or other band files
                      </Text>
                    </TouchableOpacity>

                    {this.state.allSd[key]?.sdFiles.length > 0 &&
                      this.state.allSd[key]?.sdFiles.map((file, index) => {
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
                              width: '100%',
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
                  </View>
                );
              })}
            </View>
          )}

        <TextInput
          label={getStr('TargetAllocate.TargetVideoLink')}
          error={targetVideoLinkError}
          multiline={true}
          placeholder={getStr('TargetAllocate.TargetVideoLink')}
          defaultValue={targetVideoLink}
          onChangeText={(targetVideoLink) => this.setState({targetVideoLink})}
        />

        <Text>Attachments</Text>
        <TouchableOpacity
          onPress={() => this.selectFile(0)}
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
          <Text style={{color: Color.gray, fontSize: 12, textAlign: 'center'}}>
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
      </>
    );
  }

  renderInput2() {
    let {
      objective,
      targetInstr,
      goodPractices,
      gernalizationCriteria,
    } = this.state;
    return (
      <>
        <Text style={styles.sectionTitle}>
          {getStr('TargetAllocate.TargetInstruction')}
          <Text style={{textAlign: 'left', color: 'red'}}>
            {this.state.targetInstrError}
          </Text>
        </Text>

        <RichEditor
          ref={(r) => (this.richText = r)}
          initialContentHTML={targetInstr}
          style={styles.richEditor}
          onChange={(targetInstr) => {
            this.setState({targetInstr});
          }}
          editorStyle={{
            cssText: 'body{font-size: 13px}',
          }}
        />

        <CheckBox
          containerStyle={{
            margin: 0,
            borderWidth: 0,
            backgroundColor: Color.white,
            marginBottom: 20,
          }}
          title={getStr('TargetAllocate.MakeValueDefault')}
          checkedColor={Color.primary}
          checked={this.state.makeValue}
          onPress={() => this.setState({makeValue: !this.state.makeValue})}
        />
      </>
    );
  }

  /*
	.########..########.##....##.########..########.########.
	.##.....##.##.......###...##.##.....##.##.......##.....##
	.##.....##.##.......####..##.##.....##.##.......##.....##
	.########..######...##.##.##.##.....##.######...########.
	.##...##...##.......##..####.##.....##.##.......##...##..
	.##....##..##.......##...###.##.....##.##.......##....##.
	.##.....##.########.##....##.########..########.##.....##
  */

  deleteRow = (index, cardType, cardIndex) => {
    const {manualMasteryConditions, allSteps, allSd,sbtStep} = this.state;

    if (cardType === 0) {
      manualMasteryConditions.splice(index, 1);
      this.setState({manualMasteryConditions: manualMasteryConditions});
    } else if (cardType === 1) {
      // allSteps[cardIndex].masteryConditions.splice(index, 1);
      // this.setState({allSteps: allSteps});
      sbtStep[cardIndex].masteryConditions.splice(index, 1);
      this.setState({sbtStep: sbtStep});
    } else {
      allSd[cardIndex].masteryConditions.splice(index, 1);
      this.setState({allSd: allSd});
    }
  };

  editRow = (index, cardType, cardIndex) => {
    const {
      manualMasteryConditions,
      allSteps,
      allSd,
      targetStatusData,
      consecutiveDaysData,
      sbtStep
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
      // this.setState({
      //   fromStatus:
      //     targetStatusData[
      //       allSteps[cardIndex].masteryConditions[index].FromStatus
      //     ].id,
      //   toStatus:
      //     targetStatusData[
      //       allSteps[cardIndex].masteryConditions[index].toStatus
      //     ].id,
      //   resPercent: allSteps[cardIndex].masteryConditions[index].responseType,
      //   resPerValue:
      //     allSteps[cardIndex].masteryConditions[index].responseTypeValue,
      //   selConsecutive:
      //     allSteps[cardIndex].masteryConditions[index].selDaysType,
      //   cumConsecutiveDays:
      //     allSteps[cardIndex].masteryConditions[index].cumConsecutiveDays,
      //   minTrial: allSteps[cardIndex].masteryConditions[index].minTrails,
      //   showmanualModal: true,
      //   isEdit: true,
      //   editIndex: index,
      //   cardType,
      // });
      const fdata=consecutiveDaysData.filter(i=>i.label===this.capitalizeFirstLetter(sbtStep[cardIndex].masteryConditions[index].masteryType))
      this.setState({
        fromStatus:sbtStep[cardIndex].masteryConditions[index].fromStatus?.id,
        toStatus:
        sbtStep[cardIndex].masteryConditions[index].toStatus?.id,
        resPercent:sbtStep[cardIndex].masteryConditions[index].lte === 100 ? 1 : sbtStep[cardIndex].masteryConditions[index].gte !== 0 ? 0 : 0,
        resPerValue:sbtStep[cardIndex].masteryConditions[index].noOfProblemBehavior,
        selConsecutive:fdata.length>0?fdata[0].id:2,
        cumConsecutiveDays:
        sbtStep[cardIndex].masteryConditions[index].consecutiveDays,
        minTrial: sbtStep[cardIndex].masteryConditions[index].minTrial,
        showmanualModal: true,
        isEdit: true,
        editIndex: index,
        cardType,
        cardIndex,
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

    if (!this.state.showBehaviourRecordingInput && minTrial === '') {
      this.setState({manualMinTrialErr: "Can't be Empty"});
      return false;
    }

    return true;
  };

  capitalizeFirstLetter=(string)=> {
    if (string) {
      string = string?.toLowerCase()
      return string.charAt(0).toUpperCase() + string.slice(1)
    }
    return ''
  }
  
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
      manualMinTrialErr,
      manualFromStatusErr,
      manualToStatusErr,
      manualConsecutiveDayErr,
      manualResPercentErr,
      showBehaviourReductionInput,
      showBehaviourRecordingInput,
      sbtStatus
    } = this.state;

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
                  minTrial: '',
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
                data={showBehaviourReductionInput ? sbtStatus : targetStatusData}
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
                data={showBehaviourReductionInput ? sbtStatus : targetStatusData}

                onValueChange={(itemValue, itemIndex) => {
                  this.setState({
                    toStatus: itemValue,
                    toStatuslabel: itemIndex,
                    manualToStatusErr: '',
                  });
                }}
              />

              <View style={{}}>
                {showBehaviourReductionInput ? (
                  <Text style={{marginBottom: -15}}>
                    No Of Problem Behaviour
                  </Text>
                ) : showBehaviourRecordingInput ? (
                  <Text style={{marginBottom: -15}}>Duration (in second)</Text>
                ) : (
                  <Text style={{marginBottom: -15}}>Response %</Text>
                )}
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
                      defaultValue={resPerValue?.toString()}
                      onChangeText={(resPerValue) =>
                        this.setState({resPerValue, manualResPercentErr: ''})
                      }
                    />
                  </View>
                </View>
              </View>

              <View style={{}}>
                <Text style={{marginBottom: -15}}> Days</Text>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <View style={{width: '45%'}}>
                    <PickerModal
                      label={''}
                      error={this.state.selectedStatusError}
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
                        selConsecutive == '1' ? '1' : cumConsecutiveDays.toString()
                      }
                      onChangeText={(cumConsecutiveDays) =>
                        this.setState({
                          cumConsecutiveDays,
                          manualConsecutiveDayErr: '',
                        })
                      }
                      editable={selConsecutive == '1' ? false : true}
                    />
                  </View>
                </View>
              </View>
              {!showBehaviourRecordingInput && (
                <View>
                  <Text style={{marginBottom: -15}}>Minimum Trails</Text>
                  <TextInput
                    label={''}
                    error={manualMinTrialErr}
                    multiline={true}
                    placeholder={'0'}
                    defaultValue={minTrial.toString()}
                    onChangeText={(minTrial) =>
                      this.setState({minTrial, manualMinTrialErr: ''})
                    }
                  />
                </View>
              )}
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
                        sbtStatus,
                        sbtStep
                      } = this.state;
                      let obj = {};
                      let obj2={}

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
                      obj.masteryType =
                        this.state.selConsecutive == '1'
                          ? 'Daily'
                          : this.state.selConsecutive == '0'
                          ? 'Cumulative'
                          : 'Consecutive';
                      obj.noOfProblemBehavior = this.state.resPerValue;
                      obj.duration = this.state.resPerValue;
                      if (this.state.cardType === 0) {
                        manualMasteryConditions[editIndex] = obj;

                        this.setState({
                          manualMasteryConditions: manualMasteryConditions,
                          showmanualModal: false,
                        });
                      } else if (this.state.cardType === 1) {
                        // allSteps[cardIndex].masteryConditions[editIndex] = obj;
                        // this.setState({
                        //   allSteps: allSteps,
                        //   showmanualModal: false,
                        // });
                        let fStatus=sbtStatus.filter(i=>i.id===this.state.fromStatus)
                        let tStatus=sbtStatus.filter(i=>i.id===this.state.toStatus)
                        obj2.minTrial=this.state.minTrial
                        obj2.fromStatus={
                          id:fStatus[0].id,
                          statusName:fStatus[0].label
                        }
                        obj2.toStatus={
                          id:tStatus[0].id,
                          statusName:tStatus[0].label
                        }
                        
                        obj2.consecutiveDays=this.state.cumConsecutiveDays
                        obj2.noOfProblemBehavior=this.state.resPerValue
                        obj2.masteryType =
                        this.state.selConsecutive == '1'
                          ? 'Daily'
                          : this.state.selConsecutive == '0'
                          ? 'Cumulative'
                          : 'Consecutive';
                        obj2.gte=this.state.resPerValue
                        obj2.lte=sbtStep[cardIndex].masteryConditions[editIndex].lte
                        sbtStep[cardIndex].masteryConditions[editIndex] = obj2;
                        this.setState({
                          sbtStep:sbtStep,
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
                        this.state.selConsecutive == '1'
                          ? 1
                          : this.state.cumConsecutiveDays;
                      obj.minTrails = this.state.minTrial;
                      obj.fromStatusId = this.state.fromStatus;
                      obj.toStatusId = this.state.toStatus;
                      obj.isDaily =
                        this.state.selConsecutive == '1' ? true : false;
                      obj.masteryType =
                        this.state.selConsecutive == '1'
                          ? 'Daily'
                          : this.state.selConsecutive == '0'
                          ? 'Cumulative'
                          : 'Consecutive';
                      obj.noOfProblemBehavior = this.state.resPerValue;
                      obj.duration = this.state.resPerValue;

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
                            minTrial: '',
                            cumConsecutiveDays: '',
                            fromStatus: '',
                            toStatus: '',
                            resPercent: '0',
                          });
                        } else if (this.state.cardType === 1) {
                          const allSteps = this.state.allSteps;
                          // allSteps[
                          //   this.state.cardIndex
                          // ]?.masteryConditions.push(obj);
                          sbtStep[
                            this.state.cardIndex
                          ]?.masteryConditions.push(obj2);
                          this.setState({
                            showmanualModal: false,
                            fromStatuslabel: '',
                            toStatuslabel: '',
                            resPerValue: '',
                            selConsecutive: '0',
                            minTrial: '',
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
                            minTrial: '',
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
                            minTrial: '',
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
                            minTrial: '',
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
                            minTrial: '',
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
    return (
      <SafeAreaView style={styles.container}>
        <NavigationHeader
          backPress={() => this.props.navigation.goBack()}
          title={getStr('TargetAllocate.NewTargetAllocateManual')}
        />

        {this.state.isLoading && <LoadingIndicator />}
        {!this.state.isLoading && (
          <>
            <Container enablePadding={this.props.disableNavigation != true}>
              {OrientationHelper.getDeviceOrientation() == 'portrait' && (
                <>
                  <ScrollView
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                    contentInsetAdjustmentBehavior="automatic">
                    {this.renderLernerModal()}
                    {this.renderInput1()}
                    {this.renderInput2()}
                  </ScrollView>
                  <Button
                    labelButton={getStr('TargetAllocate.AllocateTarget')}
                    style={{marginBottom: 10}}
                    isLoading={this.state.showLoading}
                    onPress={() => {
                      this.allocateTarget();
                      this.searchByFilter();
                    }}
                  />
                </>
              )}

              {OrientationHelper.getDeviceOrientation() == 'landscape' && (
                <Row style={{flex: 1}}>
                  <Column>
                    <ScrollView
                      keyboardShouldPersistTaps="handled"
                      showsVerticalScrollIndicator={false}
                      contentInsetAdjustmentBehavior="automatic">
                      {this.renderInput1()}
                    </ScrollView>
                  </Column>
                  <Column>
                    <ScrollView
                      keyboardShouldPersistTaps="handled"
                      showsVerticalScrollIndicator={false}
                      contentInsetAdjustmentBehavior="automatic">
                      {this.renderInput2()}
                    </ScrollView>
                    <Button
                      labelButton={getStr('TargetAllocate.AllocateTarget')}
                      style={{marginBottom: 10}}
                      isLoading={this.state.showLoading}
                      onPress={() => {
                        this.allocateTarget();
                        this.searchByFilter();
                      }}
                    />
                  </Column>
                </Row>
              )}
            </Container>
          </>
        )}
        {this.renderManualModal()}
        {this.state.showAttachmentModal && this.showAttachmentModal()}
        {this.state.showImageAttachmentModal && this.showImageAttachmentModal()}
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.white,
  },
  targetView: {
    marginTop: 10,
    marginBottom: 0,
  },
  targetViewImage: {
    width: '100%',
    height: 200,
    borderRadius: 5,
    marginBottom: 0,
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
  modal: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalInnerView: {
    backgroundColor: 'white',
    height: '50%',
    width: screenWidth - 100,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
    borderWidth: 1,
    borderColor: Color.white,
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
    fontSize: 15,
    fontWeight: 'normal',
    // color: '#fff'
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
  modalHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginLeft: 10,
    marginTop: 10,
  },
  text: {
    color: '#3f2949',
    marginTop: 10,
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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ManualTargetAllocationNew);
