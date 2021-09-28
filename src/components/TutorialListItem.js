import React, {Component} from 'react';

import {View, Text, Image, FlatList, StyleSheet, Alert} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {TouchableOpacity} from 'react-native-gesture-handler';

class TutorialListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: props.title,
      description: props.description,
      duration: props.duration,
      imageurl: props.thumbimageurl,
      videodata: props.content,
    };
  }

  render() {
    return (
      <View style={styles.listItemView}>
        <TouchableOpacity
          onPress={() =>
            this.props.navigation.navigate('Playing Tutorial Video', {
              content: this.state.videodata,
            })
          }>
          <View style={styles.listItemImageView}>
            <FontAwesome5
              name={'play-circle'}
              style={{
                position: 'absolute',
                top: 65,
                left: 135,
                zIndex: 99999,
                fontSize: 60,
                color: '#FFFFFF',
              }}
            />
            {/*   <Image source={{uri: this.state.imageurl}} style={styles.listItemImage} />*/}
            <Image
              source={require('../../android/img/Image.png')}
              style={styles.listItemImage}
            />
          </View>
          <View style={styles.listItemTextView}>
            <Text style={styles.listItemTextTitle}>{this.state.title}</Text>
            <Text style={styles.listItemDuration}>
              {this.state.duration} mins
            </Text>
          </View>
          <Text style={styles.listItemTextDescription}>
            {this.state.description}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  listItemView: {
    borderRadius: 8,
    marginBottom: 20,
    flex: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },
  listItemImageView: {
    width: '100%',
    borderColor: '#ccc',
    borderLeftWidth: 1,
    borderRightWidth: 1,
  },

  listItemImage: {
    width: '100%',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  listItemTextView: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    padding: 10,
  },
  listItemTextTitle: {
    width: '50%',
    textAlign: 'left',
    fontSize: 19,
    color: '#FF8080',
    fontFamily: 'SF Pro Text',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 12,
  },
  listItemDuration: {
    width: '50%',
    textAlign: 'right',
    fontFamily: 'SF Pro Text',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: 12,
    color: '#FF8080',
  },
  listItemTextDescription: {
    padding: 10,
    fontSize: 16,
    color: '#63686E',
    fontFamily: 'SF Pro Text',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: 16,
  },
});
export default TutorialListItem;
