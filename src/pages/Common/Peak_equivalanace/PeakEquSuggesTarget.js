import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Image,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import NavigationHeader from '../../../components/NavigationHeader';
import Styles from '../../../utility/Style';
import Color from '../../../utility/Color';
import { SceneMap, TabView } from 'react-native-tab-view';
import Icon from 'react-native-vector-icons/Entypo';
import TherapistRequest from '../../../constants/TherapistRequest';
import { getTargetsByCategory } from '../../../constants/therapist';

const screenWidth = Dimensions.get('window').width;
export default function PeakEquSuggesTarget(props) {
  const { navigation, route } = props;
  const { student, program, shortTermGoalId } = route.params;

  console.log("route params", route.params);

  const [data, setData] = useState([]);
  const [domainData, setDomainData] = useState([]);
  const [selectedIndex, setIndex] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState();
  const [Loading, setLoading] = useState(false);


  const getDomain = () => {
    TherapistRequest.getPeakEquDomain()
      .then(result => {
        setDomainData(result.data.peakEquDomains);
        setSelectedCategory(result.data.peakEquDomains[0].name);
        getPeakEquSuggestedTargets(result.data.peakEquDomains[0].name);
      })
      .catch(error => {
        console.log(error);
        console.log(JSON.stringify(error));
      });
  };
  const getTarget = (id, target) => {
    const variables = {
      id: id
    };
    TherapistRequest.getPeakEquCodeDetails(variables)
      .then(result => {
        {
          result.data.getPeakEquCodeDetails.target.maxSd > 0 &&
            console.log("vbncgvcgcncncvn", result.data)

          console.log('Student data before check--->' + JSON.stringify(student))

          props.navigation.navigate('EquivalanceTarget', {
            target: target,
            student: student,
            program: program,
            maxSD: result.data.getPeakEquCodeDetails.target.maxSd,
            simuless: result.data.getPeakEquCodeDetails.classes.edges,
            shortTermGoalId: shortTermGoalId,
          });
        }

      })
      .catch(error => {
        console.log("jejejejej", error);
        console.log(JSON.stringify(error));
      });
  };

  const getPeakEquSuggestedTargets = async (name) => {
    setData([]);
    setLoading(true);
    const response = await getTargetsByCategory(name);

    if (response) {

      setData(response.data.getPeakEquCodes.edges);
      setLoading(false);
    }
  }

  useEffect(() => {

    // const { shortTermGoalId } = this.props.route.params;
    // setStgId(shortTermGoalId);

    // console.log("shortTermGoalId-----", shortTermGoalId);

    getDomain();

  }, []);

  const renderVw = () => {
    return data.map((item, index) => {
      // console.log("Targets Astha1===",item)
      return (
        <TouchableOpacity
          style={{
            padding: 10,
            borderRadius: 5,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 1,
            },
            shadowOpacity: 0.22,
            shadowRadius: 2.22,
            elevation: 1,
            borderWidth: 0.1,
            borderColor: Color.gray,
            marginVertical: 5
          }}
          onPress={() => {
            getTarget(item.node.id, item.node.target)
          }}>

          {/* <Image
                  style={styles.targetViewImage}
                  source={require('../../../../android/img/peak.jpg')}
              /> */}

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
              <Text>{item.node.code}</Text>
              <Text> : </Text>
              <Text>{item.node.target && item.node.target.targetMain.targetName}</Text>
            </View>

            <MaterialCommunityIcons name={'plus'} size={20} color='#45494E' />
          </View>

        </TouchableOpacity>
      );
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={{ width: '100%' }}>
        <NavigationHeader
          title="Peak Suggested Targets"
          backPress={() => props.navigation.goBack()}
        />
        <View style={styles.domainMainVw}>
          {domainData.map((item, index) => (
            <TouchableOpacity
              style={[
                styles.domainVw,
                {
                  backgroundColor:
                    selectedIndex == index ? Color.primary : 'lightgray',
                },
              ]}
              onPress={() => {
                setIndex(index);
                getPeakEquSuggestedTargets(item.name);
              }}>
              <Text style={{ color: selectedIndex == index ? 'white' : 'black' }}>
                {item.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <ScrollView>
          {Loading && (
            <ActivityIndicator
              size="large"
              color="black"
              style={{
                zIndex: 9999999,
                // backgroundColor: '#ccc',
                opacity: 0.9,
                // position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                // height: screenHeight,
                justifyContent: 'center',
                alignSelf: 'center',
              }}
            />
          )}

          <View style={{ paddingHorizontal: 10, paddingBottom: 100 }}>
            {renderVw()}
          </View>

        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scene: {},
  SquareShapeView: {
    backgroundColor: Color.white,
    margin: 10,
    marginBottom: 10,
    padding: 5,
    paddingLeft: 10,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 1,
    borderWidth: 0.5,
    borderColor: Color.gray,
  },
  searchWrapper: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    alignItems: 'center',
    height: 40,
    marginVertical: 10,
    backgroundColor: Color.grayWhite,
  },
  targetViewImage: {
    width: '100%',
    height: 200,
    borderRadius: 5,
  },
  fixedView: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'flex-end',
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
  domainVw: {
    height: 35,
    width: '24%',
    marginRight: 5,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  domainMainVw: {
    marginTop: 10,
    width: screenWidth,
    padding: 20,
    flexDirection: 'row',
  },
});
