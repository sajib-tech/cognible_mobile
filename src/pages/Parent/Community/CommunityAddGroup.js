import React, { Component } from "react";
import { Text, SafeAreaView, Dimensions, StyleSheet, ScrollView, Alert } from "react-native";
import { connect } from "react-redux";

import Snackbar from "react-native-snackbar";
import ParentRequest from '../../../constants/ParentRequest';
import store from '../../../redux/store';
import NavigationHeader from "../../../components/NavigationHeader";
import { Container } from "../../../components/GridSystem";
import Color from "../../../utility/Color";
import TextInput from "../../../components/TextInput";
import Button from "../../../components/Button";

let self;
const {
    height, width,
} = Dimensions.get('window');

class CommunityAddGroup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            description: '',

            isSaving: false
        }

        this.params = this.props.route.params;
        console.log("Params", this.params);
    }

    componentDidMount() {
        if (this.params) {
            this.setState({
                name: this.params.name,
                description: this.params.description,
            })
        }
    }

    saveGroup() {
        this.setState({ isSaving: true });
        let variables = {
            name: this.state.name,
            description: this.state.description,
        };

        let promise = null;

        if (this.params) {
            variables.pk = this.params.id;
            variables.userId = store.getState().user.id;

            promise = ParentRequest.updateGroup(variables);
        } else {
            promise = ParentRequest.addGroup(variables);
        }

        promise.then((result) => {
            this.setState({ isSaving: false });
            Alert.alert("Information", "Successfully save group.");
            this.props.navigation.goBack();
        }).catch((err) => {
            this.setState({ isSaving: false });
            Alert.alert("Information", err.toString());
        })
    }

    showSnackbar(title) {
        Snackbar.show({
            title: title,
            duration: Snackbar.LENGTH_LONG,
            position: "top",
            backgroundColor: Color.danger,
            color: "white",
        });
    }

    render() {
        return (
            <SafeAreaView style={{ backgroundColor: Color.white, flex: 1 }}>
                <NavigationHeader
                    title={this.params != null ? "Update Group" : "Create Group"}
                    backPress={() => this.props.navigation.goBack()}
                />
                <Container>
                    <ScrollView>
                        <TextInput
                            label='Name'
                            onChangeText={name => this.setState({ name })}
                            value={this.state.name}
                        />

                        <TextInput
                            label='Description'
                            onChangeText={description => this.setState({ description })}
                            value={this.state.description}
                            multiline={true}
                        />
                    </ScrollView>

                    <Button labelButton='Save'
                        style={{ marginBottom: 10 }}
                        isLoading={this.state.isSaving}
                        onPress={() => {
                            this.saveGroup()
                        }} />
                </Container>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    containerHeader: {
        flexDirection: "row"
    },
    parentView: {
        backgroundColor: '#EEEEF4',
        flex: 1,
    },

    editStyle1: {
        color: '#45494E',
        fontSize: 16,
        borderRadius: 8,
        marginTop: 6,
        borderWidth: 2,
        padding: 10,
        backgroundColor: 'white',
        width: width * 0.80,
        borderColor: '#D5D5D5',
        height: height * 0.070,
        alignSelf: 'center'
    },
    Blogtextstyle: {
        alignSelf: 'flex-start',
        fontSize: 18,
        color: '#45494E',
        padding: 10,

        width: width * 100,
        fontStyle: 'normal',
        fontWeight: '600',

    },

    textstyle: {
        alignSelf: 'center',
        fontSize: 16,
        color: 'black',
        paddingTop: 12,
        borderBottomColor: 'black',
        width: width * 0.80,


    },
    editStyledescription: {
        color: 'black',
        fontSize: 16,
        borderRadius: 6,
        marginTop: 6,
        borderWidth: 2,
        padding: 10,
        backgroundColor: '#FFFFFF',
        width: width * 0.80,
        borderColor: '#D5D5D5',
        height: height * 0.2,
        alignSelf: 'center', textAlignVertical: 'top'

    },

    updatebtnview: {
        height: height * 0.070,
        width: width * 0.80,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignSelf: 'flex-start',
        alignItems: 'center',
        marginLeft: 40,
        marginTop: 20,
        backgroundColor: '#213077',
        borderRadius: 8,
    },
    btntext: {
        alignSelf: 'center',
        color: '#FFFFFF',
        fontSize: 17,

    },

});

const mapStateToProps = state => ({
})
const mapDispatchToProps = dispatch => ({
});
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CommunityAddGroup);    