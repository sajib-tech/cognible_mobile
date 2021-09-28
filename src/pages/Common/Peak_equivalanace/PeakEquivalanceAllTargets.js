import React, {useState, useEffect} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    FlatList,
    TouchableOpacity,
    ScrollView,
    Image,
    SafeAreaView,
    TextInput,
    ActivityIndicator,
    Alert,
} from 'react-native';

import NavigationHeader from '../../../components/NavigationHeader';
import Styles from '../../../utility/Style';
import Color from '../../../utility/Color';
import {SceneMap, TabView} from 'react-native-tab-view';
import Icon from 'react-native-vector-icons/Entypo';
import TherapistRequest from '../../../constants/TherapistRequest';
import {getPeakCodes, getPeakEquCode} from "../../../constants/therapist";

const screenWidth = Dimensions.get('window').width;
export default function PeakEquivalanceAllTargets(props) {
    const {navigation, route} = props;
    const {student, program} = route.params;
    const [data, setData] = useState([]);
    const [startCount, setStartCount] = useState(0);
    const [endCount, setEndCount] = useState(10);
    const [Loading, setLoading] = useState(false);
    const shortTermGoalId = '';
    const getPeakEquAllTargets = (startCount, endCount) => {
        const variables = {skip:startCount, first:endCount};
        setLoading(true)
        TherapistRequest.getPeakEquCode(variables)
            console.log("abcdefghijk",getPeakEquCode)
            .then(res => {
                // setStartCount(startCount + 10)
                // setEndCount(endCount + 10)
                // getPeakEquAllTargets(startCount + 10, endCount + 10)
                setData(res.data.getPeakEquCodes.edges)
                setLoading(false);
            })
            .catch(err => {
                setLoading(false);
                console.log(JSON.stringify(err));
                Alert(JSON.stringify(err));
            });
    };


    useEffect(() => {
        getPeakEquAllTargets(startCount, endCount);
    }, []);

    const renderVw = () => {
        return data.map((item, index) => {
            return (
                <TouchableOpacity
                    onPress={() => {
                        props.navigation.navigate('PeakScrollTabView', {
                            target: item,
                            student: student,
                            program: program,
                            shortTermGoalId: shortTermGoalId,
                        });
                    }}>
                    <View style={[styles.card, {backgroundColor: Color.white}]}>
                        <Text>{'   ' +  item.node.code}</Text>
                    </View>
                </TouchableOpacity>
            )
        });
    };

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
            <View style={{flex:1}}>
                <NavigationHeader
                    title="Peak Equivalence Targets"
                    backPress={() => props.navigation.goBack()}
                />
                <ScrollView>
                    {Loading && (
                        <ActivityIndicator
                            size="large"
                            color="black"
                            style={{
                                zIndex: 9999999,
                                // backgroundColor: '#ccc',
                                opacity: 0.9,
                                // position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                // height: screenHeight,
                                justifyContent: 'center',
                                alignSelf: 'center',
                            }}
                        />
                    )}
                    <View style={{paddingHorizontal: 10}}>
                        {renderVw()}
                    </View>
                </ScrollView>
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
        padding: 5,
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
    searchWrapper: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        alignItems: 'center',
        height: 40,
        marginVertical: 10,
        backgroundColor: Color.grayWhite,
    },
    targetViewImage: {
        width: '100%',
        height: 200,
        borderRadius: 5,
    },
    fixedView: {
        position: 'absolute',
        left: 0,
        bottom: 0,
        flexDirection: 'row',
        justifyContent: 'flex-end',
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
    domainVw: {
        height: 35,
        width: '24%',
        marginRight: 5,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    domainMainVw: {
        marginTop: 10,
        width: screenWidth,
        padding: 20,
        flexDirection: 'row',
    },
});
