/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect, useState } from 'react';
import { SafeAreaView, TouchableOpacity, StyleSheet, View, FlatList } from 'react-native';
import { PermissionsAndroid, Platform } from "react-native";
import CameraRoll from "@react-native-community/cameraroll";
import FastImage from 'react-native-fast-image';

const App = () => {
  let [state, setState] = useState(null);
  let moreToken = "0";
  let [selected, setSelected] = useState(null);

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
        first: 200,
        after: { moreToken },
        assetType: 'Photos',
      })
        .then(r => {
          console.log(r.edges)
          setState(r.edges);
          console.log(r.page_info.has_next_page)
          console.log(r.page_info.end_cursor);
          if (r.page_info.has_next_page) {
            moreToken = r.page_info.end_cursor;
          }
        })
        .catch((err) => {
          alert(err);
          //Error Loading Images
        });
    }
  };
  const imageSelected = (image) => {
    console.log(image);
    setSelected(image);
  }
  return (
    <SafeAreaView >
      <FastImage
        style={{
          height: 300,
        }}
        resizeMode={FastImage.resizeMode.cover}
        source={{ uri: selected?.uri }} />
      <View>
        {/* <ScrollView> */}
        <FlatList
          data={state}
          renderItem={({ item }) =>
            <TouchableOpacity>
              <FastImage
                onProgress={imageSelected(item.node.image)}
                style={{
                  width: 140,
                  height: 200,
                }}
                source={{ uri: item.node.image.uri }} />
            </TouchableOpacity>
          }
          numColumns={3} />
        {/* </ScrollView> */}
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