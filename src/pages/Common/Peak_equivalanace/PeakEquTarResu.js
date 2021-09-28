import  React, {useState} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    FlatList,
    TouchableOpacity,
    ScrollView,
    Image,
    SafeAreaView, TextInput
} from 'react-native';
import NavigationHeader from "../../../components/NavigationHeader";
import Styles from "../../../utility/Style";
import Color from "../../../utility/Color";
import {SceneMap, TabView} from "react-native-tab-view";
import Icon from "react-native-vector-icons/Entypo";



const FirstRoute = () => (
    <View style={[styles.scene, { backgroundColor: '#ff4081' }]} />
);

const SecondRoute = () => (
    <View style={[styles.scene, { backgroundColor: '#673ab7' }]} />
);
const ThirdRoute = () => (
    <View style={[styles.scene, { backgroundColor: '#673ab7' }]} />
);
const FourthRoute = () => (
    <View style={[styles.scene, { backgroundColor: '#ff4081' }]} />
);
const FifthRoute = () => (
    <View style={[styles.scene, { backgroundColor: '#ff4081' }]} />
);
const SixthRoute = () => (
    <View style={[styles.scene, { backgroundColor: '#673ab7' }]} />
);

const initialLayout = { width: Dimensions.get('window').width };

function Item(props){
    const{item,index,selectedId,onPress} = props
    return(

        <TouchableOpacity
            style={{marginHorizontal: 7, }}
            onPress={() => {onPress(index)}}>
            <Text style ={{fontSize:23,width:'100%',marginBottom:5,elevation:5,color:'grey'}}>
                {item.title}</Text>
            {index== selectedId &&
            <View
                style={{
                    borderRadius: 5,
                    position: 'absolute',
                    bottom: 0,
                    width: 80,
                    height: '5%',
                    alignSelf: 'center',
                    backgroundColor: '#007ff6',
                    // index === setSelectedId ? '#007ff6' : colors.secondaryColor,
                }}
            />}
        </TouchableOpacity>
    )
}

const renderPeakscorecard = () =>{
    const peakAllSd = [1,2,3,4]
    return(
        <View style={[styles.scoreboardView, {marginBottom: 200}]}>
            <Text style={{color: '#808080'}}>6 Relation  44 Trails</Text>
            <Text style={[styles.scoreText,{color:'black'}]}>Scoreboard</Text>
            <Text style={styles.totalScore}>66</Text>
            <View style={{marginTop: 15}}>
                <FlatList
                    data={peakAllSd}
                    renderItem={(item, index) =>
                        renderScoreItem(item, index)}
                    keyExtractor={(item) => item.id}
                    extraData={1}/>

            </View>
        </View>
    )
}


const renderScoreItem = (item, index) =>{
    const data = [1,2,3,4,5,6,7,8,9,10]
    return(
        <TouchableOpacity style={{flexDirection:'row', marginBottom: 10}}>
            <View style={styles.scoreItemVw}>
                <Text>A-B</Text>
            </View>
            <View style={{flexDirection:'row', alignItems:'center'}}>
                {data.map((item, index) => (
                    <View style={styles.scoreItemTextVw}>
                    </View>
                ))}
            </View>
        </TouchableOpacity>
    )
}


function ItemQuestion(props){
    return(

        <TouchableOpacity
            style={{marginHorizontal: 1, }}
            onPress={() => onPress(index)}>
            <View style={[styles.SquareShapeView,{marginTop:1,flexDirection:'row'}]} >
                <Text style={[styles.questionTitle,{}]}>{props.item}</Text>
                <TextInput style={[styles.questionTitle,{marginLeft:10,width:'90%'}]}></TextInput>
            </View>

        </TouchableOpacity>
    )
}


