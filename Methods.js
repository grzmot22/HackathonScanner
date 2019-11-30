import React from "react";

import { Text, View, TouchableOpacity } from "react-native";
import { styles, landmarkSize } from "./styles";
import GalleryScreen from "./GalleryScreen";
import {
  Ionicons,
  MaterialIcons,
  Foundation,
  Octicons
} from "@expo/vector-icons";
export const renderFace = ({ bounds, faceID, rollAngle, yawAngle }) => {
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
};

export const renderTopBar = (autoFocus, toggleFocus) => (
  <View style={styles.topBar}>
    <TouchableOpacity style={styles.toggleButton} onPress={toggleFocus}>
      <Text
        style={[
          styles.autoFocusLabel,
          { color: autoFocus === "on" ? "white" : "#6b6b6b" }
        ]}
      >
        AF
      </Text>
    </TouchableOpacity>
  </View>
);

export const renderMoreOptions = (
  toggleFaceDetection,
  faceDetecting,
  pictureSize
) => (
  <View style={styles.options}>
    <View style={styles.detectors}>
      <TouchableOpacity onPress={toggleFaceDetection}>
        <MaterialIcons
          name="tag-faces"
          size={32}
          color={faceDetecting ? "white" : "#858585"}
        />
      </TouchableOpacity>
    </View>

    <View style={styles.pictureSizeContainer}>
      <Text style={styles.pictureQualityLabel}>Picture quality</Text>
      <View style={styles.pictureSizeChooser}>
        <TouchableOpacity
          onPress={this.previousPictureSize}
          style={{ padding: 6 }}
        >
          <Ionicons name="md-arrow-dropleft" size={14} color="white" />
        </TouchableOpacity>
        <View style={styles.pictureSizeLabel}>
          <Text style={{ color: "white" }}>{pictureSize}</Text>
        </View>
        <TouchableOpacity onPress={this.nextPictureSize} style={{ padding: 6 }}>
          <Ionicons name="md-arrow-dropright" size={14} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  </View>
);

export const renderGallery = (toggleView) => {
  return <GalleryScreen onPress={toggleView.bind(this)} />;
};

export const renderLandmarksOfFace = (face) => {
  const renderLandmark = (position) =>
    position && (
      <View
        style={[
          styles.landmark,
          {
            left: position.x - landmarkSize / 2,
            top: position.y - landmarkSize / 2
          }
        ]}
      />
    );
  return (
    <View key={`landmarks-${face.faceID}`}>
      {renderLandmark(face.leftEyePosition)}
      {renderLandmark(face.rightEyePosition)}
      {renderLandmark(face.leftEarPosition)}
      {renderLandmark(face.rightEarPosition)}
      {renderLandmark(face.leftCheekPosition)}
      {renderLandmark(face.rightCheekPosition)}
      {renderLandmark(face.leftMouthPosition)}
      {renderLandmark(face.mouthPosition)}
      {renderLandmark(face.rightMouthPosition)}
      {renderLandmark(face.noseBasePosition)}
      {renderLandmark(face.bottomMouthPosition)}
    </View>
  );
};

export const renderNoPermissions = () => (
  <View style={styles.noPermissions}>
    <Text style={{ color: "white" }}>
      Camera permissions not granted - cannot open camera preview.
    </Text>
  </View>
);

export const renderFaces = (faces) => (
  <View style={styles.facesContainer} pointerEvents="none">
    {faces.map(renderFace)}
  </View>
);

export const renderLandmarks = (faces) => (
  <View style={styles.facesContainer} pointerEvents="none">
    {faces.map(renderLandmarksOfFace)}
  </View>
);

export const renderBottomBar = (toggleView, toggleMoreOptions, newPhotos) => (
  <View style={styles.bottomBar}>
    <TouchableOpacity style={styles.bottomButton} onPress={toggleMoreOptions}>
      <Octicons name="kebab-horizontal" size={30} color="white" />
    </TouchableOpacity>
    <View style={{ flex: 0.4 }}>
      <TouchableOpacity
        onPress={this.takePicture}
        style={{ alignSelf: "center" }}
      >
        <Ionicons name="ios-radio-button-on" size={70} color="white" />
      </TouchableOpacity>
    </View>
    <TouchableOpacity style={styles.bottomButton} onPress={toggleView}>
      <View>
        <Foundation name="thumbnails" size={30} color="white" />
        {newPhotos && <View style={styles.newPhotosDot} />}
      </View>
    </TouchableOpacity>
  </View>
);
