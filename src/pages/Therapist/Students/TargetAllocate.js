import 'react-native-gesture-handler';
import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Image,
  Text,
  TextInput,
  ActivityIndicator,
  Modal,
  RefreshControl,
  Dimensions,
  TouchableOpacity,
  Animated,
  Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Styles from '../../../utility/Style.js';
import Color from '../../../utility/Color';
import {getStr} from '../../../../locales/Locale';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import SearchInput, {createFilter} from 'react-native-search-filter';
import NavigationHeader from '../../../components/NavigationHeader.js';
import PickerModal from '../../../components/PickerModal';
import store from '../../../redux/store';
import {connect} from 'react-redux';
import {getAuthResult} from '../../../redux/reducers/index';
import {setToken, setTokenPayload} from '../../../redux/actions/index';
import NoData from '../../../components/NoData';
import Button from '../../../components/Button';
import moment from 'moment';
import ImageHelper from '../../../helpers/ImageHelper';
import {Row, Container, Column} from '../../../components/GridSystem';
import OrientationHelper from '../../../helpers/OrientationHelper';
import StudentDetail from './StudentDetail';
import {therapistGetLongTermGoals} from '../../../constants/therapist';
import TherapistRequest from '../../../constants/TherapistRequest';
import TargetAllocateNew from './TargetAllocateNew.js';
import LoadingIndicator from '../../../components/LoadingIndicator.js';

