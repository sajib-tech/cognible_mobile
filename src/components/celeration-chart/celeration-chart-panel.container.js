import React, {Component} from 'react';
import {connect} from 'react-redux';

import {
  fetchAllCelerationCategories,
  fetchAllCelerationCharts,
  onCelerationChartChange,
  addCelerationChart,
  onSelectChart,
  updateCelerationChart,
  addPoint,
  updatePoint,
  onDisplaySelectedChart,
  openAddDrawer,
  setStudentId,
  resetCelerationChart,
  onBehaviorTypesChange,
} from '../../redux/actions/celeration-chart/panel.action';
import NavigationHeader from '../../components/NavigationHeader.js';
import Color from '../../utility/Color';
import CelerationChart from './celeration-chart.component';
import {Text} from 'react-native-elements';
import CelerationGraph from './celeration-graph.component';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DateInput from '../DateInput';
import moment from 'moment';
import {
  ScrollView,
  View,
  FlatList,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Button,
} from 'react-native';

class CelerationGraphPanel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      range: [ moment().subtract(1, 'year').isoWeek(moment().isoWeek()).isoWeekday(moment().isoWeekday()), moment()]
    };
  }
  componentDidMount() {
    let student = this.props.route.params;

    const {
      fetchAllCelerationCategoriesAction,
      fetchAllCelerationChartsAction,
      openAddDrawerAction,
      setStudentIdAction,
    } = this.props;
    setStudentIdAction(student.node.id);
    fetchAllCelerationCategoriesAction();
    fetchAllCelerationChartsAction();
    openAddDrawerAction();
  }

  render() {
    const dataColumns = [
      'date',
      'title',
      'category',
      'notes',
      'recordingParameters',
    ];

    const {range} = this.state;

    const {
      celerationCategories,
      celerationCharts,
      celerationChartIndex,
      celerationChart,
      behaviorTypesSelected,
    } = this.props;
    const {
      onCelerationChartChangeAction,
      addCelerationChartAction,
      onSelectChartAction,
      updateCelerationChartAction,
      addPointAction,
      updatePointAction,
      resetCelerationChartAction,
      onDisplaySelectedChartAction,
      onBehaviorTypesChangeAction,
    } = this.props;

    const selectChart = item => {
      onSelectChartAction(item);
      this.props.navigation.navigate('UpdateCelerationChart', {
        celerationCategories: celerationCategories,
        chart: item,
        updateCelerationChart: updateCelerationChartAction,
      });
    };

    const displayChart = item => {
      onDisplaySelectedChartAction(item);
    };

    const changeStartDate = value => {
      this.setState({
        range: [moment(value), range[1]],
      });
    };

    const changeEndDate = value => {
      this.setState({
        range: [range[0], moment(value)],
      });
    };

    const filterCelerationChartsByDate = () => {
      return celerationCharts.filter(chart => {
        const chartDate = moment(chart.date);
        return chartDate >= range[0] && chartDate <= range[1];
      });
    }

    return (
      <SafeAreaView style={styles.container}>
        <NavigationHeader
          backPress={() => this.props.navigation.goBack()}
          title={'Celeration Graphs'}
        />
        <ScrollView>
          <Text h1>Charts</Text>

          <TouchableOpacity
            style={styles.plus}
            onPress={() => {
              this.props.navigation.navigate('AddCelerationChart', {
                celerationCategories: celerationCategories,
                chart: celerationChart,
                addCelerationChart: addCelerationChartAction,
              });
            }}>
            <MaterialCommunityIcons
              name="plus"
              size={30}
              color={Color.primary}
            />
          </TouchableOpacity>

          <DateInput
            value={range[0]}
            onChange={e => {
              changeStartDate(e);
            }}
            style={styles.input}
            mode="date"
            placeholder="select date"
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
              dateInput: {
                marginLeft: 36,
              },
            }}
          />

          <DateInput
            value={range[1]}
            onChange={e => {
              changeEndDate(e);
            }}
            style={styles.input}
            mode="date"
            placeholder="select date"
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
              dateInput: {
                marginLeft: 36,
              },
            }}
          />
          
          {celerationChartIndex === -1 ? (
            <View>
              <FlatList
                data={filterCelerationChartsByDate()}
                renderItem={({item, index}) => (
                  <View style={styles.cardStyle}>
                    <View>
                      <CelerationChart chart={item} />
                    </View>
                    <View>
                      <View style={{paddingBottom: 20}}>
                        <TouchableOpacity
                          style={styles.header}
                          onPress={() => selectChart(item)}>
                          <MaterialCommunityIcons
                            name="pencil"
                            size={24}
                            color={Color.primary}
                          />
                        </TouchableOpacity>
                      </View>
                      <View>
                        <TouchableOpacity
                          style={styles.header}
                          onPress={() => displayChart(item)}>
                          <MaterialCommunityIcons
                            name="chart-line"
                            size={24}
                            color={Color.primary}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                )}
                keyExtractor={item => item.id}
              />
            </View>
          ) : (
            <View>
              <Button title="Back" onPress={resetCelerationChartAction} />
              <CelerationGraph
                chart={celerationChart}
                addPoint={addPointAction}
                updatePoint={updatePointAction}
                onCelerationChartChange={onCelerationChartChangeAction}
                updateCelerationChart={updateCelerationChartAction}
                behaviorTypesSelected={behaviorTypesSelected}
                onBehaviorTypesChange={onBehaviorTypesChangeAction}
                navigation={this.props.navigation}
              />
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    alignSelf: 'flex-end',
  },
  plus: {
    alignSelf: 'flex-end',
    marginRight: 20,
    marginBottom: 10,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  head: {
    height: 40,
    backgroundColor: '#f1f8ff',
  },
  text: {
    margin: 6,
  },
  cardStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 10,
    padding: 10,
    borderRadius: 5,
    backgroundColor: Color.white,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },
});

const mapStateToProps = state => ({
  celerationCategories: state.celerationChartState.celerationCategories,
  celerationChart: state.celerationChartState.celerationChart,
  celerationCharts: state.celerationChartState.celerationCharts,
  celerationChartIndex: state.celerationChartState.celerationChartIndex,
  drawer: state.celerationChartState.drawer,
  behaviorTypesSelected: state.celerationChartState.behaviorTypesSelected,
});

const mapDispatchToProps = dispatch => ({
  fetchAllCelerationCategoriesAction: () =>
    dispatch(fetchAllCelerationCategories()),
  fetchAllCelerationChartsAction: () => dispatch(fetchAllCelerationCharts()),
  openAddDrawerAction: () => dispatch(openAddDrawer()),
  onCelerationChartChangeAction: (event, key) => dispatch(onCelerationChartChange(event, key)),
  addCelerationChartAction: (event, chart) =>
    dispatch(addCelerationChart(event, chart)),
  onSelectChartAction: (event, index) => dispatch(onSelectChart(event, index)),
  updateCelerationChartAction: (event, chart) =>
    dispatch(updateCelerationChart(event, chart)),
  resetCelerationChartAction: () => dispatch(resetCelerationChart()),
  addPointAction: point => dispatch(addPoint(point)),
  updatePointAction: (currentPoint, newPoint) =>
    dispatch(updatePoint(currentPoint, newPoint)),
  onDisplaySelectedChartAction: (event, index) =>
    dispatch(onDisplaySelectedChart(event, index)),
  onBehaviorTypesChangeAction: behaviors =>
    dispatch(onBehaviorTypesChange(behaviors)),
  setStudentIdAction: value => dispatch(setStudentId(value)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CelerationGraphPanel);
