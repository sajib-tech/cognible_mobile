import React, { Component } from 'react';
import {View, Text, TouchableOpacity, Alert} from 'react-native';
import TherapistRequest from '../../constants/TherapistRequest';
import { SafeAreaView } from 'react-native';
import NavigationHeader from '../../components/NavigationHeader.js';
import { Row, Container, Column } from '../../components/GridSystem';
import RNFetchBlob from 'rn-fetch-blob'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'


class IepReport extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            iepData: '',
            iepFile: '',
            error: false
        }
    }

    componentDidMount() {
        this.fetchReport();
    }

    fetchReport() {
        const { pk } = this.props.route.params;
        console.log(pk, 'kokokokokokokokokokokok');
        let variables = {
            pk: pk
        }
        TherapistRequest.iepReportVbmapps(variables).then(result => {
            console.log(result, 'pppppppppppppppppppppp');
            this.setState({
                iepData: JSON.parse(result.data.vbmappIepReport.data),
                iepFile: result.data.vbmappIepReport.file
            })
        }).catch(error => {
            this.setState({ isLoading: false, error: true })
            console.log(error)
        });
    }

    handleDownload = () => {
        Alert.alert("Download Completed","")

        const { iepFile } = this.state;
        RNFetchBlob.config({
            addAndroidDownloads: {
                useDownloadManager: true, // <-- this is the only thing required
                // Optional, override notification setting (default to true)
                notification: true,
            }
        })
            .fetch('GET', iepFile)
            .then((resp) => {
                // the path of downloaded file
                console.log("sucesssss",resp.path())
                // resp.path()
            }).catch(error => console.log("errrorooro",error))
    }

    render() {
        const { iepData, iepFile } = this.state;
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF' }}>
                <NavigationHeader
                    backPress={() => this.props.navigation.goBack()}
                    title="IEP Report"
                />
                <Container>
                    {iepData !== '' ?
                        <View style={{}}>
                            <View style={{ flexDirection: 'row', marginVertical: 10 }}>
                                <Text style={{ flex: 1, marginRight: 10 }}>Student Name: </Text>
                                <Text style={{ flex: 2, fontWeight: '700' }}>{iepData.student.name}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', marginVertical: 10 }}>
                                <Text style={{ flex: 1, marginRight: 10 }}>Date of Birth: </Text>
                                <Text style={{ flex: 2, fontWeight: '700' }}>{iepData.student.dob}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', marginVertical: 10 }}>
                                <Text style={{ flex: 1, marginRight: 10 }}>Age: </Text>
                                <Text style={{ flex: 2, fontWeight: '700' }}>{iepData.student.age} Years</Text>
                            </View>
                            <View style={{ flexDirection: 'row', marginVertical: 10 }}>
                                <Text style={{ flex: 1, marginRight: 10 }}>School: </Text>
                                <Text style={{ flex: 2, fontWeight: '700' }}>{iepData.student.school}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', marginVertical: 10 }}>
                                <Text style={{ flex: 1, marginRight: 10 }}>Assessment Number: </Text>
                                <Text style={{ flex: 2, fontWeight: '700' }}>{iepData.report.test_no}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', marginVertical: 10 }}>
                                <Text style={{ flex: 1, marginRight: 10 }}>Assessment Date: </Text>
                                <Text style={{ flex: 2, fontWeight: '700' }}>{iepData.report.assess_date}</Text>
                            </View>
                            <TouchableOpacity onPress={this.handleDownload}
                            style={{ padding: 20, borderRadius: 10, backgroundColor: '#3E7BFA', marginBottom: 10,flexDirection:'row',justifyContent:'space-evenly' }}>
                                <MaterialCommunityIcons
                                    name="download"
                                    color="#FFFFFF"
                                    size={24}
                                />
                                <Text style={{ color: '#FFF', fontSize: 16, fontWeight: '700', textAlign: 'center' }}>Download Detailed Report</Text>
                            </TouchableOpacity>
                        </View>
                        :
                        <View>
                            {this.state.error === true ? <Text style={{ alignSelf: 'center', marginTop: '45%' }}>NO DATA</Text> :
                                <Text style={{ alignSelf: 'center', marginTop: '45%' }}>Loading ...</Text>}
                        </View>
                    }
                </Container>
            </SafeAreaView>
        )
    }
}

export default IepReport;
