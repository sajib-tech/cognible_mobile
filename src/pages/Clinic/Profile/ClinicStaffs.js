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
  TouchableWithoutFeedback,
  RefreshControl,
  Dimensions,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Color from '../../../utility/Color';
import NavigationHeader from '../../../components/NavigationHeader';
import {Button} from 'react-native-elements';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SearchInput, {createFilter} from 'react-native-search-filter';
const KEYS_TO_FILTERS = ['node.name'];

const width = Dimensions.get('window').width;

import {connect} from 'react-redux';
import {getAuthResult} from '../../../redux/reducers/index';
import {setToken, setTokenPayload} from '../../../redux/actions/index';
import TokenRefresher from '../../../helpers/TokenRefresher';
import NoData from '../../../components/NoData';
import moment from 'moment';
import _ from 'lodash';
import ImageHelper from '../../../helpers/ImageHelper.js';
import OrientationHelper from '../../../helpers/OrientationHelper.js';
import {Row, Container, Column} from '../../../components/GridSystem';
import TherapistRequest from '../../../constants/TherapistRequest';
import store from '../../../redux/store/index.js';
import ClinicRequest from '../../../constants/ClinicRequest';

class ClinicStaffs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      searchStaffManagement: '',
      staffs: [],
    };
  }

  _refresh() {
    this.componentDidMount();
  }

  componentDidMount() {
    //Call this on every page
    ClinicRequest.setDispatchFunction(this.props.dispatchSetToken);
    this.getData();
  }

  getData() {
    this.setState({isLoading: true});

    ClinicRequest.getStaffList()
      .then((staffData) => {
				console.log('getStaffList', staffData.data.staffs.edges);
				

        let staffs = staffData.data.staffs.edges.filter((staff) => staff.node.isActive)
        console.log(JSON.stringify(staffs));

        this.setState({
          isLoading: false,
          staffs,
        });
      })
      .catch((error) => {
        console.log(error);
        this.setState({isLoading: false});
        Alert.alert('Information', error.toString());
      });
  }

  searchUpdated(term) {
    this.setState({searchStaffManagement: term});
  }

  showDetail(item) {
    this.props.navigation.navigate('ClinicStaffDetail', item);
  }

  render() {
    let {staffs} = this.state;
    const filteredStaffManagements = staffs.filter(
      createFilter(this.state.searchStaffManagement, KEYS_TO_FILTERS),
    );
    filteredStaffManagements.sort();

    return (
      <SafeAreaView style={styles.container}>
        <NavigationHeader
          enable={this.props.disableNavigation != true}
          backPress={() => this.props.navigation.goBack()}
          title={'Staff Management'}
          materialCommunityIconsName="plus"
          dotsPress={() => {
            this.props.navigation.navigate('ClinicStaffNew');
          }}
          disabledTitle
        />

        <Container enablePadding={this.props.disableNavigation != true}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: Color.grayWhite,
              marginBottom: 10,
            }}>
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
              placeholder="Search Staff"
            />
          </View>

          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={this.state.isLoading}
                onRefresh={this._refresh.bind(this)}
              />
            }>
            {filteredStaffManagements.map((staff, index) => {
              return (
                <View style={{paddingHorizontal: 3}} key={index}>
                  <TouchableOpacity
                    activeOpacity={0.9}
                    style={styles.studentItem}
                    onPress={() => {
                      this.showDetail(staff);
                    }}>
                    <Image
                      style={styles.studentImage}
                      source={{uri: ImageHelper.getImage(staff.node.image)}}
                    />
                    <View style={{flex: 1, marginHorizontal: 8}}>
                      <Text style={styles.text}>{staff.node.name}</Text>
                      {staff.node.userRole && (
                        <Text style={styles.studentSubject}>
                          {staff.node.userRole.name}
                        </Text>
                      )}
                    </View>
                    <MaterialCommunityIcons
                      name="chevron-right"
                      size={24}
                      color={Color.grayFill}
                    />
                  </TouchableOpacity>
                </View>
              );
            })}

            {filteredStaffManagements.length == 0 && (
              <NoData>No Staff Available</NoData>
            )}
          </ScrollView>
        </Container>
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  header: {
    alignSelf: 'flex-end',
    borderRadius: 20,
    marginTop: 8,
  },
  recentImage: {
    width: width / 11,
    height: width / 11,
    borderRadius: 20,
  },
  studentImage: {
    width: 50,
    height: 50,
    borderRadius: 4,
  },
  smallImage: {
    width: width / 15,
    height: width / 15,
    borderRadius: 2,
  },
  bigImage: {
    width: width / 3,
    height: width / 3.3,
    resizeMode: 'contain',
    // backgroundColor: 'red'
  },
  row: {
    flex: 1,
    flexDirection: 'row',
  },
  container: {
    flex: 1,
    backgroundColor: Color.white,
  },
  recentBox: {
    marginHorizontal: 8,
    height: 60,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 14,
  },
  textBig: {
    fontSize: 16,
  },
  textSmall: {
    fontSize: 10,
  },
  newCount: {
    backgroundColor: Color.primary,
    padding: 2,
    width: 16,
    height: 16,
    borderRadius: 4,
    justifyContent: 'center',
  },
  textCount: {
    color: Color.white,
    fontSize: 10,
    textAlign: 'center',
  },
  buttonStart: {
    flex: 1,
    backgroundColor: Color.primary,
    borderRadius: 8,
    alignItems: 'center',
    paddingVertical: 12,
  },
  buttonStartText: {
    color: Color.white,
  },
  buttonEnd: {
    flex: 1,
    borderColor: Color.primary,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: 'center',
    paddingVertical: 12,
  },
  buttonEndText: {
    color: Color.primary,
  },
  line: {
    height: 1,
    width: width / 1.2,
    backgroundColor: Color.silver,
    marginVertical: 4,
  },
  dot: {
    height: 5,
    width: 5,
    backgroundColor: Color.silver,
    borderRadius: 3,
    marginHorizontal: 8,
  },
  studentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: Color.white,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
    borderRadius: 5,
    marginBottom: 7,
    marginTop: 3,
  },
  studentSubject: {
    fontSize: 12,
    color: 'rgba(0,0,0,0.5)',
  },
  searchInput: {
    padding: 4,
    backgroundColor: Color.grayWhite,
  },
});

const mapStateToProps = (state) => ({
  authResult: getAuthResult(state),
});

const mapDispatchToProps = (dispatch) => ({
  dispatchSetToken: (data) => dispatch(setToken(data)),
  dispatchSetTokenPayload: (data) => dispatch(setTokenPayload(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ClinicStaffs);
