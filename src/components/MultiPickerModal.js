import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, Dimensions, KeyboardAvoidingView } from 'react-native';
import { Row, Column } from './GridSystem';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Color from '../utility/Color';
import Button from './Button';
import NoData from './NoData';
const { width, height } = Dimensions.get('window');
import _ from 'lodash';
import TextInput from './TextInput';

export default class MultiPickerModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showModal: false,
            query: '',
            selectedValue: [],
            filteredData: [],
        };
    }

    componentDidUpdate(prevProp) {

    }

    toggle(index) {
        let propsData = this.getData();
        let item = propsData[index];
        let selectedValue = this.state.selectedValue;

        let itemIndex = _.indexOf(selectedValue, item.id);

        if (itemIndex == -1) {
            selectedValue.push(item.id);
        } else {
            selectedValue.splice(itemIndex, 1);
        }

        this.setState({ selectedValue });
    }

    select() {
        this.setState({ showModal: false, query: "" });
        this.props.onSelect(this.state.selectedValue);
    }

    filterData() {
        let query = this.state.query;
        console.log("Query", query);

        let filteredData = this.props.data.filter(item => item.label.toLowerCase().indexOf(query.toLowerCase()) >= 0);
        console.log(filteredData);

        this.setState({ filteredData });
    }

    getData() {
        if (this.state.query == "") {
            return this.props.data;
        } else {
            return this.state.filteredData;
        }
    }

    renderLabel() {
        let label = "Select";
        if (this.props.placeholder) {
            label = this.props.placeholder;
        }

        let data = {};
        let propsData = this.getData();
        propsData.forEach((item) => {
            data[item.id] = item.label;
        });

        //console.log("RenderLabel", this.props.value);

        if (this.props.value.length != 0) {
            let arrLabel = this.props.value.map((itemId) => {
                return data[itemId];
            });

            label = arrLabel.join(", ");
        }

        return (
            <Text style={styles.text} ellipsizeMode='tail' numberOfLines={1}>{label}</Text>
        );
    }

    render() {
        let filteredData = this.getData();
        let value = this.props.value;
        return (
            <>
                {this.props.label != null && (
                    <View style={{ flexDirection: 'row', alignItems: 'center',justifyContent:'space-between'}}>
                        <Text style={styles.label}>{this.props.label}</Text>
                        {this.props.onAdded && (
                            <TouchableOpacity onPress={() => {
                                this.props.onAdded();
                            }}>
                                <MaterialCommunityIcons
                                    name='plus'
                                    size={20}
                                    color={Color.black}
                                />
                            </TouchableOpacity>
                        )}
                    </View>
                )}
                {(this.props.error != "" && this.props.error != null) && (
                    <Text style={styles.errorText}>{this.props.error}</Text>
                )}
                <TouchableOpacity activeOpacity={0.9} style={styles.button} onPress={() => {
                    this.setState({ showModal: true, selectedValue: _.cloneDeep(value) });
                }}>
                    <View style={{ flex: 1 }}>
                        {this.renderLabel()}
                    </View>
                    <MaterialCommunityIcons
                        name="chevron-down"
                        size={20}
                        // style={{flex:1,}}
                        color={Color.primaryFont}
                    />
                </TouchableOpacity>
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={this.state.showModal}
                    onRequestClose={() => this.setState({ showModal: false, query: "" })}>
                    <KeyboardAvoidingView behavior="height" enabled={Platform.OS == 'ios' ? true : false}>
                        <TouchableOpacity onPress={() => this.setState({ showModal: false, query: "" })}
                            activeOpacity={1}
                            style={styles.modalRoot}>
                            <View style={styles.modalContent}>
                                <TextInput
                                    placeholder='Type to Search'
                                    autoFocus={true}
                                    defaultValue={this.state.query}
                                    onChangeText={(query) => {
                                        this.setState({ query }, () => {
                                            this.filterData();
                                        });
                                    }} />
                                <ScrollView
                                    showsHorizontalScrollIndicator={false}
                                    showsVerticalScrollIndicator={false}
                                    keyboardShouldPersistTaps='handled'>
                                    {filteredData.length == 0 && (
                                        <NoData>No Data Available</NoData>
                                    )}
                                    {filteredData.map((item, index) => {
                                        let exist = _.indexOf(this.state.selectedValue, item.id) != -1 ? true : false;
                                        return (
                                            <TouchableOpacity key={index} onPress={() => {
                                                this.toggle(index);
                                            }} style={styles.modalItem}>
                                                {!exist && <MaterialCommunityIcons name='checkbox-blank-outline' size={25} color={Color.blackFont} />}
                                                {exist && <MaterialCommunityIcons name='checkbox-marked-outline' size={25} color={Color.success} />}
                                                <Text style={styles.modalText}>{item.label}</Text>
                                            </TouchableOpacity>
                                        )
                                    })}
                                </ScrollView>
                                <Button labelButton='Select'
                                    onPress={() => {
                                        this.select();
                                    }} />
                            </View>
                        </TouchableOpacity>
                    </KeyboardAvoidingView>
                </Modal>
            </>
        );
    }
}

const styles = {
    modalRoot: {
        backgroundColor: 'rgba(0,0,0,0.1)',
        width: '100%',
        height: '100%',
        // justifyContent: 'center',
        paddingVertical: '15%',
        alignItems: 'center'
    },
    modalContent: {
        width: 300,
        borderRadius: 5,
        backgroundColor: Color.white,
        padding: 10,
        maxHeight: '100%'
    },
    modalItem: {
        paddingVertical: 10,
        borderBottomColor: "#eee",
        borderBottomWidth: 1,
        paddingHorizontal: 5,
        flexDirection: 'row',
        alignItems: 'center'
    },
    modalText: {
        color: Color.black,
        flex: 1,
        marginLeft: 5
    },
    button: {
        borderWidth: 1,
        borderColor: Color.gray,
        borderRadius: 5,
        marginTop: 5,
        marginBottom: 15,
        paddingVertical: 15,
        paddingHorizontal: 15,
        flexDirection: 'row',
        alignItems: 'center'
    },
    text: {
        fontSize: 14,
        color: Color.grayFill
    },
    label: {
        color: Color.grayFill,
        marginTop: 5
    },
    errorText: {
        color: Color.danger
    },
};