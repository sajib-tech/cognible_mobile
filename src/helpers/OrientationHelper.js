import React, { Component } from 'react';
import { Dimensions } from 'react-native';

export default {
    getDeviceOrientation() {
        if (Dimensions.get('window').width < Dimensions.get('window').height) {
            return "portrait";
        } else {
            return "landscape"
        }
    }
}