import 'react-native-gesture-handler';
import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  ActivityIndicator,
  Text,
} from 'react-native';

import {useQuery} from '@apollo/react-hooks';
import {Overlay} from 'react-native-elements';
import {client, getTutorialVideosList} from '../../constants';

import TutorialListItem from '../../components/TutorialListItem';

const TutorialsList = props => {
  const {loading, error, data} = useQuery(getTutorialVideosList, {client});

  if (loading) {
    return (
      <Overlay isVisible fullScreen>
        <ActivityIndicator size="large" color="blue" />
      </Overlay>
    );
  } else if (error) {
    return <Text>Error</Text>;
  } else {
    return <TutorialsListP {...props} data={data} />;
  }
};

class TutorialsListP extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.data.VimeoVideos.edges,
    };
    this.getResultData = this.getResultData.bind(this);
    this.getResultListView = this.getResultListView.bind(this);
  }

  getResultData() {
    let resdata = this.state.data;
    return resdata;
  }

  getResultListView() {
    let data = this.getResultData();
    let resList = [];
    for (let x = 0; x < data.length; x++) {
      resList.push(
        <TutorialListItem
          title={data[x].node.name}
          description={data[x].node.description}
          duration={data[x].node.duration}
          thumbimageurl={data[x].node.thubUrl}
          content={data[x].node.url}
          navigation={this.props.navigation}
        />,
      );
    }
    return resList;
  }

  render() {
    return (
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <View style={styles.targetView}>
            <Text style={styles.targetText}>46 of 161 video watched</Text>
            <Text style={styles.targetProgress} />
            <Text style={styles.targetProgressColor} />
          </View>
          {this.getResultListView()}
        </ScrollView>
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  scrollView: {
    padding: 10,
  },
  targetView: {
    paddingBottom: 10,
  },
  targetText: {
    paddingBottom: 10,
    color: 'rgba(95, 95, 95, 0.75)',
    fontSize: 13,
    fontWeight: 'normal',
    fontStyle: 'normal',
    fontFamily: 'SF Pro Text',
  },
  targetProgress: {
    height: 1,
    // width: '100%',
    borderWidth: 2,
    borderRadius: 8,
    borderColor: 'rgba(95, 95, 95, 0.1)',
  },
  targetProgressColor: {
    position: 'absolute',
    top: 28,
    // left: 12,
    width: '15%',
    borderRadius: 8,
    height: 1,
    borderWidth: 2,
    borderColor: '#3E7BFA',
  },
});
export default TutorialsList;