const width = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const KEYS_TO_FILTERS = ['node.targetMain.targetName'];
class TargetAllocate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      shortTermGoalId: '',
      targets: [],
      searchTarget: '',
      student: {},
      program: {},
      animation: new Animated.Value(0),
      domainList: [],
      showSearchFilter: false,
      isFilterOpened: true,
      domainDropdownList: [],
      targetAreaDropdownList: [],
      selectedDomain: '',
      domainDone: 0,
      targetareaDone: 0,
      selectedTargetArea: '',
      noDataText: '',
      longTermGoals: [],
      noDataFound: '',
      shortTermGoals: [],
      newPageParams: null,
      isShowDomainModal: false,
      selectedType: '',
    };
  }
  _refresh() {
    this.componentDidMount();
  }
  searchUpdated(term) {
    this.setState({searchTarget: term});
  }

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
  saveTargetAreaDropdown(targetAreas) {
    let targetAreaList = targetAreas.map((targetArea, index) => {
      let name = targetArea.node.Area;
      if (name.length > 25) {
        name = name.substring(0, 25) + '...';
      }

      if (index === 0) {
        this.setState({selectedTargetArea: targetArea.node.id});
      }
      return {
        id: targetArea.node.id,
        label: name,
      };
    });
    this.setState({targetAreaDropdownList: targetAreaList}, () => {
      setTimeout(() => this.searchByFilter(), 10)
    });
  }
  componentDidMount() {
    console.log("props target allocate 117", this.props)
    
    TherapistRequest.setDispatchFunction(this.props.dispatchSetToken);
    let program = this.props.route.params.program;
    let student = this.props.route.params.student;
    let shortTermGoalId = this.props.route.params.shortTermGoalId;
    let newPrograms = this.props.route.params.newPrograms

    this.setState({
      student: student,
      program: program,
      // shortTermGoalId: shortTermGoalId,
      selectedType: shortTermGoalId
    });

    if (
      program &&
      program?.domain &&
      program?.domain?.edges &&
      program?.domain?.edges?.length > 0
    ) {
      this.saveDomainDropdown(program?.domain?.edges);
      this.fetchTargetsByDomainInit(program?.domain?.edges[0]?.node.id);
    }

    if(this.props.route.params.fromParent && newPrograms && newPrograms.edges && newPrograms.edges.length > 0) {
      this.saveDomainDropdown(newPrograms.edges)
      this.fetchTargetsByDomainInit(newPrograms?.edges[0]?.node?.id)
    }


  }

  fetchTargetsByDomainInit(domainId) {
    // Alert.alert(JSON.stringify("targetAreaData"));
    // let firstDomain = domain;
    let variables = {
      domain: domainId,
    };
    this.setState({ targets: [], isLoading: false});
    // TherapistRequest.getTargetArea(variables).then(targetAreaData => {
    //   //  Alert.alert(JSON.stringify(targetAreaData));
    //     this.setState({ isLoading: false });
    //     if (targetAreaData &&
    //         targetAreaData.data &&
    //         targetAreaData.data.targetArea &&
    //         targetAreaData.data.targetArea.edges &&
    //         targetAreaData.data.targetArea.edges.length > 0) {
    //             Alert.alert(JSON.stringify(targetAreaData.data.targetArea.edges))
    //         this.saveTargetAreaDropdown(targetAreaData.data.targetArea.edges)

    //         // let firstTarget = targetAreaData.data.targetArea.edges[0];
    //         // console.log(JSON.stringify(firstTarget))
    //         // console.log(domainId)
    //         // this.fetchTargets(domainId, firstTarget.node.id)
    //     }
    // }).catch(error => {
    //     console.log(JSON.stringify(error));
    //     this.setState({ isLoading: false });
    // });
  }

  fetchTargetsByDomain(domainId) {
    // Alert.alert(JSON.stringify("targetAreaData"));
    // let firstDomain = domain;
    let variables = {
      domain: domainId,
    };

    this.setState({isLoading: true, targets: []});
    TherapistRequest.getTargetArea(variables)
      .then((targetAreaData) => {
        this.setState({isLoading: false})
        //  Alert.alert(JSON.stringify(targetAreaData));
        // this.setState({isLoading: false});
        if (
          targetAreaData &&
          targetAreaData.data &&
          targetAreaData.data.targetArea &&
          targetAreaData.data.targetArea.edges &&
          targetAreaData.data.targetArea.edges.length > 0
        ) {
          this.saveTargetAreaDropdown(targetAreaData.data.targetArea.edges);

          let firstTarget = targetAreaData.data.targetArea.edges[0];
          // this.fetchTargets(domainId, firstTarget.node.id)
        }
      })
      .catch((error) => {
        console.log(JSON.stringify(error));
        this.setState({isLoading: false, filteredTargets});
      });
  }
  fetchTargets(domainId, targetAreaId) {
    this.setState({
      isLoading: true,
      targets: [],
      noDataText: '',
      isFilterOpened: true,
    });

    const {student} = this.props.route.params

    let variables = {
      domain: domainId,
      targetArea: targetAreaId,
      student: student.node ? student.node.id : student.id
    };

    //  Alert.alert(JSON.stringify(variables))
    TherapistRequest.getTargets(variables)
      .then((targetsData) => {
        this.setState({isLoading: false});

        console.log(JSON.stringify(targetsData))
        

        if (
          targetsData &&
          targetsData.data &&
          targetsData.data.target &&
          targetsData.data.target.edges &&
          targetsData.data.target.edges.length > 0
        ) {
					this.setState({targets: targetsData.data.target.edges});
					this.setState({isLoading: false})
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
    var Text = '';

    if (this.state.domainDone == 1 && this.state.targetareaDone == 1) {
      this.fetchTargets(
        this.state.selectedDomain,
        this.state.selectedTargetArea,
      );
    } else {
      if (this.state.domainDone == 1) {
        Text = 'Target Area';
      } else if (this.state.targetareaDone == 0 && this.state.domainDone == 0) {
        Text = 'Domain & Target Area';
      } else {
        Text = 'Domain';
      }

      Alert.alert('Error', 'Please select ' + Text);
    }
  }

  getTargetView(target, index) {
    let backgroundColor = Color.white;
    let titleColor = Color.black;
    let subtitleColor = '#999';

    console.log("short terms goal id", this.state.shortTermGoalId)

    if (this.state.newPageParams) {
      if (target.node.id == this.state.newPageParams.target.node.id) {
        backgroundColor = Color.primary;
        titleColor = Color.white;
        subtitleColor = Color.white;
      }
    }

    console.log(target)
    
    return (
      <TouchableOpacity
        style={[
          styles.card,
          {
            backgroundColor:
              target?.node?.allocatedTar == true ? 'pink' : backgroundColor,
          },
        ]}
        key={index}
        onPress={() => {
          if (OrientationHelper.getDeviceOrientation() == 'portrait') {
            this.props.navigation.navigate('TargetAllocateNew', {
              target: target,
              student: this.state.student,
              program: this.state.program,
              shortTermGoalId: this.state.shortTermGoalId,
            });
          } else {
            this.setState({
              newPageParams: {
                target: target,
                student: this.state.student,
                program: this.state.program,
                shortTermGoalId: this.state.shortTermGoalId,
              },
            });
          }
        }}>
        {/* <Image style={styles.targetViewImage} source={require('../../../../android/img/Image.png')} /> */}
        <Text style={[styles.targetViewTitle, {color: titleColor}]}>
          {target.node.targetMain.targetName}
        </Text>
        <Text style={[styles.targetViewDomain, {color: subtitleColor}]}>
          {target.node.domain.domain}
        </Text>
        {/* <Text>{JSON.stringify(target)}</Text> */}
      </TouchableOpacity>
    );
  }

  showDomainFilterOption() {
    let {
      isFilterOpened,
      domainDropdownList,
      targetAreaDropdownList,
      selectedDomain,
      selectedTargetArea,
    } = this.state;
    let {shortTermGoals} = this.state;
    let typesData = [];
    for (let i = 0; i < shortTermGoals.length; i++) {
      typesData[i] = {
        id: shortTermGoals[i].id,
        label: shortTermGoals[i].goalName,
      };
    }
    let unique = typesData.filter(
      ((set) => (f) => !set.has(f.id) && set.add(f.id))(new Set()),
    );
    let defaults = this.props.route.params.defaults;
    return (
      <>
        <View
          style={{
            marginVertical: 5,
            padding: 10,
            borderColor: '#ccc',
            borderWidth: 0.5,
          }}>
          <View style={{flexDirection: 'row'}}>
        <Text style={{width: '90%'}}>{getStr("TargetAllocate.DomainFilter")}</Text>
            <TouchableOpacity
              onPress={() => {
                this.setState({
                  isFilterOpened: !isFilterOpened,
                  selectedDomain: selectedDomain,
                  selectedTargetArea: selectedTargetArea,
                });
              }}>
              <MaterialCommunityIcons
                name={isFilterOpened ? 'chevron-up' : 'chevron-down'}
                size={24}
                style={{textAlign: 'left', paddingLeft: 10}}
              />
            </TouchableOpacity>
          </View>
          <ScrollView>
            {isFilterOpened && (
              <>
                {/* <View>
                  <PickerModal
                    label={getStr("TargetAllocate.ShortTermGoal")}
                    placeholder="(Select Short Term Goal)"
                    selectedValue={
                      this.state.selectedType != ''
                        ? defaults
                          ? this.state.shortTermGoalId
                          : this.state.selectedType
                        : unique[0]?.id
                    }
                    data={unique}
                    onValueChange={(itemValue, itemIndex) => {
                      this.setState({selectedType: itemValue, shortTermGoalId: itemValue});
                    }}
                  />
                </View> */}
                <View>
                  <PickerModal
                    label={getStr("TargetAllocate.Domain")}
                    iconLeft="folder-open"
                    // placeholder={this.state.selectedDomain}
                    selectedValue={this.state.selectedDomain}
                    data={domainDropdownList}
                    onValueChange={(itemValue, itemIndex) => {
                      console.log('ksksksksskskk', itemValue);
                      this.setState({selectedDomain: itemValue, domainDone: 1});
                      this.fetchTargetsByDomain(itemValue);
                    }}
                  />
                </View>
                <View>
                  <PickerModal
                    label={getStr("TargetAllocate.TargetArea")}
                    iconLeft="folder-open"
                    // placeholder={this.state.selectedTargetArea}
                    selectedValue={this.state.selectedTargetArea}
                    data={targetAreaDropdownList}
                    onValueChange={(itemValue, itemIndex) => {
                      this.setState({
                        selectedTargetArea: itemValue,
                        targetareaDone: 1,
                      });
                      //this.fetchTargets(this.state.selectedDomain, itemValue);
                    }}
                  />
                </View>

                <Button
                  labelButton={getStr("TargetAllocate.SuggestTarget")}
                  onPress={() => {
                    this.searchByFilter();
                  }}
                />
              </>
            )}
          </ScrollView>
        </View>
      </>
    );
  }

  renderList() {
    let {targets, noDataText} = this.state;

    console.log(targets)
    
    const filteredTargets = targets.filter(
      createFilter(this.state.searchTarget, KEYS_TO_FILTERS),
    );
    filteredTargets.sort();

    return (
      <>
        {this.state.showSearchFilter && (
          <View style={styles.searchWrapper}>
            <MaterialCommunityIcons
              name="account-search-outline"
              size={24}
              color={Color.gray}
            />
            <SearchInput
              onChangeText={(term) => {
                this.searchUpdated(term);
              }}
              style={styles.searchInput}
              placeholder="Search Targets"
              // clearIcon
            />
          </View>
        )}

        {this.state.isLoading && (
          <View style={{height: 300}}>
            <LoadingIndicator />
          </View>
        )}

        {!this.state.isLoading && (
          <ScrollView>
            {filteredTargets.length == 0 && (
              <NoData>No Target Available</NoData>
            )}

            {filteredTargets.map((target, index) => {
              return this.getTargetView(target, index);
            })}
          </ScrollView>
        )}
      </>
    );
  }

  renderDomainFilterModal() {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={this.state.isShowDomainModal}
        onRequestClose={() => {
          this.setState({isShowDomainModal: false});
        }}>
        <View style={styles.modal}>
          <View style={styles.modalContent}>
            <View style={{flexDirection: 'row', paddingTop: 10}}>
              <TouchableOpacity
                onPress={() => this.handleClose()}
                style={{width: '20%'}}>
                <MaterialCommunityIcons
                  name={'chevron-down'}
                  size={20}
                  style={{textAlign: 'left', paddingLeft: 10}}
                />
              </TouchableOpacity>
              <Text style={{width: '30%', fontSize: 20, textAlign: 'center'}}>
                Filter
              </Text>
              <Text style={{width: '50%', textAlign: 'right'}}>CLEAR ALL</Text>
            </View>
            <ScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              contentInsetAdjustmentBehavior="automatic"
              style={{marginBottom: 50}}>
              <View style={{flexDirection: 'row', width: '100%'}}>
                <View style={{width: '30%'}}>
                  <Text style={styles.domainName}>Domain</Text>
                  <Text style={styles.domainName}>Program</Text>
                  <Text style={styles.domainName}>Language</Text>
                  <Text style={styles.domainName}>Family</Text>
                </View>
                <View style={{width: '70%', padding: 10}}>
                  <Text>
                    You can select multiple domains to see relevant targets.
                  </Text>
                  {this.state.domainList.map((domain, index) => (
                    <CheckBox
                      key={index}
                      title={domain.domain}
                      checked={domain.isSelected}
                      onPress={() => {
                        this.selectDomain(index);
                      }}
                    />
                  ))}
                </View>
              </View>
            </ScrollView>
            <View style={styles.continueView}>
              <TouchableOpacity
                style={styles.continueViewTouchable}
                activeOpacity={0.5}
                onPress={() => {
                  this.applyFilters();
                }}>
                <Text style={styles.continueViewText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }

  renderRightMenu() {
    return (
      <View style={{flexDirection: 'row'}}>
        {/* <TouchableOpacity style={{ paddingHorizontal: 10 }} onPress={() => {
                    this.setState({ showSearchFilter: !this.state.showSearchFilter });
                }}>
                    <MaterialIcons name='search' size={25} color={Color.blackFont} />
                </TouchableOpacity> */}
        {/* Disabled It temporarily */}
        <TouchableOpacity
          style={{paddingHorizontal: 10}}
          onPress={() => {
            this.setState({isFilterOpened: !this.state.isFilterOpened});
          }}>
          <MaterialCommunityIcons
            name="filter-variant"
            size={25}
            color={Color.blackFont}
          />
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    // let { shortTermGoals } = this.state;
    // let typesData = [];
    // for (let i = 0; i < shortTermGoals.length; i++) {
    //     typesData[i] = {
    //         id: shortTermGoals[i].id,
    //         label: shortTermGoals[i].goalName
    //     }
    // }
    // let unique = typesData.filter((set => f => !set.has(f.id) && set.add(f.id))(new Set));
    // let defaults = this.props.route.params.defaults;
    return (
      <SafeAreaView style={styles.container}>
        <NavigationHeader
          backPress={() => this.props.navigation.goBack()}
          title={getStr("TargetAllocate.AllocateTarget")}
          customRightMenu={this.renderRightMenu()}
        />

        <Container>
          {/* <View style={{ flex: 0.1, marginBottom: 50 }}>
                        <PickerModal
                            label="Short Term Goal"
                            placeholder='(Select Short Term Goal)'
                            selectedValue={this.state.selectedType != "" ?( defaults ? this.state.shortTermGoalId : this.state.selectedType ): unique[0]?.id}
                            data={unique}
                            onValueChange={(itemValue, itemIndex) => {
                                this.setState({ selectedType: itemValue });
                            }}
                        />
                    </View> */}
          {OrientationHelper.getDeviceOrientation() == 'portrait' && (
            <>
              {this.state.isFilterOpened && this.showDomainFilterOption()}
              {this.renderList()}
            </>
          )}
          {OrientationHelper.getDeviceOrientation() == 'landscape' && (
            <Row style={{flex: 1}}>
              <Column>
                {this.state.isFilterOpened && this.showDomainFilterOption()}
                {this.renderList()}
              </Column>
              <Column style={{flex: 2, paddingTop: 10}}>
                {this.state.newPageParams && (
                  <TargetAllocateNew
                    disableNavigation
                    route={{params: this.state.newPageParams}}
                    navigation={this.props.navigation}
                  />
                )}
              </Column>
            </Row>
          )}
        </Container>
        {/* {this.renderDomainFilterModal()} */}
      </SafeAreaView>
    );
  }

  handleOpen = () => {
    this.setState({isShowDomainModal: true});
  };

  handleClose = () => {
    this.setState({isShowDomainModal: false});
  };

  applyFilters() {
    this.handleClose();
  }

  selectDomain(index) {
    let domains = this.state.domainList;
    for (let i = 0; i < domains.length; i++) {
      if (index === i) {
        domains[i].isSelected = !domains[i].isSelected;
      }
    }
    this.setState({domainList: domains});
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.white,
  },
  searchWrapper: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    alignItems: 'center',
    height: 40,
    marginVertical: 10,
    backgroundColor: Color.grayWhite,
  },
  card: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
    borderRadius: 5,
    margin: 3,
    marginTop: 10,
    padding: 10,
  },

  targetViewImage: {
    width: '100%',
    height: 200,
    borderRadius: 5,
  },
  targetViewTitle: {
    fontFamily: 'SF Pro Text',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 14,
    color: '#45494E',
    paddingTop: 10,
  },
  targetViewDomain: {
    fontFamily: 'SF Pro Text',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 12,
    color: '#7480FF',
    paddingTop: 5,
  },
  modal: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Color.white,
    width: 300,
  },
});
const mapStateToProps = (state) => ({
  authResult: getAuthResult(state),
});

const mapDispatchToProps = (dispatch) => ({
  dispatchSetToken: (data) => dispatch(setToken(data)),
  dispatchSetTokenPayload: (data) => dispatch(setTokenPayload(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TargetAllocate);
