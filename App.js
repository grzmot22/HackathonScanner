import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as Permissions from "expo-permissions";
import { Camera } from "expo-camera";
import * as  FaceDetector from "expo-face-detector"

export default class App extends React.Component {

  state = {
    hasCameraPermission: false
  }

  handleFacesDetected = ({ faces }) => {
    if (faces.length > 0) {
      this.setState({ faces });
    }
  };
  cameraPermissionCheck = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }
  async componentWillMount() {

    this.cameraPermissionCheck()
  }
  render() {
    return (
      <View style={styles.container} >
        <Camera
          style={styles.camera}
          type={'front'}
          onFacesDetected={this.handleFacesDetected}
          faceDetectorSettings={{
            mode: FaceDetector.Constants.Mode.fast,
            detectLandmarks: FaceDetector.Constants.Mode.none,
            runClassifications: FaceDetector.Constants.Mode.none
          }}>
        </Camera>
      </View>
    )

  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
