import React, { Component } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Color from "../utility/Color";
import Button from "./Button";
import { Column, Row } from "./GridSystem";

export default class Tab extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Row style={{marginVertical:5}}>
                {/* <View style={styles.side} /> */}
                {this.props.labels.map((text, key) => {
                    // let activeStyle = null;
                    // if(key == this.props.activeTab){
                    //     activeStyle = {
                    //         borderBottomColor: Color.white
                    //     }
                    // }
                    // return (
                    //     <TouchableOpacity activeOpacity={0.9} key={key} style={[styles.tab, activeStyle]} onPress={()=>{
                    //         this.props.onChangeTab(key);
                    //     }}>
                    //         <Text style={styles.tabText}>{text}</Text>
                    //     </TouchableOpacity>
                    // );
                    let isActive = false;
                    let theme = 'secondary';
                    if (key == this.props.activeTab) {
                        isActive = true;
                        theme = 'primary'
                    }

                    return (
                        <Column>
                            <Button theme={theme} labelButton={text} onPress={() => {
                                this.props.onChangeTab(key);
                            }} />
                        </Column>
                    );
                })}
            </Row>
        );
    }
}

const styles = {
    wrapper: {
        flexDirection: 'row',
        marginVertical: 5
    },
    side: {
        borderBottomWidth: 1,
        borderBottomColor: Color.primary,
        height: 50,
        width: 10,
    },
    tab: {
        flex: 1,
        borderWidth: 1,
        borderColor: Color.primary,
        justifyContent: 'center',
        alignItems: 'center',
        height: 50,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
    },
    tabText: {
        color: Color.primary
    }
};