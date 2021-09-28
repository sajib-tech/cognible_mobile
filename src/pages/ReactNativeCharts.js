
import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,Dimensions,
  Text,TextInput,TouchableOpacity,
  StatusBar, TouchableHighlight
} from 'react-native';
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart
} from 'react-native-chart-kit'

import NavigationHeader from '../components/NavigationHeader'

const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;


const linedata = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
    {
        data: [20, 45, 28, 80, 99, 43],
        strokeWidth: 2, // optional
    },
    ],
};
const barData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
    {
        data: [20, 45, 28, 80, 99, 43],
    },
    ],
};

const pieData = [
      {
        name: 'Seoul',
        population: 21500000,
        color: 'rgba(131, 167, 234, 1)',
        legendFontColor: '#7F7F7F',
        legendFontSize: 15,
      },
      {
        name: 'Toronto',
        population: 2800000,
        color: '#F00',
        legendFontColor: '#7F7F7F',
        legendFontSize: 15,
      },
      {
        name: 'Beijing',
        population: 527612,
        color: 'red',
        legendFontColor: '#7F7F7F',
        legendFontSize: 15,
      },
      {
        name: 'New York',
        population: 8538000,
        color: '#ffffff',
        legendFontColor: '#7F7F7F',
        legendFontSize: 15,
      },
      {
        name: 'Moscow',
        population: 11920000,
        color: 'rgb(0, 0, 255)',
        legendFontColor: '#7F7F7F',
        legendFontSize: 15,
      },
    ];
const progressData = {
  labels: ["Swim", "Bike", "Run"], // optional
  data: [0.4, 0.6, 0.8]
};
const stackedBarData = {
  labels: ["Test1", "Test2"],
  legend: ["L1", "L2", "L3"],
  data: [
    [60, 60, 60],
    [30, 30, 60]
  ],
  barColors: ["#dfe4ea", "#ced6e0", "#a4b0be"]
};
class ReactNativeCharts extends Component {
    constructor(props) {
		super(props);
		this.state = { 
            chartConfig: {
                backgroundColor: '#e26a00',
                backgroundGradientFrom: '#fb8c00',
                backgroundGradientTo: '#ffa726',
                decimalPlaces: 2, // optional, defaults to 2dp
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                    borderRadius: 16
                }
            }
        };
	}
    
    renderLineChart() {
        return(
            <View style={{backgroundColor: '#fff'}}>
                <Text>
                    Bezier Line Chart
                </Text>
                <LineChart
                    data={linedata}
                    width={Dimensions.get('window').width - 20} // from react-native
                    height={220}
                    yAxisLabel={'$'}
                    chartConfig={{
                        backgroundColor: '#e26a00',
                        backgroundGradientFrom: '#fb8c00',
                        backgroundGradientTo: '#ffa726',
                        decimalPlaces: 2, // optional, defaults to 2dp
                        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        style: {
                            borderRadius: 16
                        }
                    }}
                    bezier
                    style={{
                        marginVertical: 8,
                        borderRadius: 16
                    }}
                />
            </View>
        )
    }

    renderbarChart() {
        return(
            <>
            <Text>
                Bar Chart
            </Text>
            <BarChart
                // style={graphStyle}
                data={barData}
                width={screenWidth - 20}
                height={220}
                yAxisLabel={'$'}
                chartConfig={{
                        backgroundColor: '#e26a00',
                        backgroundGradientFrom: '#fb8c00',
                        backgroundGradientTo: 'blue',
                        decimalPlaces: 2, // optional, defaults to 2dp
                        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        style: {
                            borderRadius: 16
                        }
                    }}
                style={{
                    marginVertical: 8,
                    borderRadius: 16
                }}
            />
            </>
        )
    }

    renderPieChart() {
        return(
            <>
                <Text>
                    Pie Chart
                </Text>
                <PieChart
                    data={pieData}
                    width={screenWidth - 20}
                    height={220}
                    chartConfig={{
                        backgroundColor: '#e26a00',
                        backgroundGradientFrom: '#fb8c00',
                        backgroundGradientTo: 'blue',
                        decimalPlaces: 2, // optional, defaults to 2dp
                        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        style: {
                            borderRadius: 16
                        }
                    }}
                    style={{
                        marginVertical: 8,
                        borderRadius: 16,
                        borderColor: 'blue',
                        borderWidth: 1
                    }}
                    accessor="population"
                    backgroundColor="transparent"
                    paddingLeft="15"
                    absolute
                />
            </>
        )
    }

    renderProgressChart() {
        return (
            <>
                <Text>
                    Progress Chart
                </Text>
                <ProgressChart
                    data={progressData}
                    width={screenWidth - 20}
                    height={220}
                    strokeWidth={16}
                    radius={32}
                    chartConfig={this.state.chartConfig}
                    hideLegend={false}
                    style={{
                        marginVertical: 8,
                        borderRadius: 16
                    }}
                    />
            </>
        )
    }

    renderStackedBarChart() {
        return(
            <>
                <Text>
                    StackedBar Chart
                </Text>
                <StackedBarChart
                    data={stackedBarData}
                    width={screenWidth -20}
                    height={220}
                    chartConfig={this.state.chartConfig}
                    style={{
                        marginVertical: 8,
                        borderRadius: 8
                    }}
                />
            </>
        )
    }
    render() {
        return(
            <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
                <NavigationHeader title="ReactNativeChartKit"/>
                <ScrollView contentInsetAdjustmentBehavior="automatic" style={{paddingHorizontal: 10}}>
                    {this.renderLineChart()}
                    {this.renderbarChart()}
                    {this.renderPieChart() }
                    {this.renderProgressChart()}
                    {this.renderStackedBarChart()}
                </ScrollView>
            </SafeAreaView>
        )
    }
}

export default ReactNativeCharts;