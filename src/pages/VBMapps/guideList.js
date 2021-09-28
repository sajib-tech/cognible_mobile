import React, {Component} from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Color from '../../utility/Color';
import NavigationHeader from '../../components/NavigationHeader.js';
import { Row, Container, Column } from '../../components/GridSystem';

class GuideList extends Component {
  constructor(props) {
    super(props);
  }

  renderChapters = () => {
    let list=[];
    for(let x=1;x<=10;x++) {
      list.push(
        <TouchableOpacity style={styles.chapterContainer} onPress={() => this.props.navigation.navigate('ChapterDetails', {
          chapterNumber: x
        })}>
          <Text style={styles.chapterName}>Chapter {x}</Text>
          <Text style={styles.chapterDesc}>This is chapter {x}</Text>
        </TouchableOpacity>
      );
    }
    return list;
  }

  render() {
    return(
        <SafeAreaView style={styles.container}>
          <NavigationHeader
            backPress={() => this.props.navigation.goBack()}
            title="VBMapps Guide"
          />
          <Container>
            <ScrollView>
              <View style={styles.chaptersContainer}>
                {this.renderChapters()}
              </View>
            </ScrollView>
          </Container>
        </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor:Color.white
  },
  header: {
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between'
  },
  pageHeading: {
    fontSize:24,
    fontWeight:'700',
    flex:1,
    textAlign:'center'
  },
  heading: {
    fontSize:20,
    fontWeight:'700',
    marginBottom:10
  },
  chaptersContainer: {
    marginTop:10
  },
  chapterContainer: {
    borderWidth:1,
    borderRadius:10,
    borderColor:'#DDD',
    padding:20,
    marginVertical:10
  },
  chapterName: {
    fontSize:20,
    fontWeight:'700'
  },
  chapterDesc: {
    marginTop:10
  }
})

export default GuideList;