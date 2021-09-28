import React, {useEffect, useState} from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    SafeAreaView,
    TextInput, Image,
} from 'react-native';
import NavigationHeader from '../../../components/NavigationHeader';
import Color from '../../../utility/Color';
import Icon from 'react-native-vector-icons/Entypo';
import TherapistRequest from '../../../constants/TherapistRequest';

function Item(props) {
    const {item, index, selectedId, onPress} = props;
    return (
        <TouchableOpacity
            style={{marginHorizontal: 7}}
            onPress={() => {
                onPress(index);
            }}>
            <Text style={styles.classText}>{item.node.name}</Text>
            {index == selectedId && <View style={styles.bottomLineVw} />}
        </TouchableOpacity>
    );
}
function ItemQuestion(props) {
    const {item, index, onPress} = props;
    return (
        <TouchableOpacity
            onPress={() => onPress(item.node.target)}>
            <View style={[styles.card, {backgroundColor: Color.white}]}>
                <Image
                    style={styles.targetViewImage}
                    source={require('../../../../android/img/peak.jpg')}
                />
                <Text>{item.node.option + " - " + item.node.target.targetMain.targetName}</Text>
            </View>
        </TouchableOpacity>
    );
}

export default function PeakScrollTabView(props) {
    const {navigation, route} = props;
    const {id} = route.params;
    const [index, setIndex] = useState(0);
    const [selectedId, setSelectedId] = useState(0);
    const [tab, setTab] = useState(0);
    const [data, setData] = useState([]);
    const [allData, setAllData] = useState([]);
    // const data=[1,2,3,4]
    const [code, setCode] = useState('');

    const [valueChange, setValueChange] = useState(false);

    console.log('uhjkjkhjjhjh', id);

    useEffect(() => {
        // // debugger;
        setCode(props.route.params.target.node.code)
        setData(props.route.params.target.node.classes.edges)
        setAllData(props.route.params.target.node.classes.edges[0].node.stimuluses.edges)
    }, []);



    return (
        <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
            <View style={{width: '100%', height: '100%'}}>
                <View style={{}}>
                    <NavigationHeader
                        title="Equivalence"
                        backPress={() => props.navigation.goBack()}
                    />
                </View>

                <View style={{paddingHorizontal: 10, paddingBottom: 120}}>
                    <Text style={{marginLeft: 10, fontSize: 20}}>{code}</Text>
                    <FlatList
                        style={{marginTop: 8}}
                        bounces
                        data={data}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        extraData={selectedId}
                        renderItem={({item, index}) => (
                            <Item
                                item={item}
                                selectedId={selectedId}
                                index={index}
                                onPress={index => {
                                    setSelectedId(index)
                                    setAllData(props.route.params.target.node.classes.edges[index].node.stimuluses.edges)
                                }}
                            />
                        )}
                        keyExtractor={item => item.id}
                    />
                    <FlatList
                        style={{marginTop: 15}}
                        bounces
                        data={allData}
                        showsVerticalScrollIndicator={false}
                        renderItem={({item, index}) => (
                            <ItemQuestion
                                item={item}
                                index={index}
                                stimData={data}
                                tabIndex={selectedId}
                                onPress={(item) => {
                                    props.navigation.navigate('EquivalanceTarget', {
                                        target: item,
                                        student: props.route.params.student,
                                        program: props.route.params.program,
                                        shortTermGoalId: props.route.params.shortTermGoalId,
                                    });
                                }}
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
    scene: {},
    SquareShapeView: {
        backgroundColor: Color.white,
        margin: 10,
        marginBottom: 10,
        padding: 10,
        paddingLeft: 10,
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 1,
        borderWidth: 0.5,
        borderColor: Color.gray,
    },
    fixedView: {
        position: 'absolute',
        left: 0,
        bottom: 0,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    classText: {
        fontSize: 18,
        width: '100%',
        marginBottom: 5,
        elevation: 5,
        color: 'grey',
        fontFamily: 'SF Pro Text',
    },
    bottomLineVw: {
        borderRadius: 5,
        position: 'absolute',
        bottom: 0,
        width: 80,
        height: '6%',
        alignSelf: 'center',
        backgroundColor: '#007ff6',
    },
    headingText: {
        fontFamily: 'SF Pro Text',
        fontStyle: 'normal',
        fontWeight: '500',
        fontSize: 16,
        color: '#45494E',
    },
    scoreItemTextVw: {
        height: 20,
        marginLeft: 5,
        width: 20,
        borderRadius: 3,
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    scoreboardView: {
        marginTop: 10,
        shadowColor: 'rgba(0, 0, 0, 0.06)',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
        borderRadius: 5,
        backgroundColor: 'white',
        width: '100%',
        paddingVertical: 20,
        paddingHorizontal: 15,
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.05)',
    },
    scoreText: {
        fontFamily: 'SF Pro Text',
        fontStyle: 'normal',
        fontWeight: '500',
        fontSize: 12,
        marginTop: 5,
        color: 'black',
    },
    totalScore: {
        position: 'absolute',
        right: 20,
        top: 20,
        color: '#3E7BFA',
        fontFamily: 'SF Pro Text',
        fontStyle: 'normal',
        fontWeight: '500',
        fontSize: 16,
    },
    scoreItemVw: {
        height: 24,
        width: 43,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    TrialText: {
        fontFamily: 'SF Pro Text',
        fontStyle: 'normal',
        fontWeight: '500',
        fontSize: 13,
        marginTop: 5,
        color: 'rgba(95, 95, 95, 0.75)',
    },
    TrainingTab: {
        position: 'absolute',
        marginTop: 15,
        bottom: 0,
        width: 50,
        height: '8%',
        alignSelf: 'center',
        backgroundColor: '#007ff6',
    },
    card: {
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,

        elevation: 3,
        borderRadius: 5,
        margin: 3,
        marginTop: 10,
        padding: 10,
    },
    targetViewImage: {
        width: '100%',
        height: 200,
        borderRadius: 5,
    },
});
