/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect, useState } from 'react';
import { SafeAreaView, TouchableOpacity, StyleSheet, View, FlatList, Text } from 'react-native';
import { PermissionsAndroid, Platform } from "react-native";
import CameraRoll, { getPhotos } from "@react-native-community/cameraroll";
import FastImage from 'react-native-fast-image';

const App = () => {

  let imageGaller = {
    hasMore: true,
    first: 100,
    after: '0',
    photos: []
  }

  let [state, setState] = useState(null);
  let moreToken = "0";
  let hasMore = false;
  let [selected, setSelected] = useState(null);


  loadPhotos = () => {
    if (imageGaller.hasMore) {
      fetchPhotos(imageGaller.first, imageGaller.after);
    }
  }

  const fetchPhotos = (first, last) => {
    if (hasAndroidPermission()) {
      CameraRoll.getPhotos({
        first: first,
        after: last,
        assetType: 'Photos',
      })
        .then(r => {
          imageGaller = {
            hasMore: r.page_info.has_next_page,
            first: parseFloat(r.page_info.end_cursor),
            after: "" + (parseFloat(imageGaller.after) + parseFloat(r.page_info.end_cursor)),
            photos: imageGaller.photos.concat(r.edges)
          }
          console.log('after')
          console.log(imageGaller);
          // console.log(imageGaller.photos)
        })
        .catch((err) => {
          alert(err);
          //Error Loading Images
        });
    }
  }

  async function hasAndroidPermission() {
    const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
    let vvv = null;
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
    loadPhotos();
  }, [])

  const _handleButtonPress = () => {
    // alert('calling')
    if (hasAndroidPermission()) {
      CameraRoll.getPhotos({
        first: 200,
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
        {imageGaller.hasMore && <TouchableOpacity style={{ width: '100%', height: 30, backgroundColor: 'blue', alignItems: 'center', justifyContent: 'center' }} onPress={() => loadPhotos()}>
          <Text style={{ fontWeight: 'bold' }}> Load more</Text>
        </TouchableOpacity>}

        {/* <ScrollView> */}
        <FlatList
          data={imageGaller.photos}
          renderItem={({ item }) =>
            <TouchableOpacity onPress={() => imageSelected(item.node.image)}>
              <FastImage
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
