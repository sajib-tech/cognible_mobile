import React, { Component } from 'react';
import { View, Image, Text, SafeAreaView, StatusBar } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import Color from './src/utility/Color';
import Button from './src/components/Button';
import { Container } from './src/components/GridSystem';

class Walkthrough extends Component {

    _renderItem({ item }) {
        return (
            <View style={styles.slideStyle}>
                <Image source={item.image} style={{ width: '100%', height: '50%' }} resizeMode='cover' />
                <Text style={styles.slideTitle}>{item.title}</Text>
                <Text style={styles.slideSubtitle}>{item.text}</Text>
            </View>
        );
    }

    render() {
        const slides = [
            {
                key: 1,
                title: 'Autism Therapy at home',
                text: 'Cogniable provides ABA , occupational and special education programs for kids with autism which helps develop language , communication skills. Improve social skills , comprehension skills and academics.',
                image: require('./android/img/walkthrough.jpeg'),
                backgroundColor: '#FFFFFF',
            },
            {
                key: 2,
                title: 'Early Screening can rehabilitate autism',
                text: 'Early screening  is your child’s best hope for the future. Early detection makes you one step closer to seek intervention at an initial phase.',
                image: require('./android/img/walkthrough22.jpeg'),
                backgroundColor: '#FFFFFF',
            },
            {
                key: 3,
                title: 'Acceptance and Commitment',
                text: 'Therapy for children and parents to deal with anxiety , turbulence , inner emotional conflicts by accepting  issues ,hardships and commit to make necessary changes in behavior, regardless of what is going on.',
                image: require('./android/img/walkthrough33.jpeg'),
                backgroundColor: '#FFFFFF',
            }
        ];

        return (
            <SafeAreaView style={styles.wrapper}>
                <StatusBar backgroundColor={Color.primary} barStyle='light-content' />

                <AppIntroSlider renderItem={this._renderItem} data={slides}
                    activeDotStyle={{ backgroundColor: Color.primary, width: 40, height: 5 }}
                    dotStyle={{ width: 20, backgroundColor: Color.gray, height: 5 }} />

                <Button labelButton='Continue'
                    style={{ marginHorizontal: 16, marginBottom: 10 }}
                    onPress={() => {
                        this.props.onContinue()
                    }} />
            </SafeAreaView>
        );
    }
}

const styles = {
    wrapper: {
        backgroundColor: Color.white,
        flex: 1
    },

    slideStyle: {
        flex: 1,
        justifyContent: 'center'
    },
    slideTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Color.blackFont,
        marginVertical: 8,
        paddingHorizontal: 16
    },
    slideSubtitle: {
        fontSize: 14,
        color: Color.grayFill,
        paddingHorizontal: 12
    },
};

export default Walkthrough;
