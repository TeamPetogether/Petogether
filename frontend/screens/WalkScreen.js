// screens/WalkScreen.js
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useNavigation } from '@react-navigation/native';
import { API_BASE_URL } from '../constants';

export default function WalkScreen() {
  const navigation = useNavigation();
  const [markedDates, setMarkedDates] = useState({});

  useEffect(() => {
    const fetchMarkedDates = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/walks/dates`);
        const text = await res.text();
        console.log("산책 날짜 응답:", text);
        const dates = JSON.parse(text);

        const newMarked = {};
        dates.forEach(date => {
          newMarked[date] = { marked: true };
        });

        setMarkedDates(newMarked);
      } catch (err) {
        console.log("산책 마커 불러오기 실패:", err);
      }
    };

    fetchMarkedDates();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🐾 Walk Record 🐾</Text>
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
              onPress={() => navigation.navigate('WalkDay', { selectedDate: date.dateString })}
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
                {isMarked ? '🐾' : date.day}
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
    color: '#66A95A',
    marginBottom: 20,
  },
});