export default function PeakEquTarResu(props) {


    //const data = ['Class 1','Class 2','Class 3','Class 4'];

    const dataQuestion = ['A','B','C','D'];

    const text = ['A','B','C','D']

    const [index, setIndex] = React.useState(0);

    const renderScene = SceneMap({
        first: FirstRoute,
        second: SecondRoute,
        third:ThirdRoute,
        fourth:FourthRoute,
        // fifth:FifthRoute,
        // sixth:SixthRoute,
    });

    const [routes] = React.useState([
        { key: 'first', title: 'Class 1' },
        { key: 'second', title: 'Class 2' },
        { key: 'third', title: 'Class 3' },
        { key: 'fourth', title: 'Class 4' },
        // { key: 'fifth', title: 'Recents' },
        // { key: 'sixth', title: 'Purchased' },
    ]);
    const [selectedId, setSelectedId] = useState(0);
    const [allData, setAllData] = useState([{title:'Class 1', data:['A','B','C','D']},
        {title:'Class 2', data:['A','B','C','D']},
        {title:'Class 3', data:['A','B','C','D']},
        {title:'Class 4', data:['A','B','C','D']}])
    const [valueChange, setValueChange] = useState(false)
    return (
        <SafeAreaView style={{flex:1,backgroundColor:'white'}}>
            <View style={{width: '100%',}}>
                <View style = {{}}>

                <NavigationHeader
                    title="Equivalence"
                    backPress={() => props.navigation.goBack()}
                />

                    {/*<View style={{position: 'absolute', top: 13, left: 300, right:10, bottom: 0}}>*/}
                    {/*    <TouchableOpacity*/}
                    {/*        onPress={() => {*/}
                    {/*            let newData = allData[selectedId].title*/}
                    {/*            newData.push('E')*/}
                    {/*            allData[selectedId].title = newData*/}
                    {/*            setAllData(allData)*/}
                    {/*            setValueChange(!valueChange)*/}
                    {/*        } }>*/}

                    {/*    <Icon color="black" name="plus" size={30}>*/}

                    {/*    </Icon>*/}

                    {/*    </TouchableOpacity>*/}
                    {/*</View>*/}


                </View>
                <View>

                    <FlatList style={{marginTop:8}}
                              bounces
                              data={allData}
                              horizontal
                              showsHorizontalScrollIndicator={false}
                              extraData={selectedId}
                              renderItem={({item, index}) => (
                                  <Item
                                      item={item}
                                      selectedId={selectedId}
                                      index={index}
                                      onPress={(index) => setSelectedId(index)}
                                  />
                              )}
                              keyExtractor={item => item.id}
                    />
                    <ScrollView>

                    {renderPeakscorecard()}
                    {renderPeakscorecard()}
                    </ScrollView>
                    {/*<View style={{flexDirection:'row',justifyContent:'flex-end'}}>*/}
                    {/*    <TouchableOpacity style={{marginTop:10,flexDirection: 'row',marginRight:20,}}*/}
                    {/*                      onPress={() => {*/}
                    {/*                          let newData = allData[selectedId].data*/}
                    {/*                          newData.push('E')*/}
                    {/*                          allData[selectedId].data = newData*/}
                    {/*                          setAllData(allData)*/}
                    {/*                          setValueChange(!valueChange)*/}
                    {/*                      } }>*/}

                    {/*        <Icon color="black" name="plus" size={30} />*/}


                    {/*    </TouchableOpacity>*/}

                    {/*    <TouchableOpacity style={{marginTop:10,flexDirection: 'row',marginRight:20,justifyContent:'flex-end'}}*/}
                    {/*                      onPress={() =>{*/}
                    {/*                          if (allData[selectedId].data.length > 4) {*/}
                    {/*                              allData[selectedId].data.splice(index, allData[selectedId].data.pop());*/}
                    {/*                              setValueChange(!valueChange)*/}
                    {/*                          }*/}
                    {/*                      }}*/}
                    {/*    >*/}

                    {/*        <Icon color="black" name="minus" size={30} />*/}

                    {/*    </TouchableOpacity>*/}

                    {/*</View>*/}
                    {/*<FlatList style={{marginTop:15}}*/}
                    {/*          bounces*/}
                    {/*          data={allData[selectedId].data}*/}
                    {/*          showsVerticalScrollIndicator={false}*/}
                    {/*          renderItem={({item, index}) => (*/}
                    {/*              <ItemQuestion*/}
                    {/*                  item={item}*/}
                    {/*                  index={index}*/}
                    {/*              />*/}
                    {/*          )}*/}
                    {/*          keyExtractor={item => item.id}*/}
                    {/*/>*/}
                </View>



            </View>


        </SafeAreaView>

    );
}

