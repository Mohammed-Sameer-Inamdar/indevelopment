/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect, useState } from 'react';
import {
  SafeAreaView, TouchableOpacity,
  StyleSheet,
  Text,
  View,
  Button,
  FlatList
} from 'react-native';


import { PermissionsAndroid, Platform } from "react-native";
import CameraRoll from "@react-native-community/cameraroll";

import FastImage from 'react-native-fast-image';

const App = () => {
  const [state, setState] = useState(null);
  const [moreToken, setMoreToken] = useState('0');

  async function hasAndroidPermission() {
    const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;

    const hasPermission = await PermissionsAndroid.check(permission);
    if (hasPermission) {
      return true;
    }
    const status = await PermissionsAndroid.request(permission);
    return status === 'granted';
  }

  async function savePicture() {
    if (Platform.OS === "android" && !(await hasAndroidPermission())) {
      return;
    }

    CameraRoll.save(tag, { type, album })
  };

  useEffect(() => {
    _handleButtonPress();
  }, [])

  const _handleButtonPress = () => {
    // alert('calling')
    if (hasAndroidPermission()) {
      CameraRoll.getPhotos({
        first: 20,
        after: '30',
        assetType: 'Photos',
      })
        .then(r => {
          console.log(r.edges)
          setState(r.edges);
          console.log(r.page_info.has_next_page)
          console.log(r.page_info.end_cursor);
          if (r.page_info.has_next_page) {
            setMoreToken(r.page_info.end_cursor);
          }
        })
        .catch((err) => {
          alert(err);
          //Error Loading Images
        });
    }
  };
  return (
    <SafeAreaView >
      <Text >Hi</Text>
      <View>
        <Button title="Load Images" onPress={_handleButtonPress} />
        <FlatList
          data={state}
          renderItem={({ item }) =>
            <TouchableOpacity>
              <FastImage
                style={{
                  width: 120,
                  height: 200,
                }}
                resizeMode={FastImage.resizeMode.cover}
                source={{ uri: item.node.image.uri }} />
            </TouchableOpacity>
          }
          numColumns={3} />

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;