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
import PickerModal from "../../../components/PickerModal";

let self;
const {
    height, width,
} = Dimensions.get('window');

class CommunityAddBlog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            description: '',
            categories: [
                { id: 'Q29tbXVuaXR5R3JvdXBzVHlwZTox', label: 'Travel' }
            ],
            groups: [],
            selectedCategory: 'Q29tbXVuaXR5R3JvdXBzVHlwZTox',
            groupId: null,

            isSaving: false
        }

        this.params = this.props.route.params;
        console.log("Params", this.params);
    }

    componentDidMount() {
        this.getData();
    }

    getData() {
        ParentRequest.getBlogData().then((result) => {
            console.log("getBlogData", result);
            let groups = result.data.communityGroups.map((group) => {
                return {
                    id: group.id,
                    label: group.name
                }
            });
            this.setState({ groups });
        }).catch((err) => {
            console.log("Err", err)
        })
    }

    saveGroup() {
        this.setState({ isSaving: true });
        let variables = {
            title: this.state.title,
            description: this.state.description,
            category: this.state.selectedCategory,
            groupId: this.state.groupId,
        };

        let promise = null;

        if (this.params) {
            variables.pk = this.params.id;

            promise = ParentRequest.updateBlogs(variables);
        } else {
            promise = ParentRequest.addBlogs(variables);
        }

        console.log("Vars", variables);

        promise.then((result) => {
            this.setState({ isSaving: false });
            Alert.alert("Information", "Blog Saved Successfully.");
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

    goBack() {
        this.props.navigation.goBack();
    }

    render() {
        return (
            <SafeAreaView style={{ backgroundColor: Color.white, flex: 1 }}>
                <NavigationHeader
                    title={this.params != null ? 'Update Blog' : 'Create A Blog'}
                    backPress={() => this.props.navigation.goBack()}
                />
                <Container>
                    <ScrollView>
                        <TextInput
                            label='Title'
                            placeholder='Title'
                            onChangeText={title => this.setState({ title })}
                            value={this.state.title}
                        />

                        <PickerModal
                            label='Category'
                            placeholder="Select Category"
                            selectedValue={this.state.selectedCategory}
                            data={this.state.categories}
                            onValueChange={(itemValue, itemIndex) => {
                                this.setState({ selectedCategory: itemValue });
                            }}
                        />

                        <PickerModal
                            label='Group'
                            placeholder="Select Group"
                            selectedValue={this.state.groupId}
                            data={this.state.groups}
                            onValueChange={(itemValue, itemIndex) => {
                                this.setState({ groupId: itemValue });
                            }}
                        />

                        <TextInput
                            label='Description'
                            placeholder='Description'
                            onChangeText={description => this.setState({ description })}
                            value={this.state.description}
                            multiline={true}
                        />
                    </ScrollView>

                    <Button labelButton='Save'
                        style={{ marginBottom: 10 }}
                        isLoading={this.state.isSaving}
                        onPress={() => {
                            this.saveGroup();
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
)(CommunityAddBlog);    