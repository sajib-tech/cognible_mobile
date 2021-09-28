import 'react-native-gesture-handler';
import React, { Component } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View, Image,
    Text, TextInput,
    Modal, RefreshControl,
    Dimensions,
    TouchableOpacity,
    Linking,
    ActivityIndicator
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import Color from '../../../utility/Color';
import {
    LineChart,
    BarChart,
    PieChart,
    ProgressChart,
    ContributionGraph,
    StackedBarChart
} from 'react-native-chart-kit';

import Button from '../../../components/Button';
import NavigationHeader from '../../../components/NavigationHeader';
import { Row, Container, Column } from '../../../components/GridSystem';

import { connect } from 'react-redux';
import { getAuthResult } from '../../../redux/reducers/index';
import { setToken, setTokenPayload } from '../../../redux/actions/index';
import TherapistRequest from '../../../constants/TherapistRequest';
import ClinicRequest from '../../../constants/ClinicRequest';
import PickerModal from '../../../components/PickerModal';
import DateInput from '../../../components/DateInput';
import LoadingIndicator from '../../../components/LoadingIndicator';
import {getStr} from "../../../../locales/Locale";

const screenWidth = Dimensions.get("window").width;

class StudentProgressOverview extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,


            graphPieData: null,
            graphBarData: null,
            targetStatus: [],
            programArea: [],
            selectedTargetStatus: "U3RhdHVzVHlwZToz",
            selectedProgramArea: "UHJvZ3JhbUFyZWFUeXBlOjE4OQ==",
            start_date: moment().subtract(30, 'day').format("YYYY-MM-DD"),
            end_date: moment().format("YYYY-MM-DD"),

            isGraphShow: false,
            mode: 'pie'
        }
    }
    _refresh() {

    }
    componentDidMount() {
        let student = this.props.route.params;
        console.log("Student", student);
        this.setState({ student: student });
        ClinicRequest.setDispatchFunction(this.props.dispatchSetToken);
        this.getGraphData();
    }

    getGraphData() {
        ClinicRequest.getStudentGraphData().then(result => {
            console.log('getStudentGraphData', result);

            let targetStatus = result.data.targetStatus.map((item) => {
                return {
                    id: item.id,
                    label: item.statusName
                };
            });

            let programArea = result.data.programArea.edges.map((item) => {
                return {
                    id: item.node.id,
                    label: item.node.name
                };
            });

            this.setState({ targetStatus, programArea })
        }).catch(error => {
            console.log(error);
            this.setState({ isLoading: false });
        });
    }

    getGraphInfo() {
        let student = this.props.route.params;

        this.setState({ isGraphShow: false, graphData: null })

        if (this.state.selectedProgramArea && this.state.selectedTargetStatus) {
            this.setState({ isLoading: true });
            let variables = {
                student_id: student.node.id,
                start_date: this.state.start_date,
                end_date: this.state.end_date,
                program: this.state.selectedProgramArea,
                status: this.state.selectedTargetStatus
            };
            console.log("Vars", variables);
            ClinicRequest.getStudentGraphInfo(variables).then(result => {
                console.log('getStudentGraphInfo', result);

                let graphBarDataLabel = [];
                let graphBarDataValue = [];

                let colorList = Color.getColorList();
                let graphPieData = [];
                if (result) {
                    result.data.domainPercentage.forEach((item, index) => {
                        // graphBarDataLabel.push(item.domain);
                        // graphBarDataValue.push(item.tarCount);
                        if (item.tarCount != 0) {
                            graphPieData.push({
                                id: item.id,
                                name: item.domain,
                                population: item.tarCount,
                                color: colorList[index],
                                legendFontColor: Color.black,
                                legendFontSize: 14,
                            });
                        }
                    });

                    let dataDomains = {};

                    result.data.domainMastered.target.forEach((item) => {
                        let baseLine = null;
                        let today = moment(this.state.end_date);
                        let days = null;

                        if (!dataDomains.hasOwnProperty(item.domainName)) {
                            dataDomains[item.domainName] = 0;
                        }

                        if (item.targetId || item.intherapyDate) {
                            if (item.targetId) {
                                baseLine = moment(item.targetAllcatedDetails.dateBaseline);
                                days = today.diff(baseLine, 'days');
                            } else {
                                baseLine = moment(item.intherapyDate);
                                days = today.diff(baseLine, 'days');
                            }

                            //console.log("Append", item.domainName, days);
                            dataDomains[item.domainName] += days;
                        }
                    })

                    console.log(dataDomains);

                    graphBarDataLabel = Object.keys(dataDomains).map((item) => {
                        return item;
                    })

                    graphBarDataValue = Object.keys(dataDomains).map((item) => {
                        return dataDomains[item];
                    });

                    let graphBarData = {
                        labels: graphBarDataLabel,
                        datasets: [
                            {
                                data: graphBarDataValue,
                            },
                        ],
                    };

                    this.setState({ isGraphShow: true, graphPieData, graphBarData, isLoading: false })
                } else {
                    this.setState({ isGraphShow: false, isLoading: false });
                }
            }).catch(error => {
                console.log(error);
                this.setState({ isGraphShow: false, isLoading: false });
            });
        }
    }

    render() {

        return (
            <SafeAreaView style={styles.container}>
                <NavigationHeader
                    enable={this.props.disableNavigation != true}
                    backPress={() => this.props.navigation.goBack()}
                    title={getStr('ExtraAdd.ProgressOverview')}
                    disabledTitle={true}
                />

                <Container enablePadding={this.props.disableNavigation != true}>
                    <ScrollView>
                        <Row>
                            <Column>
                                <DateInput
                                    label={getStr('ExtraAdd.StartDate')}
                                    format='YYYY-MM-DD'
                                    displayFormat='DD MMM YYYY'
                                    value={this.state.start_date}
                                    onChange={(start_date) => {
                                        this.setState({ start_date }, () => {
                                            this.getGraphInfo()
                                        });
                                    }} />
                            </Column>
                            <Column>
                                <DateInput
                                    label={getStr('ExtraAdd.EndDate')}
                                    format='YYYY-MM-DD'
                                    displayFormat='DD MMM YYYY'
                                    value={this.state.end_date}
                                    onChange={(end_date) => {
                                        this.setState({ end_date }, () => {
                                            this.getGraphInfo()
                                        });
                                    }} />
                            </Column>
                        </Row>
                        <PickerModal
                            label={getStr('ExtraAdd.TargetStatus')}
                            placeholder="Select Target"
                            selectedValue={this.state.selectedTargetStatus}
                            data={this.state.targetStatus}
                            onValueChange={(itemValue, itemIndex) => {
                                this.setState({ selectedTargetStatus: itemValue }, () => {
                                    this.getGraphInfo()
                                });
                            }}
                        />
                        <PickerModal
                            label={getStr('ExtraAdd.ProgramArea')}
                            placeholder="Select Program"
                            selectedValue={this.state.selectedProgramArea}
                            data={this.state.programArea}
                            onValueChange={(itemValue, itemIndex) => {
                                this.setState({ selectedProgramArea: itemValue }, () => {
                                    this.getGraphInfo()
                                });
                            }}
                        />
                        <PickerModal
                            label={getStr('ExtraAdd.ChartType')}
                            selectedValue={this.state.mode}
                            data={[
                                { id: "pie", label: getStr('ExtraAdd.PieChart')},
                                { id: "bar", label: getStr('ExtraAdd.BarChart')} ,
                            ]}
                            onValueChange={(itemValue, itemIndex) => {
                                this.setState({ mode: itemValue });
                            }}
                        />

                        <View style={{ height: 1, backgroundColor: Color.gray, marginBottom: 20 }} />

                        {this.state.isLoading && <LoadingIndicator />}

                        {this.state.isGraphShow && (
                            <>
                                {(!this.state.isLoading && this.state.mode == 'pie') && (
                                    <PieChart
                                        data={this.state.graphPieData}
                                        width={screenWidth - 32}
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
                                            borderRadius: 5,
                                            borderColor: Color.gray,
                                            borderWidth: 1
                                        }}
                                        accessor="population"
                                        backgroundColor="transparent"
                                        paddingLeft="15"
                                        absolute
                                    />
                                )}

                                {(!this.state.isLoading && this.state.mode == 'bar') && (
                                    // <View style={{ backgroundColor: Color.primary, paddingBottom: 50 }}>
                                    <BarChart
                                        // style={graphStyle}
                                        data={this.state.graphBarData}
                                        width={screenWidth - 33}
                                        height={220}
                                        yAxisLabel={''}
                                        withInnerLines={false}
                                        chartConfig={{
                                            backgroundColor: 'black',
                                            backgroundGradientFrom: Color.white,
                                            backgroundGradientTo: Color.white,
                                            decimalPlaces: 0, // optional, defaults to 2dp
                                            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                            barPercentage: 1.0,
                                            style: {
                                                borderRadius: 5
                                            },
                                            propsForLabels: {
                                                fontSize: 8,
                                                width: 20
                                            }
                                        }}
                                        fromZero={true}
                                        verticalLabelRotation={10}
                                        style={{
                                            borderRadius: 5,
                                            borderColor: Color.gray,
                                            borderWidth: 1
                                        }}
                                    />
                                    // </View>
                                )}
                            </>
                        )}
                    </ScrollView>
                </Container>
            </SafeAreaView>
        )
    }
}
const styles = {
    container: {
        flex: 1,
        backgroundColor: Color.white
    }
};

const mapStateToProps = (state) => ({
    authResult: getAuthResult(state)
});

const mapDispatchToProps = (dispatch) => ({
    dispatchSetToken: (data) => dispatch(setToken(data)),
    dispatchSetTokenPayload: (data) => dispatch(setTokenPayload(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(StudentProgressOverview);


