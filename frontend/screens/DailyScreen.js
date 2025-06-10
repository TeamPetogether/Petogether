// screens/DailyScreen.js
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useNavigation } from '@react-navigation/native';
import { API_BASE_URL } from '../constants';

export default function DailyScreen() {
  const navigation = useNavigation();
  const [markedDates, setMarkedDates] = useState({});

  // ✅ 메모가 있는 날짜들을 불러와 발자국 마커 세팅
  useEffect(() => {
    const fetchMarkedDates = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/notes/dates`);

        const text = await res.text();             // 먼저 텍스트로 받기
        console.log("서버 응답:", text);

        const dates = JSON.parse(text);            // 수동 파싱 (확실하게 예외 잡힘)
        const newMarked = {};
        dates.forEach(date => {
          newMarked[date] = { marked: true };
        });

        setMarkedDates(newMarked);
      } catch (err) {
        console.log("마커 불러오기 실패:", err);
      }
    };

    fetchMarkedDates();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🐱 데일리 🐶</Text>
      <Calendar
        markingType={'custom'}
        markedDates={markedDates}
        style={{
          width: 360,
          borderRadius: 12,
          paddingVertical: 10,
        }}
        dayComponent={({ date, state }) => {
          const isMarked = !!markedDates[date.dateString];
          return (
            <TouchableOpacity
              onPress={() => navigation.navigate('Day', { selectedDate: date.dateString })}
              style={{
                minWidth: 44,
                minHeight: 44,
                paddingVertical: 12,
                paddingHorizontal: 10,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{
                fontSize: 20,
                color: state === 'disabled' ? '#d9e1e8' : '#2d4150',
              }}>
                {isMarked ? '💖' : date.day}
              </Text>
            </TouchableOpacity>
          );
        }}
        theme={{
          selectedDayBackgroundColor: '#A1A5F5',
          todayTextColor: '#66A95A',
          arrowColor: '#B59440',
          textDayFontSize: 16,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF9F1',
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#A1A5F5',
    marginBottom: 20,
  },
});