const styles = StyleSheet.create({
    scene: {
    },
    SquareShapeView: {

        backgroundColor: Color.white,
        margin: 10,
        marginBottom: 10,
        padding: 5,
        paddingLeft:10,
        borderRadius: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 1,
        borderWidth: 0.5,
        borderColor: Color.gray

    },
    fixedView : {
        position: 'absolute',
        left: 0,
        bottom: 0,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    scoreboardView:{
        marginTop:10,
        shadowColor: 'rgba(0, 0, 0, 0.06)',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
        borderRadius:5,
        backgroundColor: 'white',
        width:'100%',
        paddingVertical: 20,
        paddingHorizontal: 15,
        borderWidth:1,
        borderColor:'rgba(0, 0, 0, 0.05)'
    },
    scoreText:{
        fontFamily: 'SF Pro Text',
        fontStyle: 'normal',
        fontWeight: '500',
        fontSize: 12,
        marginTop:5,
        color: 'black'
    },
    totalScore:{
        position:'absolute',
        right:20,
        top:20,
        color: '#3E7BFA',
        fontFamily: 'SF Pro Text',
        fontStyle: 'normal',
        fontWeight: '500',
        fontSize: 16,
    },
    scoreItemVw:{
        height:24,
        width:43,
        borderRadius:5,
        borderWidth:1,
        borderColor:'rgba(0, 0, 0, 0.1)',
        alignItems:'center',
        justifyContent:'center'
    },
    container: {
        backgroundColor: '#fff',
        flex: 1
    },
    peakView:{
        flex:1,
        flexDirection:'column'
    },
    scoreItemVw:{
        height:24,
        width:43,
        borderRadius:5,
        borderWidth:1,
        borderColor:'rgba(0, 0, 0, 0.1)',
        alignItems:'center',
        justifyContent:'center'
    },
    scoreItemTextVw:{
        height:20,
        marginLeft:5,
        width:20,
        borderRadius:3,
        borderWidth:1,
        borderColor:'rgba(0, 0, 0, 0.1)'
    },
    scoreText:{
        fontFamily: 'SF Pro Text',
        fontStyle: 'normal',
        fontWeight: '500',
        fontSize: 12,
        marginTop:5,
        color: 'black'
    },
    questionText:{
        fontFamily: 'SF Pro Text',
        fontStyle: 'normal',
        fontWeight: '500',
        fontSize: 16,
        marginTop:10,
        color: '#45494E'
    },
    TrialText:{
        fontFamily: 'SF Pro Text',
        fontStyle: 'normal',
        fontWeight: '500',
        fontSize: 13,
        marginTop:5,
        color: 'rgba(95, 95, 95, 0.75)'
    },
    containerPeak: {
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection:'row',
        backgroundColor: 'white',
    },

    SquareShapeView: {
        width: 40,
        height: 40,
        borderColor:'rgba(0, 0, 0, 0.2)',
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: 'white',
        alignItems:'center',
        justifyContent:'center'

    },
    peakNumber:{
        alignItems:'center',
        justifyContent:'center',
        color:'black'
    },
    totalScore:{
        position:'absolute',
        right:20,
        top:20,
        color: '#3E7BFA',
        fontFamily: 'SF Pro Text',
        fontStyle: 'normal',
        fontWeight: '500',
        fontSize: 16,
    },
    scoreboardView:{
        marginTop:10,
        shadowColor: 'rgba(0, 0, 0, 0.06)',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
        borderRadius:5,
        backgroundColor: 'white',
        width:'100%',
        paddingVertical: 20,
        paddingHorizontal: 15,
        borderWidth:1,
        borderColor:'rgba(0, 0, 0, 0.05)'
    },
    carousel: {
        // height: 200,
        // borderColor: 'red',
        // borderWidth: 1
    },
    scrollView: {
        // flex: 1,
        backgroundColor: '#FFFFFF',
        padding: 10,
        marginBottom: 100
    },
    header: {
        flexDirection: 'row',
        height: 50,
        width: '100%'
    },
    backIcon: {
        fontSize: 50,
        fontWeight: 'normal',
        color: '#fff',
        width: '10%',
        paddingTop: 15,
        paddingLeft: 15
    },
    backIconText: {
        fontSize: 20,
        fontWeight: 'normal',
        color: '#63686E'
    },
    headerTitle: {
        textAlign: 'center',
        width: '85%',
        fontSize: 22,
        paddingTop: 10,
        color: '#45494E'
    },
    rightIcon: {
        fontSize: 50,
        fontWeight: 'normal',
        color: '#fff',
        width: '10%',
        paddingTop: 15
    },
    // Target Instruction
    targetInstructionView: {
        paddingTop: 16
    },
    targetInstructionTitle: {
        color: '#63686E',
        fontSize: 18,
        fontWeight: '500'
    },
    targetInstructionInformation: {
        flexDirection: 'row',
        width: '100%',
        paddingTop: 20
    },
    videoPlay: {
        position: 'absolute',
        left: 80,
        top: 30,
        fontSize: 30,
        color: '#fff',
        zIndex: 99999
    },
    instructionImage: {
        width: 180,
        height: 90,
        borderWidth: 1,
        borderColor: Color.gray,
        borderRadius: 5
    },
    instructions: {
        flex: 1,
        justifyContent: 'center',
        paddingLeft: 10,
    },
    instructionsText: {
        color: '#45494E',
        fontSize: 16,
        fontWeight: '500'
    },
    videoTime: {
        paddingTop: 5,
        color: 'rgba(95, 95, 95, 0.75)',
        fontSize: 13,
        fontWeight: '500'
    },

    progressBox: {
        height: 15,
        width: '19%',
        marginRight: 2,
        borderRadius: 4,
        backgroundColor: '#4BAEA0'
    },
    correct: {
        borderColor: '#4BAEA0',
        color: '#4BAEA0',
    },
    incorrect: {
        borderColor: '#FF9C52',
        color: '#FF9C52',
    },

    // scorebaord
    // trailProgress
    trailProgressSection: {
        marginTop: 30,
    },
    trailProgressTitle: {
        flexDirection: 'row',
        // paddingTop: 10,
        // paddingBottom: 10,
        // paddingBottom: 10,
        // marginRight: 10,
        // borderColor: 'red',
        // borderWidth: 1
    },
    arrowButton: {
        justifyContent: 'center',
        width: 40,
        height: 40,
        // backgroundColor: '#3E7BFA',
        borderRadius: 4,
        marginLeft: 8,
        paddingTop: 10,
        textAlign: 'center'
    },
    arrowButtonText: {
        fontSize: 20,
        fontWeight: 'normal',
        // color: '#fff'
    },
    trailProgressText: {
        paddingTop: 10,
        textAlign: 'left',
        flex: 1,
        color: '#63686E',
        fontSize: 16,
        fontWeight: '500'
    },
    trailProgress: {
        height: 20,
        width: '100%',
        flexDirection: 'row',
    },
    progressBox: {
        height: 15,
        width: 40,
        marginRight: 2,
        borderRadius: 4,
        backgroundColor: '#4BAEA0'
    },


    // Popup
    cover: {
        backgroundColor: "rgba(0,0,0,.5)",
    },
    sheet: {
        position: "absolute",
        top: (Dimensions.get("window").height + 10),
        left: 0,
        right: 0,
        height: "90%",
        justifyContent: "flex-end",
        paddingTop: 10,
    },
    popup: {
        backgroundColor: "#FFF",
        marginHorizontal: 10,
        paddingTop: 20,
        // borderTopLeftRadius: 5,
        // borderBottomLeftRadius:
        // borderTopRightRadius: 5,
        borderRadius: 5,
        // alignItems: "center",
        // justifyContent: "center",
        // minHeight: 330,
        height: '100%'
    },

    instructionContent: {
        padding: 10,
        position: "absolute",
    },

    itemView: {
        borderColor: '#ccc',
        flexDirection: 'row',
        borderWidth: 1,
        borderRadius: 4,
        padding: 16,
        marginBottom: 12
    },
    itemIcon: {
        fontSize: 16,
        marginTop: 2
    },
    itemText: {
        marginLeft: 12,
        color: '#63686E',
        fontSize: 16,
        fontWeight: '500',
        fontStyle: 'normal'
    },
    incorrectItemSelected: {
        borderColor: '#FF9C52',
        color: '#FF9C52',
    },
    outsideBlock: {
        marginTop: 16,
        paddingVertical: 10,
        paddingHorizontal: 16,
        // flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4
    },


    // Exit

    exitViewTouchable: {
        paddingTop: 10,
        paddingBottom: 10,
        marginBottom: 15,
        backgroundColor: '#FF8080',
        borderRadius: 8
    },
    exitView: {
        width: '100%',
    },
    exitViewText: {
        color: '#fff',
        fontSize: 17,
        textAlign: 'center',
    },
    cancelViewTouchable: {
        paddingTop: 10,
        paddingBottom: 10,
        marginBottom: 15,
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        borderWidth: 1.5,
        borderColor: 'rgba(95, 95, 95, 0.75)'
    },
    cancelView: {
        width: '100%',
        marginTop: 20
    },
    cancelViewText: {
        color: 'rgba(95, 95, 95, 0.75)',
        fontSize: 17,
        textAlign: 'center',
    },

    titleUpcoming: {
        marginTop: 16,
        color: "#45494E",
        fontSize: 16,
        marginBottom: 10
    },
    cardTarget: {
        borderRadius: 5,
        padding: 16,
        margin: 3,
        marginBottom: 8,
        backgroundColor: Color.white,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,

        elevation: 3,
        borderWidth: 1,
        borderColor: Color.white
    },
    cardTargetSelected: {
        borderRadius: 5,
        padding: 16,
        margin: 3,
        marginBottom: 8,
        backgroundColor: '#fff',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,

        elevation: 3,
        borderWidth: 1,
        borderColor: Color.primary
    },

    // Overlay Bottom
    overlayWrapper: {
        borderRadius: 5,
        padding: 16,
        margin: 3,
        marginBottom: 10,
        backgroundColor: '#fff',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,

        elevation: 3,
    },

    overlayHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        paddingBottom: 10,
        backgroundColor: Color.white
    },
    overlayCard: {
        borderRadius: 5,
        padding: 16,
        margin: 3,
        marginBottom: 16,
        backgroundColor: '#fff',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,

        elevation: 3,
        flexDirection: 'row'
    },
    overlayTitle: {
        fontSize: 18,
        // fontWeight: 'bold',
        color: '#45494E',
        marginLeft: 16
    },
    overlayTitleActive: {
        fontSize: 18,
        // fontWeight: 'bold',
        color: Color.primary,
        marginLeft: 16
    },
    overlayItemTitle: {
        fontSize: 17,
        color: '#45494E',
    },
    overlayItemDescription: {
        fontSize: 15,
        color: '#808080',
    },
    video: {
        width: Dimensions.get('window').width - 32,
        height: Dimensions.get('window').width * (9 / 16),
        backgroundColor: 'black',
    },

});
