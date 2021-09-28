import React, { Component } from 'react';
import {
    View,
    Animated,
    TouchableOpacity,
    Text
} from 'react-native';
import Color from '../utility/Color';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import _ from 'lodash';

class FeedbackButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isShow: false,
        }
    }

    componentDidMount() {

    }

    render() {
        let appointment = this.props.appointment;
        let answerSet = appointment.node.feedbackanswersSet;
        let userIds = [];
        if (answerSet) {
            userIds = _.uniqBy(answerSet, function (e) {
                return e.feedbackUser.id;
            });
        }
        return (
            <TouchableOpacity style={{ flexDirection: 'row' }} activeOpacity={1} onPress={() => {
                this.props.onPress();
            }}>
                <View>
                    <MaterialCommunityIcons
                        name='comment-account'
                        size={17}
                        color={Color.primary}
                    />
                    <View style={styles.badge}>
                        <Text style={{ color: Color.white, fontSize: 6 }}>{userIds.length}</Text>
                    </View>
                </View>
                <View>
                    <Text style={{ color: Color.primary, fontSize: 12, textDecorationLine: 'underline', marginLeft: 5, fontWeight: 'bold' }}>Feedback</Text>
                </View>
            </TouchableOpacity>
        )
    }
}

const styles = {
    badge: {
        backgroundColor: Color.danger,
        position: 'absolute',
        paddingVertical: 1,
        paddingHorizontal: 3,
        borderRadius: 5,
        left: 8,
        top: -5,
        borderWidth: 2,
        borderColor: Color.white
    }
};

export default FeedbackButton;