// screens/DailyScreen.js
import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useNavigation } from '@react-navigation/native';

export default function DailyScreen() {
  const navigation = useNavigation();

  // 메모가 있는 날짜들에 마커를 표시
  const [markedDates, setMarkedDates] = useState({
    '2025-05-16': {
      customStyles: {
        container: {
          backgroundColor: '#fff',
          borderRadius: 8,
        },
        text: {
          color: '#000',
        },
        // 아래 마커를 표시 (🐾)
        marker: (
          <Text style={{ fontSize: 14, textAlign: 'center', marginTop: 2 }}>🐾</Text>
        ),
      },
    },
    '2025-05-17': {
      customStyles: {
        container: {
          backgroundColor: '#fff',
          borderRadius: 8,
        },
        text: {
          color: '#000',
        },
        marker: (
          <Text style={{ fontSize: 14, textAlign: 'center', marginTop: 2 }}>🐾</Text>
        ),
      },
    },
  });

  const handleDayPress = (day) => {
    navigation.navigate('Day', { selectedDate: day.dateString });
  };

  return (
    <View style={styles.container}>
      <Calendar
        onDayPress={handleDayPress}
        markingType={'custom'}
        markedDates={markedDates}
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
    marginTop: 100,
    flex: 1,
    backgroundColor: '#FFF9F1',
    padding: 16,
  },
});