import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import NavigationHeader from '../../components/NavigationHeader';
import {getStr} from '../../../locales/Locale';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {connect} from 'react-redux';
import {setToken, setTokenPayload} from '../../redux/actions/index';
import {getAuthResult, getAuthTokenPayload} from '../../redux/reducers/index';
import ParentRequest from '../../constants/ParentRequest';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Color from '../../utility/Color';
import {SafeAreaView} from 'react-native';
import LoadingIndicator from '../../components/LoadingIndicator';

const BehaviorRecordingOption = (props) => {
  const [template, setTemplate] = useState(props.route.params.template);
  const [behaviorType, setBehaviorType] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [studentId,setStudentId]=useState(props.route.params.studentId)
  console.log('template-->', props);

  useEffect(() => {
    ParentRequest.getBehaviorTemplateDetails({
      id: template,
    }).then((res) => {
      console.log('response--->', res.data);
      setBehaviorType(
        JSON.parse(
          res.data.getBehaviorTemplateDetails.behaviorType.replace(/'/g, '"'),
        ),
      );
      setLoading(false);
    });
  }, []);
  console.log('props----->', behaviorType);

  const getBehaviorType = (behaviorType) => {
    let x;
    switch (behaviorType) {
      case 'FR':
        x = 'Frequency and Rate';
        break;
      case 'DR':
        x = 'Duration';
        break;
      case 'LT':
        x = 'Latency';
        break;
      case 'PI':
        x = 'Partial Interval';
        break;
      case 'WI':
        x = 'Whole Interval';
        break;
      case 'MT':
        x = 'Momentary Time sample';
        break;
      default:
        x = '';
    }
    return x;
  };

  const gotoRecordingScreen=(item)=>{
      console.log('pressed',item);
      if(item==='FR'){
        props.navigation.navigate('BehaviorFRScreen', {
            studentId: studentId,
            tempId:template,
            parent:'BehaviorRecordingOption'
          });
      }
      else if(item==='DR'){
        props.navigation.navigate('BehaviorDRScreen', {
          studentId: studentId,
          tempId:template,
         
        });
      }

  }

  return (
    <SafeAreaView style={{backgroundColor: '#fff', flex: 1}}>
      <NavigationHeader
        title={getStr('BegaviourData.BehaviorType')}
        backPress={() => props.navigation.goBack()}
      />
      {isLoading && <LoadingIndicator />}

      {!isLoading &&
        behaviorType &&
        behaviorType.map((item) => {
          return (
            <TouchableOpacity
            key={item}
              activeOpacity={0.8}
              onPress={()=>
                  gotoRecordingScreen(item)
              }
              style={styles.card}>
              <View>
                <Text style={styles.title}>{`${getBehaviorType(
                  item,
                )}-(${item})`}</Text>
              </View>
              <MaterialCommunityIcons
                name={'arrow-right'}
                color={Color.primary}
                size={24}
              />
            </TouchableOpacity>
          );
        })}
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    margin: 5,
    flex: 1,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 30,
    marginVertical: 4,
    padding: 30,
    borderWidth: 1,
    borderColor: Color.gray,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Color.blackFont,
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
)(BehaviorRecordingOption);
