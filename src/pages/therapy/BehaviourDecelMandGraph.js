import React, {Component} from 'react';

import {
  Alert,
  Text,
  TextInput,
  View,
  StyleSheet,
  Image,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Picker,
  Dimensions,
  Modal,
} from 'react-native';
import {LineChart} from 'react-native-chart-kit';
import {connect} from 'react-redux';
import ParentRequest from '../../constants/ParentRequest';
import {getAuthResult} from '../../redux/reducers/index';
import {
  setToken,
  setTokenPayload,
  setMedicalData,
} from '../../redux/actions/index';
import moment from 'moment/min/moment-with-locales';
import store from '../../redux/store';
import {Row, Container, Column} from '../../components/GridSystem';
import OrientationHelper from '../../helpers/OrientationHelper';
import NavigationHeader from '../../components/NavigationHeader';
import DateInput from '../../components/DateInput';
import LoadingIndicator from '../../components/LoadingIndicator';
import Button from '../../components/Button';
import HighchartsReactNative from '@highcharts/highcharts-react-native';

class BehaviourDecelMandGraph extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      startDate: moment().subtract(7, 'day').format('YYYY-MM-DD'),
      endDate: moment().format('YYYY-MM-DD'),

      labels: [],
      data: [],
    };

    this.params = this.props.route.params;
    console.log('Params', this.params);
  }

  componentDidMount() {
    ParentRequest.setDispatchFunction(this.props.dispatchSetToken);

    this.getData();
  }

  getData() {
    this.setState({isLoading: true});
    let vars = {
      studentId: this.params.studentId,
      mandId: this.params.mandData.node.id,
      sdate: this.state.startDate,
      edate: this.state.endDate,
    };
    console.log('Vars', vars);
    ParentRequest.mandReport(vars)
      .then((result) => {
        console.log('Result', result);
        let labels = [];
        let data = [];

        result.data.mandReport[0].data.forEach((item) => {
          labels.push(item.x);
          data.push(item.y);
        });

        this.setState({isLoading: false, labels, data});
      })
      .catch((err) => {
        Alert.alert('Information', err.toString());
        this.setState({isLoading: false});
      });
  }

  render() {
    let {isLoading, startDate, endDate, labels, data} = this.state;

    const linedata = {
      labels: labels,
      datasets: [
        {
          data: data,
          strokeWidth: 2, // optional
        },
      ],
    };

    // console.log("data", linedata);

    return (
      <SafeAreaView style={{backgroundColor: '#ffffff', flex: 1}}>
        {!this.params.isFromSession && (
          <NavigationHeader
            title={this.params.mandData.node.measurments}
            backPress={() => this.props.navigation.goBack()}
          />
        )}

        <Container style={{paddingTop: 10}}>
          <Text>Start & End Date</Text>
          <Row>
            <Column>
              <DateInput
                format="YYYY-MM-DD"
                displayFormat="DD MMM YYYY"
                value={startDate}
                onChange={(startDate) => {
                  this.setState({startDate}, () => {
                    this.getData();
                  });
                }}
              />
            </Column>
            <Column>
              <DateInput
                format="YYYY-MM-DD"
                displayFormat="DD MMM YYYY"
                value={endDate}
                onChange={(endDate) => {
                  this.setState({endDate}, () => {
                    this.getData();
                  });
                }}
              />
            </Column>
          </Row>

          {isLoading && <LoadingIndicator />}
          {(!isLoading && labels.length != 0) && <LineChart
						data={linedata}
						width={this.params.isFromSession ? Dimensions.get('window').width - 60
							: Dimensions.get('window').width - 32} // from react-native
						height={220}
						yAxisLabel={''}
						verticalLabelRotation={-90}
						xLabelsOffset={10}
						chartConfig={{
							backgroundColor: '#fff',
							backgroundGradientFrom: '#fff',
              backgroundGradientTo: '#fff',
							decimalPlaces: 2, // optional, defaults to 2dp
							color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
							style: {
                 borderRadius: 16,
							 } 
						}}   
						bezier
						style={{
							marginVertical: 10,
              borderRadius: 6,
              alignSelf: 'center'
						}}
					/>}

          {/* {!isLoading && labels.length != 0 && (
            <HighchartsReactNative
              styles={{
                backgroundColor: '#fff',
                justifyContent: 'center',
                height: 350,
              }}
              options={{
                chart: {
                  type: 'spline',
                },

                // title: false,

                // subtitle: false,

                yAxis: {
                  allowDecimals: false,
                  title: {
                    text: 'Frequency'
                },
                  minHeight: 0,
                },

                xAxis: {
                  categories: labels,
                  title: {
                    text: 'Date'
                },
                minHeight: 2,
                },

                legend: {
                  layout: 'vertical',
                  align: 'right',
                  verticalAlign: 'middle',
                  symbolHeight: 0,
                  symbolWidth: 0,
                },
                credits: {
                  enabled: false,
                },

                plotOptions: {
                  line: {
                    dataLabels: {
                      enabled: false,
                    },
                    enableMouseTracking: false,
                  },
                },

                series: [
                  {
                    name: 'Frequency',
                    data: data,
                  },
                ],

                responsive: {
                  rules: [
                    {
                      condition: {
                        maxWidth: "900",
                      },
                      chartOptions: {
                        legend: {
                          layout: 'horizontal',
                          enabled: false,
                          align: 'center',
                          // verticalAlign: 'bottom',
                        },
                      },
                    },
                  ],
                },
              }}
            />
          )} */}

          {this.params.isFromSession && (
            <Button
              labelButton="Cancel"
              theme="secondary"
              style={{marginBottom: 10}}
              onPress={() => {
                this.props.onCancel();
              }}
            />
          )}
        </Container>
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({});
const mapStateToProps = (state) => ({
  authResult: getAuthResult(state),
});

const mapDispatchToProps = (dispatch) => ({
  dispatchSetToken: (data) => dispatch(setToken(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BehaviourDecelMandGraph);
