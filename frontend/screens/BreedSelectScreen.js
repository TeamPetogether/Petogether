import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Alert, TextInput
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { API_BASE_URL } from '../constants';
import { useNavigation } from '@react-navigation/native';

export default function BreedSelectScreen() {
  const [breeds, setBreeds] = useState([]);
  const [selectedBreedName, setSelectedBreedName] = useState('');
  const [selectedBreed, setSelectedBreed] = useState(null);
  const [check1, setCheck1] = useState(null);
  const [check2, setCheck2] = useState(null);
  const [check3, setCheck3] = useState(null);
  const [extraNote, setExtraNote] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    fetch(`${API_BASE_URL}/dogbreeds`)
      .then(res => res.json())
      .then(data => setBreeds(data))
      .catch(err => console.log("견종 불러오기 실패", err));
  }, []);

  const handleBreedSelect = () => {
    const breed = breeds.find(b => b.name === selectedBreedName);
    setSelectedBreed(breed || null);
    setCheck1(null);
    setCheck2(null);
    setCheck3(null);
  };

  const handleSubmit = async () => {
    if (!selectedBreed) {
      Alert.alert("알림", "견종을 선택해주세요.");
      return;
    }

    if (check1 === null || check2 === null || check3 === null) {
      Alert.alert("알림", "모든 질문에 응답해주세요.");
      return;
    }

    let message = "오늘 강아지에게는 완벽한 하루네요! 💖";
    if (check1 === false) message = "산책 횟수를 늘려주세요.";
    else if (check2 === false) message = "산책 시간이 더 필요해요.";
    else if (check3 === false) message = "병원 방문이 필요해요.";

    try {
      const res = await fetch(`${API_BASE_URL}/check-history`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: message,
          note: extraNote || "없음"
        })
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error("❌ 서버 응답 오류:", errText);
        Alert.alert("오류", "서버에서 데이터를 저장하지 못했습니다.");
        return;
      }

      Alert.alert(
        "안내",
        `${message}\n\n📝 기타 사항:\n${extraNote || "없음"}`,
        [
          {
            text: "확인",
            onPress: () => {
              // 페이지 상태 초기화
              setSelectedBreedName('');
              setSelectedBreed(null);
              setCheck1(null);
              setCheck2(null);
              setCheck3(null);
              setExtraNote('');
            }
          }
        ]
      );
    } catch (e) {
      console.error("❌ fetch 오류:", e);
      Alert.alert("오류", "서버 연결에 실패했습니다.");
    }
  };

  const renderQuestion = (label, value, setter) => (
    <View style={styles.checkRow}>
      <Text style={styles.checkLabel}>{label}</Text>
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.optionButton, value === true && styles.optionSelected]}
          onPress={() => setter(true)}
        >
          <Text style={styles.optionText}>예</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.optionButton, value === false && styles.optionSelected]}
          onPress={() => setter(false)}
        >
          <Text style={styles.optionText}>아니오</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📋 체크리스트 📋</Text>

      <View style={styles.pickerRow}>
        <View style={styles.pickerWrapper}>
          <RNPickerSelect
            onValueChange={(value) => setSelectedBreedName(value)}
            value={selectedBreedName}
            placeholder={{
              label: '견종을 선택해주세요',
              value: '',
            }}
            items={breeds.map(breed => ({
              label: breed.name,
              value: breed.name,
            }))}
            style={{
              inputIOS: styles.pickerText,
              inputAndroid: styles.pickerText,
              iconContainer: {
                top: 8,
                right: 10,
              },
            }}
            useNativeAndroidPickerStyle={false}
            Icon={() => (
              <Icon name="arrow-drop-down" size={24} color="#A1A5F5" />
            )}
          />
        </View>

        <TouchableOpacity style={styles.selectButton} onPress={handleBreedSelect}>
          <Text style={styles.selectButtonText}>선택</Text>
        </TouchableOpacity>
      </View>

      {selectedBreed && (
        <View style={styles.checkSection}>
          <Text style={styles.subtitle}>오늘 강아지 상태 체크리스트</Text>
          {renderQuestion(`오늘 산책 횟수는 ${selectedBreed.walk_count}에 해당되나요?`, check1, setCheck1)}
          {renderQuestion(`오늘 산책 시간은 ${selectedBreed.walk_duration}에 적합하나요?`, check2, setCheck2)}
          {renderQuestion(`오늘 강아지는 ${selectedBreed.health_warning}와 관련된 이상이 없었나요?`, check3, setCheck3)}
        </View>
      )}

      <View style={styles.extraNoteSection}>
        <Text style={styles.subtitle}>기타 사항</Text>
        <TextInput
          style={styles.extraInput}
          placeholder="ex) 오늘 유난히 더위를 많이탐"
          placeholderTextColor="#aaa"
          multiline
          numberOfLines={3}
          value={extraNote}
          onChangeText={setExtraNote}
        />
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitText}>제출하기</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.historyButton}
        onPress={() => navigation.navigate('CheckHistory')}
      >
        <Text style={styles.historyText}>이전 내역 확인하기</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF9F1',
    padding: 20,
  },
  title: {
    marginTop: 100,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#66A95A',
    marginBottom: 20,
    textAlign: 'center',
  },
  pickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 10,
  },
  pickerWrapper: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#fff',
  },
  pickerText: {
    fontSize: 16,
    paddingVertical: 10,
    color: '#000',
  },
  selectButton: {
    backgroundColor: '#A1A5F5',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 8,
    marginLeft: 8,
  },
  selectButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  checkSection: {
    marginTop: 30,
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#444',
    marginBottom: 16,
  },
  checkRow: {
    marginBottom: 16,
  },
  checkLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
  },
  optionButton: {
    flex: 1,
    padding: 10,
    backgroundColor: '#eee',
    borderRadius: 8,
    alignItems: 'center',
  },
  optionSelected: {
    backgroundColor: '#66A95A',
  },
  optionText: {
    color: '#000',
    fontWeight: 'bold',
  },
  extraNoteSection: {
    marginTop: 20,
  },
  extraInput: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    color: '#000',
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#A1A5F5',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  historyButton: {
    marginTop: 20,
    backgroundColor: '#9ACA70',
    padding: 12,

    borderRadius: 10,
    alignItems: 'center',
  },
  historyText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});