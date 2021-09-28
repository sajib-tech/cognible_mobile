import 'react-native-gesture-handler';
import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Picker,
  Text,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ToggleSwitch from 'toggle-switch-react-native';
import Styles from '../../../utility/Style.js';
import Color from '../../../utility/Color.js';
import PickerModal from '../../../components/PickerModal';
import Button from '../../../components/Button';
import NavigationHeader from '../../../components/NavigationHeader.js';

import store from '../../../redux/store';
import {connect} from 'react-redux';
import {getAuthResult} from '../../../redux/reducers/index';
import {setToken, setTokenPayload} from '../../../redux/actions/index';
import NoData from '../../../components/NoData';
import moment from 'moment';
import _ from 'lodash';
import {Row, Container, Column} from '../../../components/GridSystem';
import TherapistRequest from '../../../constants/TherapistRequest.js';
import DateInput from '../../../components/DateInput.js';
import LoadingIndicator from '../../../components/LoadingIndicator';
import TextInput from '../../../components/TextInput';
import ParentRequest from '../../../constants/ParentRequest';
import {CheckBox} from 'react-native-elements';

class StudentNew extends Component {
  constructor(props) {
    super(props);
    //set value in state for initial date
    this.state = {
      isLoading: false,
      isSaving: false,
      showDatepicker: false,

      clientErrorMessage: '',
      emailErrorMessage: '',
      firstNameErrorMessage: '',
      lastNameErrorMessage: '',
      staffErrorMessage: '',
      categoryErrorMessage: '',
      caseManagerErrorMessage: '',
      genderErrorMessage: '',
      locationErrorMessage: '',
      StreetAddressErrorMessage: '',
      CityErrorMessage: '',
      CountryErrorMessage: '',
      StateErrorMessage: '',
      ZipCodeErrorMessage: '',
      zipCode: '',

      clientId: '',
      firstName: '',
      lastName: '',
      selectedCategory: null,
      categories: [],
      email: '',
      city: '',
      streetAddress: '',
      country: '',
      States: '',
      selectedGender: 'Male',
      genders: [
        {id: 'Male', label: 'Male'},
        {id: 'Female', label: 'Female'},
      ],
      dateOfBirth: '2010-01-01',
      selectedLocation: 'TG9jYXRpb25UeXBlOjg=',
      locations: [],
      selectedStaff: null,
      selectedcaseManger: null,
      staffs: [],
      casemannger: [],
			parentActivation: true,
			caseManager: ''
    };
  }

  _refresh() {
    this.componentDidMount();
  }

  componentDidMount() {
    //Call this on every page
    let USER = store.getState().user;
    console.log('hdhhdhd', USER);
    TherapistRequest.setDispatchFunction(this.props.dispatchSetToken);
    this.getData();
    this.getCaseManger();

    // this.getStudentDropdownData()
  }

  getStudentDropdownData = () => {
    TherapistRequest.getStudentDropdownData().then((res) => {
      console.log('res', res);
    });
  };

  getCaseManger() {
    this.setState({isLoading: true});
    TherapistRequest.getCaseMangerData()
      .then((caseManger) => {
        console.log(
          'CaseManger=====',
          caseManger.data.staffs.edges.map((loc) => {
            return {
              id: loc.node.id,
              label: loc.node.name,
              surname: loc.node.surname,
            };
          }),
        );
        let casemannger = caseManger.data.staffs.edges.map((loc) => {
          return {
            id: loc.node.id,
            label: loc.node.name,
            surname: loc.node.surname,
          };
        });

        this.setState({
          isLoading: false,
          casemannger,
        });
      })
      .catch((error) => {
        console.log(error);
        Alert.alert('Error', error.toString());
        this.setState({isLoading: false, isAttendanceLoading: false});
      });
  }

  getData() {
    this.setState({isLoading: true});

    TherapistRequest.getStudentNewData()
      .then((studentData) => {
        console.log('studentData', studentData);

        let locations = studentData.data.schoolLocation.edges.map((loc) => {
          return {
            id: loc.node.id,
            label: loc.node.location,
          };
        });

        locations = _.orderBy(locations, ['label'], ['asc']);

        let categories = studentData.data.category.map((loc) => {
          return {
            id: loc.id,
            label: loc.category,
          };
        });

        let staffs = studentData.data.staffs.edges.map((staff) => {
          return {
            id: staff.node.id,
            label: staff.node.name,
          };
        });

        staffs = _.orderBy(staffs, ['label'], ['asc']);

        console.log(staffs);
        debugger;

        this.setState({
          isLoading: false,
          locations,
          selectedCategory: categories[0].id,
          categories,
          staffs,
        });
      })
      .catch((error) => {
        console.log(error);
        Alert.alert('Error', error.toString());
        this.setState({isLoading: false, isAttendanceLoading: false});
      });
  }

