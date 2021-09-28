import React, {useState} from 'react';
import ModalSelector from 'react-native-modal-selector';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Button,
  Dimensions,
  SafeAreaView,
} from 'react-native';

import {
  chartPointType,
  chartSessionPointsFields,
} from '../../constants/chart.constant';

const AddUpdatePointDialog = props => {
  const {pointInput, pointIndex, chart} = props;
  const {updatePoint, addPoint, handleClose} = props;
  const [point, setPoint] = useState({
    date: '',
    day: 0,
    count: 0,
    dataType: 0,
    time: '1',
    ...pointInput,
  });
  const [textType, setTextType] = useState('');

  const onPointChange = (event, key) => {
    setPoint({...point, [key]: event});
  };

  const addUpdatePoint = event => {
    event.preventDefault();

    if (pointIndex && pointIndex !== -1) {
      updatePoint(pointIndex, point);
    } else {
      addPoint(point);
    }

    setPoint({date: '', day: 0, dataType: 0, count: 0, time: 1});
    if (handleClose) {
      handleClose();
    }
  };

  let index = 0;
  const data = [
    {
      key: index++,
      value: chartPointType[0],
      label: chart.pointsTypeLables.type1,
    },
    {
      key: index++,
      value: chartPointType[1],
      label: chart.pointsTypeLables.type2,
    },
    {
      key: index++,
      value: chartPointType[2],
      label: chart.pointsTypeLables.type3,
    },
  ];

  function changePointType(value) {
    onPointChange(value.value, 'dataType');
    setTextType(value.label);
  }
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          onChangeText={value => {
            onPointChange(value, 'day');
          }}
          value={point.day}
          placeholder="Day"
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text>Type</Text>
        <ModalSelector
          data={data}
          key={point.dataType}
          onChange={value => changePointType(value)}>
          <TextInput
            style={styles.input}
            editable={false}
            placeholder="Select Type"
            value={textType}
          />
        </ModalSelector>
      </View>

      <View style={styles.inputContainer}>
        <Text>Count</Text>
        <TextInput
          style={styles.input}
          key="count"
          onChangeText={value => {
            onPointChange(value, 'count');
          }}
          value={point.count}
          placeholder="Count"
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text>Time (minutes)</Text>
        <TextInput
          style={styles.input}
          key="time"
          onChangeText={value => {
            onPointChange(value, 'time');
          }}
          value={point.time}
          placeholder="Time"
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputContainer}>
        <Button
          type="submit"
          title={pointIndex && pointIndex !== -1 ? 'Update Point' : 'Add Point'}
          onPress={e => addUpdatePoint(e)}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  inputContainer: {
    marginTop: 20,
    marginBottom: 20,
    width: Dimensions.get('window').width,
  },
  input: {
    padding: 5,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    color: '#000',
  },
});

export default AddUpdatePointDialog;
