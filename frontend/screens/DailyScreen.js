// screens/DailyScreen.js
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
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
        const dates = await res.json();  // ['2025-05-15', '2025-05-16']

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

  const handleDayPress = (day) => {
    navigation.navigate('Day', { selectedDate: day.dateString });
  };

  return (
    <View style={styles.container}>
      <Calendar
        onDayPress={handleDayPress}
        markingType={'custom'}
        markedDates={markedDates}
        style={{
          width: 350,
          height: 380,          // ✅ 원하는 높이 지정
          borderRadius: 12,
          paddingVertical: 10,  // ✅ 내부 여백 조절
        }}
        dayComponent={({ date, state }) => {
          const isMarked = !!markedDates[date.dateString];
          return (
            <View>
              <Text style={{ textAlign: 'center', color: state === 'disabled' ? '#d9e1e8' : '#2d4150' }}>
                {isMarked ? '🐾' : date.day}
              </Text>
            </View>
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
    justifyContent: 'center', // ✅ 세로 가운데 정렬
    alignItems: 'center',
  },
});