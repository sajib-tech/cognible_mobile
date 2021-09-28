import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
} from 'react-native';
import NavigationHeader from '../../../components/NavigationHeader';
import Color from '../../../utility/Color';
import Icon from 'react-native-vector-icons/Entypo';
import TherapistRequest from '../../../constants/TherapistRequest';

function Item(props) {
  const {item, index, selectedId, onPress} = props;
  return (
    <TouchableOpacity
      style={{marginHorizontal: 7}}
      onPress={() => {
        onPress(index);
      }}>
      <Text style={styles.classText}>{item.node.name}</Text>
      {index == selectedId && <View style={styles.bottomLineVw} />}
    </TouchableOpacity>
  );
}
function ItemQuestion(props) {
  const {stimData, tabIndex} = props;
  const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  return (
    <TouchableOpacity style={{marginHorizontal: 1}} onPress={() => {}}>
      <View style={[styles.SquareShapeView, {marginTop: 1}]}>
        {stimData.length > 0 && (
          <Text style={styles.headingText}>
            {stimData[tabIndex]?.node.stimuluses.edges[0]?.node.option}-
            {stimData[tabIndex]?.node.stimuluses.edges[1]?.node.option}
          </Text>
        )}
        {stimData.length > 0 && (
          <Text>
            {stimData[tabIndex]?.node.stimuluses.edges[0]?.node.stimulusName} -{' '}
            {stimData[tabIndex]?.node.stimuluses.edges[1]?.node.stimulusName}
          </Text>
        )}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            flexWrap: 'wrap',
            width: '100%',
            marginTop: 10,
          }}>
          {data.map((item, index) => {
            return <View style={styles.scoreItemTextVw} />;
          })}
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function PeakScrollTabView(props) {
  const {navigation, route} = props;
  const {id} = route.params;
  const [index, setIndex] = useState(0);
  const [selectedId, setSelectedId] = useState(0);
  const [tab, setTab] = useState(0);
  const [data, setData] = useState([]);
  const [allData, setAllData] = useState([1]);
  // const data=[1,2,3,4]
  const [code, setCode] = useState('');

  const [valueChange, setValueChange] = useState(false);

  console.log('uhjkjkhjjhjh', id);

  // const rendergetPeakEquCodeDetails = () => {
  //   let variables = {
  //     id: id,
  //   };
  //
  //   TherapistRequest.getPeakEquCodeDetails(variables)
  //     .then(result => {
  //       let codee = result.data.getPeakEquCodeDetails.code;
  //       let allClass = result.data.getPeakEquCodeDetails.classes.edges;
  //       console.log(
  //         'jsjsjjsjsjsjj',
  //         result.data.getPeakEquCodeDetails.classes.edges,
  //       );
  //       setData(allClass);
  //       setCode(codee);
  //     })
  //     .catch(error => {
  //       console.log(error);
  //       console.log(JSON.stringify(error));
  //     });
  // };

  // useEffect(() => {
  //   rendergetPeakEquCodeDetails();
  // }, [rendergetPeakEquCodeDetails]);

  const renderScoreItem = (item, index) => {
    const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    return (
      <TouchableOpacity
        onPress={() => {}}
        style={{flexDirection: 'row', marginBottom: 10}}>
        <View style={styles.scoreItemVw}>
          <Text>A-B</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            flexWrap: 'wrap',
            width: '85%',
          }}>
          {data.map((item, index) => {
            return <View style={styles.scoreItemTextVw} />;
          })}
        </View>
      </TouchableOpacity>
    );
  };

  const renderPeakscorecard = () => {
    const data = [1, 2, 3, 4];
    return (
      <View style={[styles.scoreboardView, {marginBottom: 30}]}>
        <Text style={styles.scoreText}>Scoreboard</Text>
        <Text style={styles.totalScore}>66</Text>
        <View style={{marginTop: 15}}>
          <FlatList
            data={data}
            renderItem={(item, index) => renderScoreItem(item, index)}
            keyExtractor={item => item.id}
            extraData={1}
          />
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <View style={{width: '100%', height: '100%'}}>
        <View style={{}}>
          <NavigationHeader
            title="Equivalence"
            backPress={() => props.navigation.goBack()}
          />
          <View
            style={{
              position: 'absolute',
              top: 13,
              left: 300,
              right: 10,
              bottom: 0,
            }}>
            <TouchableOpacity
              onPress={() => {
                setAllData([
                  ...allData,
                  {title: 'Class 5', data: ['A', 'B', 'C', 'D']},
                ]);
                setValueChange(!valueChange);
              }}>
              <Icon color="black" name="plus" size={30} />
            </TouchableOpacity>
          </View>
        </View>

        <View>
          <Text style={{marginLeft: 10, fontSize: 20}}>{code}</Text>

          <FlatList
            style={{marginTop: 8}}
            bounces
            data={data}
            horizontal
            showsHorizontalScrollIndicator={false}
            extraData={selectedId}
            renderItem={({item, index}) => (
              <Item
                item={item}
                selectedId={selectedId}
                index={index}
                onPress={index => setSelectedId(index)}
              />
            )}
            keyExtractor={item => item.id}
          />
          <View style={{marginTop: 10, marginLeft: 10, flexDirection: 'row'}}>
            <TouchableOpacity onPress={() => setTab(0)}>
              <Text style={{fontSize: 16}}>Training</Text>
              <View
                style={[
                  styles.TrainingTab,
                  {backgroundColor: tab == 0 ? '#007ff6' : 'white'},
                ]}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{marginLeft: 10, width: 60}}
              onPress={() => setTab(1)}>
              <Text style={{fontSize: 16, marginLeft: 20}}>Test</Text>
              <View
                style={[
                  styles.TrainingTab,
                  {
                    backgroundColor: tab == 1 ? '#007ff6' : 'white',
                    left: 10,
                  },
                ]}
              />
            </TouchableOpacity>
          </View>
          <FlatList
            style={{marginTop: 15}}
            bounces
            data={allData}
            showsVerticalScrollIndicator={false}
            renderItem={({item, index}) => (
              <ItemQuestion
                item={item}
                index={index}
                stimData={data}
                tabIndex={selectedId}
              />
            )}
            keyExtractor={item => item.id}
          />
          <View style={{paddingHorizontal: 10}}>{renderPeakscorecard()}</View>
        </View>
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
    padding: 10,
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
  fixedView: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  classText: {
    fontSize: 18,
    width: '100%',
    marginBottom: 5,
    elevation: 5,
    color: 'grey',
    fontFamily: 'SF Pro Text',
  },
  bottomLineVw: {
    borderRadius: 5,
    position: 'absolute',
    bottom: 0,
    width: 80,
    height: '6%',
    alignSelf: 'center',
    backgroundColor: '#007ff6',
  },
  headingText: {
    fontFamily: 'SF Pro Text',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 16,
    color: '#45494E',
  },
  scoreItemTextVw: {
    height: 20,
    marginLeft: 5,
    width: 20,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  scoreboardView: {
    marginTop: 10,
    shadowColor: 'rgba(0, 0, 0, 0.06)',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    borderRadius: 5,
    backgroundColor: 'white',
    width: '100%',
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  scoreText: {
    fontFamily: 'SF Pro Text',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 12,
    marginTop: 5,
    color: 'black',
  },
  totalScore: {
    position: 'absolute',
    right: 20,
    top: 20,
    color: '#3E7BFA',
    fontFamily: 'SF Pro Text',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 16,
  },
  scoreItemVw: {
    height: 24,
    width: 43,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  TrialText: {
    fontFamily: 'SF Pro Text',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 13,
    marginTop: 5,
    color: 'rgba(95, 95, 95, 0.75)',
  },
  TrainingTab: {
    position: 'absolute',
    marginTop: 15,
    bottom: 0,
    width: 50,
    height: '8%',
    alignSelf: 'center',
    backgroundColor: '#007ff6',
  },
});
