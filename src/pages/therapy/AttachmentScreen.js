import React from 'react';
import {StyleSheet, Text, View, SafeAreaView, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Pdf from 'react-native-pdf';

import NavigationHeader from '../../components/NavigationHeader';
import {Row, Container, Column} from '../../components/GridSystem';

const AttachmentScreen = (props) => {
  const navigation = useNavigation();

  const {type, url} = props.route.params;

  console.log(type, url);

  return (
    <SafeAreaView style={styles.container}>
      <NavigationHeader
        backPress={() => navigation.goBack()}
        title={'Attachment'}
        disabledTitle
        // materialCommunityIconsName="flash"
        // dotsPress={() => {
        //   this.setState({
        //     showDataRecordingModal: true,
        //     isShowBehaviour: true,
        //   });
        // }}
      />

      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        {type === 'i' && (
          <Image
            source={{uri: url}}
            style={{height: '100%', width: '100%', resizeMode: 'contain'}}
          />
        )}
        {type === 'p' && (
          <Pdf
            source={{
              uri: url,
            }}
            style={{height: '100%', width: '100%'}}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default AttachmentScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
});

{
  /* <View style={{marginHorizontal: 7}}>
<Pdf
  source={{
    uri:
      this.state.attachmentUrl,
  }}
  style={{height: '100%', width: '100%'}}
/>
</View> */
}

{
  /* <View
style={{
  marginHorizontal: 7,
  borderRadius: 10,
  overflow: 'hidden',
  justifyContent: 'center',
  flex: 1,
}}>
<Image
  source={{
    uri: tempUrl
  }}
  style={{height: '80%', width: '100%', resizeMode: 'contain'}}
  progressiveRenderingEnabled
/>
</View> */
}
