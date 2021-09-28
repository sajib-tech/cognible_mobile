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
  ActivityIndicator,
  Modal,
  RefreshControl,
  Dimensions,
  TouchableOpacity,
  Alert,
  Platform,
  Switch,
} from 'react-native';
import RNFS from 'react-native-fs';
import RNFetchBlob from 'rn-fetch-blob';
import Pdf from 'react-native-pdf';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import RnModal from 'react-native-modal';
import FilePickerManager from 'react-native-file-picker';
import axios from 'axios';
import {CheckBox} from 'react-native-elements';
import {
  check,
  request,
  requestMultiple,
  checkMultiple,
  PERMISSIONS,
  RESULTS,
} from 'react-native-permissions';
import DocumentPicker from 'react-native-document-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import Styles from '../../../utility/Style.js';
import Color from '../../../utility/Color';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SearchInput, {createFilter} from 'react-native-search-filter';
import NavigationHeader from '../../../components/NavigationHeader.js';
import PickerModal from '../../../components/PickerModal';
import store from '../../../redux/store';
import {connect} from 'react-redux';
import {getAuthResult} from '../../../redux/reducers/index';
import {setToken, setTokenPayload} from '../../../redux/actions/index';
import NoData from '../../../components/NoData';
import moment from 'moment';
import ImageHelper from '../../../helpers/ImageHelper';
import {Row, Container, Column} from '../../../components/GridSystem';
import OrientationHelper from '../../../helpers/OrientationHelper';
import StudentDetail from './StudentDetail';
import {therapistGetLongTermGoals} from '../../../constants/therapist';
import TherapistRequest from '../../../constants/TherapistRequest';
import DateHelper from '../../../helpers/DateHelper';
import Button from '../../../components/Button.js';
import {RichEditor} from 'react-native-pell-rich-editor';
import GraphqlErrorProcessor from '../../../helpers/GraphqlErrorProcessor.js';
import TextInput from '../../../components/TextInput';
import LoadingIndicator from '../../../components/LoadingIndicator.js';
import {colors} from 'react-select/src/theme';
import MultiPickerModal from '../../../components/MultiPickerModal';

const width = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

