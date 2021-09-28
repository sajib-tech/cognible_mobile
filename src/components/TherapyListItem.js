import React, { Component } from 'react';

import { View, Text, Image, FlatList, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import Color from '../utility/Color';
class TherapyListItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.id,
            title: props.title,
            description: props.description,
            callBack: props.callBack
        };
        this.gotoTherapyRoadMap = this.gotoTherapyRoadMap.bind(this);
    }
    render() {
        let selected = this.props.selected;
        let listStyle = styles.listItemView;
        let titleStyle = styles.listItemTextTitle;
        let subtitleStyle = styles.listItemTextDescription;
        if (selected) {
            listStyle = [styles.listItemView, { backgroundColor: Color.primary }];
            titleStyle = [styles.listItemTextTitle, { color: Color.white }];
            subtitleStyle = [styles.listItemTextDescription, { color: Color.white }];
        }
        return (
            <TouchableWithoutFeedback onPress={this.gotoTherapyRoadMap}>
                <View style={listStyle}>
                    <View style={styles.listItemImageView}>
                        <Image source={require('../../android/img/Img-2.png')} style={{ borderRadius: 6, width: 62, height: 62 }} />
                    </View>
                    <View style={styles.listItemTextView}>
                        <Text style={titleStyle}>{this.state.title}</Text>
                        <Text style={subtitleStyle} >{this.state.description}
                        </Text>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        )
    }
    gotoTherapyRoadMap = () => {
        this.props.callBack(this.state.id);
    }
    // TherapyRoadMap
}
const styles = StyleSheet.create({
    listItemView: {
        flexDirection: 'row',
        padding: 10,
        borderRadius: 5,
        margin: 3,
        marginBottom: 10,
        backgroundColor: Color.white,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,

        elevation: 3,
    },
    listItemImageView: {
        
    },
    listItemTextView: {
        flex: 1,
        paddingLeft: 10
    },
    listItemTextTitle: {
        fontSize: 19,
        color: '#3E7BFA'
    },
    listItemTextDescription: {
        fontSize: 13,
        color: 'rgba(95, 95, 95, 0.75)'
    },
});
export default TherapyListItem;