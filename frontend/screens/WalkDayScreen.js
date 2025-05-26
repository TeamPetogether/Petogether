// screens/WalkDayScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert, Platform } from 'react-native';
import { useRoute } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import { Ionicons } from '@expo/vector-icons';
import { API_BASE_URL } from '../constants';

const pickerSelectStyles = {
  inputIOS: {
    height: 50,
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    color: '#000',
    backgroundColor: '#fff',
    paddingRight: 30,
  },
  inputAndroid: {
    height: 50,
    fontSize: 16,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    color: '#000',
    backgroundColor: '#fff',
    paddingRight: 30,
  },
  iconContainer: {
    top: '50%',
    right: 10,
    transform: [{ translateY: -12 }],
  },
  placeholder: {
    color: '#000',
  },
};

export default function WalkDayScreen() {
  const route = useRoute();
  const { selectedDate } = route.params;
  const [walkType, setWalkType] = useState('');
  const [walkPath, setWalkPath] = useState('');
  const [walkDuration, setWalkDuration] = useState('');
  const [memo, setMemo] = useState('');
  const [walkHour, setWalkHour] = useState('');
  const [walkMinute, setWalkMinute] = useState('');

  useEffect(() => {
    const fetchExistingData = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/walks/${selectedDate}`);
        if (!res.ok) return; // 기록 없으면 무시

        const data = await res.json();
        console.log("📦 기존 기록:", data);

        // 필드 자동 채우기
        setWalkType(data.walk_type);
        setWalkPath(data.walk_path);
        setMemo(data.memo);

        // 시간 파싱
        const match = data.walk_duration.match(/(?:(\d+)시간)?\s?(\d+)분?/);
        if (match) {
          if (match[1]) setWalkHour(match[1]);
          if (match[2]) setWalkMinute(match[2]);
        }
      } catch (err) {
        console.error('기존 데이터 불러오기 실패:', err);
      }
    };

    fetchExistingData();
  }, [selectedDate]);

  const handleSave = async () => {
    const walkDurationText = `${walkHour ? walkHour + '시간 ' : ''}${walkMinute ? walkMinute + '분' : ''}`;

    try {
      const formData = new FormData();
      formData.append('date', selectedDate);
      formData.append('walk_type', walkType);
      formData.append('walk_path', walkPath);
      formData.append('walk_duration', walkDurationText);
      formData.append('memo', memo);

      const res = await fetch(`${API_BASE_URL}/walks/`, {
        method: 'POST',
        body: formData,
      });

      const result = await res.json();
      console.log(result);
      Alert.alert('저장 완료', result.message || '산책 기록이 저장되었습니다!');
    } catch (err) {
      console.error('저장 실패:', err);
      Alert.alert('에러', '산책 기록 저장 중 문제가 발생했습니다.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🌳 {selectedDate} 산책 기록</Text>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>산책 유형</Text>
        <RNPickerSelect
          onValueChange={setWalkType}
          value={walkType}
          placeholder={{ label: '산책 유형을 선택하세요', value: null }}
          items={[
            { label: '아침 산책', value: 'morning' },
            { label: '점심 산책', value: 'noon' },
            { label: '저녁 산책', value: 'evening' },
            { label: '밤 산책', value: 'night' },
            { label: '짧은 산책', value: 'short' },
            { label: '긴 산책', value: 'long' },
            { label: '배변 목적 산책', value: 'toilet' },
            { label: '운동 산책', value: 'exercise' },
            { label: '병원 가는 길', value: 'hospital' },
            { label: '기타', value: 'other' },
          ]}
          style={{
            inputIOS: {
              fontSize: 16,
              padding: 12,
              borderWidth: 1,
              borderColor: '#ccc',
              borderRadius: 10,
              backgroundColor: '#fff',
              color: '#333',
              marginBottom: 20,
            },
            inputAndroid: {
              fontSize: 16,
              padding: 12,
              borderWidth: 1,
              borderColor: '#ccc',
              borderRadius: 10,
              backgroundColor: '#fff',
              color: '#333',
              marginBottom: 20,
            },
            iconContainer: {
              top: '35%',
              right: 10,
              transform: [{ translateY: -12 }],
            },
            placeholder: {
              color: '#999',
            },
          }}
          useNativeAndroidPickerStyle={false}
          Icon={() => <Ionicons name="chevron-down" size={24} color="#999" />}
        />
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>산책 경로</Text>
        <TextInput
          style={styles.input}
          value={walkPath}
          onChangeText={setWalkPath}
        />
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>산책 시간</Text>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <View style={[styles.pickerWrapper, { flex: 1 }]}>
            <RNPickerSelect
              onValueChange={setWalkHour}
              value={walkHour}
              placeholder={{ label: '시간', value: '', color: '#999' }}
              items={[
                { label: '0시간', value: '0' },
                { label: '1시간', value: '1' },
                { label: '2시간', value: '2' },
                { label: '3시간', value: '3' },
                { label: '4시간', value: '4' },
                { label: '5시간', value: '5' },
              ]}
              style={pickerSelectStyles}
              useNativeAndroidPickerStyle={false}
              Icon={() => <Ionicons name="chevron-down" size={24} color="#999" />}
            />
          </View>
          <View style={[styles.pickerWrapper, { flex: 1 }]}>
            <RNPickerSelect
              onValueChange={setWalkMinute}
              value={walkMinute}
              placeholder={{ label: '분', value: '', color: '#999' }}
              items={[
                { label: '0분', value: '0' },
                { label: '5분', value: '5' },
                { label: '10분', value: '10' },
                { label: '15분', value: '15' },
                { label: '20분', value: '20' },
                { label: '25분', value: '25' },
                { label: '30분', value: '30' },
                { label: '35분', value: '35' },
                { label: '40분', value: '40' },
                { label: '45분', value: '45' },
                { label: '50분', value: '50' },
                { label: '55분', value: '55' },
              ]}
              style={pickerSelectStyles}
              useNativeAndroidPickerStyle={false}
              Icon={() => <Ionicons name="chevron-down" size={24} color="#999" />}
            />
          </View>
        </View>
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>메모</Text>
        <TextInput
          style={[styles.input, { height: 100 }]}
          value={memo}
          onChangeText={setMemo}
          multiline
        />
      </View>

      <Button title="저장하기" onPress={handleSave} color="#66A95A" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 50,
    paddingHorizontal: 20,
    backgroundColor: '#FFF9F1',
    flexGrow: 1,
  },
  title: {
    marginTop: 100, 
    fontSize: 24,
    fontWeight: 'bold',
    color: '#66A95A',
    marginBottom: 24,
    textAlign: 'center',
  },
  fieldGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 6,
    color: '#444',
  },
  input: {
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
  },
  pickerWrapper: {
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#fff',
    height: 50,
    justifyContent: 'center',
    marginBottom: 10,
  },
  picker: {
    height: 50,
    width: '100%',
    margin: 0,
    padding: 0,
  },
  inputIOS: {
    fontSize: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    backgroundColor: '#fff',
    color: '#000000',
    marginBottom: 20,
  },
});