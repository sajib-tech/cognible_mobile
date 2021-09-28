import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Row, Column } from './GridSystem';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Color from '../utility/Color';
import Button from './Button';

export default class NumericStepper extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Row style={this.props.style}>
                <Column>
                    <Text style={styles.label}>{this.props.title}</Text>
                </Column>
                <Column>
                    <Row>
                        <Column>
                            <Button
                                theme='secondary'
                                labelButton={<MaterialCommunityIcons name='minus' size={30} color={Color.primary} />}
                                onPress={() => {
                                    this.props.onDecrease();
                                }}
                            />
                        </Column>
                        <Column>
                            <Text style={styles.counterText}>{this.props.value}</Text>
                        </Column>
                        <Column>
                            <Button
                                theme='secondary'
                                labelButton={<MaterialCommunityIcons name='plus' size={30} color={Color.primary} />}
                                onPress={() => {
                                    this.props.onIncrease();
                                }}
                            />
                        </Column>
                    </Row>
                </Column>
            </Row>
        );
    }
}

const styles = {

    label: {
        fontSize: 16,
        color: Color.black,
        marginTop: 10
    },
    counterText: {
        fontSize: 20,
        color: Color.black,
        textAlign: 'center',
        marginTop: 10
    }
};