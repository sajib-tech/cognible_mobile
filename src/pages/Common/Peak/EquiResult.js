import 'react-native-gesture-handler';
import React, { Component } from 'react';
import {
    ActivityIndicator,
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View, Image,
    Text, TextInput,
    TouchableWithoutFeedback, RefreshControl,
    Dimensions,
    TouchableOpacity,
    Alert, FlatList, processColor
} from 'react-native';
import Styles from '../../../utility/Style.js';
import PickerModal from '../../../components/PickerModal';
import { getAuthResult } from '../../../redux/reducers/index'
import { setToken } from '../../../redux/actions/index';
import { connect } from 'react-redux';
import NavigationHeader from '../../../components/NavigationHeader.js';
import { Row, Container, Column } from '../../../components/GridSystem';
import OrientationHelper from '../../../helpers/OrientationHelper.js';
import Color from '../../../utility/Color';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import TherapistRequest from '../../../constants/TherapistRequest'
import Button from '../../../components/Button';
import DateInput from '../../../components/DateInput';
import store from '../../../redux/store';
import moment from 'moment';
import {LineChart} from "react-native-charts-wrapper";
import BarChart from "react-native-charts-wrapper/lib/BarChart";

const screenWidth = Dimensions.get('window').width
const screenHeight = Dimensions.get('window').height


class EquiResult extends Component {
    constructor(props) {
        super(props);
        this.state = {
            student: {},
            pkID:'',
            firstName:'',
            lastName:'',
            isLoading: false,
            programTitle: '',
            selectedId:'',
            selectedIdData:'',
            setSelectedId:'',
            typePeak: '',
            programDate: moment().format('YYYY-MM-DD'),
            titleError: '',
            dateError: '',
            equivilanceData:[],
            scoreEquivalance: 0,
            scoreReflexivity: 0,
            scoreSymmetry: 0,
            scoreTransivity: 0,
            scoreTotal: 0,
            tab1: {
                backgroundColor: '#3371FF',
                color: '#ffffff'
            },
            tab2: {
                backgroundColor: '#bcbcbc',
                color: '#000000'
            },
            tab3: {
                backgroundColor: '#bcbcbc',
                color: '#000000'
            },
            scoreTransivityReport :'',scoreEquivalanceReport:'',scoreReflexivityReport:'',scoreSymmetryReport:'',
            cateogries: [
                { id: 'Direct', label: 'Direct' },
                { id: 'Generalization', label: 'Generalization' },
                { id: 'Transformation', label: 'Transformation' },
                { id: 'Equivalance', label: 'Equivalance' }

            ],
            equivalance: [
                { id: 'Basic', label: 'Basic' },
                { id: 'Intermediate', label: 'Intermediate' },
                { id: 'Advance', label: 'Advance' },

            ],
            selectReport: [
                { id: "Score", label: "Score" },
                { id: "Graph", label: "Graph" },
            ],
            selectedReportTYpe: "Score",

            selectedCategory: '',
            selectedCategoryError: '',
            eqivalanceFlag : false,
            euivalanceCategory:'',
            notes: '',
            notesError: '',
            placeholderText: 'Notes',
            type:'',
            equID:'',

            isInLandscape: false,
            legend: {
                enabled: true,
                textSize: 18,
                form: 'SQUARE',
                formSize: 18,
                xEntrySpace: 20,
                yEntrySpace: 20,
                formToTextSpace: 10,
                wordWrapEnabled: true,
                maxSizePercent: 0.5
            },
            data:[],
            values:[],
            programID:'',
            selectIndex:0,
            PKIDGRAPH:'',

            // data: {
            //     dataSets: [{
            //         values: [{y: 1}, {y: 1}, {y: 2}, {y: 3},],
            //         label: 'Equivilance Report',
            //         config: {
            //             color: processColor('teal'),
            //             barShadowColor: processColor('lightgrey'),
            //             highlightAlpha: 90,
            //             highlightColor: processColor('red'),
            //         }
            //     }],
            //
            //     config: {
            //         barWidth: 0.9,
            //     }
            // },
            // highlights: [{x: 3}, {x: 6}],
            xAxis: {
                valueFormatter: ['Reflexivity', 'Symmetry', 'Transivity', 'Equivalance'],
                granularityEnabled: true,
                granularity : 1,
                drawGridLines:false,
            },

        }
    };
    _refresh() {
        this.setState({ isLoading: false })
        this.componentDidMount();
    }

