import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Alert,
} from 'react-native';
import BehaviourRecordCard from '../../components/BehaviourRecordCard';
import {connect} from 'react-redux';
import {getAuthResult, getAuthTokenPayload} from '../../redux/reducers/index';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {setToken, setTokenPayload} from '../../redux/actions/index';
import SearchInput, {createFilter} from 'react-native-search-filter';
import OrientationHelper from '../../helpers/OrientationHelper';
import NavigationHeader from '../../components/NavigationHeader';
import ParentRequest from '../../constants/ParentRequest';
import LoadingIndicator from '../../components/LoadingIndicator';
import Color from '../../utility/Color';
import NoData from '../../components/NoData';
import {getStr} from '../../../locales/Locale';

const KEYS_TO_FILTERS = ['node.behavior.behaviorName'];
class BehaviorRecordScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      studentId: '',
      noDataText: '',
      templateItems: [],
      searchText: '',
      behaviourId: '',
      errorBehaviourMessage: '',
      behaviourtemplateList: [],
      isDeleting: false,
    };
  }

  componentDidMount() {
    this.getData();
  }

  getData() {
    console.log('BehaviorRecordScreen  componentDidMount() is called');
    ParentRequest.setDispatchFunction(this.props.dispatchSetToken);
    let {route} = this.props;
    let studentIdFromProps = '';
    if (route && route.params) {
      studentIdFromProps = route.params.studentId;
    } else if (this.props.studentId) {
      studentIdFromProps = this.props.studentId;
    }
    let studentId = studentIdFromProps;
    console.log(studentId);
    let selectedDate = this.state.selectedDate;
    this.setState({studentId: studentId});
    this.getTemplateData(studentId);
  }
  getTemplateData(studentId) {
    this.setState({isLoading: true, templateItems: []});
    let variables = {
      studentId: studentId,
    };
    ParentRequest.fetchTemplatesData(variables)
      .then((templatesData) => {
        let templateItems = templatesData.data.getTemplate.edges;
        templateItems = templateItems.reverse();
        console.log('fetchTemplatesData', templateItems);
        // filteredTemplates = templateItems.filter(createFilter(this.state.searchText, KEYS_TO_FILTERS));
        let behaviourtemplateList = templateItems.map((el, index) => {
          return {
            id: el.node.id,
            label: `${el.node.behavior.behaviorName}-${el.node.behaviorDescription}`,
          };
        });
        this.setState({templateItems});
        this.setState({behaviourtemplateList, behaviourtemplateList});
        this.setState({isLoading: false});
      })
      .catch((error) => {
        console.log('Error: ' + JSON.stringify(error));
        this.setState({isLoading: false});
      });
  }
  editTemplate(template) {
    this.props.navigation.navigate('BehaviourNewTemplateScreen', {
      studentId: this.state.studentId,
      template,
      parent: this,
    });
  }

  updateTemplate(templateId, activity) {
    let variables = {
      id: templateId,
      isActive: activity,
    };
    console.log(
      'Input variables for update template data ' + JSON.stringify(variables),
    );
    ParentRequest.updateTemplateActiveData(variables).then((updateData) => {
      console.log(
        'output variables for update template data ' +
          JSON.stringify(updateData),
      );
      let updatedId = updateData.data.updateTemplate.details.id;
      let isActive = updateData.data.updateTemplate.details.isActive;
      let index = this.state.templateItems.findIndex(
        (el) => el.node.id == updatedId,
      );
      let upatedTemplates = [...this.state.templateItems];
      upatedTemplates[index].node.isActive = isActive;
      this.setState({templateItems: upatedTemplates});
    });
  }

  deleteTemplate(templateId) {
    Alert.alert(
      'Information',
      'Are you sure ?',
      [
        {text: 'No', onPress: () => {}, style: 'cancel'},
        {
          text: 'Yes',
          onPress: () => {
            let variables = {
              id: templateId,
            };
            ParentRequest.deleteTemplate(variables)
              .then((result) => {
                this.setState({
                  isDeleting: false,
                });

                if (OrientationHelper.getDeviceOrientation() == 'portrait') {
                  let parent = this.props.route.params.parent;
                  this.props.navigation.goBack();

                  setTimeout(() => {
                    if (parent) {
                      parent.getData();
                    }
                  }, 500);
                }
              })
              .catch((error) => {});
          },
        },
      ],
      {cancelable: false},
    );
  }
  renderList() {
    let {templateItems} = this.state;
    const filteredTemplates = templateItems.filter(
      createFilter(this.state.searchText, KEYS_TO_FILTERS),
    );

    return (
      <>
        <View style={styles.searchWrapper}>
          <Ionicons name="ios-search" size={24} color={Color.gray} />
          <View style={styles.searchInputWrapper}>
            <SearchInput
              onChangeText={(searchText) => {
                this.setState({searchText});
              }}
              style={styles.searchInput}
              placeholder="Search Template"
            />
          </View>
        </View>
        {filteredTemplates.length == 0 && (
          <NoData>No Template Available</NoData>
        )}
        {filteredTemplates.map((el, index) => {
          return (
            <>
              <BehaviourRecordCard
                navigation={this.props.navigation}
                key={index}
                title={el.node.behavior.behaviorName}
                description={el.node.behaviorDescription}
                statusName={el.node.status.statusName}
                environments={el.node.environment.edges}
                isActive={el.node.isActive ? true : false}
                data={el.node}
                id={el.node.id}
                studentId={this.state.studentId}
                fromSession={this.props.isFromSession}
                onDelete={() => this.deleteTemplate(el.node.id)}
                onDeactivate={() => this.updateTemplate(el.node.id, false)}
                onActivate={() => this.updateTemplate(el.node.id, true)}
                onEdit={() => {
                  this.editTemplate(el);
                }}
                onSaved={() => {
                  this.props.navigation.goBack();
                }}
              />
            </>
          );
        })}
      </>
    );
  }

  render() {
    let {isLoading, templateItems, noDataText} = this.state;
    return (
      <SafeAreaView style={{backgroundColor: '#fff', flex: 1}}>
        <NavigationHeader
          enable={this.props.disableNavigation != true}
          backPress={() => this.props.navigation.goBack()}
          title={getStr('BegaviourData.RecordBehaviour')}
        />
        <ScrollView contentInsetAdjustmentBehavior="automatic">
          {this.renderList()}
        </ScrollView>
        {isLoading && <LoadingIndicator />}
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
  searchWrapper: {
    backgroundColor: '#eee',
    flexDirection: 'row',
    borderRadius: 5,
    marginVertical: 5,
    alignItems: 'center',
    paddingHorizontal: 10,
    height: 50,
  },
  searchInputWrapper: {
    flex: 1,

    marginLeft: 10,
  },
  searchInput: {},
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
)(BehaviorRecordScreen);
