import { StatusBar } from 'expo-status-bar';
import React, { Component } from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  SafeAreaView, 
  Platform, 
  Image, 
  ScrollView, 
  TouchableOpacity 
} from "react-native";
import { Camera } from "expo-camera";
import * as FaceDetector from "expo-face-detector";
import Filter1 from './Filter1';

export default class Main extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      hasCameraPermission: null,
      faces: []
    };

    this.onFacesDetected = this.onFacesDetected.bind(this);
  };
  
  async componentDidMount(){
    const { status } = await Camera.requestCameraPermissionsAsync();
    this.setState({ hasCameraPermission: status === "granted" });
  };

  onFacesDetected({ faces }){
    this.setState({ faces: faces });
    //console.log(this.state.faces);
  };

  onFacesDetectionError = (error)=>{
    console.log(error);
  }

  render(){
    const {hasCameraPermission} = this.state;
    if (hasCameraPermission === null){
      return <View/>;
    };
    if (hasCameraPermission === false){
      return(
        <View style={[styles.container, {alignItems: 'center', justifyContent: 'center'}]}>
          <Text style={styles.noAccessText}>very no access to camera</Text>
        </View>  
      );
    };
    return(
      <View style={styles.container}>
      <SafeAreaView style={styles.iosSafeArea}/>
        <StatusBar backgroundColor="#000"/>
        <View style={styles.headingContainer}>
          <Image
            style={{width: 75, height: 75}}
            source={require('../assets/logo2.png')}
          />
          <Text style={styles.titleText}>  DisguiseCam</Text>
        </View>
        <View style={styles.middleContainer}>
          <Camera
            style={styles.cameraStyle}
            type={Camera.Constants.Type.front}
            faceDetectorSettings={{
              mode: FaceDetector.FaceDetectorMode.fast,
              detectLandmarks: FaceDetector.FaceDetectorLandmarks.all,
              runClassififcations: FaceDetector.FaceDetectorClassifications.all
            }}
            onFacesDetected={this.onFacesDetected}
            onFacesDetectionError={this.onFacesDetectionError}
          />
          {this.state.faces.map(face=>(
            <Filter1 key={`face-id-${face.faceID}`} face={face}/>
          ))}
        </View>
        <View style={styles.filterContainer}></View>
        <View style={styles.actionContainer}></View>
    </View>
    );
  };
};

const styles = StyleSheet.create({
  container:{
    flex: 1
  },
  iosSafeArea:{
    marginTop: Platform.OS === "ios" ? StatusBar.currentHeight : 0,
  },
  headingContainer:{
    flex: 0.1,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginBottom: 10,
  },
  noAccessText:{
    fontSize: 30,
    alignItems: "center",
    justifyContent: "center"
  },
  titleText:{
    fontSize: 30,
  },
  middleContainer:{
    flex: 0.75
  },
  cameraStyle:{
    flex: 1,
    width: "160%", 
    alignSelf: "center",
  },
  filterContainer:{
    flex: 0.06,
  },
  actionContainer:{
    flex: 0.09,
    backgroundColor: "#626470",
    marginHorizontal: -77.5
  }
});