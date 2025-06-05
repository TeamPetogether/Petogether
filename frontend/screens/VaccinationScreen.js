import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput,
  TouchableOpacity, Alert, Switch
} from 'react-native';
import { API_BASE_URL } from '../constants';

export default function VaccinationScreen() {
  const userId = 1;
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/vaccinations/${userId}`)
      .then(res => res.json())
      .then(data => setItems(data))
      .catch(err => console.log("불러오기 실패", err));
  }, []);

  const updateField = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const handleAddItem = () => {
    setItems(prev => [
      ...prev,
      {
        name: '',
        scheduled_date: '',
        is_done: false,
        had_allergy: false,
        allergy_description: '',
        note: ''
      }
    ]);
  };

  const handleSaveItem = async (index) => {
    const item = items[index];
    const method = item.id ? 'PUT' : 'POST';
    const url = item.id
      ? `${API_BASE_URL}/vaccinations/${item.id}`
      : `${API_BASE_URL}/vaccinations`;

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...item, user_id: userId })
      });

      if (!res.ok) throw new Error("저장 실패");
      const result = await res.json();

      if (!item.id && result.id) {
        // 새로 저장된 경우 id 갱신
        const updated = [...items];
        updated[index].id = result.id;
        setItems(updated);
      }

      Alert.alert("완료", "저장되었습니다!");
    } catch (err) {
      console.error(err);
      Alert.alert("오류", "저장 중 오류가 발생했습니다.");
    }
  };

  const handleDeleteItem = (index) => {
    const item = items[index];
    if (!item.id) {
      setItems(items.filter((_, i) => i !== index));
      return;
    }

    fetch(`${API_BASE_URL}/vaccinations/${item.id}`, {
      method: "DELETE"
    })
      .then(res => {
        if (!res.ok) throw new Error("삭제 실패");
        setItems(items.filter((_, i) => i !== index));
      })
      .catch(() => Alert.alert("오류", "삭제 중 오류 발생"));
  };

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.container}>
      <Text style={styles.title}>💉 접종 관리</Text>

      {items.map((item, index) => (
        <View
          key={index}
          style={[
            styles.card,
            item.is_done && { backgroundColor: '#eee' }
          ]}
        >
          <TextInput
            style={styles.input}
            placeholder="예: 광견병"
            value={item.name}
            onChangeText={(val) => updateField(index, 'name', val)}
          />
          <TextInput
            style={styles.input}
            placeholder="예정일 (예: 2025-06-30)"
            value={item.scheduled_date}
            onChangeText={(val) => updateField(index, 'scheduled_date', val)}
          />

          <View style={styles.switchRow}>
            <View style={styles.switchItem}>
              <Text style={styles.label}>✅ 완료</Text>
              <Switch
                value={item.is_done}
                onValueChange={(val) => updateField(index, 'is_done', val)}
              />
            </View>
            <View style={styles.switchItem}>
              <Text style={styles.label}>⚠️ 알러지</Text>
              <Switch
                value={item.had_allergy}
                onValueChange={(val) => updateField(index, 'had_allergy', val)}
              />
            </View>
          </View>

          {item.had_allergy && (
            <TextInput
              style={styles.input}
              placeholder="예: 부기, 구토"
              value={item.allergy_description}
              onChangeText={(val) => updateField(index, 'allergy_description', val)}
            />
          )}

          <TextInput
            style={styles.input}
            placeholder="메모 (예: 오전 9시 접종)"
            value={item.note}
            onChangeText={(val) => updateField(index, 'note', val)}
            multiline
          />

          <TouchableOpacity
            style={styles.saveButton}
            onPress={() => handleSaveItem(index)}
          >
            <Text style={styles.saveText}>
              {item.id ? "수정하기" : "저장하기"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleDeleteItem(index)}
            style={styles.deleteButton}
          >
            <Text style={styles.deleteText}>삭제</Text>
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity style={styles.addButton} onPress={handleAddItem}>
        <Text style={styles.addText}>+ 새 접종 항목 추가</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: '100%',
    backgroundColor: '#FFF9F1',
    padding: 20,
    paddingBottom: 100
  },
  title: {
    marginTop: 80,
    fontSize: 26,
    fontWeight: 'bold',
    color: '#66A95A',
    textAlign: 'center',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  label: {
    fontSize: 16,
    marginRight: 10,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    marginTop: 6,
    marginBottom: 10,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  switchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  saveButton: {
    backgroundColor: '#66A95A',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  saveText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteText: {
    color: '#333',
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#eee',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  addText: {
    color: '#555',
    fontSize: 16,
  },
});