    componentDidMount() {
        let student = this.props.route.params.student;
        let programID = this.props.route.params.equiID;
        let PKIDGRAPH = this.props.route.params.PKIDGRAPH;
        // let type = this.props.route.params.type;
        let isInLandscape = false;
        let selectID = this.props.route.params.selectID;
        // debugger


        if (this.props.route.params && this.props.route.params.isInLandscape) {
            isInLandscape = this.props.route.params.isInLandscape;
        }
        this.setState({
            student: student,
            isInLandscape: isInLandscape,
            firstName:JSON.stringify(student.node.firstname),
            lastName:JSON.stringify(student.node.lastname),
            programID:programID,
            PKIDGRAPH:PKIDGRAPH,
            // type:type,
            selectIndex:selectID

        },()=>{

            selectID == 0 ? this.handleTab("B") : selectID == 1 ?
                this.handleTab("I") : this.handleTab("A"),

            this.getEquiResult(selectID)
        })
    }

    getEquiResult(index) {
        // debugger
        this.setState({
            typePeak: index == 0 ? 'Basic' : index == 1 ?
                'Intermediate' : 'Advanced',
        }, () => {


            let variables = {
                program: this.state.PKIDGRAPH,
                peakType: this.state.typePeak,
            }

            console.log("hhhdhdhdoo", index, this.state.typePeak)


            TherapistRequest.getStartPeakEqui(variables).then(startpeak => {
                console.log('xggsgfg', startpeak.data.startPeakEquivalance.details.program.id);

                this.setState({equID: startpeak.data.startPeakEquivalance.details.id}, () => {
                    this.PeakEquiGraph(this.state.equID, this.state.typePeak)


                })


                //   Alert.alert(JSON.stringify(peakPrograms))

            }).catch(error => {

                console.log(JSON.stringify(error));
                // // debugger;
                console.log(error, error.response);
                this.setState({isLoading: false});

                Alert.alert('Information', error.toString());
            });
        })

    }


    PeakEquiGraph(equiID, typePeak) {

        // debugger
        let values = []

        let variables = {
            pk: equiID,
            peakType: typePeak,

        }

            // debugger
        TherapistRequest.getEquiGraph(variables).then(peakGraph => {
            // debugger
            this.setState({
                scoreTotal: peakGraph.data.peakEquData[0].score,
            })


                this.setState({scoreReflexivity:peakGraph.data.peakEquData[0].scoreReflexivity,
                    scoreTransivity:peakGraph.data.peakEquData[0].scoreTransivity,
                    scoreSymmetry:peakGraph.data.peakEquData[0].scoreSymmetry,
                    scoreEquivalance:peakGraph.data.peakEquData[0].scoreEquivalance,})



            values.push({y:parseInt(peakGraph.data.peakEquData[0].scoreReflexivity)})
            values.push({y:parseInt(peakGraph.data.peakEquData[0].scoreSymmetry)})
            values.push({y:parseInt(peakGraph.data.peakEquData[0].scoreTransivity)})
            values.push({y:parseInt(peakGraph.data.peakEquData[0].scoreEquivalance)})

            // // debugger;
            console.log("values===", values)



            this.setState({data:[{values:values,label: 'Equivilance Report', config: {
                        color: processColor('teal'),
                        barShadowColor: processColor('lightgrey'),
                        highlightAlpha: 90,
                        highlightColor: processColor('red'),
                        drawValues: false,
                    }}]})

            //Adding Items To Array.

            // Showing the complete Array on Screen Using Alert.
            // Alert.alert(this.state.finalStatus.toString());
            console.log("thfddjsbnsm",this.state.scoreSymmetryReport)


            //   Alert.alert(JSON.stringify(peakPrograms))

        }).catch(error => {

            console.log(JSON.stringify(error));
            // // debugger;
            console.log(error, error.response);
            this.setState({isLoading: false});

            // Alert.alert('GRAPGGGGHH', error.toString());
        });

    }