class TargetAllocateNew extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      showLoading: false,
      shortTermGoalId: '',
      student: {},
      targetName: '',
      dailyTrials: 5,
      consecutiveDays: 25,
      masteryData: [],
      selectedMastery: '',
      objective: '',
      targetInstr: '',
      goodPractices: '',
      gernalizationCriteria: '',
      makeValue: false,
      targetNameError: '',
      dailyTrialsError: '',
      consecutiveDaysError: '',
      selectedMasteryError: '',
      objectiveError: '',
      targetInstrError: '',
      goodPracticesError: '',
      gernalizationCriteriaError: '',
      targetStatusData: [],
      selectedStatus: '',
      typesData: [],
      selectedType: '',
      selectedTypeError: '',
      selectedStatusError: '',
      targetVideoLink: '',
      targetVideoLinkError: '',
      isSd: true,
      isSteps: true,
      showSteps: false,
      showSd: false,
      steps: [],
      sd: [],
      stepValue: '',
      sdValue: '',
      student: {},
      selectedSteps: [],
      selectedSd: [],
      settingData: '',
      selectedFiles: [],
      showStep:false,
      showStepId:'',
      sbtStatus:[],

      instructionMode: 'text',
      isPeak: false,
      selectedPeakType: 'Direct',
      selectedPeakTypeError: '',
      peakTypes: [
        {id: 'Direct', label: 'DIRECT'},
        {id: 'Equivalence', label: 'EQUIVALENCE'},
        {id: 'Transformation', label: 'TRANSFORM'},
        {id: 'Generalization', label: 'GENERALIZATION'},
      ],
      selectectedPeakBlock: 1,
      allSd: [],
      allSteps: [],
      sbtStep:[],
      selectedSdKey: -1,
      selectedStepKey: -1,
      shortTermGoals: [],
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
        {
          id: 2,
          label: 'Consecutive',
          isEdit: true,
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
      stepsFiles: [],
      sdFiles: [],
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
      selectedDomainId: '',
      isPeak: false,
      peakSdErr: '',
    };
  }
  _refresh() {
    this.componentDidMount();
  }
  componentDidMount() {
    console.log('props targetallocatenew 118', this.props);

    let student = this.props.route.params.student;
    let program = this.props.route.params.program;
    let target = this.props.route.params.target;
    console.log('Target:', target);

    let shortTermGoalId = this.props.route.params.shortTermGoalId;

    this.setState({
      student: student,
      program: program,
      shortTermGoalId: shortTermGoalId,
      targetName: target.node?.targetMain?.targetName,
      targetVideoLink: target?.node?.video == null ? '' : target?.node?.video,
      targetInstr: target?.node?.targetInstr,
      selectedDomainId: target?.node?.domain?.id,
    });

    TherapistRequest.setDispatchFunction(this.props.dispatchSetToken);
    this.fetchTargetStatusList();
    this.getShortTermGoals(shortTermGoalId);
    this.getPromptCodes();
    this.getBehPromptCode();
    this.getDefaultGoals();
  }

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
          sdPrompts: tempArr,
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
      this.setState({behaviourDataList: tempArr}, () => {
        // this.getPromptCodes()
      });
    });
  };

  getShortTermGoals(shortTermGoalId) {
    const {student, program} = this.props.route.params;
    // Alert.alert(JSON.stringify(program))
    let variables = {
      studentId: student.node ? student.node.id : student?.id,
      program: student.node ? program.id : program,
    };
    let shortTerms = [];
    TherapistRequest.getFilteredShortTermGoals(variables)
      .then((longTermGoalsData) => {
        console.log(longTermGoalsData);

        // let longTermGoals =
        //   longTermGoalsData.data.programDetails.longtermgoalSet.edges;
        // for (let x = 0; x < longTermGoals.length; x++) {
        //   let shortTermGoals = longTermGoals[x].node.shorttermgoalSet.edges;
        //     console.log('target status target', shortTermGoals[y]);

        let shortTermGoals = longTermGoalsData?.data?.shortTerm?.edges;
        // for (let i = 0; i < shortTermGoals.length; i++) {
        //   let shortTermGoal = shortTermGoals[i].node;
        //   console.log("selected goal", shortTermGoal)
        //   shortTerms.push(shortTermGoal);
        // }

        for (let y = 0; y < shortTermGoals.length; y++) {
          // if (shortTermGoals[y]?.node?.goalStatus?.status === 'In Progress') {
          shortTerms.push({
            id: shortTermGoals[y].node.id,
            label: shortTermGoals[y].node.goalName,
          });
          // }
        }

        // shortTermGoal?.goalStatus?.status == "In Progress"
        // }
        // }
        this.setState({
          shortTermGoals: shortTerms,
          isLoading: false,
          shortTermGoalId: shortTermGoalId,
        });
        this.fetchTargetSettingdata();
      })
      .catch((error) => {
        console.log(error);
        this.setState({isLoading: false});
      });
  }

  fetchTargetStatusList() {
    this.setState({isLoading: true});

    TherapistRequest.getTargetStatusList()
      .then((targetStatusList) => {
        console.log('targetStatusList', JSON.stringify(targetStatusList));
        let statusList = targetStatusList.data.targetStatus.map((status) => {
          console.log(status);

          return {
            id: status.id,
            label: status.statusName,
          };
        });
        console.log(statusList);
        this.setState({targetStatusData: statusList}, () => {
          this.setState({selectedStatus: 'U3RhdHVzVHlwZToz'});
        });

        this.fetchMasteryData();
      })
      .catch((error) => {
        console.log('mastery error: ' + error);
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
          this.setState({selectedMastery: masteryList[0].id});
        });

        this.fetchTargetTypes();
      })
      .catch((error) => {
        console.log('mastery error: ' + error);
        this.setState({isLoading: false});
      });
  }

  fetchTargetTypes() {
    TherapistRequest.getTargetTypes()
      .then((targetTypes) => {
        console.log('targetTypes', JSON.stringify(targetTypes));
        let typesList = targetTypes.data.types.map((type) => {
          return {
            id: type.id,
            label: type.typeTar,
          };
        });
        console.log(typesList);
        this.setState({typesData: typesList}, () => {
          this.setState({selectedType: typesList[0].id});
        });

        this.fetchTargetSettingdata();
      })
      .catch((error) => {
        console.log('mastery error: ' + error);
        this.setState({isLoading: false});
      });
  }

  fetchTargetSettingdata() {
    const {student} = this.props.route.params;
    let v = {
      studentId: student.node.id,
    };
    TherapistRequest.getAllTargetSettingData(v)
      .then((settingData) => {
        console.log('settingData', settingData);
        let settingdata =
          settingData?.data?.getAllocateTargetSettings?.edges[0]?.node;

        if (settingData?.data?.getAllocateTargetSettings?.edges[0].length > 0) {
          this.setState({
            settingData:
              settingData?.data?.getAllocateTargetSettings?.edges[0]?.node,
            dailyTrials:
              settingdata?.dailyTrials != undefined
                ? settingdata?.dailyTrials
                : 5,
            consecutiveDays:
              settingdata?.consecutiveDays != undefined
                ? settingdata?.consecutiveDays
                : 25,
            selectedType: settingdata?.targetType?.id,
            selectedMastery: settingdata?.masteryCriteria?.id,
            selectedStatus: settingdata?.status?.id,
            isLoading: false,
          });
        }
      })
      .catch((error) => {
        console.log('mastery error: ' + error);
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

    if (
      this.state.selectedMastery === '' ||
      this.state.selectedMastery === null
    ) {
      this.setState({selectedMasteryError: ' Please select Mastery Criteria'});
      isError = true;
    } else {
      this.setState({selectedMasteryError: ''});
    }

    if (
      this.state.selectedStatus === '' ||
      this.state.selectedStatus === null
    ) {
      this.setState({selectedStatusError: ' Please select Target Status'});
      isError = true;
    } else {
      this.setState({selectedStatusError: ''});
    }

    if (this.state.selectedType === '' || this.state.selectedType === null) {
      this.setState({selectedTypeError: ' Please select Target Type'});
      isError = true;
    } else {
      this.setState({selectedTypeError: ''});
    }
    if (this.state.targetInstr === '') {
      this.setState({targetInstrError: ' (Cant be empty)'});
      isError = true;
    } else {
      this.setState({targetInstrError: ''});
    }

    if (
      this.state.showBehaviourReductionInput &&
      this.state.behaviourR1 === ''
    ) {
      this.setState({behaviourR1Err: ' (Cant be empty)'});
      isError = true;
    } else {
      this.setState({behaviourR1Err: ''});
    }

    if (
      this.state.showBehaviourReductionInput &&
      this.state.behaviourR2 === ''
    ) {
      this.setState({behaviourR2Err: ' (Cant be empty)'});
      isError = true;
    } else {
      this.setState({behaviourR2Err: ''});
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

    if (this.state.isPeak && this.state.allSd.length === 0) {
      this.setState({
        peakSdErr: 'Atleast one Stimulus is required for type Peak',
      });
      isError = true;
    } else {
      this.setState({peakSdErr: ''});
    }

    return isError;
  }
  handleChangeSteps = (text, key) => {
    let allSteps = this.state.allSteps;
    allSteps[key].step = text;
    this.setState({
      allSteps: allSteps,
      selectedStepKey: key,
    });
    if (text.indexOf(' ') >= 0) {
      this.setState({
        steps: [],
      });
    } else if (text.includes(',') === true) {
      let d = text.replace(',', '');
      let f = {id: this.makeid(6), name: d};
      this.handleStepClick(f);
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
    if (text.indexOf(' ') >= 0) {
      this.setState({
        sd: [],
      });
    } else if (text.includes(',') === true) {
      let d = text.replace(',', '');
      let f = {id: this.makeid(6), name: d};
      this.handleSdClick(f);
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
  allocateTarget() {
    console.log('state targetallocate new student 454', this.state.student);
    const {sdFiles, stepsFiles,stepPrompts, selectedFiles, allSteps,sbtStep, allSd} = this.state;
    let target = this.props.route.params.target;
    if (this.isFormInValid()) {
      return;
    }

    const manualMasterySd = [];
    const manualMastery = [];
    const tempAllSd = [];
    const tempAllSteps = [];
    const manualMasteryStep = [];
    const uploadedFiles = [];

    this.state.manualMasteryConditions.map((condition) => {
      manualMastery.push({
        sd: '',
        step: '',
        isDaily: condition.isDaily,
        responsePercentage: condition.responseTypeValue,
        consecutiveDays: condition.isDaily ? '1' : condition.cumConsecutiveDays,
        minTrial: this.state.showBehaviourRecordingInput
          ? '0'
          : condition.minTrails,
        fromStatus: condition.fromStatusId,
        toStatus: condition.toStatusId,
        gte: condition.responseType == '0' ? condition.responseTypeValue : 0,
        lte: condition.responseType == '1' ? condition.responseTypeValue : 100,
        masteryType: condition.masteryType,
        duration: condition.duration || 0,
        noOfProblemBehavior: condition.noOfProblemBehavior || 0,
      });
    });

    this.state.allSd.map((sd, index) => {
      console.log('sd', sd);
      sd.masteryConditions.map((condition) => {
        manualMasterySd.splice(index, 0, {
          sd: sd?.sd,
          step: '',
          isDaily: condition.isDaily,
          responsePercentage: condition.responseTypeValue,
          consecutiveDays: condition.isDaily
            ? '1'
            : condition.cumConsecutiveDays,
          minTrial: this.state.showBehaviourRecordingInput
            ? '0'
            : condition.minTrails,
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
      console.log('steps', step);
      step.masteryConditions.map((condition) => {
        manualMasteryStep.splice(index, 0, {
          sd: '',
          step: step?.step,
          isDaily: condition.isDaily,
          responsePercentage: condition.responseTypeValue,
          consecutiveDays: condition.isDaily
            ? '1'
            : condition.cumConsecutiveDays,
          minTrial: this.state.showBehaviourRecordingInput
            ? '0'
            : condition.minTrails,
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
    console.log('sdasdasdasdad', tempAllSd);

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

    this.setState({showLoading: true});
    let queryParams = {
      shortTerm: this.state.isAllocateDirectly
        ? this.state.defaultGoalId
        : this.state.shortTermGoalId,
      targetId: target.node.id,
      targetName: this.state.targetName,
      dailyTrials: this.state.dailyTrials,
      consecutiveDays: this.state.consecutiveDays,
      studentId: this.state.student.node
        ? this.state.student.node.id
        : this.state.student.id,
      masteryCriteria: this.state.selectedMastery,
      date: DateHelper.getTodayDate(),
      sd: tempAllSd,
      steps: tempAllSteps,
      video: this.state.targetVideoLink,
      objective: this.state.objective,
      targetInstr: this.state.targetInstr,
      goodPractices: this.state.goodPractices,
      gernalizationCriteria: this.state.gernalizationCriteria,
      targetType: this.state.selectedType,
      targetStatus: this.state.selectedStatus,
      precaution: 'Precaution Text',
      peakType: this.state.selectedPeakType,
      peakBlocks: this.state.selectectedPeakBlock,
      targetDocs: uploadedFiles,
      manualMastery: manualMastery,
      trialDuration: this.state.trialDuration,
      r1: this.state.showBehaviourReductionInput
        ? this.state.behaviourR1
        : null,
      r2: this.state.showBehaviourReductionInput
        ? this.state.behaviourR2
        : null,
      recordingType: this.state.showBehaviourRecordingInput
        ? this.state.selRecordingType
        : [],
      prompts: this.state.selPrompts.length > 0 ? this.state.selPrompts: [],
      domain: this.state.selectedDomainId,
      sbtSteps:sbtStepResponse
    };




    console.log(
      'query params before new target -------------------------------------------------------->',
      queryParams,
    );

    TherapistRequest.allocateNewTarget(queryParams)
      .then((newTargetData) => {
        console.log('newTargetData', newTargetData);
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

        Alert.alert('Information', GraphqlErrorProcessor.process(error));
      });
  }
  changeDailyTrials(changeType) {
    console.log(changeType, this.state.dailyTrials);
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

  selectFile = async (cardType, cardIndex) => {
    const {stepsFiles, sdFiles, allSteps, allSd} = this.state;
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
    this.setState({isLoading: true});
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
              this.setState({isLoading: false});
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
              this.setState({isLoading: false});
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
              this.setState({isLoading: false});
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
              this.setState({isLoading: false});
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
              this.setState({isLoading: false});
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
              this.setState({isLoading: false});
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

  showImageAttachmentModal = () => {
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
    const {manualMasteryConditions,sbtStep, allSteps, allSd} = this.state;

    if (cardType === 0) {
      manualMasteryConditions.splice(index, 1);
      this.setState({manualMasteryConditions: manualMasteryConditions});
    } else if (cardType === 1) {
      sbtStep[cardIndex].masteryConditions.splice(index, 1);
      this.setState({sbtStep: sbtStep});
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
      sbtStep,
      targetStatusData,
      consecutiveDaysData
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
                        sbtStep,
                        sbtStatus
                      } = this.state;
                      let obj = {};
                      let obj2={}

                      obj.FromStatus = this.state.fromStatuslabel;
                      obj.toStatus = this.state.toStatuslabel;
                      obj.responseType = this.state.resPercent;
                      obj.responseTypeValue = this.state.resPerValue;
                      obj.selDaysType = this.state.selConsecutive;
                      obj.cumConsecutiveDays =
                        this.state.selConsecutive == '1'
                          ? this.state.cumConsecutiveDays
                          : 1;
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
                      obj.duration = parseFloat(this.state.resPerValue);

                      if (this.state.cardType === 0) {
                        manualMasteryConditions[editIndex] = obj;

                        this.setState({
                          manualMasteryConditions: manualMasteryConditions,
                          showmanualModal: false,
                        });
                      } else if (this.state.cardType === 1) {
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
                      obj.duration = parseFloat(this.state.resPerValue);

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

              <LegacyTextInput
                style={{
                  textAlign: 'center',
                  fontSize: 20,
                  color: Color.primary,
                  borderWidth: 1,
                  borderColor: Color.gray,
                  borderRadius: 4,
                  height: 50,
                  width: 50,
                }}
                defaultValue={this.state.selectectedPeakBlock?.toString()}

                value={this.state.selectectedPeakBlock}
                keyboardType="number-pad"
                onChangeText={(text) => {
                  if (text !== '') {
                    let num = parseInt(text);
                    if (num > 30) {
                      Alert.alert('value should not be >30');
                      this.setState({selectectedPeakBlock: 0});
                    } else if (num < 1) {
                      this.setState({selectectedPeakBlock: 0});
                    } else {
                      this.setState({selectectedPeakBlock: num});
                    }
                  } 
                  
                }}
              />

              <TouchableOpacity
                onPress={() => {
                  this.changePeakBlocks('I');
                }}>
                <Text style={styles.hrButton}>
                  <MaterialCommunityIcons
                    name="plus"
                    size={24}
                    color={Color.gray}
                    style={styles.minusButtonText}
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

    // console.log('beviour data list', behaviourDataList);
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

  renderInput1() {
    let target = this.props.route.params.target;
    // console.log("targetastha:" + JSON.stringify(target))
    let {
      targetName,
      dailyTrials,
      consecutiveDays,
      masteryData,
      selectedMastery,
      selectedSdKey,
      selectedStepKey,
      steps,
      sd,
      targetStatusData,
      sbtStatus,
      selectedStatus,
      typesData,
      promptList,
      behPromptList,
      selPrompts,
      selBehPrompts,
      stepPrompts,
      selStepPrompts,
      isAllocateDirectly,
    } = this.state;
    // console.log('daily trial>>>',stepPrompts,selPrompts,promptList ,dailyTrials);
    return (
      <>
        <View style={styles.targetView}>
          <Image
            style={styles.targetViewImage}
            source={require('../../../../android/img/Image.png')}
          />
          <Text style={styles.targetViewTitle}>
            {target.node?.targetMain.targetName}
          </Text>
          <Text style={styles.targetViewDomain}>
            {target.node?.domain.domain}
          </Text>
          {/* <Text>{JSON.stringify(target)}</Text> */}
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
              overflow: 'hidden',
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
                flex: 1,
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
                flex: 1,
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
              placeholder="(Select Short Term Goal)"
              //selectedValue={defaults ? shortTermGoalId : this.state.selectedShortTermGoalType != "" ? this.state.selectedShortTermGoalType : shortTermGoals[0]?.id}
              selectedValue={
                this.state.shortTermGoalId || this.state?.shortTermGoals[0]?.id
              }
              data={this.state.shortTermGoals}
              onValueChange={(itemValue, itemIndex) => {
                this.setState({shortTermGoalId: itemValue});
              }}
            />
          </View>
        )}
        
             
        <TextInput
          label="Target Name"
          error={this.state.targetNameError}
          multiline={true}
          placeholder={'Target Name'}
          defaultValue={targetName}
          onChangeText={(targetName) => this.setState({targetName})}
        />

        <PickerModal
          label="Target Type"
          error={this.state.selectedTypeError}
          placeholder="(Select Target Type)"
          selectedValue={this.state.selectedType || typesData[0]?.id}
          data={typesData}
          onValueChange={(itemValue, itemIndex) => {
            console.log(typesData);
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

            if (typesData[itemIndex].label === 'Peak') {
              this.setState({isPeak: true});
            } else if (typesData[itemIndex].label === 'Time Circle') {
              this.setState({
                showStimulus: true,
                showSteps: false,
                isPeak: false,
              });
            } else if (typesData[itemIndex].label === 'Skill Based Treatment') {
              this.setState(
                {
                  showStimulus: false,
                  showSteps: true,
                  showBehaviourReductionInput: true,
                  allSd: [],
                  isPeak: false,
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
                  allSd: [],
                  isPeak: false,
                },
                () => {
                  this.fetchRecordingType();
                  this.getPromptCodes();
                },
              );
            } else if (typesData[itemIndex].label === 'Task Analysis') {
              this.setState({
                showStimulus: true,
                showSteps: true,
                isPeak: false,
              });
            } else {
              this.setState({
                showSteps: false,
                showStimulus: true,
                isPeak: false,
              });
            }
          }}
        />

        {this.state.showBehaviourReductionInput &&
          this.renderBehaviourReductionInput()}

        {this.state.showBehaviourRecordingInput &&
          this.renderBehaviourRecordingInput()}

        {this.state.isPeak && this.renderPeak()}

        <PickerModal
          label="Target Status"
          error={this.state.selectedStatusError}
          placeholder="(Select Target Status)"
          selectedValue={this.state.selectedStatus || targetStatusData[0]?.id}
          data={targetStatusData}
          onValueChange={(itemValue, itemIndex) => {
            console.log(targetStatusData);
            this.setState({selectedStatus: itemValue});
          }}
        />

        <View style={styles.card}>
          <View style={{flex: 5}}>
            <Text style={[styles.cardTitle, {flex: 0}]}>Daily Trials</Text>
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
              maxLength={2}
              defaultValue={dailyTrials.toString()}
              value={dailyTrials}
              keyboardType="number-pad"
              onChangeText={(text) => {
                console.log('text', text);
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
            <Text style={[styles.cardTitle, {flex: 0}]}>Consecutive Days</Text>
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
              maxLength={2}
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

        {!this.state.showBehaviourRecordingInput &&
          !this.state.showBehaviourReductionInput && (
            <PickerModal
              label="Mastery Criteria"
              placeholder="(Select Mastery Criteria)"
              error={this.state.selectedMasteryError}
              selectedValue={selectedMastery || masteryData[0]?.id}
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

        {this.state.allSd.length == 0 && this.state.showSteps && (
          <View>
            <Text style={{fontSize: 14, fontWeight: '500', color: Color.red}}>
              {this.state.stepErr}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                height: 42,
                alignItems: 'center',
                marginTop: 10,
              }}>
              <Text style={{fontSize: 14, fontWeight: '500', color: '#63686E'}}>
                Steps
              </Text>
              <Text style={{textAlign: 'left', color: 'red'}}>
                {this.state.sdError}
              </Text>
             {!this.state.showBehaviourReductionInput && <View
                style={{flex: 0, width: 120, position: 'absolute', right: 0}}>
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
              </View>
              }
            </View>
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
                      // allSteps.splice(key, 1);
                      this.setState({allSteps});
                    }}
                  />
                  <View style={{width: '100%', marginTop: 20}}>
                    {item.sdError != '' && (
                      <Text style={{color: Color.danger}}>{item.sdError}</Text>
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
                      <LegacyTextInput
                        defaultValue={item.step}
                        value={item.step}
                        style={{flex: 1}}
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
                      <View style={{marginTop: -15, width: '100%'}}>
                        <Text style={{textAlign: 'left', color: 'red'}}>
                          {this.state.selectedMasteryError}
                        </Text>
                        <PickerModal
                          label="Mastery Criteria"
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

                  {this.state.allSteps[key].masteryConditions.length > 0 && (
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

                  {this.state.allSteps[key]?.masteryConditions.length > 0 &&
                    this.state.allSteps[key]?.masteryConditions.map(
                      (condition, index) => {
                        return (
                          <>
                            <View style={{width: '100%', flexDirection: 'row'}}>
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
                        );
                      },
                    )}

                  <View style={{marginTop: -15, width: '100%'}}>
                    <Text style={{textAlign: 'left', color: 'red'}}>
                      {this.state.selectedStatusError}
                    </Text>
                    <PickerModal
                      label="Target Status"
                      iconLeft="folder-open"
                      selectedValue={
                        selectedStatus
                          ? selectedStatus
                          : targetStatusData[0]?.id
                      }
                      data={targetStatusData}
                      onValueChange={(itemValue, itemIndex) => {
                        let allSteps = this.state.allSteps;
                        allSteps[key].status = itemValue;
                        this.setState({
                          allSteps: allSteps,
                        });
                      }}
                    />
                  </View>
                  {/* {attachments} */}

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
                    this.state.allSteps[key]?.stepsFiles.map((file, index) => {
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
                              {file && file.name && file.name.length > 25
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
                              onPress={() =>
                                this.manageFile('v', index, 1, key)
                              }
                            />
                            <MaterialCommunityIcons
                              name="delete-outline"
                              size={20}
                              color={Color.red}
                              onPress={() =>
                                this.manageFile('d', index, 1, key)
                              }
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

        {this.state.allSteps.length == 0 && this.state.showStimulus && (
          <View style={{marginTop: 10}}>
            <Text style={{textAlign: 'left', color: 'red', marginBottom: 3}}>
              {this.state.isPeak ? this.state.peakSdErr : this.state.sdError}
            </Text>
            <View
              style={{flexDirection: 'row', height: 42, alignItems: 'center'}}>
              <Text style={{fontSize: 14, fontWeight: '500', color: '#63686E'}}>
                Stimulus
              </Text>
              <View
                style={{flex: 0, width: 120, position: 'absolute', right: 0}}>
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
                      <Text style={{color: Color.danger}}>{item.sdError}</Text>
                    )}
                    <Text style={styles.sectionTitle}>Stimulus</Text>
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
                        // editable={this.state.isSd}
                        value={item.sd}
                        style={{flex: 1}}
                        onChangeText={(text) => this.handleChangeSd(text, key)}
                      />
                    </View>
                  </View>
                  {/* {sd.length > 0 && selectedSdKey == key && (
                    <View style={{backgroundColor: '#EEE', borderRadius: 10}}>
                      {sd.map((sd) => (
                        <TouchableOpacity
                          style={{padding: 10}}
                          onPress={() => {
                            this.handleSdClick(sd, key);
                          }}>
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
                          label="Mastery Criteria"
                          iconLeft="folder-open"
                          selectedValue={
                            selectedMastery
                              ? selectedMastery
                              : masteryData[0]?.id
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

                  {this.state.showBehaviourReductionInput && (
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
                  )}

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
                          <Text style={{textAlign: 'center'}}>Min. Trail</Text>
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
                            <View style={{width: '100%', flexDirection: 'row'}}>
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
                                    onPress={() => this.editRow(index, 2, key)}
                                  />
                                </TouchableOpacity>
                                <TouchableOpacity
                                  onPress={() => this.deleteRow(index, 2, key)}>
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
                      label="Target Status x"
                      iconLeft="folder-open"
                      selectedValue={
                        selectedStatus
                          ? selectedStatus
                          : targetStatusData[0]?.id
                      }
                      data={targetStatusData}
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
                              onPress={() =>
                                this.manageFile('v', index, 2, key)
                              }
                            />
                            <MaterialCommunityIcons
                              name="delete-outline"
                              size={20}
                              color={Color.red}
                              onPress={() =>
                                this.manageFile('d', index, 2, key)
                              }
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
      </>
    );
  }

  renderInput2() {
    let {
      objective,
      targetInstr,
      goodPractices,
      gernalizationCriteria,
      targetVideoLink,
      targetVideoLinkError,
    } = this.state;
    return (
      <>
        <TextInput
          label="Target Video Link"
          error={targetVideoLinkError}
          multiline={true}
          placeholder={'Target Video Link'}
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
        })}

        <Text style={styles.sectionTitle}>
          Target Instructions
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
          title="Make Value Default"
          checkedColor={Color.primary}
          checked={this.state.makeValue}
          onPress={() => this.setState({makeValue: !this.state.makeValue})}
        />
      </>
    );
  }

  render() {
    return (
      <>
        {this.state.isLoading && <LoadingIndicator />}
        {!this.state.isLoading && (
          <>
            <SafeAreaView style={styles.container}>
              <NavigationHeader
                backPress={() => {
                  this.props.navigation.goBack();
                  this.setState({isLoading: true});
                }}
                title="New Target Allocate (New)"
              />
              <Container enablePadding={this.props.disableNavigation != true}>
                {OrientationHelper.getDeviceOrientation() == 'portrait' && (
                  <>
                    <ScrollView
                      keyboardShouldPersistTaps="handled"
                      showsVerticalScrollIndicator={false}
                      contentInsetAdjustmentBehavior="automatic">
                      {this.renderInput1()}
                      {this.renderInput2()}
                    </ScrollView>
                    <Button
                      labelButton="Allocate Target"
                      style={{marginBottom: 10}}
                      isLoading={this.state.showLoading}
                      onPress={() => {
                        this.allocateTarget();
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
                        labelButton="Allocate Target"
                        style={{marginBottom: 10}}
                        isLoading={this.state.showLoading}
                        onPress={() => {
                          this.allocateTarget();
                        }}
                      />
                    </Column>
                  </Row>
                )}
              </Container>
              {this.renderManualModal()}
              {this.state.showAttachmentModal && this.showAttachmentModal()}
              {this.state.showImageAttachmentModal &&
                this.showImageAttachmentModal()}
            </SafeAreaView>
          </>
        )}
      </>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.white,
  },
  targetView: {
    marginBottom: 30,
    marginTop: 10,
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
    marginVertical: 10,
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
  switcher: {
    fontSize: 15,
    fontWeight: 'bold',
    paddingHorizontal: 10,
    textDecorationLine: 'underline',
  },
  modalRoot: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  modalContent: {
    width: 300,
    height: '80%',
    padding: 16,
    borderRadius: 5,
    backgroundColor: Color.white,
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

export default connect(mapStateToProps, mapDispatchToProps)(TargetAllocateNew);
