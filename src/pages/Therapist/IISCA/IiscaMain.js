import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Animated,
  TextInput,
  StyleSheet,
  Alert,
} from 'react-native';
import {Row, Container, Column} from '../../../components/GridSystem';
import OrientationHelper from '../../../helpers/OrientationHelper.js';

import Swipeable from 'react-native-gesture-handler/Swipeable';
import NavigationHeader from '../../../components/NavigationHeader';
import {getStr} from '../../../../locales/Locale';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DateInput from '../../../components/DateInput.js';
import PickerModal from '../../../components/PickerModal';
import Button from '../../../components/Button';
import moment from 'moment';
import NoData from '../../../components/NoData';

import {connect} from 'react-redux';
import {setToken, setTokenPayload} from '../../../redux/actions/index';
import {
  getAuthResult,
  getAuthTokenPayload,
} from '../../../redux/reducers/index';
import TherapistRequest from '../../../constants/TherapistRequest';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import Color from '../../../utility/Color';
import LoadingIndicator from '../../../components/LoadingIndicator';

const IiscaMain = (props) => {
  console.log('props>>', props);
  const [student, setStudent] = useState(props.route.params.student);
  const {program}=props.route.params
  const [tab1, setTab1] = useState({
    backgroundColor: '#3371FF',
    color: '#ffffff',
  });
  const [tab2, setTab2] = useState({
    backgroundColor: '#bcbcbc',
    color: '#000000',
  });
  const [active, setActive] = useState(true);
  const [iiscaPrograms, setIiscaProgram] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (student) {
      getData()
    }
  }, [student]);

  const getData=()=>{
    setIsLoading(true);

    const variables = {
        studentId: student.node.id,
      };
      TherapistRequest.getIISCAPrograms(variables)
        .then((res) => {
          setIsLoading(false);
          console.log('response>>', res.data.IISCAPrograms.edges);
          setIiscaProgram(res.data.IISCAPrograms.edges);
        })
        .catch((err) => {
          setIsLoading(false);
        });
  }
  const handleTab = (type) => {
    switch (type) {
      case 'C':
        setTab1({
          backgroundColor: '#3371ff',
          color: '#ffffff',
        });
        setTab2({
          backgroundColor: '#bcbcbc',
          color: '#000000',
        });
        setActive(true);

        break;
      case 'I':
        setTab2({
          backgroundColor: '#3371ff',
          color: '#ffffff',
        });
        setTab1({
          backgroundColor: '#bcbcbc',
          color: '#000000',
        });
        setActive(false);

        break;
      default:
        break;
    }
  };

  const deleteAssessment=(id)=> {
    Alert.alert('Information', 'Are you sure ?', [
      {text: 'No', onPress: () => {}, style: 'cancel'},
      {
        text: 'Yes',
        onPress: () => {
          let variables = {
            id,
          };
          console.log('variable>>>', variables);
          TherapistRequest.deleteIISCAAssessment(variables)
            .then((result) => {
              console.log('result>>>', result.data);
              Alert.alert('Information', 'IISCA Assessment Successfully Deleted!!.');
              getData()
              })
            .catch((error) => {
              console.log('error>>', error);
            });
        },
      },
    ]);
  }

  console.log('isca length>>', iiscaPrograms.length);
  const renderProgressPrograms = () => {
    console.log('progress');
    const progress = iiscaPrograms.filter((x) => x.node.status === 'PROGRESS');
    console.log('progress>>>', progress.length);
    return (
      <ScrollView>
        {progress.length === 0 && (
          <NoData>No Progress Assesments Found.</NoData>
        )}
        {progress.length !== 0 &&
          progress.map(({node}) => {
            let outputDate = moment(node.date).format('MMMM DD, YYYY');
            return (
              <View key={node.id} style={styles.programBox}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={styles.title}>{node.title}</Text>
                  <TouchableOpacity style={{marginRight: 5}} onPress={() => {
                    deleteAssessment(node.id)
                  }}>
                    <MaterialCommunityIcons
                      name="delete"
                      size={20}
                      color={Color.gray}
                    />
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={{marginVertical: 5}}>{outputDate}</Text>
                  <Text
                    style={{
                      color: Color.orange,
                      fontWeight: '700',
                      fontSize: 13,
                    }}>
                    IN-PROGRESS
                  </Text>
                </View>
                <Button
                  theme="secondary"
                  labelButton="Continue Assessment"
                  onPress={() => {
                    props.navigation.navigate('StudentIisca', {
                      student,
                      iiscaId:node.id,
                      program
                    });
                  }}
                />
              </View>
            );
          })}
      </ScrollView>
    );
  };

  const renderCompltedPrograms = () => {
    console.log('completed');
    const completed = iiscaPrograms.filter(
      (x) => x.node.status === 'COMPLETED',
    );
    return (
      <ScrollView>
        {completed.length === 0 && (
          <NoData>No Completed Assesments Found.</NoData>
        )}
        {completed.length !== 0 &&
          completed.map(({node}) => {
            let outputDate = moment(node.date).format('MMMM DD, YYYY');
            return (
              <View key={node.id} style={styles.programBox}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={styles.title}>{node.title}</Text>
                  <TouchableOpacity style={{marginRight: 5}} onPress={() => {}}>
                    <MaterialCommunityIcons
                      name="delete"
                      size={20}
                      color={Color.gray}
                    />
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={{marginVertical: 5}}>{outputDate}</Text>
                  <Text
                    style={{
                      color: Color.greenFill,
                      fontWeight: '700',
                      fontSize: 13,
                    }}>
                    COMPLETED
                  </Text>
                </View>
                <Button
                  theme="secondary"
                  labelButton="Continue Assessment"
                  onPress={() => {
                    props.navigation.navigate('StudentIisca', {
                      student,
                    });
                  }}
                />
              </View>
            );
          })}
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <NavigationHeader
        title={`${student.node.firstname}'s IISCA`}
        backPress={() => props.navigation.goBack()}
      />
      <Container>
        <View
          style={{
            flexDirection: 'row',
            paddingVertical: 5,
            justifyContent: 'center',
            width: '100%',
            marginTop: 10,            
          }}>
          <TouchableOpacity
            style={{
              backgroundColor: tab1.backgroundColor,
              height: 40,
              justifyContent: 'center',
              borderRadius: 5,
              paddingHorizontal: 40,
              marginRight: 5,
            }}
            onPress={() => {
              handleTab('C');
            }}>
            <Text
              style={{
                fontSize: 18,
                color: tab1.color,
                alignSelf: 'center',
              }}>
              Completed
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: tab2.backgroundColor,
              height: 40,
              justifyContent: 'center',
              borderRadius: 5,
              paddingHorizontal: 40,
            }}
            onPress={() => {
              handleTab('I');
            }}>
            <Text
              style={{
                fontSize: 18,
                color: tab2.color,
                alignSelf: 'center',
              }}>
              InProgress
            </Text>
          </TouchableOpacity>
        </View>
        {isLoading && <LoadingIndicator />}

        {!isLoading && (
          <>
            {OrientationHelper.getDeviceOrientation() == 'portrait' && (
              <>
                {active === true && renderCompltedPrograms()}
                {active === false && renderProgressPrograms()}
              </>
            )}

            {OrientationHelper.getDeviceOrientation() == 'landscape' && (
              <>
                {active === true && (
                  <Row style={{flex: 1}}>
                    <Column style={{flex: 1}}>
                      {renderCompltedPrograms()}
                    </Column>
                  </Row>
                )}
                {active === false && (
                  <Row style={{flex: 1}}>
                    <Column style={{flex: 1}}>
                      {renderProgressPrograms()}
                    </Column>
                    {/*<Column style={{ flex: 2 }}>*/}
                    {/*    {rightSideView == 'new' && (*/}
                    {/*        <CreateProgram disableNavigation*/}
                    {/*            route={{ params: { student: this.state.student, isInLandscape: true } }} />*/}
                    {/*    )}*/}

                    {/*    {rightSideView == 'detail' && (*/}
                    {/*        <PeakScreen disableNavigation*/}
                    {/*            route={{ params: { student: this.state.student, category: this.state.category, programID: this.state.programID, isInLandscape: true } }} />*/}
                    {/*    )}*/}
                    {/*</Column>*/}
                  </Row>
                )}
              </>
            )}
          </>
        )}
      </Container>
      <Button
        style={{margin: 10,fontSize:18}}
        labelButton="Create IISCA Assessment"
        onPress={() => {
            props.navigation.navigate('CreateIISCA', {
              student,
              getData
            });
          }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.white,
  },
  programBox: {
    margin: 3,
    marginTop: 10,
    padding: 16,
    borderRadius: 5,
    backgroundColor: Color.white,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },
  title: {
    flex: 1,
    textAlign: 'left',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: 18,
    color: '#45494E',
  },
  type: {
    textAlign: 'center',
    color: '#3E7BFA',
    backgroundColor: 'rgba(62, 123, 250, 0.05)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
});

const mapStateToProps = (state) => ({
  authResult: getAuthResult(state),
});

const mapDispatchToProps = (dispatch) => ({
  dispatchSetToken: (data) => dispatch(setToken(data)),
  dispatchSetPeakPrograms: (data) => dispatch(setPeakPrograms(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(IiscaMain);
