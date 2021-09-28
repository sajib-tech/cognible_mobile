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
  Modal,
  Switch,
} from 'react-native';
import {
  check,
  request,
  requestMultiple,
  checkMultiple,
  PERMISSIONS,
  RESULTS,
} from 'react-native-permissions';
import Pdf from 'react-native-pdf';
import RNFS from 'react-native-fs';
import RNFetchBlob from 'rn-fetch-blob';
import RnModal from 'react-native-modal';
import DocumentPicker from 'react-native-document-picker';
import Styles from '../../../utility/Style.js';
import Color from '../../../utility/Color';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
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
import TherapistRequest from '../../../constants/TherapistRequest';
import Button from '../../../components/Button.js';
import MultiSelect from 'react-native-multiple-select';
import {RichEditor} from 'react-native-pell-rich-editor';
import TextInput from '../../../components/TextInput';
import LoadingIndicator from '../../../components/LoadingIndicator.js';
import MultiPickerModal from '../../../components/MultiPickerModal';

const width = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

class TargetStatusChange extends Component {
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
      stepValue: '',
      sdValue: '',
      targetName: '',
      dailyTrials: 5,
      consecutiveDays: 25,
      masteryData: [],
      selectedMastery: '',
      objective: '',
      targetInstr: '',
      goodPractices: '',
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
      selectedStatus: '',
      typesData: [],
      selectedType: '',
      selectedTypeError: '',
      selectedStatusError: '',
      shortTermGoals: [],
      shortTermError: '',
      allSd: [],
      allSteps: [],
      selectedSdKey: -1,
      selectedStepKey: -1,
      peakBlocks: 0,
      renderPeak: false,
      selectedDomain: '',
      domainDropdownList: [],
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
      selectdDomain: '',
      selectedDomainId: '',
      targetTypeName: '',
      peakSdErr: ''
    };
  }

  _refresh() {
    this.componentDidMount();
  }

  componentDidMount() {
    console.log('student taregtstatuschange 101', this.props.target);

    const {student, program, target} = this.props.route.params;

    this.getPromptCodes();
    this.saveDomainDropdown(program?.domain?.edges);

    // console.log('target from route xyz-->' + JSON.stringify(target));
    console.log('Params', JSON.stringify(this.props.route.params.target));
    

    let steps = [];
    let sd = [];
    let allSteps = [];
    let allSd = [];
    let tempSdDocs = [];
    let tempStepDocs = [];
    let tempDocs = [];
    let tempPrompts = [];

    target?.node?.mastery?.edges.map((ele, index) => {
      console.log('element', ele);

      if (ele?.node?.sd !== null) {
        if (
          target?.node?.targetAllcatedDetails?.targetType?.typeTar ===
          'Skill Based Treatment'
        ) {
          ele?.node?.behPrompts?.edges.map((prompt) => {
            tempPrompts.push(prompt?.node?.id);
          });
        } else {
          ele?.node?.prompts?.edges.map((prompt) => {
            tempPrompts.push(prompt?.node?.id);
          });
        }

        sd.push({id: ele?.node?.sd?.id, name: ele?.node?.sd?.sd});
        allSd.push({
          sd: ele?.node?.sd.sd,
          mastery: ele?.node?.mastery?.id,
          status: ele?.node?.status?.id,
          sdFiles: [],
          masteryConditions: ele?.node?.manualMastery?.edges,
          prompts: tempPrompts,
        });
      }
      if (ele?.node?.step !== null) {
        if (
          target?.node?.targetAllcatedDetails?.targetType?.typeTar ===
          'Skill Based Treatment'
        ) {
          ele?.node?.behPrompts?.edges.map((prompt) => {
            tempPrompts.push(prompt?.node?.id);
          });
        } else {
          ele?.node?.prompts?.edges.map((prompt) => {
            tempPrompts.push(prompt?.node?.id);
          });
        }
        steps.push({id: ele?.node?.step?.id, name: ele?.node?.step?.step});
        allSteps.push({
          step: ele?.node?.step.step,
          mastery: ele?.node?.mastery?.id,
          status: ele?.node?.status?.id,
          sdFiles: [],
          masteryConditions: ele?.node?.manualMastery?.edges,
          prompts: tempPrompts,
        });
      }
    });

    console.log('sd', sd);
    console.log('allsd', allSd);

    if (target?.node?.targetAllcatedDetails?.targetType?.typeTar === 'Peak') {
      this.setState({renderPeak: true});
    }

    this.setState({peakBlocks: target?.node?.peakBlocks});

    this.setState({selectedMastery: target?.node?.masteryCriteria?.id});
    this.setState({
      manualMasteryConditions: target?.node?.manualMastery?.edges,
    });

    target?.node?.targetDocs?.edges.map((doc) => {
      if (doc?.node?.sd === null && doc?.node?.step === null) {
        tempDocs.push({...doc, isFromApi: true});
      }
    });

    allSd.map((item) => {
      let tempArr = [];
      target?.node?.targetDocs?.edges.map((doc, index) => {
        if (doc?.node?.sd?.sd == item.sd) {
          tempArr.push({...doc, isFromApi: true});
          tempSdDocs.splice(index, 0, tempArr);
        }
      });
    });

    allSteps.map((item, index) => {
      let tempArr = [];
      target?.node?.targetDocs?.edges.map((doc) => {
        if (doc?.node?.step?.step === item.step) {
          tempArr.push({...doc, isFromApi: true});
          tempStepDocs.splice(index, 0, tempArr);
        }
      });
    });

    this.setState({selectedFiles: tempDocs});

    console.log('temp sd docs', tempSdDocs);
    console.log('temp  docs', tempDocs);

    let tempSds = allSd.map((sd, index) => ({
      ...sd,
      sdFiles: tempSdDocs[index],
    }));

    let tempSteps = allSteps.map((step, index) => ({
      ...step,
      stepsFiles: tempStepDocs[index],
    }));

    let dailyTrials = target?.node?.targetAllcatedDetails?.DailyTrials;
    console.log('DailyTrials', dailyTrials);
    if (dailyTrials == null) {
      dailyTrials = 0;
    }

    let consecutiveDays = target?.node?.targetAllcatedDetails?.consecutiveDays;
    if (consecutiveDays == null) {
      consecutiveDays = 0;
    }

    if (
      target?.node?.targetAllcatedDetails?.targetType.typeTar ===
      'Skill Based Treatment'
    ) {
      this.setState(
        {
          showStimulus: false,
          showSteps: true,
          showBehaviourReductionInput: true,
        },
        () => {
          this.fetchBehaviourList();
        },
      );
    } else if (
      target?.node?.targetAllcatedDetails?.targetType.typeTar === 'Time Circle'
    ) {
      this.setState({showStimulus: true, showSteps: false});
    } else if (
      target?.node?.targetAllcatedDetails?.targetType.typeTar ===
      'Behavior Recording'
    ) {
      this.setState(
        {
          showStimulus: false,
          showSteps: false,
          showBehaviourRecordingInput: true,
        },
        () => {
          this.fetchRecordingType();
        },
      );
    } else if (
      target?.node?.targetAllcatedDetails?.targetType.typeTar ===
      'Task Analysis'
    ) {
      this.setState({showStimulus: true, showSteps: true});
    }

    let tempSelRecordingType = [];

    target?.node?.recordingType.edges.map((item) => {
      console.log('recording type', item);
      tempSelRecordingType.push(item.node.id);
    });

    let tempAllocatedPrompts = [];

    target?.node?.targetAllcatedDetails?.promptCodes?.edges.map((item) => {
      tempAllocatedPrompts.push(item?.node?.id);
    });

    this.setState(
      {
        student: student,
        program: program,
        targetName: target?.node?.targetAllcatedDetails?.targetName,
        dailyTrials: target?.node?.targetAllcatedDetails?.DailyTrials,
        consecutiveDays: target?.node?.targetAllcatedDetails?.consecutiveDays,
        selectedType: target?.node?.targetAllcatedDetails?.targetType.id,
        targetVideoLink: target?.node?.videos?.edges[0]?.node?.url,
        selectedSteps: steps,
        selectedSd: sd,
        targetInstr: target?.node?.targetInstr,
        shortTermGoalId: target?.node?.shortTerm.id,
        selectedStatus: target?.node?.targetStatus?.id,
        allSd: tempSds,
        allSteps: tempSteps,
        selectedDomain: target?.node?.targetId?.domain?.id,
        behaviourR1: target?.node?.r1?.id || '',
        behaviourR2: target?.node?.r2?.id || '',
        selRecordingType: tempSelRecordingType,
        trialDuration: target?.node?.targetAllcatedDetails?.trialDuration,
        selPrompts: tempAllocatedPrompts,
        selectedDomain: target?.node?.manualAllocateDomain ? target?.node?.manualAllocateDomain?.domain  : target?.node?.targetId?.domain?.domain,
        selectedDomainId: target?.node?.manualAllocateDomain ? target?.node?.manualAllocateDomain?.id  : target?.node?.targetId?.domain?.id,
        isAllocateDirectly: target?.node?.shortTerm?.isDefault,
        targetTypeName: target?.node?.targetAllcatedDetails?.targetType?.typeTar
      },
      () => {
        console.log('Stimulus is -->', this.state.allSd);
        console.log('Steps are -->' + JSON.stringify(this.state.allSteps));

        console.log(
          'selected status -->' + JSON.stringify(this.state.selectedStatus),
        );

        console.log('selected domain', this.state.selectedDomain);

        TherapistRequest.setDispatchFunction(this.props.dispatchSetToken);
        this.fetchTargetStatusList();
      },
    );
    console.log('All SD: ' + this.state.allSd);
  }

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
          stepPrompts: tempArr,
          sdPrompts: tempArr,
        });
      } else if (showBehaviourReductionInput) {
        console.log('behav iour reduction');
        this.setState(
          {
            promptList: tempArr,
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
            stepPrompts: tempArr,
            sdPrompts: tempArr,
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
    TherapistRequest.getBehPromptCodes().then((res) => {
      console.log('res behavioiur prompts', res);
      res?.data?.getBehPrompts.map((code) => {
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

  fetchTargetStatusList() {
    this.setState({isLoading: true});

    TherapistRequest.getTargetStatusList()
      .then((targetStatusList) => {
        let statusList = targetStatusList.data.targetStatus.map((status) => {
          return {
            id: status.id,
            label: status.statusName,
          };
        });
        this.setState({targetStatusData: statusList}, () => {
          this.fetchMasteryData();
        });
      })
      .catch((error) => {
        console.log('mastery error: ' + error);
        this.setState({isLoading: false});
      });
  }

  fetchMasteryData() {
    TherapistRequest.getMasteryData()
      .then((masteryData) => {
        let masteryList = masteryData.data.masteryCriteria.map((mastery) => {
          return {
            id: mastery.id,
            label: mastery.name,
          };
        });
        this.setState({masteryData: masteryList});

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
        let typesList = targetTypes.data.types.map((type) => {
          return {
            id: type.id,
            label: type.typeTar,
          };
        });
        this.setState({typesData: typesList});

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
        let settingdata =
          settingData?.data?.getAllocateTargetSettings?.edges[0]?.node;
        let dailyTrials = settingdata?.dailyTrials;
        if (dailyTrials == null) {
          dailyTrials = 0;
        }
        let consecutiveDays = settingdata?.consecutiveDays;
        if (consecutiveDays == null) {
          consecutiveDays = 0;
        }
        this.setState({
          settingData:
            settingData?.data?.getAllocateTargetSettings?.edges[0]?.node,
          //dailyTrials,
          //consecutiveDays,
          //selectedType: settingdata ?.targetType ?.id,
          //selectedMastery: settingdata ?.masteryCriteria ?.id,
          //selectedStatus: settingdata ?.status ?.id
        });

        this.getShortTermGoals();
      })
      .catch((error) => {
        console.log('mastery error: ' + error);
        this.setState({isLoading: false});
      });
  }

  getShortTermGoals() {
    const {student, program} = this.props.route.params;
    // Alert.alert(JSON.stringify(program))
    let variables = {
      studentId: student.node ? student?.node?.id : student.id,
      program: program.id,
    };
    let shortTerms = [];
    TherapistRequest.getFilteredShortTermGoals(variables)
      .then((longTermGoalsData) => {
        // let longTermGoals =
        //   longTermGoalsData.data.programDetails.longtermgoalSet.edges;
        // for (let x = 0; x < longTermGoals.length; x++) {
          let shortTermGoals = longTermGoalsData?.data?.shortTerm?.edges;
          for (let y = 0; y < shortTermGoals.length; y++) {
            console.log(shortTermGoals[y]?.node)
            debugger
            if(shortTermGoals[y]?.node?.goalStatus?.id !== "R29hbFN0YXR1c1R5cGU6NQ==") {
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
      })
      .catch((error) => {
        console.log(error);
        this.setState({isLoading: false});
      });
  }

  isFormInValid() {
    console.log('targettype', this.state.selectedType);

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

    if (this.state.selectedMastery === '') {
      this.setState({selectedMasteryError: ' Please select Mastery Criteria'});
      isError = true;
    } else {
      this.setState({selectedMasteryError: ''});
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
    if (this.state.targetInstr === '') {
      this.setState({targetInstrError: ' (Cant be empty)'});
      isError = true;
    } else {
      this.setState({targetInstrError: ''});
    }

    if (
      this.state.selectedType == 'VGFyZ2V0RGV0YWlsVHlwZTo4' &&
      this.state.targetVideoLink === ''
    ) {
      this.setState({targetVideoLinkError: ' (Cant be empty)'});
      isError = true;
    } else {
      this.setState({targetVideoLinkError: ''});
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

  allocateTarget() {
    console.log('props targetstatuschange 370', this.props);
    const {sdFiles, stepsFiles, selectedFiles, allSteps, allSd} = this.state;

    // if(this.isFormInValid()) {
    //   return
    // }

    if(this.state.renderPeak && this.state.allSd.length === 0) {
      this.setState({peakSdErr: "Atleast one Stimulus is required for type Peak"})
      return 
    } else {
      this.setState({peakSdErr: ""})
    }


    let target = this.props.route.params.target;

    console.warn('target video link', this.state.targetVideoLink);

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
        isDaily: condition.node.isDaily,
        responsePercentage:
          condition.node.responseType == '0'
            ? condition.node.gte
            : condition.node.lte,
        consecutiveDays: condition.node.isDaily
          ? '1'
          : condition.node.consecutiveDays,
        minTrial: !this.state.showBehaviourRecordingInput
          ? condition.node.minTrial
          : 0,
        fromStatus: condition.node.fromStatus.id,
        toStatus: condition.node.toStatus.id,
        gte: condition.node.gte,
        lte: condition.node.lte,
        masteryType:
          condition.node.masteryType === 'CUMULATIVE'
            ? 'Cumulative'
            : condition.node.masteryType === 'DAILY'
            ? 'Daily'
            : 'Consecutive',
        duration: condition.node.duration ? condition.node.duration : 0,
        noOfProblemBehavior: condition.node.noOfProblemBehavior
          ? condition.node.noOfProblemBehavior
          : 0,
      });
    });

    this.state.allSd.map((sd, index) => {
      console.log('sd', sd);
      sd.masteryConditions.map((condition) => {
        manualMasterySd.splice(index, 0, {
          sd: sd.sd,
          step: '',
          isDaily: condition.node.isDaily,
          responsePercentage:
            condition.node.responseType == '0'
              ? condition.node.gte
              : condition.node.lte,
          consecutiveDays: condition.node.isDaily
            ? '1'
            : condition.node.consecutiveDays,
          minTrial: !this.state.showBehaviourRecordingInput
            ? condition.node.minTrial
            : 0,
          fromStatus: condition.node.fromStatus.id,
          toStatus: condition.node.toStatus.id,
          gte: condition.node.gte,
          lte: condition.node.lte,
          masteryType: condition.node.masteryType,
          duration: condition.node.duration ? condition.node.duration : 0,
          noOfProblemBehavior: condition.node.noOfProblemBehavior
            ? condition.node.noOfProblemBehavior
            : 0,
        });
      });
    });

    this.state.allSd.map((sd, index) => {
      console.log('sd', sd);
      tempAllSd.splice(index, 0, {
        ...sd,
        manualMastery: manualMasterySd,
        mastery: sd.mastery,
      });
    });

    this.state.allSteps.map((step, index) => {
      console.log('steps', step);
      step.masteryConditions.map((condition) => {
        console.log('condition', condition);
        manualMasteryStep.splice(index, 0, {
          sd: '',
          step: step.step,
          isDaily: condition.node.isDaily,
          responsePercentage:
            condition.node.responseType == '0'
              ? condition.node.gte
              : condition.node.lte,
          consecutiveDays: condition.node.isDaily
            ? '1'
            : condition.node.consecutiveDays,
          minTrial: !this.state.showBehaviourRecordingInput
            ? condition.node.minTrial
            : 0,
          fromStatus: condition.node.fromStatus.id,
          toStatus: condition.node.toStatus.id,
          gte: condition.node.gte,
          lte: condition.node.lte,
          masteryType:
            condition.node.masteryType === 'CUMULATIVE'
              ? 'Cumulative'
              : condition.node.masteryType === 'DAILY'
              ? 'Daily'
              : 'Consecutive',
          duration: condition.node.duration ? condition.node.duration : 0,
          noOfProblemBehavior: condition.node.noOfProblemBehavior
            ? condition.node.noOfProblemBehavior
            : 0,
        });
      });
    });

    this.state.allSteps.map((step, index) => {
      tempAllSteps.splice(index, 0, {
        ...step,
        manualMastery: manualMasteryStep,
        mastery: !this.state.showBehaviourRecordingInput ? step.mastery : null,
      });
    });

    if (
      selectedFiles &&
      selectedFiles.length > 0 &&
      allSteps.length === 0 &&
      allSd.length === 0
    ) {
      selectedFiles.map((file) => {
        if (file.node) {
          uploadedFiles.push({
            sd: '',
            step: '',
            url: file.node.url,
          });
        } else {
          uploadedFiles.push({
            sd: '',
            step: '',
            url: file.url,
          });
        }
      });
    } else if (allSteps.length > 0) {
      if (selectedFiles && selectedFiles.length > 0) {
        selectedFiles.map((file) => {
          if (file.node) {
            uploadedFiles.push({
              sd: '',
              step: '',
              url: file.node.url,
            });
          } else {
            uploadedFiles.push({
              sd: '',
              step: '',
              url: file.url,
            });
          }
        });

        allSteps.map((step, index) => {
          step.stepsFiles &&
            step.stepsFiles.length > 0 &&
            step.stepsFiles.map((file) => {
              if (file.node) {
                uploadedFiles.push({
                  sd: '',
                  step: step.step,
                  url: file.node.url,
                });
              } else {
                uploadedFiles.push({
                  sd: '',
                  step: step.step,
                  url: file.url,
                });
              }
            });
        });
      } else {
        allSteps.map((step, index) => {
          step.stepsFiles &&
            step.stepsFiles.length > 0 &&
            step.stepsFiles.map((file) => {
              if (file.node) {
                uploadedFiles.push({
                  sd: '',
                  step: step.step,
                  url: file.node.url,
                });
              } else {
                uploadedFiles.push({
                  sd: '',
                  step: step.step,
                  url: file.url,
                });
              }
            });
        });
      }
    } else if (allSd.length > 0) {
      if (selectedFiles && selectedFiles.length > 0) {
        selectedFiles.map((file) => {
          if (file.node) {
            uploadedFiles.push({
              sd: '',
              step: '',
              url: file.node.url,
            });
          } else {
            uploadedFiles.push({
              sd: '',
              step: '',
              url: file.url,
            });
          }
        });

        allSd.map((sd, index) => {
          sd.sdFiles &&
            sd.sdFiles.length > 0 &&
            sd.sdFiles.map((file) => {
              if (file.node) {
                uploadedFiles.push({
                  sd: sd.sd,
                  step: '',
                  url: file.node.url,
                });
              } else {
                uploadedFiles.push({
                  sd: sd.sd,
                  step: '',
                  url: file.url,
                });
              }
            });
        });
      } else {
        allSd.map((sd, index) => {
          sd.sdFiles &&
            sd.sdFiles.length > 0 &&
            sd.sdFiles.map((file) => {
              if (file.node) {
                uploadedFiles.push({
                  sd: sd.sd,
                  step: '',
                  url: file.node.url,
                });
              } else {
                uploadedFiles.push({
                  sd: sd.sd,
                  step: '',
                  url: file.url,
                });
              }
            });
        });
      }
    }

    console.log('sdasdasdasdad', tempAllSd);
    console.log('sdasdasdasdad', uploadedFiles);

    tempAllSteps.map((step) => {
      delete step.masteryConditions;
      delete step.stepsFiles;
      delete step.sdFiles;
    });
    tempAllSd.map((sd) => {
      delete sd.masteryConditions;
      delete sd.stepsFiles;
      delete sd.sdFiles;
    });

    this.setState({showLoading: true});
    let queryParams = {
      pk: target?.node?.id,
      status: this.state.selectedStatus,
      targetName: this.state.targetName,
      dailyTrials: this.state.dailyTrials,
      consecutiveDays: Number(this.state.consecutiveDays),
      targetType: this.state.selectedType,
      targetInstr: this.state.targetInstr,
      sd: tempAllSd,
      steps: tempAllSteps,
      videos: this.state.targetVideoLink ? [this.state.targetVideoLink] : '',
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
      prompts: this.state.selPrompts,
      domain: this.state.selectedDomainId,
      shortTerm: this.state.isAllocateDirectly ? this.state.defaultGoalId : this.state.shortTermGoalId
    };
    console.log(
      'query params to update target xy-->' + JSON.stringify(queryParams),
    );

    TherapistRequest.updateTarget(queryParams)
      .then((newTargetData) => {
        console.log('new target data', JSON.stringify(newTargetData));
        this.setState({showLoading: false});
        if (newTargetData?.data?.updateTargetAllocate2?.target?.id) {
          //refresh list request

          Alert.alert(
            'Target Status',
            'Successfully Saved',
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
        this.setState({showLoading: false, isSaving: false});

        console.log('errro ', error);

        Alert.alert('Information', error.toString());
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

  changePeakBlocks(changeType) {
    if (changeType === 'I' && this.state.peakBlocks < 30) {
      this.setState({
        peakBlocks: this.state.peakBlocks + 1,
      });
    } else if (changeType === 'D' && this.state.peakBlocks > 1) {
      this.setState({
        peakBlocks: this.state.peakBlocks - 1,
      });
    }
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
        let steps = result.data.targetStep.edges;
        let finalSteps = [];
        for (let x = 0; x < steps.length; x++) {
          finalSteps.push({id: steps[x].node.id, name: steps[x].node.step});
        }

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
        let sd = result.data.targetSd.edges;
        let finalSd = [];
        for (let x = 0; x < sd.length; x++) {
          finalSd.push({id: sd[x].node.id, name: sd[x].node.sd});
        }
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

    console.log('edit all sd', allSd);

    if (cardType === 0) {
      this.setState({
        fromStatus: manualMasteryConditions[index].node.fromStatus.id,
        toStatus: manualMasteryConditions[index].node.toStatus.id,
        resPercent: manualMasteryConditions[index]?.node?.gte > 0 ? '0' : '1',
        resPerValue: manualMasteryConditions[index].node.gte.toString() || '0',
        selConsecutive: manualMasteryConditions[index].node.isDaily ? '1' : '0',
        cumConsecutiveDays:
          manualMasteryConditions[index].node.consecutiveDays.toString() || '0',
        minTrial:
          manualMasteryConditions[index].node.minTrial?.toString() || '0',
        showmanualModal: true,
        isEdit: true,
        editIndex: index,
        cardType,
      });
    } else if (cardType === 1) {
      this.setState({
        fromStatus:
          allSteps[cardIndex].masteryConditions[index].node?.fromStatus.id,
        toStatus:
          allSteps[cardIndex].masteryConditions[index].node?.toStatus.id,
        resPercent:
          allSteps[cardIndex].masteryConditions[index]?.node?.gte > 0
            ? '0'
            : '1',
        resPerValue: allSteps[cardIndex].masteryConditions[
          index
        ]?.node?.gte?.toString(),
        selConsecutive: allSteps[cardIndex].masteryConditions[index]?.node
          ?.isDaily
          ? '1'
          : '0',
        cumConsecutiveDays:
          allSteps[cardIndex].masteryConditions[
            index
          ].node?.consecutiveDays?.toString() || '0',
        minTrial:
          allSteps[cardIndex].masteryConditions[
            index
          ].node?.minTrial?.toString() || '0',
        showmanualModal: true,
        isEdit: true,
        editIndex: index,
        cardType,
      });
    } else {
      this.setState({
        fromStatus:
          allSd[cardIndex].masteryConditions[index].node?.fromStatus.id,
        toStatus: allSd[cardIndex].masteryConditions[index].node?.toStatus.id,
        resPercent:
          allSd[cardIndex].masteryConditions[index]?.node?.gte > 0 ? '0' : '1',
        resPerValue:
          allSd[cardIndex].masteryConditions[index]?.node?.gte.toString() ||
          '0',
        selConsecutive: allSd[cardIndex].masteryConditions[index]?.node?.isDaily
          ? '1'
          : '0',
        cumConsecutiveDays:
          allSd[cardIndex].masteryConditions[
            index
          ].node?.consecutiveDays.toString() || '0',
        minTrial:
          allSd[cardIndex].masteryConditions[index].node?.minTrial.toString() ||
          '0',
        showmanualModal: true,
        isEdit: true,
        editIndex: index,
        cardType,
      });
    }
  };

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
        if (allSd[cardIndex].sdFiles.length > 0) {
          console.log('sdfiles', allSd[cardIndex].sdFiles);

          let tempArr = allSd;

          tempArr[cardIndex].sdFiles = allSd[cardIndex].sdFiles.concat(
            response,
          );

          console.log('temparr after selections', tempArr);

          this.setState({allSd: tempArr}, () => {
            console.log('allsd after state update', allSd);
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
        console.log('view file', selectedFiles[index]);
        if (selectedFiles[index] && selectedFiles[index].node) {
          let urlComponents = selectedFiles[index].node.url.split('/');
          let name = urlComponents[urlComponents.length - 1];
          let type = name.split('.')[1];
          if (type === 'pdf') {
            this.setState({
              showAttachmentModal: true,
              fileUrl: selectedFiles[index].node.url,
            });
          } else {
            this.setState({
              showImageAttachmentModal: true,
              fileUrl: selectedFiles[index].node.url,
            });
          }
        } else {
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
      }
    } else if (cardType === 1) {
      if (type === 'd') {
        allSteps[cardIndex].stepsFiles.splice(index, 1);
        this.setState({allSteps});
      } else if (type === 'v') {
        if (
          allSteps[cardIndex].stepsFiles[index] &&
          allSteps[cardIndex].stepsFiles[index].node
        ) {
          let urlComponents = allSteps[cardIndex].stepsFiles[
            index
          ].node.url.split('/');
          let name = urlComponents[urlComponents.length - 1];
          let type = name.split('.')[1];

          if (type === 'pdf') {
            this.setState({
              showAttachmentModal: true,
              fileUrl: allSteps[cardIndex].stepsFiles[index].node.url,
            });
          } else {
            this.setState({
              showImageAttachmentModal: true,
              fileUrl: allSteps[cardIndex].stepsFiles[index].node.url,
            });
          }
        } else {
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
    } else if (cardType === 2) {
      if (type === 'd') {
        allSd[cardIndex].sdFiles.splice(index, 1);
        this.setState({allSd});
      } else if (type === 'v') {
        if (
          allSd[cardIndex].sdFiles[index] &&
          allSd[cardIndex].sdFiles[index].node
        ) {
          let urlComponents = allSd[cardIndex].sdFiles[index].node.url.split(
            '/',
          );
          let name = urlComponents[urlComponents.length - 1];
          let type = name.split('.')[1];

          if (type === 'pdf') {
            this.setState({
              showAttachmentModal: true,
              fileUrl: allSd[cardIndex].sdFiles[index].node.url,
            });
          } else {
            this.setState({
              showImageAttachmentModal: true,
              fileUrl: allSd[cardIndex].sdFiles[index].node.url,
            });
          }
        } else {
          let urlComponents = allSd[cardIndex].sdFiles[index].url.split('/');
          let name = urlComponents[urlComponents.length - 1];
          let type = name.split('.')[1];

          if (type === 'pdf') {
            this.setState({
              showAttachmentModal: true,
              fileUrl: allSd[cardIndex].sdFiles[index].url,
            });
          } else {
            this.setState({
              showImageAttachmentModal: true,
              fileUrl: allSd[cardIndex].sdFiles[index].url,
            });
          }
        }
      }
    }
  };

  uploadFile = async (cardType, cardIndex) => {
    this.setState({isLoading: true});
    const {selectedFiles, allSteps, allSd} = this.state;
    let tempFiles = [];

    console.log('selectedfiles', selectedFiles);

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

          if (file && !file.isFromApi) {
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
          }
        } else {
          let uploadParams = [
            {
              name: 'file',
              filename: file.name,
              type: file.type,
              data: file.uri,
            },
          ];
          console.log('file', file);

          if (file && !file.isFromApi) {
            console.log('uploading file');
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
        }
      });
    } else if (cardType === 1) {
      tempFiles = allSteps[cardIndex].stepsFiles;
      allSteps[cardIndex].stepsFiles.map(async (file, fileIndex) => {
        console.log('file', file);

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

          if (file && !file.isFromApi) {
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
          }
        } else {
          let uploadParams = [
            {
              name: 'file',
              filename: file.name,
              type: file.type,
              data: file.uri,
            },
          ];

          if (file && !file.isFromApi) {
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
        }
      });
    } else {
      tempFiles = allSd[cardIndex].sdFiles;
      console.log('tempFiles', tempFiles);

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

          if (file && !file.isFromApi) {
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
          }
        } else {
          let uploadParams = [
            {
              name: 'file',
              filename: file.name,
              type: file.type,
              data: file.uri,
            },
          ];

          if (file && !file.isFromApi) {
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
        }
      });
    }
  };

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
              style={{height: '80%', width: '100%'}}
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
      manualToStatusErr,
      manualResPercentErr,
      manualMinTrialErr,
      manualFromStatusErr,
      manualConsecutiveDayErr,
      showBehaviourRecordingInput,
      showBehaviourReductionInput,
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
                  this.setState({
                    fromStatus: itemValue,
                    fromStatuslabel: targetStatusData[itemIndex].label,
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
                    toStatuslabel: targetStatusData[itemIndex].label,
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
                        selConsecutive == '1' ? '1' : cumConsecutiveDays
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
              {!this.state.showBehaviourRecordingInput && (
                <View>
                  <Text style={{marginBottom: -15}}>Minimum Trails</Text>
                  <TextInput
                    label={''}
                    error={manualMinTrialErr}
                    multiline={true}
                    placeholder={'0'}
                    defaultValue={minTrial}
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
                      } = this.state;
                      let obj = {};
                      let fromStatus = {};
                      let toStatus = {};
                      let node = {};
                      fromStatus.statusName = this.state.fromStatuslabel;
                      fromStatus.id = this.state.fromStatus;
                      toStatus.statusName = this.state.toStatuslabel;
                      toStatus.id = this.state.toStatus;
                      if (this.state.resPercent == '0') {
                        node.gte = this.state.resPerValue;
                        node.lte = '100';
                      } else {
                        node.lte = this.state.resPerValue;
                        node.gte = '0';
                      }
                      node.isDaily =
                        this.state.selConsecutive == '1' ? true : false;
                      node.consecutiveDays =
                        this.state.selConsecutive == '1'
                          ? 1
                          : this.state.cumConsecutiveDays;
                      node.minTrial = this.state.minTrial;
                      node.masteryType =
                        this.state.selConsecutive == '1'
                          ? 'Daily'
                          : this.state.selConsecutive == '0'
                          ? 'Cumulative'
                          : 'Consecutive';
                      node.noOfProblemBehavior = this.state.resPerValue;
                      node.duration = this.state.resPerValue;

                      node = {
                        ...node,
                        fromStatus,
                        toStatus,
                      };

                      obj = {node};

                      console.log('obj', obj);
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
                      let tempArr = [];

                      let obj = {};
                      let fromStatus = {};
                      let toStatus = {};
                      let node = {};
                      fromStatus.statusName = this.state.fromStatuslabel;
                      fromStatus.id = this.state.fromStatus;
                      toStatus.statusName = this.state.toStatuslabel;
                      toStatus.id = this.state.toStatus;
                      if (this.state.resPercent == '0') {
                        node.gte = this.state.resPerValue;
                        node.lte = '100';
                      } else {
                        node.lte = this.state.resPerValue;
                        node.gte = '0';
                      }
                      node.isDaily =
                        this.state.selConsecutive == '1' ? true : false;
                      node.consecutiveDays = this.state.cumConsecutiveDays;
                      node.minTrial = this.state.minTrial;
                      node.masteryType =
                        this.state.selConsecutive == '1'
                          ? 'Daily'
                          : this.state.selConsecutive == '0'
                          ? 'Cumulative'
                          : 'Consecutive';
                      node.noOfProblemBehavior = this.state.resPerValue;
                      node.duration = this.state.resPerValue;

                      node = {
                        ...node,
                        fromStatus,
                        toStatus,
                      };

                      obj = {node};
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
          error={''}
          placeholder=""
          selectedValue={behaviourR1 || ''}
          data={behaviourDataList}
          onValueChange={(itemValue, itemIndex) => {
            this.setState({behaviourR1: itemValue});
          }}
        />
        <PickerModal
          label="Behaviour R2"
          error={''}
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
                defaultValue={trialDuration? trialDuration.toString():'0'}
                value={trialDuration}
                keyboardType="number-pad"
                onChangeText={(text) => {
                  console.log("text>>>>",text);
                  if (text !== '') {
                    let num = parseInt(text);
                    if (num > 30) {
                      Alert.alert('value should not be >30');
                      this.setState({trialDuration: 0});
                    } else if (num < 1) {
                      this.setState({trialDuration: 0});
                    } else {
                      this.setState({trialDuration: parseInt(num)});
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
                defaultValue={trialDuration ? trialDuration.toString():'0'}
                value={trialDuration}
                keyboardType="number-pad"
                onChangeText={(text) => {
                  console.log("text***",text);
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

    let {
      targetName,
      targetVideoLink,
      targetVideoLinkError,
      selectedSteps,
      selectedSdKey,
      selectedStepKey,
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
      selectedType,
      peakBlocks,
      promptList,
      selPrompts,
      stepPrompts,
      selStepPrompts,
      isAllocateDirectly,
    } = this.state;

    console.log(
      'render all steps==-===-=-==-=-==-=-=-=-==-==-=-==-==-==--=-=-',
      this.state.allSd,
    );

    // console.log(targetStatusData)
    return (
      <>
        <View style={styles.targetView}>
          <Image
            style={styles.targetViewImage}
            source={require('../../../../android/img/Image.png')}
          />
          <Text style={styles.targetViewTitle}>
            {target?.node?.targetAllcatedDetails?.targetName}
          </Text>
          <Text style={styles.targetViewDomain}>
            {target?.node?.targetId?.domain?.domain}
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
              error={this.state.shortTermError}
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
          label="Target Name"
          error={this.state.targetNameError}
          multiline={true}
          placeholder={'Target Name'}
          defaultValue={targetName}
          onChangeText={(targetName) => this.setState({targetName})}
        />

<View style={{marginTop: 9}}>
          <Text style={{color: 'grey'}}>Target Type</Text>
          <View
            style={[
              styles.pickerWrapper,
              {
                backgroundColor: Color.grayWhite,
                paddingVertical: 12,
                marginBottom: 10,
                marginTop: 3,
                justifyContent: 'flex-start',
              },
            ]}>
            <Text style={{color: 'grey'}}>{this.state.targetTypeName}</Text>
          </View>
        </View>

        {/* <PickerModal
          label="Target Type"
          error={this.state.selectedTypeError}
          placeholder="(Select Target Type)"
          selectedValue={selectedType}
          data={typesData}
          onValueChange={(itemValue, itemIndex) => {
            this.setState({selectedType: itemValue});

            if (typesData[itemIndex].label === 'Time Circle') {
              this.setState({showStimulus: true, showSteps: false});
            } else if (typesData[itemIndex].label === 'Behavior Reduction') {
              this.setState({
                showStimulus: false,
                showSteps: true,
                showBehaviourReductionInput: true,
              });
            } else if (typesData[itemIndex].label === 'Behavior Recording') {
              this.setState({
                showStimulus: false,
                showSteps: true,
                showBehaviourRecordingInput: true,
              });
            } else if (typesData[itemIndex].label === 'Task Analysis') {
              this.setState({showStimulus: true, showSteps: true});
            }
          }}
        /> */}

        {this.state.showBehaviourReductionInput &&
          this.renderBehaviourReductionInput()}

        {this.state.showBehaviourRecordingInput &&
          this.renderBehaviourRecordingInput()}

        <PickerModal
          label="Target Status"
          error={this.state.selectedStatusError}
          placeholder="(Select Target Status)"
          selectedValue={selectedStatus}
          data={targetStatusData}
          onValueChange={(itemValue, itemIndex) => {
            this.setState({selectedStatus: itemValue});
          }}
        />

        <View style={{marginTop: 9}}>
          <Text style={{color: 'grey'}}>Domain Name</Text>
          <View
            style={[
              styles.pickerWrapper,
              {
                backgroundColor: Color.grayWhite,
                paddingVertical: 12,
                marginBottom: 10,
                marginTop: 3,
                justifyContent: 'flex-start',
              },
            ]}>
            <Text style={{color: 'grey'}}>{this.state.selectedDomain}</Text>
          </View>
        </View>

        {/* <View> */}
        {/* <PickerModal
          label="Domain"
          iconLeft="folder-open"
          placeholder={this.state.selectedDomain}
          selectedValue={
            this.state.selectedDomain || this.state.domainDropdownList[0]?.id
          }
          data={this.state?.domainDropdownList}
          onValueChange={(itemValue, itemIndex) => {
            this.setState({selectedDomain: itemValue});
            // this.fetchTargetsByDomain(itemValue);
          }}
        /> */}
        {/* </View> */}

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
            <View style={{marginTop: -15, width: '100%'}}>
              {/* <Text style={{textAlign: 'left', color: 'red'}}>
            {this.state.selectedMasteryError}
          </Text> */}
              <PickerModal
                label="Mastery Criteria"
                iconLeft="folder-open"
                selectedValue={
                  this.state.selectedMastery
                    ? this.state.selectedMastery
                    : masteryData[0]?.id
                }
                data={masteryData}
                onValueChange={(itemValue, itemIndex) => {
                  console.log('item value mastery criterai', itemValue);
                }}
                onAdded={() =>
                  this.setState({
                    showmanualModal: true,
                    cardType: 0,
                    isEdit: false,
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
                      {condition.node?.fromStatus?.statusName || ''}
                    </Text>
                  </View>
                  <View style={styles.tableCell}>
                    <Text style={{textAlign: 'center'}}>
                      {condition.node?.toStatus?.statusName || ''}
                    </Text>
                  </View>
                  <View style={[styles.tableCell, {flex: 0.6}]}>
                    <Text style={{textAlign: 'center'}}>
                      {Number(condition.node?.gte) > 0 ? '>=' : '<='}
                      {this.state.showBehaviourReductionInput
                        ? condition.node.noOfProblemBehavior
                        : this.state.showBehaviourRecordingInput
                        ? condition.node.duration
                        : Number(condition.node?.gte) > 0
                        ? condition.node?.gte
                        : condition.node?.lte || ''}
                    </Text>
                  </View>
                  <View style={[styles.tableCell, {flex: 0.6}]}>
                    <Text style={{textAlign: 'center'}}>
                      {condition.node?.consecutiveDays || ''}
                    </Text>
                  </View>
                  {!this.state.showBehaviourRecordingInput && (
                    <View style={[styles.tableCell, {flex: 0.6}]}>
                      <Text style={{textAlign: 'center'}}>
                        {condition?.node?.minTrial || ''}
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
              defaultValue={dailyTrials.toString()}
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
              defaultValue={consecutiveDays.toString()}
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

        {this.state.renderPeak && (
          <View style={styles.card}>
            <View style={{flex: 5}}>
              <Text style={[styles.cardTitle, {flex: 0}]}>Peak Blocks</Text>
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
                onPress={() => {
                  this.changePeakBlocks('D');
                }}>
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
                defaultValue={peakBlocks.toString()}
                value={peakBlocks}
                keyboardType="number-pad"
                onChangeText={(text) => {
                  if (text !== '') {
                    let num = parseInt(text);
                    if (num > 30) {
                      Alert.alert('value should not be >30');
  
                      this.setState({peakBlocks: 0});
                    } else if (num < 1) {
                      this.setState({peakBlocks: 0});
                    } else if (num) {
                      this.setState({peakBlocks: parseInt(num)});
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
                  this.changePeakBlocks('I');
                  // this.setState({peakBlocks: this.state.peakBlocks + 1});
                }}>
                <MaterialCommunityIcons
                  name={'plus'}
                  size={20}
                  color="#45494E"
                />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {this.state.allSd.length == 0 && this.state.showSteps && (
          <View>
            {/*<Text style={{ fontSize:14, fontWeight: '500', color: '#63686E' }}>Steps</Text>*/}
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
              <View
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
                    });
                    this.setState({allSteps});
                  }}
                />
              </View>
            </View>
            {this.state.allSteps.map((item, key) => {
              console.log('allstpes item =============>', item);
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
                      {steps.map((step) => {
                        console.log('step', step);
                        return (
                          <TouchableOpacity
                            style={{padding: 10}}
                            onPress={() => this.handleStepClick(step, key)}>
                            <Text>{step.name}</Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  )} */}
                  <View style={{width: '100%'}}>
                    <MultiPickerModal
                      label="Prompt"
                      data={stepPrompts}
                      value={item.prompts}
                      labelStyle={{textAlign: 'left'}}
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
                            item.mastery ? item.mastery : masteryData[0]?.id
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

                  {this.state.allSteps[key]?.masteryConditions.length > 0 && (
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
                            Prob Behavior
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
                                  {condition?.node?.fromStatus?.statusName ||
                                    ''}
                                </Text>
                              </View>
                              <View style={styles.tableCell}>
                                <Text style={{textAlign: 'center'}}>
                                  {condition?.node?.toStatus?.statusName || ''}
                                </Text>
                              </View>
                              <View style={[styles.tableCell, {flex: 0.6}]}>
                                <Text style={{textAlign: 'center'}}>
                                  {Number(condition.node?.gte) > 0
                                    ? '>='
                                    : '<='}
                                  {this.state.showBehaviourReductionInput
                                    ? condition.node.noOfProblemBehavior
                                    : this.state.showBehaviourRecordingInput
                                    ? condition.node.duration
                                    : Number(condition.node?.gte) > 0
                                    ? condition.node?.gte
                                    : condition.node?.lte || '0'}
                                </Text>
                              </View>
                              <View style={[styles.tableCell, {flex: 0.6}]}>
                                <Text style={{textAlign: 'center'}}>
                                  {condition.node?.consecutiveDays || '0'}
                                </Text>
                              </View>
                              {!this.state.showBehaviourRecordingInput && (
                                <View style={[styles.tableCell, {flex: 0.6}]}>
                                  <Text style={{textAlign: 'center'}}>
                                    {condition.node?.minTrial || '0'}
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
                        item.status ? item.status : targetStatusData[0]?.id
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
                  {this.state.allSteps[key]?.stepsFiles &&
                    this.state.allSteps[key]?.stepsFiles.length > 0 &&
                    this.state.allSteps[key]?.stepsFiles.map((file, index) => {
                      let name;
                      if (file.isFromApi) {
                        const uriComponents = file?.node?.url?.split('/');
                        name = uriComponents[uriComponents.length - 1];
                      } else {
                        name = file.name;
                      }
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
                              {name && name.length > 25
                                ? String(name).substr(0, 24).concat('...')
                                : name}
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
                {this.state.renderPeak ? this.state.peakSdErr :this.state.sdError}
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
              console.log('all sd data item 1054', item);

              console.log('sd', sd);

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
                      {/*<Text style={{ marginRight: 5 }}>{item.name}</Text>*/}
                      <LegacyTextInput
                        value={item.sd}
                        style={{flex: 1}}
                        onChangeText={(text) => this.handleChangeSd(text, key)}
                      />
                    </View>
                  </View>
                  {/* {sd.length > 0 && selectedSdKey == key && (
                    <View style={{backgroundColor: '#EEE', borderRadius: 10}}>
                      {sd.map((sd) => {
                        return (
                          <TouchableOpacity
                            style={{padding: 10}}
                            onPress={() => {
                              this.handleSdClick(sd, key);
                            }}>
                            <Text>{sd.name}</Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  )} */}
                  <View style={{width: '100%'}}>
                    <MultiPickerModal
                      label="Prompt"
                      data={this.state.sdPrompts}
                      value={item.prompts}
                      labelStyle={{textAlign: 'left'}}
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
                          label="Mastery Criteria1"
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

                  {this.state.allSd[key]?.masteryConditions.length > 0 && (
                    <View style={{width: '100%', flexDirection: 'row'}}>
                      <View style={styles.tableCell}>
                        <Text style={{textAlign: 'center'}}>From Status</Text>
                      </View>
                      <View style={styles.tableCell}>
                        <Text style={{textAlign: 'center'}}>To Status</Text>
                      </View>
                      <View style={[styles.tableCell, {flex: 0.6}]}>
                        <View style={[styles.tableCell, {flex: 0.6}]}>
                          {this.state.showBehaviourRecordingInput ? (
                            <Text style={{textAlign: 'center'}}>Duration</Text>
                          ) : this.state.showBehaviourReductionInput ? (
                            <Text style={{textAlign: 'center'}}>
                              Prob Behavior
                            </Text>
                          ) : (
                            <Text style={{textAlign: 'center'}}>Res. Per.</Text>
                          )}
                        </View>
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
                                  {condition?.node?.fromStatus?.statusName ||
                                    ''}
                                </Text>
                              </View>
                              <View style={styles.tableCell}>
                                <Text style={{textAlign: 'center'}}>
                                  {condition?.node?.toStatus?.statusName || ''}
                                </Text>
                              </View>
                              <View style={[styles.tableCell, {flex: 0.6}]}>
                                <Text style={{textAlign: 'center'}}>
                                  {Number(condition.node?.gte) > 0
                                    ? '>='
                                    : '<='}
                                  {this.state.showBehaviourReductionInput
                                    ? condition.node.noOfProblemBehavior
                                    : Number(condition.node?.gte) > 0
                                    ? condition.node?.gte
                                    : condition.node?.lte || '0'}
                                </Text>
                              </View>
                              <View style={[styles.tableCell, {flex: 0.6}]}>
                                <Text style={{textAlign: 'center'}}>
                                  {condition.node?.consecutiveDays || '0'}
                                </Text>
                              </View>
                              {!this.state.showBehaviourRecordingInput && (
                                <View style={[styles.tableCell, {flex: 0.6}]}>
                                  <Text style={{textAlign: 'center'}}>
                                    {condition.node?.minTrial || '0'}
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
                      label="Target Status"
                      iconLeft="folder-open"
                      selectedValue={
                        item.status ? item.status : targetStatusData[0]?.id
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

                  {this.state.allSd[key]?.sdFiles &&
                    this.state.allSd[key]?.sdFiles.map((file, index) => {
                      let name;
                      console.log('file sd list', file);

                      if (file.isFromApi) {
                        const uriComponents = file?.node?.url?.split('/');
                        name = uriComponents[uriComponents.length - 1];
                      } else {
                        name = file.name;
                      }
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
                              {name && name.length > 25
                                ? String(name).substr(0, 24).concat('...')
                                : name}
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

        <TextInput
          label="Target Video Link"
          error={targetVideoLinkError}
          multiline={true}
          placeholder={'Target Video Link'}
          defaultValue={targetVideoLink}
          onChangeText={(targetVideoLink) => this.setState({targetVideoLink})}
        />
      </>
    );
  }

  renderInput2() {
    let {targetInstr} = this.state;
    return (
      <>
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

        {this.state.selectedFiles &&
          this.state.selectedFiles.length > 0 &&
          this.state.selectedFiles.map((file, index) => {
            console.log('file', file);

            let name;
            if (file.isFromApi) {
              const uriComponents = file?.node?.url?.split('/');
              name = uriComponents[uriComponents.length - 1];
            } else {
              name = file.name;
            }

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
                    {name && name.length > 25
                      ? String(name).substr(0, 24).concat('...')
                      : name}
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
      </>
    );
  }

  render() {
    // console.log(this.state.targetStatusData);
    return (
      <SafeAreaView style={styles.container}>
        <NavigationHeader
          backPress={() => this.props.navigation.goBack()}
          title="Allocated Target"
          enable={this.props.disableNavigation != true}
          disabledTitle
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
                    {this.renderInput1()}
                    {this.renderInput2()}
                  </ScrollView>
                  <Button
                    labelButton="Save"
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
                      labelButton="Save"
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
    marginBottom: 0,
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
    fontSize: 14,
    fontWeight: 'normal',
    color: '#3E7BFA',
  },
  minusButtonText: {
    fontSize: 14,
    fontWeight: 'normal',
    color: '#63686E',
  },

  richEditor: {
    borderWidth: 0.5,
    borderColor: Color.gray,
    borderRadius: 5,
    // marginVertical: 5,
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
  rowspacebetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  labelStyle: {fontSize: 15},
  buttonStyle: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
  },
  buttonText: {fontSize: 20, color: '#000'},
  textStyle: {fontSize: 15, color: '#000', padding: 15},
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

export default connect(mapStateToProps, mapDispatchToProps)(TargetStatusChange);
