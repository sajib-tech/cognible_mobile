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


export default function PeakEquiTarget() {


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
            <View style={{width: '100%'}}>
                <NavigationHeader
                    title="Equivalence"
                    backPress={() => this.props.navigation.goBack()}
                />

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
                    <View style={{flexDirection:'row',justifyContent:'flex-end'}}>
                        <TouchableOpacity style={{marginTop:10,flexDirection: 'row',marginRight:20,}}
                                          onPress={() => {
                                              let newData = allData[selectedId].data
                                              newData.push('E')
                                              allData[selectedId].data = newData
                                              setAllData(allData)
                                              setValueChange(!valueChange)
                                          } }>

                            <Icon color="black" name="plus" size={30} />


                        </TouchableOpacity>

                        <TouchableOpacity style={{marginTop:10,flexDirection: 'row',marginRight:20,justifyContent:'flex-end'}}>

                            <Icon color="black" name="minus" size={30} />

                        </TouchableOpacity>

                    </View>
                    <FlatList style={{marginTop:15}}
                              bounces
                              data={allData[selectedId].data}
                              showsVerticalScrollIndicator={false}
                              renderItem={({item, index}) => (
                                  <ItemQuestion
                                      item={item}
                                      index={index}
                                  />
                              )}
                              keyExtractor={item => item.id}
                    />
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

});
