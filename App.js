import { Camera } from "expo-camera";
import * as Permissions from "expo-permissions";
import * as FileSystem from "expo-file-system";
import * as FaceDetector from "expo-face-detector";
import React from "react";

import { View, Platform } from "react-native";

import {
  renderTopBar,
  renderMoreOptions,
  renderGallery,
  renderNoPermissions,
  renderFaces,
  renderLandmarks,
  renderBottomBar
} from "./Methods";
import { styles, landmarkSize } from "./styles";

export default class CameraScreen extends React.Component {
  state = {
    flash: "off",
    zoom: 0,
    autoFocus: "on",
    type: "front",
    whiteBalance: "auto",
    ratio: "16:9",
    ratios: [],
    faceDetecting: true,
    faces: [],
    newPhotos: false,
    permissionsGranted: false,
    pictureSize: undefined,
    pictureSizes: [],
    pictureSizeId: 0,
    showGallery: false,
    showMoreOptions: false
  };

  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ permissionsGranted: status === "granted" });
  }

  componentDidMount() {
    FileSystem.makeDirectoryAsync(
      FileSystem.documentDirectory + "photos"
    ).catch((e) => {
      console.log(e, "Directory exists");
    });
  }

  getRatios = async () => {
    const ratios = await this.camera.getSupportedRatios();
    return ratios;
  };

  toggleView = () =>
    this.setState({ showGallery: !this.state.showGallery, newPhotos: false });

  toggleMoreOptions = () =>
    this.setState({ showMoreOptions: !this.state.showMoreOptions });

  setRatio = (ratio) => this.setState({ ratio });

  toggleFocus = () =>
    this.setState({ autoFocus: this.state.autoFocus === "on" ? "off" : "on" });

  toggleFaceDetection = () =>
    this.setState({ faceDetecting: !this.state.faceDetecting });

  takePicture = () => {
    if (this.camera) {
      this.camera.takePictureAsync({ onPictureSaved: this.onPictureSaved });
    }
  };

  handleMountError = ({ message }) => console.error(message);

  onPictureSaved = async (photo) => {
    await FileSystem.moveAsync({
      from: photo.uri,
      to: `${FileSystem.documentDirectory}photos/${Date.now()}.jpg`
    });
    this.setState({ newPhotos: true });
  };

  onFacesDetected = ({ faces }) => this.setState({ faces });
  onFaceDetectionError = (state) =>
    console.warn("Faces detection error:", state);

  collectPictureSizes = async () => {
    if (this.camera) {
      const pictureSizes = await this.camera.getAvailablePictureSizesAsync(
        this.state.ratio
      );
      let pictureSizeId = 0;
      if (Platform.OS === "ios") {
        pictureSizeId = pictureSizes.indexOf("High");
      } else {
        // returned array is sorted in ascending order - default size is the largest one
        pictureSizeId = pictureSizes.length - 1;
      }
      this.setState({
        pictureSizes,
        pictureSizeId,
        pictureSize: pictureSizes[pictureSizeId]
      });
    }
  };

  previousPictureSize = () => this.changePictureSize(1);
  nextPictureSize = () => this.changePictureSize(-1);

  changePictureSize = (direction) => {
    let newId = this.state.pictureSizeId + direction;
    const length = this.state.pictureSizes.length;
    if (newId >= length) {
      newId = 0;
    } else if (newId < 0) {
      newId = length - 1;
    }
    this.setState({
      pictureSize: this.state.pictureSizes[newId],
      pictureSizeId: newId
    });
  };

  renderCamera = () => (
    <View style={{ flex: 1 }}>
      <Camera
        ref={(ref) => {
          this.camera = ref;
        }}
        style={styles.camera}
        onCameraReady={this.collectPictureSizes}
        type={this.state.type}
        flashMode={this.state.flash}
        autoFocus={this.state.autoFocus}
        zoom={this.state.zoom}
        whiteBalance={this.state.whiteBalance}
        ratio={this.state.ratio}
        pictureSize={this.state.pictureSize}
        onMountError={this.handleMountError}
        onFacesDetected={
          this.state.faceDetecting ? this.onFacesDetected : undefined
        }
        onFaceDetectionError={this.onFaceDetectionError}
        DetectorSettings={{
          mode: FaceDetector.Constants.Mode.fast,
          detectLandmarks: FaceDetector.Constants.Landmarks.all,
          runClassifications: FaceDetector.Constants.Classifications.all,
          minDetectionInterval: 100,
          tracking: true
        }}
      >
        {renderTopBar(this.state.autoFocus, this.toggleFocus)}
        {renderBottomBar(
          this.toggleView,
          this.toggleMoreOptions,
          this.state.newPhotos
        )}
      </Camera>
      {this.state.faceDetecting && renderFaces(this.state.faces)}
      {this.state.faceDetecting && renderLandmarks(this.state.faces)}
      {this.state.showMoreOptions &&
        renderMoreOptions(
          this.toggleFaceDetection,
          this.state.faceDetecting,
          this.state.pictureSize
        )}
    </View>
  );

  render() {
    const cameraScreenContent = this.state.permissionsGranted
      ? this.renderCamera()
      : renderNoPermissions();
    const content = this.state.showGallery
      ? renderGallery()
      : cameraScreenContent;
    return <View style={styles.container}>{content}</View>;
  }
}
