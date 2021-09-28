import React, {useState, useRef} from 'react';
import {
    View,
    Text,
    SafeAreaView,
    StyleSheet,
    ScrollView,
    TextInput,
    processColor,
    TouchableOpacity, Alert
} from 'react-native';
import NavigationHeader from "../../components/NavigationHeader";
import Carousel from 'react-native-snap-carousel';
import {screenWidth} from "react-native-calendars/src/expandableCalendar/commons";
import DateInput from "../../components/DateInput";
import Button from "../../components/Button";
import {LineChart} from "react-native-charts-wrapper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Color from "../../utility/Color";

export default function CelerationChart(props){
    const {navigation} = props;
    const [chartData, setChartData] = useState([1,2,3])
    const cRef = useRef(null)

    const renderItem = () => {
        return(
            <View style={styles.chartVw}>
                <Text>Date: 2020-10-19</Text>
                <Text>Title: Chart1</Text>
                <Text>Category: SomeCategory</Text>
                <Text>Notes: Notes</Text>
            </View>
        )
    }

    return(
        <SafeAreaView style={{backgroundColor:'white'}}>
            <NavigationHeader
                backPress={() => this.goBack()}
                title={'Charts'}
                disabledTitle
            />
            <ScrollView contentContainerStyle={{backgroundColor:'white'}}>
                <View style={{padding:10, marginBottom: 50}}>
                    <Carousel
                        layout={'default'}
                        ref={cRef}
                        data={chartData}
                        renderItem={renderItem}
                        sliderWidth={screenWidth}
                        itemWidth={screenWidth - 100}
                        onSnapToItem={index => {}}
                    />
                    <Text style={styles.headerText}>Chart1</Text>
                    <View style={{flexDirection:'row', marginVertical:10}}>
                        <View style={{width:'50%', marginRight:5}}>
                            <Text>Date</Text>
                            <DateInput
                                format='YYYY-MM-DD'
                                displayFormat='YYYY-MM-DD'
                                isPrevious={true}
                                onChange={(date) => {
                                    console.log("date==", date)
                                }} />
                                <Text>Title</Text>
                                <TextInput placeholder="Title" style={styles.input}/>
                        </View>
                        <View style={{width:'50%', marginTop: 5}}>
                            <Text>Category</Text>
                            <TextInput placeholder="Category" style={styles.input}/>
                            <Text style={{marginTop:5}}>Notes</Text>
                            <TextInput placeholder="Notes" style={styles.input}/>
                        </View>
                    </View>
                    <Button labelButton='Save'
                            theme='primary'
                            style={{ width: 150, alignSelf:'center' }}
                            onPress={() => {
                                this.setState({ isEditVisible: false });
                                this.selectIncorrectItem(this.state.incorrectIndex)
                            }} />

                    <View style={{ height: 150, justifyContent: 'center', alignItems: 'center',
                        backgroundColor: 'white', marginBottom: 10, marginTop: 16, }}>
                        <LineChart style={{ width: '100%', height: 150}}
                                   marker={{
                                       enabled: true,
                                       digits: 2,
                                       backgroundTint: processColor('red'),
                                       markerColor: processColor('red'),
                                       textColor: processColor('white'),
                                   }}
                            //xAxis={this.state.xAxis}
                                   xAxis={{
                                       granularityEnabled: true,
                                       granularity: 1,
                                   }}
                                   data={{
                                       dataSets: [{
                                           values: [
                                               {x: 1, y: 0.88},
                                               {x: 2, y: 0.77},
                                               {x: 3, y: 105},
                                               {x: 4, y: 135},
                                               {x: 5, y: 0.88},
                                               {x: 6, y: 0.77},
                                               {x: 7, y: 105},
                                               {x: 8, y: 135}
                                           ],
                                           label: 'A',
                                       }, {
                                           values: [
                                               {x: 1, y: 90},
                                               {x: 2, y: 130},
                                               {x: 3, y: 100},
                                               {x: 4, y: 105},
                                               {x: 5, y: 90},
                                               {x: 6, y: 130},
                                               {x: 7, y: 100},
                                               {x: 8, y: 105}
                                           ],
                                           label: 'B',
                                       }, {
                                           values: [
                                               {x: 1, y: 110},
                                               {x: 2, y: 105},
                                               {x: 3, y: 115},
                                               {x: 4, y: 110},
                                               {x: 5, y: 110},
                                               {x: 6, y: 105},
                                               {x: 7, y: 115},
                                               {x: 8, y: 110}],
                                           label: 'C',
                                       }],
                                   }}
                        />
                    </View>
                    <Text style={styles.headerText}>Add a New Point</Text>
                    <View style={{flexDirection:'row', marginVertical:10}}>
                        <View style={{width:'45%', marginRight: 10}}>
                    <View style={{ flexDirection: 'row', borderWidth:1,
                        height: 40, paddingHorizontal:5,marginBottom: 5,
                        alignItems:'center', justifyContent:'center'
                    }}>
                        <Text style={{marginTop: 0}}>Day</Text>
                        <TouchableOpacity onPress={() => { this.changeDailyTrials('D') }}>
                            <Text style={styles.hrButton}>
                                <MaterialCommunityIcons
                                    name='minus'
                                    size={14}
                                    color={Color.gray}
                                    style={styles.minusButtonText}
                                />
                            </Text>
                        </TouchableOpacity>
                        <Text style={{ paddingLeft: 10, paddingRight: 10,alignSelf:'center', fontSize: 18 ,borderWidth:1,borderColor:Color.gray}}>
                            0
                        </Text>
                        <TouchableOpacity onPress={() => { this.changeDailyTrials('I') }}>
                            <Text style={styles.hrButton}>
                                <MaterialCommunityIcons
                                    name='plus'
                                    size={24}
                                    color={Color.gray}
                                    style={styles.plusButtonText}
                                />
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flexDirection: 'row', borderWidth:1, height: 40, paddingHorizontal:5, alignItems:'center', justifyContent:'center'
                    }}>
                        <Text style={{marginTop: 0}}>Day</Text>
                        <TouchableOpacity onPress={() => { this.changeDailyTrials('D') }}>
                            <Text style={styles.hrButton}>
                                <MaterialCommunityIcons
                                    name='minus'
                                    size={14}
                                    color={Color.gray}
                                    style={styles.minusButtonText}
                                />
                            </Text>
                        </TouchableOpacity>
                        <Text style={{ paddingLeft: 10, paddingRight: 10,alignSelf:'center', fontSize: 18 ,borderWidth:1,borderColor:Color.gray}}>
                            0
                        </Text>
                        <TouchableOpacity onPress={() => { this.changeDailyTrials('I') }}>
                            <Text style={styles.hrButton}>
                                <MaterialCommunityIcons
                                    name='plus'
                                    size={24}
                                    color={Color.gray}
                                    style={styles.plusButtonText}
                                />
                            </Text>
                        </TouchableOpacity>
                    </View>
                        </View>
                        <View style={{width:'45%'}}>
                    <View style={{ flexDirection: 'row', borderWidth:1,marginBottom: 5,
                        height: 40, paddingHorizontal:5, alignItems:'center', justifyContent:'center'
                    }}>
                        <Text style={{marginTop: 0}}>Count</Text>
                        <TouchableOpacity onPress={() => { this.changeDailyTrials('D') }}>
                            <Text style={styles.hrButton}>
                                <MaterialCommunityIcons
                                    name='minus'
                                    size={14}
                                    color={Color.gray}
                                    style={styles.minusButtonText}
                                />
                            </Text>
                        </TouchableOpacity>
                        <Text style={{ paddingLeft: 10, paddingRight: 10,alignSelf:'center', fontSize: 18 ,borderWidth:1,borderColor:Color.gray}}>
                            0
                        </Text>
                        <TouchableOpacity onPress={() => { this.changeDailyTrials('I') }}>
                            <Text style={styles.hrButton}>
                                <MaterialCommunityIcons
                                    name='plus'
                                    size={24}
                                    color={Color.gray}
                                    style={styles.plusButtonText}
                                />
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flexDirection: 'row', borderWidth:1,
                         height: 40, paddingHorizontal:5, alignItems:'center', justifyContent:'center'
                    }}>
                        <Text style={{marginTop: 0}}>Time</Text>
                        <TouchableOpacity onPress={() => { this.changeDailyTrials('D') }}>
                            <Text style={styles.hrButton}>
                                <MaterialCommunityIcons
                                    name='minus'
                                    size={14}
                                    color={Color.gray}
                                    style={styles.minusButtonText}
                                />
                            </Text>
                        </TouchableOpacity>
                        <Text style={{ paddingLeft: 10, paddingRight: 10,alignSelf:'center', fontSize: 18 ,borderWidth:1,borderColor:Color.gray}}>
                            0
                        </Text>
                        <TouchableOpacity onPress={() => { this.changeDailyTrials('I') }}>
                            <Text style={styles.hrButton}>
                                <MaterialCommunityIcons
                                    name='plus'
                                    size={24}
                                    color={Color.gray}
                                    style={styles.plusButtonText}
                                />
                            </Text>
                        </TouchableOpacity>
                    </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}
const styles =  StyleSheet.create({
    headerText:{
        fontSize: 20,
        fontWeight: 'bold'
    },
    chartVw:{
        marginTop: 25, marginBottom: 10,
        shadowColor: 'rgba(62,123,250,0.6)',
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 2,
        borderRadius:5,
        backgroundColor: 'white',
        width:'100%',
        paddingVertical: 20,
        paddingHorizontal: 15,
        borderWidth:1,
        borderColor:'black'
    },
    input:{
        marginBottom: 10,
        padding: 10,
        fontSize: 16,
        height:53,
        fontStyle: 'normal',
        textAlign: 'left',
        color: '#10253C',
        width:'100%',
        borderRadius: 3,
        borderWidth: 1,
        borderColor: 'lightgray',
        backgroundColor: 'white'
    },
    hrButton: {
        justifyContent: 'center',
        width: 40,
        height: 40,
        // backgroundColor: '#3E7BFA',
        borderRadius: 4,
        // marginLeft: 8,
        paddingTop: 10,
        textAlign: 'center'
    },
    plusButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#3E7BFA'
    },
    minusButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#63686E'
    },
})