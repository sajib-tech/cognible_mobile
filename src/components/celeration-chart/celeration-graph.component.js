import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Button,
  StyleSheet,
  processColor,
  FlatList,
} from 'react-native';
import Dialog from 'react-native-dialog';

import {LineChart} from 'react-native-charts-wrapper';

import React, {Component} from 'react';

import Moment from 'moment';
import {
  chartPointType,
  chartSessionPointsFields,
} from '../../constants/chart.constant';
import AddUpdatePoint from './add-update-point.component';
import CelerationChartOtherPoints from './celeration-chart-other-points';
import CelerationChartBehaviourPoints from './celeration-chart-behaviour-points';
import CelerationChartSessionPoints from './celeration-chart-session-points';
import DateInput from '../DateInput';
import moment from 'moment';
import MultiSelect from 'react-native-multiple-select';
import HighchartsReactNative from '@highcharts/highcharts-react-native';
import AddUpdatePointDialog from './add-new-point-dialog.component';

class CelerationGraph extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      point: {},
      pointIndex: 0,
      pointsDrawer: false,
      behaviorTypes: [],
      behaviorMultiSelect: [],
      selectedItems: [],
      range: [
        moment()
          .subtract(1, 'year')
          .isoWeek(moment().isoWeek())
          .isoWeekday(moment().isoWeekday()),
        moment(),
      ],
    };
  }

  onSelectedItemsChange = (selectedItems) => {
    const {onBehaviorTypesChange} = this.props;
    this.setState({selectedItems});
    onBehaviorTypesChange(
      selectedItems.map((p) => {
        return {
          behavior: this.state.behaviorMultiSelect.find((x) => x.id === 'p')
            .name,
        };
      }),
    );
  };

  componentDidMount() {
    const {chart} = this.props;

    if (chart.category.name === 'Behaviour' && chart.points) {
      this.setState({
        behaviorTypes: chart.points.map((p) => p.behaviour),
        behaviorMultiSelect: chart.points.map((p) => {
          return {
            id: p.day,
            name: p.behaviour,
          };
        }),
      });
    }
  }

  render() {
    const {
      point,
      pointIndex,
      open,
      range,
      behaviorMultiSelect,
      selectedItems,
    } = this.state;
    const {chart, behaviorTypesSelected} = this.props;
    const {
      addPoint,
      updatePoint,
      onCelerationChartChange,
      onBehaviorTypesChange,
    } = this.props;

    const onBehaviorsSelect = (selectedItems) => {
      onBehaviorTypesChange(
        behaviorTypesSelected.map((p) => {
          return {
            behaviour: p.name,
          };
        }),
      );
    };

    const onSelectedItemsChange = (selectedItems) => {
      this.setState({selectedItems});
      onBehaviorTypesChange(
        selectedItems.map((p) => {
          return this.state.behaviorMultiSelect.find((x) => x.id === p).name;
        }),
      );
    };

    const aTransform = 142.86;
    const bTransform = 4;

    function linearToLogarithmic(value) {
      return Math.pow(10, value / aTransform - bTransform);
    }

    function logarithmicToLinear(value) {
      if (value === 0) {
        return 0;
      }
      return aTransform * (Math.log10(value) + bTransform);
    }

    /**
     * Filters the input array based on the chart point type.
     * Then, maps it to only x and y values to be shown on the chart.
     * @param {*} array
     * @param {*} pointType
     * @param {*} onlyTime
     */
    const getDataPointsOnChart = (chartSelected, pointType, onlyTime) => {
      if (!chartSelected.points || !chartSelected.category) {
        return [];
      }

      let type;
      let list;

      switch (chartSelected.category.name) {
        case 'Session': {
          type = chartSessionPointsFields[pointType];
          list = chartSelected.points.filter((p) => p[type] > 0);

          return sortedPoints(
            list.map((p) => {
              const startDate = Moment(chartSelected.startDate);
              const latestDate = Moment(p.date);
              const diff = startDate.diff(latestDate, 'days');
              return {
                x: diff,
                y: p[type],
              };
            }),
          );
        }

        case 'Behaviour':
          list = chartSelected.points.filter((p) => p.frequency > 0);

          if (behaviorTypesSelected.length > pointType) {
            list = list.filter(
              (p) => p.behaviour === behaviorTypesSelected[pointType],
            );
          } else {
            return [];
          }

          return sortedPoints(
            list.map((p) => {
              return {
                x: p.day,
                y: p.frequency,
              };
            }),
          );

        default:
          return sortedPoints(
            chartSelected.points
              .filter((p) => p.dataType === pointType)
              .map((p) => {
                return {
                  x: p.day,
                  y: onlyTime ? 1 / p.time / 10 : p.count / p.time,
                };
              }),
          );
      }
    };

    const dataColumns = [
      {
        title: 'Day',
        dataIndex: 'day',
        key: 'day',
      },
      {
        title: 'Count',
        dataIndex: 'count',
        key: 'count',
      },
      {
        title: 'Type',
        dataIndex: 'type',
        key: 'type',
      },
    ];

    // define data of the chart component used from react-chartjs-2
    const chartOptions = {
      chart: {
        events: {
          click: function (e) {
            let data = {
              x: e.xAxis[0].value,
              y: e.yAxis[0].value,
            };
            window.ReactNativeWebView.postMessage(JSON.stringify(data));
          },
        },
      },
      title: {
        text: chart.title,
      },
      legend: {
        align: 'right',
        layout: 'vertical',
        verticalAlign: 'top',
        x: -10,
        y: 50,
        floating: true,
      },
      yAxis: {
        type: 'logarithmic',
        min: 0.0001,
        max: 1000,
        title: {
          text: chart.yAxisLabel ? chart.yAxisLabel : 'COUNT PER MINUTE',
        },
      },
      xAxis: {
        min: 0,
        max: 140,
        gridLineWidth: 1,
        title: {
          text: 'SUCCESSIVE CALENDAR WEEKS',
        },
      },
      series: [
        {
          data: getDataPointsOnChart(chart, chartPointType[0], false),
          name: `${chart.pointsTypeLables.type1}   - Count/Minute`,
          color: '#6f6f73',
          marker: {
            symbol: 'circle',
          },
          point: {
            events: {
              click: function () {
                let data = {
                  x: this.x,
                  y: this.y,
                };
                window.ReactNativeWebView.postMessage(JSON.stringify(data));
              },
            },
          },
        },
        {
          data: getDataPointsOnChart(chart, chartPointType[0], true),
          name: `${chart.pointsTypeLables.type1} - Minute`,
          color: '#6f6f73',
          marker: {
            symbol: 'square',
          },
          point: {
            events: {
              click: function () {
                let data = {
                  x: this.x,
                  y: this.y,
                };
                window.ReactNativeWebView.postMessage(JSON.stringify(data));
              },
            },
          },
        },
        {
          data: getDataPointsOnChart(chart, chartPointType[1], false),
          name: `${chart.pointsTypeLables.type2} - Count/Minute`,
          color: '#700723',
          marker: {
            symbol: 'diamond',
          },
          point: {
            events: {
              click: function () {
                let data = {
                  x: this.x,
                  y: this.y,
                };
                window.ReactNativeWebView.postMessage(JSON.stringify(data));
              },
            },
          },
        },
        {
          data: getDataPointsOnChart(chart, chartPointType[1], true),
          name: `${chart.pointsTypeLables.type2} - Minute`,
          color: '#700723',
          marker: {
            symbol: 'square',
          },
          point: {
            events: {
              click: function () {
                let data = {
                  x: this.x,
                  y: this.y,
                };
                window.ReactNativeWebView.postMessage(JSON.stringify(data));
              },
            },
          },
        },
        {
          data: getDataPointsOnChart(chart, chartPointType[2], false),
          name: `${chart.pointsTypeLables.type3} - Count/Minute`,
          color: '#62c722',
          marker: {
            symbol: 'triangle',
          },
          point: {
            events: {
              click: function () {
                let data = {
                  x: this.x,
                  y: this.y,
                };
                window.ReactNativeWebView.postMessage(JSON.stringify(data));
              },
            },
          },
        },
        {
          data: getDataPointsOnChart(chart, chartPointType[2], true),
          name: `${chart.pointsTypeLables.type3} - Minute`,
          color: '#62c722',
          marker: {
            symbol: 'dash',
          },
          point: {
            events: {
              click: function () {
                let data = {
                  x: this.x,
                  y: this.y,
                };
                window.ReactNativeWebView.postMessage(JSON.stringify(data));
              },
            },
          },
        },
      ],
    };

    const storePoint = (pointFoundInSameColumn, newX, newY) => {
      this.setState({
        point: {
          ...pointFoundInSameColumn,
          day: newX,
          count: newY,
        },
      });
      this.setState({
        pointIndex: chart.points.findIndex((p) => p === pointFoundInSameColumn),
      });
    };

    /**
     * Sort given points according to the x-value (days)
     * @param {*} points
     */
    function sortedPoints(points) {
      if (!points) {
        return [];
      }
      return points.sort((a, b) => {
        return a.x - b.x;
      });
    }

    const options = {
      // onClick action on the graph
      onClick(event, element) {
        /*
         * 1. calculate x and y of clicked point
         */

        const yTop = chart.chartArea.top;
        const yBottom = chart.chartArea.bottom;

        const yMin = this.chart.scales['y-axis-primary'].min;
        const yMax = this.chart.scales['y-axis-primary'].max;
        let newY = 0;

        if (event.offsetY <= yBottom && event.offsetY >= yTop) {
          newY = Math.abs((event.offsetY - yTop) / (yBottom - yTop));
          newY = (newY - 1) * -1;
          newY = newY * Math.abs(yMax - yMin) + yMin;
        }

        const xTop = this.chart.chartArea.left;
        const xBottom = this.chart.chartArea.right;
        const xMin = this.chart.scales['x-axis-primary'].min;
        const xMax = this.chart.scales['x-axis-primary'].max;
        let newX = 0;

        if (event.offsetX <= xBottom && event.offsetX >= xTop) {
          newX = Math.abs((event.offsetX - xTop) / (xBottom - xTop));
          newX = newX * Math.abs(xMax - xMin) + xMin;
        }

        // x-axis represents date values so it has to be rounded to the nearest integer
        newX = Math.round(newX);

        /*
         * 2. check all points that have the same x-axis value as the clicked point (same column on graph).
         * If found, the point found need to be updated because there can't be more than one point in the same column.
         */
        const pointFoundInSameColumn = chart.points.find((p) => p.day === newX);

        // y-axis is logarithmic, but the value is read as linear so we need to apply the following equation to map it
        storePoint(pointFoundInSameColumn, newX, newY);

        /*
         * 3. open dialog for the user to add/update point
         */
        handleClickOpen();
      },
    };

    const handleClickOpen = () => {
      this.setState({open: true});
    };

    const handleClose = () => {
      this.setState({open: false});
    };

    const navigateToAddPoint = () => {
      this.props.navigation.navigate('AddPoint', {
        chart: chart,
        addPoint: addPoint,
        updatePoint: updatePoint,
        handleClose: handleClose,
        pointInput: point,
        pointIndex: pointIndex,
      });
    };

    const viewMode = chart.category.name !== 'Others';

    const changeStartDate = (value) => {
      const rangeTemp = [value, range[1]];

      this.setState({
        range: rangeTemp,
      });

      onCelerationChartChange(rangeTemp, 'range');
    };

    const changeEndDate = (value) => {
      const rangeTemp = [range[0], value];
      this.setState({
        range: rangeTemp,
      });
      onCelerationChartChange(rangeTemp, 'range');
    };

    const onMessage = (m) => {
      let data = JSON.parse(m);
      let newY = Math.round(data.y * 10) / 10;

      storePoint(
        chart.points.find((p) => {
          return parseInt(p.day) === parseInt(Math.round(data.x));
        }),
        Math.round(data.x).toString(),
        newY.toString(),
      );
      handleClickOpen();
    };

    return (
      <View>
        {chart.category.name !== 'Others' && (
          <>
            <DateInput
              value={range[0]}
              onChange={(e) => {
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
              onChange={(e) => {
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
          </>
        )}
        {chart.category.name === 'Behaviour' ? (
          <MultiSelect
            hideTags
            items={behaviorMultiSelect}
            uniqueKey="id"
            ref={(component) => {
              this.multiSelect = component;
            }}
            onSelectedItemsChange={(selectedItems) =>
              onSelectedItemsChange(selectedItems)
            }
            selectedItems={selectedItems}
            selectText="Pick Items"
            searchInputPlaceholderText="Search Items..."
            altFontFamily="ProximaNova-Light"
            tagRemoveIconColor="#CCC"
            tagBorderColor="#CCC"
            tagTextColor="#CCC"
            selectedItemTextColor="#CCC"
            selectedItemIconColor="#CCC"
            itemTextColor="#000"
            displayKey="name"
            searchInputStyle={{color: '#CCC'}}
            submitButtonColor="#CCC"
            submitButtonText="Submit"
          />
        ) : null}

        <HighchartsReactNative
          styles={styles.container}
          options={chartOptions}
          onMessage={(m) => onMessage(m)}
        />

        {viewMode ? null : (
          <>
            <Button title="Add Point" onPress={() => navigateToAddPoint()} />
            <Dialog.Container visible={open} onBackdropPress={handleClose}>
              <Dialog.Title>
                {pointIndex && pointIndex !== -1 ? 'Update Point' : 'Add Point'}
              </Dialog.Title>
              <Dialog.Description>
                <AddUpdatePointDialog
                  chart={chart}
                  addPoint={addPoint}
                  updatePoint={updatePoint}
                  handleClose={handleClose}
                  pointInput={point}
                  pointIndex={pointIndex}
                />
              </Dialog.Description>
            </Dialog.Container>
          </>
        )}

        {chart.category.name === 'Others' ? (
          <FlatList
            data={chart.points}
            renderItem={({item, index}) => (
              <View>
                <CelerationChartOtherPoints point={item} />
              </View>
            )}
            keyExtractor={(item) => item.id}
          />
        ) : null}

        {chart.category.name === 'Session' ? (
          <FlatList
            data={chart.points}
            renderItem={({item, index}) => (
              <View>
                <CelerationChartSessionPoints point={item} />
              </View>
            )}
            keyExtractor={(item) => item.id}
          />
        ) : null}

        {chart.category.name === 'Behaviour' ? (
          <FlatList
            data={chart.points}
            renderItem={({item, index}) => (
              <View>
                <CelerationChartBehaviourPoints point={item} />
              </View>
            )}
            keyExtractor={(item) => item.id}
          />
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  chart: {
    height: '500',
  },
  container: {
    height: 400,
    backgroundColor: '#fff',
    justifyContent: 'center',
    flex: 1,
  },
});

export default CelerationGraph;
