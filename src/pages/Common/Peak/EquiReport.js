import React, { Component } from 'react';
import {
  Alert,
  ActivityIndicator,
  Dimensions,
  Text,
  View,
  TextInput,
  StyleSheet,
  Image,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  BackHandler,
  Picker, processColor
} from 'react-native';
import Color from '../../../utility/Color';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import TherapistRequest from '../../../constants/TherapistRequest';
import Styles from '../../../utility/Style.js';
import Orientation from 'react-native-orientation-locker';
import BarChart from "react-native-charts-wrapper/lib/BarChart";

class   EquiReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      array: [],
      codes: '',
      peakSummary: '',
      isLoading:true,
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
      selectedID:0,
      active: true,
      typePeak:'',
      scoreEquivalance: 0,
      scoreReflexivity: 0,
      scoreSymmetry: 0,
      scoreTransivity: 0,
      pkID:'',
      data:[],
      values:[],
      type:'',
      scoreTotal:'',
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
      },
      selectedYear: '',
      peakFactor: [
        {
          id: 1,
          title: "Foundational Learning Skills",
          year: ''
        },
        {
          id: 2,
          title: "Perceptual Learning Skills",
          year: ''
        },
        {
          id: 3,
          title: "Verbal Comprehension Skills",
          year: ''
        },
        {
          id: 4,
          title: "Verbal Reasoning, Memory, and Mathematical Skills",
          year: ''
        }
      ]
    };
  }
  componentDidMount() {

    let student = this.props.route.params.student;
    let program = this.props.route.params.pk;

    // this.getCodes();
    // Orientation.lockToLandscape();
    // Orientation.lockToPortrait();
    this.setState({
      pkID:program,
    },()=>{
      this.getEquiResult(0);
    })

    BackHandler.addEventListener("hardwareBackPress", () => {
      //   Orientation.unlockAllOrientations()
      Orientation.lockToPortrait();
    }
    );
  }

  componentWillMount() {
    //  Orientation.unlockAllOrientations()
  }

  getEquiResult(index) {

    let typePeak = index == 0 ? 'Basic' : index == 1 ?
        'Intermediate' : 'Advanced';


      let variables = {
        program: this.state.pkID,
        peakType: typePeak,
      }

      console.log("rfvdddcc", this.state.selectedID, this.state.typePeak)

    let equID;

      TherapistRequest.getStartPeakEqui(variables).then(startpeak => {
        console.log('xggsgfg', startpeak.data.startPeakEquivalance.details.program.id);

        equID = startpeak.data.startPeakEquivalance.details.id;

          this.PeakEquiGraph(equID, typePeak)



        //   Alert.alert(JSON.stringify(peakPrograms))

      }).catch(error => {

        console.log(JSON.stringify(error));
        // // debugger;
        console.log(error, error.response);
        this.setState({isLoading: false});

        Alert.alert('Information', error.toString());
      });


  }

  PeakEquiGraph(equiID, typePeak) {

    // const{values} = this.state;
    let values = []

    let variables = {
      pk: equiID,
      peakType: typePeak,

    }
    // // debugger;

    TherapistRequest.getEquiGraph(variables).then(peakGraph => {
      // // debugger;
      this.setState({
        scoreTotal: peakGraph.data.peakEquData[0].score,
      })

      values.push({y:peakGraph.data.peakEquData[0].scoreReflexivity})
      values.push({y:peakGraph.data.peakEquData[0].scoreTransivity})
      values.push({y:peakGraph.data.peakEquData[0].scoreSymmetry})
      values.push({y:peakGraph.data.peakEquData[0].scoreEquivalance})


      this.setState({data:[{values:values,label: 'Equivilance Report', config: {
            color: processColor('teal'),
            barShadowColor: processColor('lightgrey'),
            highlightAlpha: 90,
          }}]})

      console.log("thfddjsbnsm",this.state.scoreSymmetryReport)


      //   Alert.alert(JSON.stringify(peakPrograms))

    }).catch(error => {
      // // debugger;
      console.log(JSON.stringify(error));
      // // debugger;
      console.log(error, error.response);
      this.setState({isLoading: false});

      Alert.alert('GRAPGGGGHH', error.toString());
    });


  }


  handleTab(selectedType) {

    const {equiID, type} = this.state;

    switch (selectedType) {
      case "B":
        this.setState({type: 'Basic'}, () => {
          this.PeakEquiGraph(equiID,type)

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

          this.PeakEquiGraph(equiID,type)

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

          this.PeakEquiGraph(equiID,type)

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


  //getPeakSummaryData
  render() {
    const { student, program, outputDate } = this.props.route.params;
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
            <MaterialCommunityIcons
                name="chevron-left"
                size={30}
                color={Color.grayFill}
            />
          </TouchableOpacity>
          <Text style={styles.pageHeading}>Peak Report</Text>
          <Text />
        </View>

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


        <View style={[styles.container12,{width:'100%',height:'50%',marginBottom:30,}]}>
          {this.state.data.length > 0 &&
          <BarChart
              style={styles.chart}
              data={{dataSets:this.state.data,config: {
                  barWidth: 0.9,
                }}
              }
              xAxis={this.state.xAxis}
              animation={{durationX: 2500}}
              legend={this.state.legend}
              gridBackgroundColor={processColor('#ffffff')}
              visibleRange={{x: { min: 5, max: 5 }}}
              drawBarShadow={false}
              drawValueAboveBar={true}
              drawHighlightArrow={true}
              //highlights={this.state.highlights}
              onChange={(event) => console.log(event.nativeEvent)}
          /> }
        </View>
        <View style={{height:30,marginBottom:20,backgroundColor: '#F5FCFF',alignItems:'center',justifyContent:'center',marginTop:5,}}>
          <Text style ={{color:'black',fontSize:20,fontStyle:''}}> Total correct Answer is {this.state.scoreTotal}/16 </Text>
        </View>

      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingTop: 20,
    //  paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pageHeading: {
    fontSize: 18,
    fontWeight: '300',
    flex: 1,
    textAlign: 'center',
  },
  formContainer: {
    marginTop: 30,
  },
  inputContainer: {
    marginVertical: 10,
  },
  legend: {
    fontSize: 20,
    fontWeight: '700',
  },
  container12: {
    flex: 1,
    backgroundColor: '#F5FCFF'
  },
  chart: {
    flex: 1,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#D5D5D5',
    borderRadius: 10,
    marginTop: 10,
    padding: 10,
  },
  colors: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  buttonFilled: {
    marginTop: 20,
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#3E7BFA',
    marginBottom: 40,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
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
});

export default EquiReport;