    Item(props){
        const{item,index,selectedId,onPress} = props
        return(

            <TouchableOpacity
                style={{width:screenWidth / 3.3, alignItems:'center', justifyContent:'center'}}
                onPress={() => {onPress(index)} }>
                <View style ={styles.tabText}>
                    <Text style={{color: index == selectedId? '#3E7BFA' : "grey",textAlign:'center',fontSize:17}}>
                        {item}</Text>
                </View>
                {index == selectedId &&
                <View
                    style={{
                        borderRadius: 5,
                        position: 'absolute',
                        bottom: 0,
                        width: 90,
                        height: '5%',
                        alignSelf: 'center',
                        backgroundColor: '#3E7BFA',
                        // index === setSelectedId ? '#007ff6' : colors.secondaryColor,
                    }}
                />}
            </TouchableOpacity>
        )
    }

    ItemList(props){

        const{item,index,selectedId,onPress} = props
        return(

            <TouchableOpacity
                style={{marginHorizontal: 1, }}
                onPress={() => onPress(index)}>
                <View style={[styles.SquareShapeView,{marginTop:1,flexDirection:'row'}]} >
                    <Text style={[styles.questionTitle,{fontFamily: 'SF Pro Text',}]}>{props.item.name}</Text>
                    <Text style={[styles.questionTitle,{marginLeft:10,width:'90%'}]}></Text>
                </View>

            </TouchableOpacity>
        )
    }

    renderChart() {
        const linedata = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June'],
            datasets: [
                {
                    data: [20, 45, 28, 80, 99, 43],
                    strokeWidth: 2, // optional
                },
            ],
        };