  validateForm() {
    let anyError = false;

    this.setState({
      clientErrorMessage: '',
      emailErrorMessage: '',
      firstNameErrorMessage: '',
      lastNameErrorMessage: '',
      staffErrorMessage: '',
      categoryErrorMessage: '',
      caseManagerErrorMessage: '',
      genderErrorMessage: '',
      locationErrorMessage: '',
      StreetAddressErrorMessage: '',
      CityErrorMessage: '',
      CountryErrorMessage: '',
      StateErrorMessage: '',
      ZipCodeErrorMessage: '',
    });

    if (this.state.clientId == '') {
      this.setState({clientErrorMessage: 'Please fill Client ID'});
      anyError = true;
    }

    if (this.state.email == '') {
      this.setState({emailErrorMessage: 'Please fill email address'});
      anyError = true;
    }

    if (this.state.firstName == '') {
      this.setState({firstNameErrorMessage: 'Please fill first name'});
      anyError = true;
    }

    if (this.state.lastName == '') {
      this.setState({lastNameErrorMessage: 'Please fill last name'});
      anyError = true;
    }

    if (this.state.selectedLocation == '') {
      this.setState({locationErrorMessage: 'Please choose location'});
      anyError = true;
    }

    if (this.state.selectedStaff == null) {
      // this.setState({ staffErrorMessage: 'Please choose authorized staff' });
      // anyError = true;
    }

    if (this.state.selectedCategory == null) {
      this.setState({categoryErrorMessage: 'Please choose category'});
      anyError = true;
    }

    if (this.state.selectedGender == null) {
      this.setState({genderErrorMessage: 'Please choose gender'});
      anyError = true;
    }

    if (this.state.streetAddress == '') {
      // this.setState({ StreetAddressErrorMessage: 'Please Enter Street Address' });
      // anyError = true;
    }
    if (this.state.city == '') {
      // this.setState({ CityErrorMessage: 'Please Enter City' });
      // anyError = true;
    }
    if (this.state.country == '') {
      // this.setState({ CountryErrorMessage: 'Please Enter Country' });
      // anyError = true;
    }
    if (this.state.States == '') {
      // this.setState({ StateErrorMessage: 'Please Enter State' });
      // anyError = true;
    }
    if (this.state.zipCode == '') {
      // this.setState({ ZipCodeErrorMessage: 'Please Enter ZipCode' });
      // anyError = true;
    }

    return anyError;
  }

  addNewStudent() {
    if (this.validateForm()) {
      return;
    }

    let queryString = {
      clientId: this.state.clientId,
      categoryId: this.state.selectedCategory,
      email: this.state.email,
      dateOfBirth: moment(this.state.dateOfBirth).format('YYYY-MM-DD'),
      gender: this.state.selectedGender,
      clinicLocation: this.state.selectedLocation,
      authStaff: this.state.selectedStaff,
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      caseManager: this.state.selectedcaseManger,

      city: this.state.city,
      streetAddress: this.state.streetAddress,
      country: this.state.country,
      state: this.state.States,
      zipCode: this.state.zipCode,

      // categoryId: "Q2F0ZWdvcnlUeXBlOjI=",
      // clientId: "01",
      // clinicLocation: "TG9jYXRpb25UeXBlOjg=",
      // dateOfBirth: "2010-02-10",
      // diagnose: [],
      // email: "febfeb.90@gmail.com",
      // firstName: "Arif",
      // gender: "Male",
      // lastName: "Rakhman",
    };

    console.log('student variables===', queryString);
    debugger;

    this.setState({isSaving: true});

    TherapistRequest.studentNew(queryString)
      .then((leaveResult) => {
        console.log('leaveResult', leaveResult);

        this.setState({
          isSaving: false,
        });

        Alert.alert('Information', 'Successfully Added New Learner.');

        if (this.props.disableNavigation) {
          this.setState({
            clientId: '',
            selectedCategory: null,
            email: '',
            city: '',
            country: '',
            streetAddress: '',
            States: '',
            clinicLocation: null,
            selectedStaff: null,
            firstName: '',
            lastName: '',
          });
        } else {
          this.props.navigation.goBack();
        }

        //refresh list screen
        let parentScreen = store.getState().studentHome;
        if (parentScreen) {
          parentScreen._refresh();
        }
      })
      .catch((error) => {
    		console.log(error, error.response);
    		console.log(error.response)
        this.setState({isSaving: false});

        Alert.alert('Information', JSON.stringify(error));
      });
  }

