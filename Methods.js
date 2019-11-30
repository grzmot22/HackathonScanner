
import Constants from 'expo-constants';
import { Camera } from 'expo-camera';
import * as Permissions from 'expo-permissions';
import * as FileSystem from 'expo-file-system';
import * as FaceDetector from 'expo-face-detector';
import React from 'react';

import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Platform
} from 'react-native';
import GalleryScreen from './GalleryScreen';
import isIPhoneX from 'react-native-is-iphonex';

import {
    Ionicons,
    MaterialIcons,
    Foundation,
    Octicons
} from '@expo/vector-icons';


export const renderFace = ({ bounds, faceID, rollAngle, yawAngle }, styles) => {
    return (
        <View
            key={faceID}
            transform={[
                { perspective: 600 },
                { rotateZ: `${rollAngle.toFixed(0)}deg` },
                { rotateY: `${yawAngle.toFixed(0)}deg` }
            ]}
            style={[
                styles.face,
                {
                    ...bounds.size,
                    left: bounds.origin.x,
                    top: bounds.origin.y
                }
            ]}
        >
            <Text style={styles.faceText}>ID: {faceID}</Text>
            <Text style={styles.faceText}>rollAngle: {rollAngle.toFixed(0)}</Text>
            <Text style={styles.faceText}>yawAngle: {yawAngle.toFixed(0)}</Text>
        </View>
    );
}
