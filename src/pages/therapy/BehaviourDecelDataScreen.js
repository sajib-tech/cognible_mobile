import 'react-native-gesture-handler';
import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  ActivityIndicator,
  Text,
  Dimensions,
  Alert,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {connect} from 'react-redux';
import {getAuthResult, getAuthTokenPayload} from '../../redux/reducers/index';
import {setToken, setTokenPayload} from '../../redux/actions/index';
import DateHelper from '../../helpers/DateHelper';
import BehaviourDecelCard from '../../components/BehaviourDecelCard';
import {Row, Container, Column} from '../../components/GridSystem';
import OrientationHelper from '../../helpers/OrientationHelper';
import NavigationHeader from '../../components/NavigationHeader';
import Button from '../../components/Button';
import BehaviourDecelTemplateScreen from './BehaviourDecelTemplateScreen';
import BehaviourNewTemplateScreen from './BehaviourNewTemplateScreen';
import Color from '../../utility/Color';
import LoadingIndicator from '../../components/LoadingIndicator';
import ParentRequest from '../../constants/ParentRequest';
import NoData from '../../components/NoData';
import moment from 'moment';
import {getStr} from '../../../locales/Locale';
import CalendarView from '../../components/CalendarView';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

class BehaviourDecelDataScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      screenMode: 'list',
      weeks: DateHelper.getCurrentWeekDates(),
      selectedDate: DateHelper.getTodayDate(),
      tempid:[],
      decelItems: [],
      environments:[],
      showLoading: false,
      noDataText: '',
      studentId: props.route.params.studentId,
      template: null,
    };
  }

  componentDidMount() {

    console.error("props behaviourdeceldatascreen 56", this.props)
    ParentRequest.setDispatchFunction(this.props.dispatchSetToken);
    this.getData();

    // this.props.navigation.addListener('focus', () => {
    //   this.getData();
    // });
  }

  getData() {
    this.setState({showLoading: true});
    let tempid
    let variables = {
      student: this.state.studentId,
    };
    console.log('Vars', variables);
    ParentRequest.getBehaviorTemplate(variables)
      .then((result) => {
        tempid=result.data.getBehaviorTemplates.edges.map(({node})=>{
          return node.id})
        let environments
        this.setState({
          tempid
        })
        let decelItems=result.data.getBehaviorTemplates.edges
        const filtered=decelItems.filter(({node},index)=>{
          return (moment(node.createdAt).format('YYYY-MM-DD') === this.state.selectedDate)
        })
        console.log("filtered>>>>>",filtered);
        ParentRequest.getTemplateEnvironment({
          templates:tempid
        }) .then((resenv)=>{
                
          let environ=resenv.data.getBehaviorTemplatesEnvironments
          this.setState({
            environments:environ
          },()=>console.log("env seted"))
          this.setState({
            showLoading:false,decelItems
          })
        })
  
        
        
        
      })
      .catch((error) => {
        console.log('Err', error);
        Alert.alert('Warning', error.toString());
        this.setState({showLoading: false});
      });
         
  }

  callBackFromCalendar(selectedDate) {
    this.setState({selectedDate}, () => {
      this.getData();
    });
  }

  renderList() {
    let {decelItems, environments,weeks,tempid} = this.state;
    return (
      <>
        <View style={{height: 10}} />

        {decelItems.length === 0 && <NoData>No Data Available</NoData>}

        <View style={{height: 10}} />

        {decelItems.map(({node}, index) => {
            
                let envs=environments.find(el=>el.templateId===node.id)
                let env=[]
                if(envs!==undefined){
                  env=envs.environments
                }
                
                
              

            return (
              <BehaviourDecelCard
                navigation={this.props.navigation}
                key={node.id}
                tempId={node.id}
                studentId={this.state.studentId}
                title={
                  node.behavior ? node.behavior.behaviorName : ''
                }
                behaviorType={node.behaviorType}
                status={node.status.statusName}
                onEdit={() => {
                 this.editTemplate(node.id)
                }}
                
              />
            );
          })}
      </>
    );
  }

  recordBehaviour() {
    if (OrientationHelper.getDeviceOrientation() == 'portrait') {
      this.props.navigation.navigate('BehaviourDecelTemplateScreen', {
        studentId: this.state.studentId,
        isFromRecord: true,
      });
    } else {
      this.setState({screenMode: 'add'});
    }
  }
  editTemplate(template) {
		//// debugger;
    console.log("id==>",template);
		if (OrientationHelper.getDeviceOrientation() == "portrait") {		
				this.props.navigation.navigate('BehaviourNewTemplateScreen', {
					studentId: this.state.studentId,
					template,
					parent: this
				});			
		} 
	}
  optionScreen(template){

    if (OrientationHelper.getDeviceOrientation() == "portrait") {		
      this.props.navigation.navigate('BehaviorRecordingOption', {
        studentId: this.state.studentId,
        template,
        parent: this
      });			
  }

  }
  createNewTemplate() {
    if (OrientationHelper.getDeviceOrientation() == 'portrait') {
      this.props.navigation.navigate('BehaviourNewTemplateScreen', {
        studentId: this.state.studentId,
        parent: this,
      });
    }
  }

  render() {
    let {showLoading, screenMode} = this.state;
    let setScreenMode = (screenMode) => {
      this.setState({screenMode});
    };
    let setTemplate = (template) => {
      console.log('in set template-->' + template);
      this.setState({template});
    };
    return (
      <SafeAreaView style={{backgroundColor: '#fff', flex: 1}}>
        <NavigationHeader
          title={getStr('BegaviourData.BehaviorData')}
          backPress={() => this.props.navigation.goBack()}
        />
        {showLoading && <LoadingIndicator />}
        <Container>
          {OrientationHelper.getDeviceOrientation() == 'portrait' &&
            !showLoading && (
              <>
                <CalendarView
                  parentCallback={(data) => this.callBackFromCalendar(data)}
                  selectedDate={this.state.selectedDate}
                />

                {showLoading && (
                  <View style={{flex: 1}}>
                    <LoadingIndicator />
                  </View>
                )}

                
                {!showLoading && (
                  <ScrollView contentInsetAdjustmentBehavior="automatic">
                    {this.renderList()}
                  </ScrollView>
                )}
                <View>
                  <Button
                    labelButton={getStr("TargetAllocate.CreateTemplate")}
                    style={{marginBottom: 10}}
                    onPress={() => this.createNewTemplate()}
                  />
                  {/* <Button
                    labelButton={getStr("TargetAllocate.RecordBehaviour")}
                    style={{marginBottom: 10, padding: 10}}
                    onPress={() => {
                      this.recordBehaviour();
                    }}
                  /> */}
                </View>
              </>
            )}

          {OrientationHelper.getDeviceOrientation() == 'landscape' &&
            !showLoading && (
              <Row style={{flex: 1}}>
                <Column style={{flex: 2}}>
                  <CalendarView
                    parentCallback={(data) => this.callBackFromCalendar(data)}
                    selectedDate={this.state.selectedDate}
                  />
                  {showLoading && (
                    <View style={{flex: 1}}>
                      <LoadingIndicator />
                    </View>
                  )}
                  {!showLoading && (
                    <ScrollView contentInsetAdjustmentBehavior="automatic">
                      {this.renderList()}
                    </ScrollView>
                  )}
                </Column>
                <Column>
                  {screenMode == 'list' && (
                    <BehaviourDecelTemplateScreen
                      disableNavigation
                      setScreenMode={setScreenMode}
                      setTemplate={setTemplate}
                      route={{params: {studentId: this.state.studentId}}}
                      navigation={this.props.navigation}
                    />
                  )}
                  {screenMode == 'add' && (
                    <>
                      <View style={{flexDirection: 'row'}}>
                        <Text
                          style={{
                            flex: 1,
                            color: '#000',
                            fontSize: 16,
                            marginBottom: 5,
                          }}>
                          New Template
                        </Text>
                        <TouchableOpacity onPress={() => setScreenMode('list')}>
                          <MaterialCommunityIcons
                            name="close"
                            size={24}
                            color={Color.blackFont}
                          />
                        </TouchableOpacity>
                      </View>
                      <BehaviourNewTemplateScreen
                        disableNavigation
                        setScreenMode={setScreenMode}
                        route={{params: {studentId: this.state.studentId}}}
                        navigation={this.props.navigation}
                      />
                    </>
                  )}
                  {screenMode == 'edit-template' && (
                    <>
                      <View style={{flexDirection: 'row'}}>
                        <Text
                          style={{
                            flex: 1,
                            color: '#000',
                            fontSize: 16,
                            marginBottom: 5,
                            marginTop: 5,
                          }}>
                          Edit Template
                        </Text>
                        <TouchableOpacity onPress={() => setScreenMode('list')}>
                          <MaterialCommunityIcons
                            name="close"
                            size={24}
                            color={Color.blackFont}
                          />
                        </TouchableOpacity>
                      </View>
                      <BehaviourNewTemplateScreen
                        disableNavigation
                        setScreenMode={setScreenMode}
                        route={{
                          params: {
                            studentId: this.state.studentId,
                            template: this.state.template,
                            parent: this,
                          },
                        }}
                        navigation={this.props.navigation}
                      />
                    </>
                  )}
                </Column>
              </Row>
            )}
        </Container>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  continueView: {
    marginVertical: 10,
  },
});

const mapStateToProps = (state) => ({
  authResult: getAuthResult(state),
  authTokenPayload: getAuthTokenPayload(state),
});

const mapDispatchToProps = (dispatch) => ({
  dispatchSetToken: (data) => dispatch(setToken(data)),
  dispatchSetTokenPayload: (data) => dispatch(setTokenPayload(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BehaviourDecelDataScreen);
