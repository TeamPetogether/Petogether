import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, Button, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function DayScreen({ route }) {
  const { selectedDate } = route.params;
  const [note, setNote] = useState('');
  const [imageUri, setImageUri] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('권한 필요', '이미지 업로드를 위해 갤러리 접근 권한이 필요합니다.');
      }
    })();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSave = () => {
    console.log('메모:', note);
    console.log('이미지 URI:', imageUri);
    Alert.alert('저장됨', `${selectedDate}의 기록이 저장되었습니다.`);
    // 👉 다음 단계: FastAPI 백엔드로 POST 요청 (image + note)
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{selectedDate} 기록</Text>

      <TouchableOpacity onPress={pickImage}>
        <Image
          source={imageUri ? { uri: imageUri } : require('../assets/placeholder.png')}
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
    height: 220,
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