  render() {
    let {
      clientId,
      firstName,
      lastName,
      selectedCategory,
      categories,
      email,
      selectedGender,
      genders,
      dateOfBirth,
      selectedLocation,
      locations,
      staffs,
      selectedStaff,
      selectedcaseManager,
      zipCode,
      casemannger,
      city,
      streetAddress,
      country,
			States,
			caseManager
    } = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <NavigationHeader
          backPress={() => this.props.navigation.goBack()}
          title={'New Learner'}
        />

        {this.state.isLoading && <LoadingIndicator />}

        {!this.state.isLoading && (
          <Container>
            <ScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              contentInsetAdjustmentBehavior="automatic">
              <TextInput
                label="Client ID *"
                error={this.state.clientErrorMessage}
                placeholder={'ID'}
                defaultValue={clientId}
                onChangeText={(clientId) => this.setState({clientId})}
              />

              <TextInput
                label="Email *"
                error={this.state.emailErrorMessage}
                placeholder={'Email Address'}
                defaultValue={email}
                onChangeText={(email) => this.setState({email})}
              />
              <View style={{alignSelf: 'flex-start', flex: 1, width: '100%'}}>
                <CheckBox
                  containerStyle={{
                    margin: 0,
                    borderWidth: 0,
                    marginBottom: 5,
                    paddingLeft: 0,
                    backgroundColor: Color.white,
                    fontWeight: 'normal',
                  }}
                  title={
                    <Text style={{color: Color.grayFont, paddingLeft: 5}}>
                      Parent Activation
                    </Text>
                  }
                  checkedColor={Color.primary}
                  checked={this.state.parentActivation}
                  onPress={() =>
                    this.setState({
                      parentActivation: !this.state.parentActivation,
                    })
                  }
                />
              </View>

              <TextInput
                label="Learner First Name *"
                error={this.state.firstNameErrorMessage}
                placeholder={'First Name'}
                defaultValue={firstName}
                onChangeText={(firstName) => this.setState({firstName})}
              />

              <TextInput
                label="Learner Last Name *"
                error={this.state.lastNameErrorMessage}
                placeholder={'Last Name'}
                defaultValue={lastName}
                onChangeText={(lastName) => this.setState({lastName})}
              />

              <PickerModal
                label="Select Authorized Staff"
                error={this.state.staffErrorMessage}
                iconLeft="human-male"
                selectedValue={selectedStaff}
                data={staffs}
                onValueChange={(itemValue, itemIndex) => {
                  this.setState({selectedStaff: itemValue});
                }}
              />

              <PickerModal
                label="Case Manager"
                error={this.state.caseManagerErrorMessage}
                iconLeft="folder-open"
                selectedValue={selectedcaseManager}
                data={casemannger}
                onValueChange={(itemValue, itemIndex) => {
                  this.setState({selectedcaseManger: itemValue});
                }}
              />

              {/* <Text style={Styles.grayText}>Case Manager</Text>
              <TextInput
                style={Styles.input}
                multiline={true}
                placeholder={'Case Manager'}
                defaultValue={caseManager}
                onChangeText={(caseManager) => this.setState({caseManager})}
              /> */}

              <PickerModal
                label="Category *"
                error={this.state.categoryErrorMessage}
                iconLeft="folder-open"
                selectedValue={selectedCategory}
                data={categories}
                onValueChange={(itemValue, itemIndex) => {
                  this.setState({selectedCategory: itemValue});
                }}
              />

              <PickerModal
                label="Gender *"
                error={this.state.genderErrorMessage}
                iconLeft="gender-male-female"
                selectedValue={selectedGender}
                data={genders}
                onValueChange={(itemValue, itemIndex) => {
                  this.setState({selectedGender: itemValue});
                }}
              />

              <Text style={Styles.grayText}>Date Of Birth *</Text>
              <DateInput
                format="YYYY-MM-DD"
                displayFormat="dddd, DD MMM YYYY"
                value={dateOfBirth}
                onChange={(dateOfBirth) => {
                  console.log('result', dateOfBirth);
                  this.setState({dateOfBirth});
                }}
              />

              <PickerModal
                label="Location *"
                error={this.state.locationErrorMessage}
                iconLeft={'map-marker'}
                placeholder="Select Location"
                selectedValue={selectedLocation}
                data={locations}
                onValueChange={(itemValue, itemIndex) => {
                  this.setState({selectedLocation: itemValue});
                }}
              />
              <TextInput
                label="Street Address"
                error={this.state.StreetAddressErrorMessage}
                multiline={true}
                placeholder={'Enter Street Address'}
                defaultValue={streetAddress}
                onChangeText={(streetAddress) => this.setState({streetAddress})}
              />
              <TextInput
                label="ZipCode"
                error={this.state.ZipCodeErrorMessage}
                placeholder={'Enter Zip Code'}
                defaultValue={zipCode}
                onChangeText={(zipCode) => this.setState({zipCode})}
              />
              <TextInput
                label="City"
                error={this.state.CityErrorMessage}
                placeholder={'Enter City'}
                defaultValue={city}
                onChangeText={(city) => this.setState({city})}
              />
              <TextInput
                label="State"
                error={this.state.StateErrorMessage}
                placeholder={'Enter State'}
                defaultValue={States}
                onChangeText={(States) => this.setState({States})}
              />
              <TextInput
                label="Country"
                error={this.state.CountryErrorMessage}
                placeholder={'Enter Country'}
                defaultValue={country}
                onChangeText={(country) => this.setState({country})}
              />
            </ScrollView>
            <Button
              labelButton="Add Learner"
              onPress={() => this.addNewStudent()}
              isLoading={this.state.isSaving}
              style={{marginBottom: 10}}
            />
          </Container>
        )}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  header: {
    flexDirection: 'row',
    height: 50,
    width: '100%',
  },
});

const mapStateToProps = (state) => ({
  authResult: getAuthResult(state),
});

const mapDispatchToProps = (dispatch) => ({
  dispatchSetToken: (data) => dispatch(setToken(data)),
  dispatchSetTokenPayload: (data) => dispatch(setTokenPayload(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(StudentNew);
