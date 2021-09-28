import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import ModalSelector from 'react-native-modal-selector';
import DatePicker from 'react-native-datepicker';

const InputCelerationChart = props => {
  const {celerationCategories, chart, setChart} = props;

  const onCelerationChartChange = (event, key) => {
    let value;
    if (key === 'category') {
      value = celerationCategories.find(c => c.id === event);
    } else {
      value = event;
    }
    setChart({...chart, [key]: value});
  };

  const onRecordingParametersChange = (event, key) => {
    setChart({
      ...chart,
      pointsTypeLables: {
        ...chart.pointsTypeLables,
        [key]: event,
      },
    });
  };

  /**
   * Change the category according to its id
   * @param {*} value
   */
  const changeCategory = value => {
    onCelerationChartChange(value.id, 'category');
    setCategoryType(value.label);
  };

  const [categoryType, setCategoryType] = useState(chart.category.name);

  function categories() {
    if (!celerationCategories) {
      return [];
    }
    return celerationCategories.map(category => {
      return {
        ...category,
        label: category.name,
      };
    });
  }
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputContainer}>
        <Text>Date</Text>
        <DatePicker
          style={{width: Dimensions.get('window').width}}
          date={chart.date}
          mode="date"
          placeholder="Select date"
          format="YYYY-MM-DD"
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
          customStyles={{
            dateIcon: {
              position: 'absolute',
              left: 0,
              top: 4,
              marginLeft: 0,
            },
            // ... You can check the source to find the other keys.
          }}
          onDateChange={value => {
            onCelerationChartChange(value, 'date');
          }}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text>Title</Text>
        <TextInput
          style={styles.input}
          value={chart.title}
          onChangeText={value => {
            onCelerationChartChange(value, 'title');
          }}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text>Category</Text>
        <ModalSelector
          data={categories()}
          onChange={value => changeCategory(value)}>
          <TextInput
            style={styles.input}
            editable={false}
            placeholder="Select Category"
            value={categoryType}
          />
        </ModalSelector>
      </View>

      <View style={styles.inputContainer}>
        <Text>Notes</Text>
        <TextInput
          style={styles.input}
          value={chart ? chart.notes : ''}
          onChangeText={value => {
            onCelerationChartChange(value, 'notes');
          }}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text>Y-Axis Label</Text>
        <TextInput
          style={styles.input}
          value={chart ? chart.yAxisLabel : ''}
          onChangeText={value => {
            onCelerationChartChange(value, 'yAxisLabel');
          }}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text>Recording Parameters</Text>
        <TextInput
          style={styles.input}
          value={chart.pointsTypeLables.type1}
          onChangeText={value => {
            onRecordingParametersChange(value, 'type1');
          }}
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={chart.pointsTypeLables.type2}
          onChangeText={value => {
            onRecordingParametersChange(value, 'type2');
          }}
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={chart.pointsTypeLables.type3}
          onChangeText={value => {
            onRecordingParametersChange(value, 'type3');
          }}
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

export default InputCelerationChart;
