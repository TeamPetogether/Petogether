import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, Button, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { API_BASE_URL } from '../constants'; // 예: http://192.168.0.10:8000

export default function DayScreen({ route }) {
  const { selectedDate } = route.params;
  const [note, setNote] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [isLocalImage, setIsLocalImage] = useState(false); // 로컬 이미지 여부

  // imageUri 변경 감지
  useEffect(() => {
    console.log("imageUri:", imageUri);
  }, [imageUri]);

  // 날짜별 메모 및 이미지 불러오기
  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/notes/${selectedDate}`);
        if (res.status === 200) {
          const data = await res.json();
          setNote(data.note);
          if (data.image_path) {
            setImageUri(`${API_BASE_URL}/${data.image_path.replace(/^\/?/, '')}`);
            setIsLocalImage(false);
          }
        }
      } catch (err) {
        console.log("불러오기 실패:", err);
      }
    };

    fetchNote();
  }, [selectedDate]);

  // 갤러리 접근 권한 요청
  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('권한 필요', '이미지 업로드를 위해 갤러리 접근 권한이 필요합니다.');
      }
    })();
  }, []);

  // 이미지 선택
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      setIsLocalImage(true); // 로컬 이미지임
    }
  };

  // 저장 요청
  const handleSave = async () => {
    const formData = new FormData();
    formData.append('date', selectedDate);
    formData.append('note', note);

    if (isLocalImage && imageUri) {
      const filename = imageUri.split('/').pop();
      const match = /\.(\w+)$/.exec(filename ?? '');
      const type = match ? `image/${match[1]}` : `image`;

      formData.append('image', {
        uri: imageUri,
        name: filename,
        type,
      });
    }

    try {
      const res = await fetch(`${API_BASE_URL}/notes/`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const result = await res.json();
      console.log(result);
      Alert.alert('저장 성공', '서버에 메모가 저장되었습니다!');
    } catch (err) {
      console.error(err);
      Alert.alert('에러', '저장 중 문제가 발생했습니다.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{selectedDate} 기록</Text>

      <TouchableOpacity onPress={pickImage}>
        <Image
          source={
            imageUri
              ? { uri: imageUri }
              : require('../assets/placeholder.png')
          }
          style={styles.image}
          resizeMode="cover"
        />
        <Text style={styles.imageText}>사진 선택하기</Text>
      </TouchableOpacity>

      <TextInput
        style={styles.textArea}
        placeholder="이 날의 메모를 입력하세요..."
        value={note}
        onChangeText={setNote}
        multiline={true}
      />

      <Button title="메모 저장" onPress={handleSave} color="#A1A5F5" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#FFF9F1',
    flexGrow: 1,
    alignItems: 'center',
  },
  title: {
    marginTop: 100,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  image: {
    width: 300,
    height: 300,
    borderRadius: 12,
    backgroundColor: '#ddd',
  },
  imageText: {
    marginTop: 8,
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
  },
  textArea: {
    width: '100%',
    minHeight: 120,
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    textAlignVertical: 'top',
    marginVertical: 20,
  },
});