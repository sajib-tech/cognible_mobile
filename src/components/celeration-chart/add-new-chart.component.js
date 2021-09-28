import React, {useState} from 'react';
import {
  Button,
  StyleSheet,
  Dimensions,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import InputCelerationChart from './input-chart.component';
import NavigationHeader from '../../components/NavigationHeader.js';
import moment from 'moment';

const AddCelerationChart = ({route, navigation}) => {
  const celerationChart = {
    date: moment().format('YYYY-MM-DD'),
    title: '',
    category: {name: ''},
    notes: '',
    yAxisLabel: 'COUNT PER MINUTE',
    points: [],
    pointsTypeLables: {
      type1: 'Correct',
      type2: 'Incorrect',
      type3: 'Prompted',
    },
  };
  const [chart, setChart] = useState(celerationChart);
  const {celerationCategories} = route.params;

  const addChart = event => {
    route.params.addCelerationChart(event, chart);
    navigation.navigate('CelerationGraphPanel');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <NavigationHeader
          backPress={() => navigation.goBack()}
          title={'Create Celeration Chart'}
        />
        <InputCelerationChart
          celerationCategories={celerationCategories}
          chart={chart}
          setChart={setChart}
        />

        <Button
          styles={styles.actionButton}
          onPress={event => addChart(event)}
          title="Create New Chart"
        />
      </ScrollView>
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
    alignItems: 'center',
  },
  actionButton: {
    width: Dimensions.get('window').width * 0.5,
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
export default AddCelerationChart;
