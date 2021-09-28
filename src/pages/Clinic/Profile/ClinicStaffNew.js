import 'react-native-gesture-handler';
import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Styles from '../../../utility/Style.js';
import Color from '../../../utility/Color.js';
import PickerModal from '../../../components/PickerModal';
import NavigationHeader from '../../../components/NavigationHeader';
import Button from '../../../components/Button';

import {Row, Container, Column} from '../../../components/GridSystem';
import store from '../../../redux/store';
import {connect} from 'react-redux';
import {getAuthResult} from '../../../redux/reducers/index';
import {setToken, setTokenPayload} from '../../../redux/actions/index';
import NoData from '../../../components/NoData';
import moment from 'moment';
import ClinicRequest from '../../../constants/ClinicRequest.js';
import DateInput from '../../../components/DateInput.js';
import GraphqlErrorProcessor from '../../../helpers/GraphqlErrorProcessor.js';
import LoadingIndicator from '../../../components/LoadingIndicator.js';

class ClinicStaffNew extends Component {
  constructor(props) {
    super(props);
    //set value in state for initial date
    this.state = {
      isLoading: false,
      isSaving: false,

      empId: '',
      designation: '',
      roles: [],
      role: '',
      email: '',
      firstname: '',
      surname: '',
      genders: [
        {id: 'Male', label: 'Male'},
        {id: 'Female', label: 'Female'},
      ],
      crediantials: [],
      locations: [],
      selectedLocation: null,
      selectedGender: null,
      selectedCred: null,
      mobile: '',
      address: '',
      dob: '2000-01-01',
      ssnAadhar: '',
      qualification: '',
      salutation: '',
      emergencyName: '',
      emergencyContact: '',
      shiftStart: '08:00 AM',
      shiftEnd: '05:00 PM',
      taxId: '',
      np: '',
      duration: '',
      dateOfJoining: moment().format('YYYY-MM-DD'),

      employeeIdErrorMessage: '',
      designationErrorMessage: '',
      roleErrorMessage: '',
      emailErrorMessage: '',
      firstNameErrorMessage: '',
      surnameErrorMessage: '',
      genderErrorMessage: '',
      mobileErrorMessage: '',
      addressErrorMessage: '',
      ssnErrorMessage: '',
      qualificationErrorMessage: '',
      salutationErrorMessage: '',
      emergencyNameErrorMessage: '',
      emergencyContactErrorMessage: '',
      taxErrorMessage: '',
      npiErrorMessage: '',
      durationErrorMessage: '',
      StreetAddressErrorMessage: '',
      CityErrorMessage: '',
      CountryErrorMessage: '',
      StateErrorMessage: '',
      ZipCodeErrorMessage: '',
      crediantialsErrorMessage: '',

      zipCode: '',
      city: '',
      streetAddress: '',
      country: '',
      States: '',
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
    ClinicRequest.staffGetRole()
      .then((result) => {
        console.log('staffGetRole', result);
        debugger;

        let roles = result.data.userRole.map((item) => {
          return {
            id: item.id,
            label: item.name,
          };
        });

        let locations = result?.data?.schoolLocation?.edges.map((item) => {
          return {
            id: item?.node?.id,
            label: item?.node?.location,
          };
        });

        let creds = result?.data?.getStaffCredentials.map((item) => ({
          id: item?.id,
          label: item?.name,
        }));

        this.setState({
          isLoading: false,
          roles,
          crediantials: creds,
          locations,
        });
      })
      .catch((error) => {
        console.log(error);
        this.setState({isLoading: false});
      });
  }

  validateForm() {
    this.setState({
      employeeIdErrorMessage: '',
      designationErrorMessage: '',
      roleErrorMessage: '',
      emailErrorMessage: '',
      firstNameErrorMessage: '',
      surnameErrorMessage: '',
      genderErrorMessage: '',
      mobileErrorMessage: '',
      ssnErrorMessage: '',
      qualificationErrorMessage: '',
      salutationErrorMessage: '',
      emergencyNameErrorMessage: '',
      emergencyContactErrorMessage: '',
      taxErrorMessage: '',
      npiErrorMessage: '',
      durationErrorMessage: '',
      StreetAddressErrorMessage: '',
      CityErrorMessage: '',
      CountryErrorMessage: '',
      StateErrorMessage: '',
      ZipCodeErrorMessage: '',
    });

    let anyError = false;

    if (this.state.empId == '') {
      this.setState({employeeIdErrorMessage: 'Please fill employee ID'});
      anyError = true;
    }

    if (this.state.designation == '') {
      // this.setState({ designationErrorMessage: 'Please fill designation' });
      // anyError = true;
    }

    if (this.state.role == '') {
      this.setState({roleErrorMessage: 'Please fill role'});
      anyError = true;
    }

    if (this.state.email == '') {
      this.setState({emailErrorMessage: 'Please fill email'});
      anyError = true;
    }

    if (this.state.mobile == '') {
      // this.setState({ mobileErrorMessage: 'Please fill mobile' });
      // anyError = true;
    }

    if (this.state.firstname == '') {
      this.setState({firstNameErrorMessage: 'Please fill first name'});
      anyError = true;
    }

    // if (this.state.surname == '') {
    //   this.setState({surnameErrorMessage: 'Please fill surname'});
    //   anyError = true;
    // }

    if (this.state.selectedGender == null) {
      this.setState({genderErrorMessage: 'Please choose gender'});
      anyError = true;
    }
    if (this.state.selectedCred == null) {
      this.setState({crediantialsErrorMessage: 'Please choose crediantials'});
      anyError = true;
    }

    // if (this.state.address == '') {
    //     this.setState({ addressErrorMessage: 'Please fill address' });
    //     anyError = true;
    // }

    if (this.state.ssnAadhar == '') {
      // this.setState({ ssnErrorMessage: 'Please fill SSN/Aadhar' });
      // anyError = true;
    }

    if (this.state.qualification == '') {
      // this.setState({ qualificationErrorMessage: 'Please fill qualification' });
      // anyError = true;
    }

    if (this.state.salutation == '') {
      // this.setState({ salutationErrorMessage: 'Please fill salutation' });
      // anyError = true;
    }

    if (this.state.emergencyName == '') {
      // this.setState({ emergencyNameErrorMessage: 'Please fill emergency name' });
      // anyError = true;
    }

    if (this.state.emergencyContact == '') {
      // this.setState({ emergencyContactErrorMessage: 'Please fill emergency contact' });
      // anyError = true;
    }

    if (this.state.taxId == '') {
      // this.setState({ taxErrorMessage: 'Please fill tax ID' });
      // anyError = true;
    }

    if (this.state.np == '') {
      // this.setState({ npiErrorMessage: 'Please fill NPI' });
      // anyError = true;
    }

    if (this.state.duration == '') {
      // this.setState({ durationErrorMessage: 'Please fill duration' });
      // anyError = true;
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

  saveStaff() {
    if (this.validateForm()) {
      return;
    }

    let {
      empId,
      designation,
      role,
      email,
      firstname,
      surname,
      selectedGender,
      mobile,
      address,
      dob,
      ssnAadhar,
      qualification,
      salutation,
      emergencyName,
      emergencyContact,
      shiftStart,
      shiftEnd,
      taxId,
      np,
      duration,
      dateOfJoining,
    } = this.state;

    let queryString = {
      empId,
      designation,
      role,
      email,
      firstname,
      surname,
      gender: selectedGender,
      mobile,
      address,
      dob,
      ssnAadhar,
      qualification,
      salutation,
      emergencyName,
      emergencyContact,
      shiftStart: shiftStart,
      shiftEnd: shiftEnd,
      taxId,
      npi: np,
      duration,
      dateOfJoining: dateOfJoining,
      city: this.state.city,
      streetAddress: this.state.streetAddress,
      country: this.state.country,
      state: this.state.States,
			zipCode: this.state.zipCode,
			credentials: this.state.selectedCred,
			location: this.state.selectedLocation
    };
    // return;
    console.log(queryString);
    debugger;

    this.setState({isSaving: true});

    ClinicRequest.staffNew(queryString)
      .then((dataResult) => {
        console.log(dataResult);
        this.setState({
          isSaving: false,
        });

        Alert.alert(
          'Information',
          'Successfully Add New Staff',
          [
            {
              text: 'Ok',
              onPress: () => {
                this.props.navigation.goBack();

                setTimeout(() => {
                  let parentScreen = store.getState().profile;
                  if (parentScreen) {
                    parentScreen._refresh();
                  }
                }, 300);
              },
            },
          ],
          {cancelable: false},
        );
      })
      .catch((error) => {
        console.log(error, error.response);
        this.setState({isSaving: false});

        Alert.alert('Information', GraphqlErrorProcessor.process(error));
      });
  }

  render() {
    let {
      empId,
      designation,
      role,
      email,
      firstname,
      surname,
      genders,
      selectedGender,
      mobile,
      address,
      dob,
      ssnAadhar,
      qualification,
      salutation,
      emergencyName,
      emergencyContact,
      shiftStart,
      shiftEnd,
      taxId,
      np,
      zipCode,
      city,
      streetAddress,
      country,
      States,
      duration,
      dateOfJoining,
      selectedCred,
      crediantials,
      crediantialsErrorMessage,
      locations,
      selectedLocation,
    } = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <NavigationHeader
          enable={this.props.disableNavigation != true}
          backPress={() => this.props.navigation.goBack()}
          title={'New Staff'}
          // disabledTitle
        />

        {!this.state.isLoading && (
          <Container enablePadding={this.props.disableNavigation != true}>
            <ScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              contentInsetAdjustmentBehavior="automatic"
              refreshControl={
                <RefreshControl
                  refreshing={this.state.isLoading}
                  onRefresh={this._refresh.bind(this)}
                />
              }>
              <Text style={Styles.grayText}>Employee ID *</Text>
              {this.state.employeeIdErrorMessage != '' && (
                <Text style={{color: Color.danger}}>
                  {this.state.employeeIdErrorMessage}
                </Text>
              )}
              <TextInput
                style={styles.input}
                placeholder={'Employee ID'}
                defaultValue={empId}
                onChangeText={(empId) => this.setState({empId})}
              />

              <Text style={Styles.grayText}>Designation</Text>
              {this.state.designationErrorMessage != '' && (
                <Text style={{color: Color.danger}}>
                  {this.state.designationErrorMessage}
                </Text>
              )}
              <TextInput
                style={styles.input}
                placeholder={'Designation'}
                defaultValue={designation}
                onChangeText={(designation) => this.setState({designation})}
              />

              <PickerModal
                label="Role *"
                error={this.state.roleErrorMessage}
                placeholder="Select Role"
                selectedValue={selectedGender}
                data={this.state.roles}
                onValueChange={(itemValue, itemIndex) => {
                  this.setState({role: itemValue});
                }}
              />

              <Text style={Styles.grayText}>Email *</Text>
              {this.state.emailErrorMessage != '' && (
                <Text style={{color: Color.danger}}>
                  {this.state.emailErrorMessage}
                </Text>
              )}
              <TextInput
                style={styles.input}
                placeholder={'Email'}
                defaultValue={email}
                onChangeText={(email) => this.setState({email})}
              />

              <Text style={Styles.grayText}>First Name *</Text>
              {this.state.firstNameErrorMessage != '' && (
                <Text style={{color: Color.danger}}>
                  {this.state.firstNameErrorMessage}
                </Text>
              )}
              <TextInput
                style={styles.input}
                placeholder={'First Name'}
                defaultValue={firstname}
                onChangeText={(firstname) => this.setState({firstname})}
              />

              <Text style={Styles.grayText}>Surname </Text>
              {this.state.surnameErrorMessage != '' && (
                <Text style={{color: Color.danger}}>
                  {this.state.surnameErrorMessage}
                </Text>
              )}
              <TextInput
                style={styles.input}
                placeholder={'Surname'}
                defaultValue={surname}
                onChangeText={(surname) => this.setState({surname})}
              />

              <PickerModal
                label="Gender *"
                error={this.state.genderErrorMessage}
                placeholder="Select Gender"
                selectedValue={selectedGender}
                data={genders}
                onValueChange={(itemValue, itemIndex) => {
                  this.setState({selectedGender: itemValue});
                }}
              />
              <PickerModal
                label="Credientials *"
                error={crediantialsErrorMessage}
                placeholder="Select Credientials"
                selectedValue={selectedCred}
                data={crediantials}
                onValueChange={(itemValue, itemIndex) => {
                  this.setState({selectedCred: itemValue});
                }}
              />

              <PickerModal
                label="Location"
                error={''}
                placeholder="Select Location"
                selectedValue={selectedLocation}
                data={locations}
                onValueChange={(itemValue, itemIndex) => {
                  this.setState({selectedLocation: itemValue});
                }}
              />

              <Text style={Styles.grayText}>Mobile</Text>
              {this.state.mobileErrorMessage != '' && (
                <Text style={{color: Color.danger}}>
                  {this.state.mobileErrorMessage}
                </Text>
              )}
              <TextInput
                style={styles.input}
                placeholder={'Mobile'}
                defaultValue={mobile}
                keyboardType="numeric"
                onChangeText={(mobile) => this.setState({mobile})}
              />

              {/*<Text style={Styles.grayText}>Address</Text>*/}
              {/*{this.state.addressErrorMessage != '' && <Text style={{ color: Color.danger }}>{this.state.addressErrorMessage}</Text>}*/}
              {/*<TextInput style={styles.input}*/}
              {/*    placeholder={'Address'}*/}
              {/*    defaultValue={address}*/}
              {/*    onChangeText={(address) => this.setState({ address })}*/}
              {/*/>*/}
              <Text style={Styles.grayText}>Street Address</Text>
              {this.state.StreetAddressErrorMessage != '' && (
                <Text style={{color: Color.danger}}>
                  {this.state.StreetAddressErrorMessage}
                </Text>
              )}
              <TextInput
                style={styles.input}
                multiline={true}
                placeholder={'Enter Street Address'}
                defaultValue={streetAddress}
                onChangeText={(streetAddress) => this.setState({streetAddress})}
              />
              <Text style={Styles.grayText}>ZipCode</Text>
              {this.state.ZipCodeErrorMessage != '' && (
                <Text style={{color: Color.danger}}>
                  {this.state.ZipCodeErrorMessage}
                </Text>
              )}
              <TextInput
                style={styles.input}
                placeholder={'Enter Zip Code'}
                defaultValue={zipCode}
                onChangeText={(zipCode) => this.setState({zipCode})}
              />
              <Text style={Styles.grayText}>City</Text>
              {this.state.CityErrorMessage != '' && (
                <Text style={{color: Color.danger}}>
                  {this.state.CityErrorMessage}
                </Text>
              )}
              <TextInput
                style={styles.input}
                placeholder={'Enter City'}
                defaultValue={city}
                onChangeText={(city) => this.setState({city})}
              />
              <Text style={Styles.grayText}>State</Text>
              {this.state.StateErrorMessage != '' && (
                <Text style={{color: Color.danger}}>
                  {this.state.StateErrorMessage}
                </Text>
              )}

              <TextInput
                style={styles.input}
                placeholder={'Enter State'}
                defaultValue={States}
                onChangeText={(States) => this.setState({States})}
              />

              <Text style={Styles.grayText}>Country</Text>
              {this.state.CountryErrorMessage != '' && (
                <Text style={{color: Color.danger}}>
                  {this.state.CountryErrorMessage}
                </Text>
              )}

              <TextInput
                style={styles.input}
                placeholder={'Enter Country'}
                defaultValue={country}
                onChangeText={(country) => this.setState({country})}
              />

              <Text style={Styles.grayText}>SSN/Aadhaar</Text>
              {this.state.ssnErrorMessage != '' && (
                <Text style={{color: Color.danger}}>
                  {this.state.ssnErrorMessage}
                </Text>
              )}
              <TextInput
                style={styles.input}
                placeholder={'SSN/Aadhaar'}
                defaultValue={ssnAadhar}
                onChangeText={(ssnAadhar) => this.setState({ssnAadhar})}
              />

              <Text style={Styles.grayText}>Qualification</Text>
              {this.state.qualificationErrorMessage != '' && (
                <Text style={{color: Color.danger}}>
                  {this.state.qualificationErrorMessage}
                </Text>
              )}
              <TextInput
                style={styles.input}
                placeholder={'Qualification'}
                defaultValue={qualification}
                onChangeText={(qualification) => this.setState({qualification})}
              />

              <Text style={Styles.grayText}>Salutation</Text>
              {this.state.salutationErrorMessage != '' && (
                <Text style={{color: Color.danger}}>
                  {this.state.salutationErrorMessage}
                </Text>
              )}
              <TextInput
                style={styles.input}
                placeholder={'Salutation'}
                defaultValue={salutation}
                onChangeText={(salutation) => this.setState({salutation})}
              />

              <Text style={Styles.grayText}>Emergency Name</Text>
              {this.state.emergencyNameErrorMessage != '' && (
                <Text style={{color: Color.danger}}>
                  {this.state.emergencyNameErrorMessage}
                </Text>
              )}
              <TextInput
                style={styles.input}
                placeholder={'Emergency Name'}
                defaultValue={emergencyName}
                onChangeText={(emergencyName) => this.setState({emergencyName})}
              />

              <Text style={Styles.grayText}>Emergency Contact</Text>
              {this.state.emergencyContactErrorMessage != '' && (
                <Text style={{color: Color.danger}}>
                  {this.state.emergencyContactErrorMessage}
                </Text>
              )}
              <TextInput
                style={styles.input}
                placeholder={'Emergency Contact'}
                keyboardType="numeric"
                defaultValue={emergencyContact}
                onChangeText={(emergencyContact) =>
                  this.setState({emergencyContact})
                }
              />

              <Text style={Styles.grayText}>Tax ID</Text>
              {this.state.taxErrorMessage != '' && (
                <Text style={{color: Color.danger}}>
                  {this.state.taxErrorMessage}
                </Text>
              )}
              <TextInput
                style={styles.input}
                placeholder={'Tax ID'}
                defaultValue={taxId}
                onChangeText={(taxId) => this.setState({taxId})}
              />

              <Text style={Styles.grayText}>NPI</Text>
              {this.state.npiErrorMessage != '' && (
                <Text style={{color: Color.danger}}>
                  {this.state.npiErrorMessage}
                </Text>
              )}
              <TextInput
                style={styles.input}
                placeholder={'NPI'}
                defaultValue={np}
                onChangeText={(np) => this.setState({np})}
              />

              <Text style={Styles.grayText}>Duration</Text>
              {this.state.durationErrorMessage != '' && (
                <Text style={{color: Color.danger}}>
                  {this.state.durationErrorMessage}
                </Text>
              )}
              <TextInput
                style={styles.input}
                placeholder={'Duration'}
                defaultValue={duration}
                onChangeText={(duration) => this.setState({duration})}
              />

              <Text style={Styles.grayText}>Date of Birth *</Text>
              <DateInput
                format="YYYY-MM-DD"
                displayFormat="dddd, DD MMM YYYY"
                value={dob}
                onChange={(dob) => {
                  console.log('result', dob);
                  this.setState({dob});
                }}
              />

              <Text style={Styles.grayText}>Shift Time</Text>

              <Row>
                <Column>
                  <DateInput
                    mode="time"
                    format="hh:mm A"
                    displayFormat="hh:mm A"
                    value={shiftStart}
                    onChange={(shiftStart) => {
                      this.setState({shiftStart});
                    }}
                  />
                </Column>
                <Column>
                  <DateInput
                    mode="time"
                    format="hh:mm A"
                    displayFormat="hh:mm A"
                    value={shiftEnd}
                    onChange={(shiftEnd) => {
                      this.setState({shiftEnd});
                    }}
                  />
                </Column>
              </Row>

              <Text style={Styles.grayText}>Joining Date *</Text>
              <DateInput
                format="YYYY-MM-DD"
                displayFormat="dddd, DD MMM YYYY"
                value={dateOfJoining}
                onChange={(dateOfJoining) => {
                  this.setState({dateOfJoining});
                }}
              />
            </ScrollView>
            <Button
              labelButton="Save Staff"
              onPress={() => this.saveStaff()}
              isLoading={this.state.isSaving}
              style={{marginVertical: 10}}
            />
          </Container>
        )}

        {this.state.isLoading && <LoadingIndicator />}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
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
    width: '85%',
    fontSize: 22,
    fontWeight: 'bold',
    paddingTop: 10,
    color: '#45494E',
  },

  TextStyle: {
    marginTop: 24,
    marginBottom: 16,
    color: 'rgba(95, 95, 95, 0.75)',
    fontSize: 17,
    fontStyle: 'normal',
    fontWeight: 'normal',
  },
  input: {
    marginVertical: 10,
    padding: 6,
    borderRadius: 6,
    borderColor: '#DCDCDC',
    borderWidth: 1,
    flex: 1,
    flexDirection: 'row',
  },
  input1: {
    marginTop: 10,
    marginBottom: 10,

    fontSize: 15,
    fontStyle: 'normal',

    textAlign: 'left',
    color: '#10253C',
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    borderColor: '#DCDCDC',
    borderWidth: 1,
    flex: 1,
    flexDirection: 'row',
    paddingLeft: 15,
  },

  backIconText1: {
    fontSize: 15,
    fontWeight: 'normal',
    color: '#63686E',
  },
  continueViewTouchable: {
    marginTop: 28,
    paddingTop: 10,
    paddingBottom: 20,
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
    marginTop: 500,
  },
  continueViewText: {
    color: '#fff',
    fontSize: 20,
    textAlign: 'center',
  },
  text1: {
    marginLeft: 10,
    marginRight: 19,
  },
});

const mapStateToProps = (state) => ({
  authResult: getAuthResult(state),
});

const mapDispatchToProps = (dispatch) => ({
  dispatchSetToken: (data) => dispatch(setToken(data)),
  dispatchSetTokenPayload: (data) => dispatch(setTokenPayload(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ClinicStaffNew);
