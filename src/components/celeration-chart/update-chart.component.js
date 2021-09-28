import React, {useState} from 'react';
import {
  Button,
  View,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import InputCelerationChart from './input-chart.component';
import NavigationHeader from '../../components/NavigationHeader.js';

const UpdateCelerationChart = ({route, navigation}) => {
  const celerationChart = route.params.chart;
  const [chart, setChart] = useState(celerationChart);
  const {celerationCategories} = route.params;

  const updateChart = event => {
    route.params.updateCelerationChart(event, chart);
    navigation.navigate('CelerationGraphPanel');
  };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <NavigationHeader
          backPress={() => navigation.goBack()}
          title={'Update Celeration Chart'}
        />
        <InputCelerationChart
          celerationCategories={celerationCategories}
          chart={chart}
          setChart={setChart}
        />

        <View style={styles.inputContainer}>
          <Button
            styles={styles.actionButton}
            onPress={event => updateChart(event)}
            title="Save Chart"
          />
        </View>
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
export default UpdateCelerationChart;
