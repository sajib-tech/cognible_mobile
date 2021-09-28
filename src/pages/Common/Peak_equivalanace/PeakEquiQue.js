import React, {useEffect, useState, useReg, useRef} from 'react';
import {
  View,
  Text,
  Dimensions,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import NavigationHeader from '../../../components/NavigationHeader';
import {TabBar, TabView} from 'react-native-tab-view';
import Color from '../../../utility/Color';
import Carousel from 'react-native-snap-carousel';
import OrientationHelper from '../../../helpers/OrientationHelper';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const screenWidth = Dimensions.get('window').width;
const initialLayout = {width: screenWidth};
export default function PeakEquiQues(props) {
  const {navigation} = props;
  const [routes, setRoutes] = useState([
    {
      key: 'first',
      title: 'Training',
    },
    {
      key: 'second',
      title: 'Test',
    },
  ]);
  const [index, setIndex] = useState(0);
  const cRef = useRef(null);

  const renderTabBar = props => (
    <View style={{backgroundColor: 'transperant'}}>
      <TabBar
        {...props}
        style={{
          width: screenWidth / 1.4,
          alignSelf: 'center',
          backgroundColor: 'transperant',
        }}
        indicatorStyle={{
          backgroundColor: Color.primary,
          alignSelf: 'center',
          height: 4,
          width: 70,
          marginBottom: 5,
          borderRadius: 10,
          marginLeft: screenWidth / 10,
        }}
        indicatorContainerStyle={{backgroundColor: 'transperant'}}
        renderLabel={({route}) => (
          <View style={{flexDirection: 'row'}}>
            <Text>{route.title}</Text>
          </View>
        )}
      />
    </View>
  );
  const renderScene = ({route}) => {
    switch (route.key) {
      case 'first':
        return (
          <View style={{padding: 10}}>
            {renderPeakQuestion()}
            {renderPeakscorecard()}
          </View>
        );
      case 'second':
        return (
          <View style={{padding: 10}}>
            {renderPeakQuestion()}
            {renderPeakscorecard()}
          </View>
        );
      default:
        return null;
    }
  };

  const renderQuestionItem = ({index, item}) => {
    return (
      <View style={styles.scoreboardView}>
        <View style={{flexDirection: 'row', marginTop: -10}}>
          <Text style={[styles.TrialText, {color: 'black'}]}>
            A-B TRIAL 1/10
          </Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              position: 'absolute',
              right: 0,
            }}>
            <TouchableOpacity
              onPress={() => {
                this.managePickNextPrevious('Previous');
              }}>
              <Text
                style={[styles.arrowButton, {marginTop: 0, marginBottom: -10}]}>
                <FontAwesome5
                  name={'chevron-left'}
                  style={styles.arrowButtonText}
                />
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.managePickNextPrevious('Next');
              }}>
              <Text
                style={[styles.arrowButton, {marginTop: 0, marginBottom: -10}]}>
                <FontAwesome5
                  name={'chevron-right'}
                  style={styles.arrowButtonText}
                />
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.QuestionText}>
          Present Kunal with a toy and ask “What do you do with this toy?”
        </Text>
        <Text style={styles.QuestionDescText}>
          Describing the question in a couple of text lines to explain
          Describing the question in a couple of text
        </Text>
        <View style={{marginBottom: 20}}>
          <Text style={[styles.scoreText, {marginBottom: 30, marginTop: 20}]}>
            Scoring
          </Text>
          <View style={styles.containerPeak}>
            <TouchableOpacity
              onPress={() => {}}
              style={[styles.SquareShapeView, {backgroundColor: 'white'}]}>
              <Text style={styles.peakNumber}>0</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {}}
              style={[styles.SquareShapeView, {backgroundColor: 'white'}]}>
              <Text style={styles.peakNumber}>2</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {}}
              style={[styles.SquareShapeView, {backgroundColor: 'white'}]}>
              <Text style={styles.peakNumber}>4</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {}}
              style={[styles.SquareShapeView, {backgroundColor: 'white'}]}>
              <Text style={styles.peakNumber}>8</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {}}
              style={[styles.SquareShapeView, {backgroundColor: 'white'}]}>
              <Text style={styles.peakNumber}>10</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const renderPeakQuestion = () => {
    const data = [1, 2, 3, 4];
    return (
      <Carousel
        layout={'default'}
        ref={cRef}
        data={data}
        renderItem={renderQuestionItem}
        scrollEnabled={false}
        sliderWidth={screenWidth - 20}
        itemWidth={screenWidth - 20}
        // onSnapToItem={index => {
        // 	if(currentPeak[index] == undefined && this.state.peakType != 'automatic'){
        // 		this.createBlock(this.state.currentPeakSkillId)
        // 	}
        // 	const trials = currentPeak[index] != undefined ?
        // 		currentPeak[index].node.trial != undefined ?
        // 			currentPeak[index].node.trial.edges : [] : []
        // 	this.setState({currentPeakStimIndex: index,currentPeakTrial:
        // 			trials.length == 0 ? 1 : trials.length < 10 ?
        // 				trials.length  : 10})
        // }}
      />
    );
  };

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
    <View>
      <NavigationHeader
        title="Equivalence"
        backPress={() => navigation.goBack()}
      />
      <View style={{height: '100%'}}>
        <TabView
          navigationState={{index, routes}}
          renderScene={renderScene}
          onIndexChange={index => {
            setIndex(index);
          }}
          initialLayout={initialLayout}
          renderTabBar={props => renderTabBar(props)}
        />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
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
  scoreItemTextVw: {
    height: 20,
    marginLeft: 5,
    width: 20,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  TrialText: {
    fontFamily: 'SF Pro Text',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 13,
    marginTop: 5,
    color: 'rgba(95, 95, 95, 0.75)',
  },
  QuestionText: {
    fontFamily: 'SF Pro Text',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 16,
    marginTop: 10,
    color: '#45494E',
  },
  QuestionDescText: {
    fontFamily: 'SF Pro Text',
    fontStyle: 'normal',
    fontSize: 14,
    marginTop: 10,
    color: 'rgba(95, 95, 95, 0.75)',
  },
  containerPeak: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'white',
  },
  peakNumber: {
    alignItems: 'center',
    justifyContent: 'center',
    color: 'black',
  },
  SquareShapeView: {
    width: 40,
    height: 40,
    borderColor: 'rgba(0, 0, 0, 0.2)',
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowButton: {
    justifyContent: 'center',
    width: 40,
    height: 40,
    // backgroundColor: '#3E7BFA',
    borderRadius: 4,
    marginLeft: 8,
    paddingTop: 10,
    textAlign: 'center',
  },
});
