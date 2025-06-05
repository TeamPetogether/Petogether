import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { API_BASE_URL } from '../constants';

// 날짜 포맷 함수 (시간 제외)
function formatDate(dateString) {
  const date = new Date(dateString);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export default function CheckHistoryScreen() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/check-history`)
      .then(res => res.json())
      .then(data => setHistory(data))
      .catch(err => console.error("불러오기 실패", err));
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{formatDate(item.date)}</Text>
      <Text style={styles.cell}>{item.message}</Text>
      <Text style={styles.cell}>{item.note}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📝 이전 체크 내역</Text>
      <View style={styles.headerRow}>
        <Text style={styles.header}>날짜</Text>
        <Text style={styles.header}>안내 문구</Text>
        <Text style={styles.header}>기타 사항</Text>
      </View>
      <FlatList
        data={history}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#FFF9F1', padding: 16 },
  title: { marginTop: 100, fontSize: 25, fontWeight: 'bold', marginBottom: 20, color: '#66A95A', textAlign: 'center' },
  headerRow: { marginTop: 20, flexDirection: 'row', borderBottomWidth: 2, borderColor: '#aaa', paddingBottom: 8, marginBottom: 8 },
  header: { flex: 1, fontSize: 18,fontWeight: 'bold', color: '#555' },
  row: { flexDirection: 'row', paddingVertical: 6, borderBottomWidth: 1, borderColor: '#ddd' },
  cell: { flex: 1, fontSize: 14, color: '#333' },
});