            return(
                <View style={styles.container}>
                    <Text>
                        Bezier Line Chart
                    </Text>
                    <LineChart
                        style={styles.chart}
                        data={this.state.volumeData}
                        xAxis={this.state.xAxis}
                        group="stock"
                        width={screenWidth/2}
                        height={220}
                        identifier="volume"
                        syncX={true}
                        syncY={true}

                        visibleRange={{x:{min:1, max:100}}}
                        dragDecelerationEnabled={false}
                        doubleTapToZoomEnabled={false}  // it has to be false!!
                    />
                </View>
            )
        }

    handleTab(selectedType) {

        const {equiID, type} = this.state;

        switch (selectedType) {
            case "B":
                this.setState({type: 'Basic'}, () => {

                    this.getEquiResult(0)
                })
                this.setState({
                    tab1: {
                        backgroundColor: '#3371ff',
                        color: '#ffffff',
                    },
                    tab2: {
                        backgroundColor: '#bcbcbc',
                        color: '#000000',
                    },
                    tab3: {
                        backgroundColor: '#bcbcbc',
                        color: '#000000',
                    },
                    active: true
                })
                break;
            case "I":
                this.setState({type:"Intermediate"},()=>{

                    this.getEquiResult(1)


                })
                this.setState({
                    tab2: {
                        backgroundColor: '#3371ff',
                        color: '#ffffff',
                    },
                    tab1: {
                        backgroundColor: '#bcbcbc',
                        color: '#000000',
                    },
                    tab3: {
                        backgroundColor: '#bcbcbc',
                        color: '#000000',
                    },
                    active: false
                })
                break;
            case "A":
                this.setState({type:"Advanced"},()=>{

                    this.getEquiResult(2)


                })
                this.setState({
                    tab3: {
                        backgroundColor: '#3371ff',
                        color: '#ffffff',
                    },
                    tab1: {
                        backgroundColor: '#bcbcbc',
                        color: '#000000',
                    },
                    tab2: {
                        backgroundColor: '#bcbcbc',
                        color: '#000000',
                    },
                    active: false
                })
                break;
            default:
                break;
        }
    }



    render() {

        const{scoreEquivalance,scoreReflexivity,scoreSymmetry,selectedReportTYpe,scoreTotal,selectReport,scoreTransivity} = this.state


        return (
          
            <SafeAreaView style={{flex: 1,backgroundColor: 'white'}}>
                <NavigationHeader
                    backPress={() => this.props.navigation.goBack()}
                    title="Equivalance"
                />
                <View style={{backgroundColor: 'white',marginTop:5,}}>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', padding: 5,marginTop:10}}>
                        <TouchableOpacity style={{ backgroundColor: this.state.tab1.backgroundColor, height: 40, width: '30%', justifyContent: 'center', borderRadius: 5 }} onPress={() => {
                            this.handleTab("B")
                        }}>
                            <Text style={{ fontSize: 15, color: this.state.tab1.color, alignSelf: 'center' }}>Basic</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ backgroundColor: this.state.tab2.backgroundColor, height: 40, width: '30%', justifyContent: 'center', borderRadius: 5 }} onPress={() => {
                            this.handleTab("I")
                        }}>
                            <Text style={{ fontSize: 15, color: this.state.tab2.color, alignSelf: 'center' }}>Intermediate</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ backgroundColor: this.state.tab3.backgroundColor, height: 40, width: '30%', justifyContent: 'center', borderRadius: 5 }} onPress={() => {
                            this.handleTab("A")
                        }}>
                            <Text style={{ fontSize: 15, color: this.state.tab3.color, alignSelf: 'center' }}>Advanced</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{marginLeft:10,height:80,marginRight:10}}>

                    <PickerModal
                        label='Select Report'
                        placeholder='Select Report'
                        selectedValue={selectedReportTYpe}
                        data={selectReport}
                        onValueChange={(itemValue, itemIndex) => {
                            this.setState({selectedReportTYpe: itemValue});
                        }}
                    />
                    </View>
                    {this.state.selectedReportTYpe == 'Score' && <>

                     <View style={{flexDirection:'row',height:30,backgroundColor: 'white',borderWidth:1,marginRight:6,marginLeft:4,marginTop:25,justifyContent:'center'}}>
                    <View style={{ flex: 1,paddingLeft: 10,marginLeft:8 }}>
                        <Text style={{ fontSize: 20, color: 'black', fontWeight: '100' }}>Domain</Text>
                    </View>
                         <View style={styles.verticleLine}></View>
                    <View style={{ flex: 1, }}>
                        <Text style={{ fontSize: 20, color: 'black', paddingLeft:5,fontWeight: '100' }}>Score</Text>
                    </View>
                </View>
                    <View style={{flexDirection:'row',backgroundColor: 'white',marginLeft:4,marginRight:6,borderWidth:1}}>

                    <Column style={{marginLeft:15,marginTop:8,}}>
                        <Text style={{ fontSize: 18,  fontWeight: '100',marginTop:2 }}>Reflexivity</Text>
                        <View style={styles.Line}></View>
                        <Text style={{ fontSize: 18, fontWeight: '100',marginTop:2, }}>Symmetry</Text>
                        <View style={styles.Line}></View>
                        <Text style={{ fontSize: 18,  fontWeight: '100',marginTop:2, }}>Transivity</Text>
                        <View style={styles.Line}></View>
                        <Text style={{ fontSize: 18,  fontWeight: '100',marginTop:2, }}>Equivalance</Text>
                        <View style={styles.Line}></View>
                        <Text style={{ fontSize: 20, color:'black',fontWeight: '100' ,marginTop:5}}>Total</Text>
                    </Column>
                        <View style={[styles.verticleLine,{marginLeft:18}]}></View>
                        <Column style={{marginLeft:15,marginTop:8}}>
                            <Text style={{ fontSize: 18, fontWeight: '100',marginTop:2 }}>{scoreReflexivity}</Text>
                            <View style={styles.LineRight}></View>
                            <Text style={{ fontSize: 18,  fontWeight: '100',marginTop:2 }}>{scoreSymmetry}</Text>
                            <View style={styles.LineRight}></View>
                            <Text style={{ fontSize: 18,  fontWeight: '100',marginTop:2 }}>{scoreTransivity}</Text>
                            <View style={styles.LineRight}></View>
                            <Text style={{ fontSize: 18, fontWeight: '100',marginTop:2 }}>{scoreEquivalance}</Text>
                            <View style={styles.LineRight}></View>
                            <Text style={{ fontSize: 20, fontWeight: '100',color:'black',marginTop:5 }}>{scoreTotal}</Text>
                        </Column>
                    </View>
                        </>}
                </View>
                {/*<Text style ={{color:'black',fontSize:20,fontStyle:'bold'}}> Total correct Answer is {scoreTotal}/16 </Text>*/}

                {this.state.data.length>0 && this.state.selectedReportTYpe == 'Graph'  &&  <View style={[styles.container,{backgroundColor:'white',marginTop:10,width:'100%',height:'100%',marginBottom:30,paddingTop:40}]}>

                    <LineChart
                        style={styles.chart}
                        data={{dataSets:this.state.data,config: {
                                    barWidth: 0.9,
                            }}
                        }
                        xAxis={this.state.xAxis}
                        yAxis={{left:{drawGridLines:false},right:{drawGridLines:false}}}
                        animation={{durationX: 2500}}
                        legend={this.state.legend}
                        gridBackgroundColor={processColor('#ffffff')}
                        visibleRange={{x: { min: 5, max: 5 }}}
                        drawBarShadow={false}
                        drawValueAboveBar={true}
                        drawHighlightArrow={true}
                        //highlights={this.state.highlights}
                        onChange={(event) => console.log(event.nativeEvent)}
                    />
                </View>}
                {/*<View style={{height:30,marginBottom:20,backgroundColor: '#F5FCFF',alignItems:'center',justifyContent:'center',marginTop:5,}}>*/}
                    {/*<Text style ={{color:'black',fontSize:20,fontStyle:'normal'}}> Total correct Answer is {this.state.scoreTotal}/16 </Text>*/}
                {/*</View>*/}
            </SafeAreaView>
        );
    }
}
const styles = StyleSheet.create({

    TextInputStyleClass: {
        borderWidth: 1,
        borderColor: Color.gray,
        borderRadius: 5,
        backgroundColor: "#FFFFFF",
        height: 110,
        marginVertical: 5,
        paddingHorizontal: 10,
        textAlignVertical: 'top'
    },
    LineRight:{
        color: '#000000', backgroundColor: '#000000', height: 1, borderColor : '#000000'
    },

    SquareShapeView: {

        backgroundColor: Color.white,
        marginBottom: 10,
        padding: 10,
        borderRadius: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 0.5,
        borderWidth: 0.5,
        borderColor: Color.gray


    },
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF'
    },
    chart: {
        flex: 1,


    },
    verticleLine: {
        height: '100%',
        width: 1,
        backgroundColor: '#000000',
    },
    tabText:{
        fontFamily: 'SF Pro Text',
        fontStyle: 'normal',
        fontWeight: '500',
        width:'100%',
        marginBottom:5,
        elevation:5,
        alignItems:'center'
    },
    Line:{
        color: '#000000', backgroundColor: '#000000', height: 1, width:'200%', borderColor : '#000000'
    }
});
const mapStateToProps = (state) => ({
    authResult: getAuthResult(state)
});

const mapDispatchToProps = (dispatch) => ({
    dispatchSetToken: (data) => dispatch(setToken(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(EquiResult);

