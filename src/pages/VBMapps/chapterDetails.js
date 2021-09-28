import React, { Component } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator, SafeAreaView } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Color from '../../utility/Color';
import { client, getChapterDetails } from '../../constants/therapist';
import HTML from 'react-native-render-html';
import NavigationHeader from '../../components/NavigationHeader.js';
import { Row, Container, Column } from '../../components/GridSystem';

class ChapterDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      details: ''
    }
  }

  componentDidMount() {
    this.getResultData();
  }

  getResultData() {
    client.mutate({
      mutation: getChapterDetails,
      variables: {
        chapterNumber: this.props.route.params.chapterNumber
      }
    }).then(result => {
      console.log(JSON.stringify(result.data.vbmappGuide.details));
      this.setState({
        details: result.data.vbmappGuide.details
      })
    }).catch(err => console.log(JSON.stringify(err)));
  }

  render() {
    const { details } = this.state;
    let filteredDetails = details.replace(/\\n/g, '');
    let withoutBackslashes = filteredDetails.replace(/\\/g, "");
    let final = withoutBackslashes.replace(/^"(.*)"$/, '$1');
    console.log(withoutBackslashes);
    
    const { chapterNumber } = this.props.route.params;
    return (
      <SafeAreaView style={styles.container}>
        <NavigationHeader
            backPress={() => this.props.navigation.goBack()}
            title="VBMapps Guide"
        />
        <Container>
          <ScrollView showsVerticalScrollIndicator={false}>
            {details === '' ? <ActivityIndicator /> : <HTML html={final}/>}
          </ScrollView>
        </Container>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.white
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pageHeading: {
    fontSize: 24,
    fontWeight: '700',
    flex: 1
  },
  heading: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 10
  }
})

export default ChapterDetails;