import React, { Component } from 'react';
import {View, Text, TouchableOpacity, SafeAreaView, Alert} from 'react-native';
import NavigationHeader from '../../../components/NavigationHeader.js';
import { Row, Container, Column } from '../../../components/GridSystem';
import RNFetchBlob from 'rn-fetch-blob'
import TherapistRequest from '../../../constants/TherapistRequest.js';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import LoadingIndicator from '../../../components/LoadingIndicator.js';
import { ScrollView } from 'react-native-gesture-handler';
import Button from '../../../components/Button.js';
import { error } from 'react-native-gifted-chat/lib/utils';
import SimpleModal from '../../../components/SimpleModal.js';
import Color from '../../../utility/Color.js';


class CogniableReport extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            error: false,
            iepData: '',
            iepFile: '',
            downloadComplete: false,
            isDownloading: false
        }
    }

    componentDidMount() {
        this.fetchReport();
    }

    fetchReport() {
        const { pk } = this.props.route.params;
        let variables = {
            pk: pk
        }
        this.setState({ isLoading: true });
        TherapistRequest.cogniableReport(variables).then(result => {
            console.log("cogniableReport", result,pk);
            if (result.data.cogniableAssessmentReport == null) {
                this.setState({ error: true, isLoading: false })
            } else {
                let iepData = JSON.parse(result.data.cogniableAssessmentReport.data);
                console.log({ iepData });
                this.setState({
                    iepData,
                    iepFile: result.data.cogniableAssessmentReport.file,
                    isLoading: false,
                    error: false
                })
            }
        }).catch(error => {
            this.setState({ isLoading: false, error: true })
            console.log(error)
        });
    }

    handleDownload = () => {
        this.setState({ isDownloading: true });
        const { iepFile } = this.state;
        RNFetchBlob.config({
            addAndroidDownloads: {
                useDownloadManager: true, // <-- this is the only thing required
                // Optional, override notification setting (default to true)
                notification: true,
            }
        }).fetch('GET', iepFile).then((resp) => {
            // the path of downloaded file
            console.log(resplslslslsslslslsl, 'oooooooooooooooooo');
            console.log(resp.path())
            // resp.path()

            // Alert.alert("", "Download Complete Successfully");

            this.setState({ downloadComplete: true, isDownloading: false },()=>{
                // Alert.alert("Download Complete", "Sucessfully");
            });

        }).catch(error => {
            console.log(error);
            // Alert.alert("", "Download Complete Successfully");
            this.setState({downloadComplete: true, isDownloading: false });
        })
    }

    renderAge(age) {
        if (age == "") {
            return "-";
        }
        return age;
    }

    render() {
        const { iepData, error, isLoading, isDownloading, downloadComplete } = this.state;
        console.log("llsksksnsns", iepData);
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF' }}>
                <NavigationHeader
                    backPress={() => this.props.navigation.goBack()}
                    title="Cogniable Report"
                />
                {isLoading && <LoadingIndicator />}

                {(!isLoading && error) && (
                    <Text>Oops.. cannot load data.</Text>
                )}

                {(!isLoading && !error) && (
                    <Container>
                        <ScrollView>
                            <View style={{}}>
                                <View style={styles.row}>
                                    <Text style={{ marginRight: 10 }}>Student Name :</Text>
                                    <Text style={{ flex: 1, fontWeight: '700' }}>{iepData.student.name}</Text>
                                    <Text style={{ marginRight: 10 }}>Age: </Text>
                                    <Text style={{ fontWeight: '700' }}>{iepData.student.age}</Text>
                                </View>
                                <View style={styles.row}>
                                    <Text style={{ marginRight: 10 }}>School: </Text>
                                    <Text style={{ flex: 1, fontWeight: 'bold', textAlign: 'right' }}>{iepData.student.school}</Text>
                                </View>

                                <View style={styles.row}>
                                    <Text style={{ flex: 1, marginRight: 10 }}>ADLS : </Text>
                                    <Text style={{ marginRight: 10 }}>Age: </Text>
                                    <Text style={{ fontWeight: 'bold' }}>{this.renderAge(iepData.adls.age)}</Text>
                                </View>

                                <View style={styles.row}>
                                    <Text style={{ flex: 1, marginRight: 10 }}>Cognition : </Text>
                                    <Text style={{ marginRight: 10 }}>Age: </Text>
                                    <Text style={{ fontWeight: 'bold' }}>{this.renderAge(iepData.ct.age)}</Text>
                                </View>

                                <View style={styles.row}>
                                    <Text style={{ flex: 1, marginRight: 10 }}>Language & Communication : </Text>
                                    <Text style={{ marginRight: 10 }}>Age: </Text>
                                    <Text style={{ fontWeight: 'bold' }}>{this.renderAge(iepData.lc.age)}</Text>
                                </View>

                                <View style={styles.row}>
                                    <Text style={{ flex: 1, marginRight: 10 }}>Play Skills : </Text>
                                    <Text style={{ marginRight: 10 }}>Age: </Text>
                                    <Text style={{ fontWeight: 'bold' }}>{this.renderAge(iepData.ps.age)}</Text>
                                </View>

                                <View style={styles.row}>
                                    <Text style={{ flex: 1, marginRight: 10 }}>Socialization & Emotional Development : </Text>
                                    <Text style={{ marginRight: 10 }}>Age: </Text>
                                    <Text style={{ fontWeight: 'bold' }}>{this.renderAge(iepData.se.age)}</Text>
                                </View>

                            </View>
                        </ScrollView>
                        <Button labelButton='Download Detailed Report'
                            iconLeft={true}
                            materialCommunityIconLeftName='download'
                            style={{ marginBottom: 10 }}
                            isLoading={isDownloading}
                            onPress={() => {
                                this.handleDownload();
                            }} />

                    </Container>
                )}

                <SimpleModal visible={downloadComplete}>


                    <View style={{ alignItems: 'center' }}>
                        <View style={styles.circle}>
                            <MaterialCommunityIcons name='check' color={Color.white} size={50} />
                        </View>
                        <Text style={{ fontWeight: 'bold', marginVertical: 20, fontSize: 18 }}>Download Complete</Text>
                    </View>
                    <Button labelButton='Ok'
                        style={{ marginBottom: 10 }}
                        onPress={() => {
                            this.setState({ downloadComplete: false })
                        }} />
                </SimpleModal>

            </SafeAreaView>
        )
    }
}

const styles = {
    row: {
        flexDirection: 'row',
        marginTop: 16
    },
    circle: {
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: '#27ae60',
        justifyContent: 'center',
        alignItems: 'center'
    }
};

export default CogniableReport;
