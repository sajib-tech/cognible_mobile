import React from 'react'
import {
  View,
  Text,
  StyleSheet
} from 'react-native'
import moment from 'moment'

const Comment = (props)=> {
  const {
     key,
     name,
     date,
     comment
  } = props

  const d = moment(date);
  const agodate = moment(d).fromNow(); // 2 months ago

  return(
    <View style={styles.container} key={key}>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.time}>{agodate}</Text>
      <Text style={styles.comment}>{comment}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#3E7BFA'
  },
  name: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 18
  },
  time: {
    fontSize: 12,
    marginBottom: 7
  },
  comment: {
    fontSize: 15
  }
})

export default Comment