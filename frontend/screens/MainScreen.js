// screens/LoginScreen.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';

export default function LoginScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.logo}>
        <Text style={styles.logoGreen}>PET</Text>
        <Text style={styles.logoBrown}>OGETHER</Text>
      </Text>

      <View style={styles.buttonWrapper}>
        <TouchableOpacity style={styles.ovalButton}>
          <Text style={styles.buttonText}>Daily</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.ovalButton}>
          <Text style={styles.buttonText}>산책</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.ovalButton}>
          <Text style={styles.buttonText}>접종</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF9F1', // 배경색 연한 베이지 느낌
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 50,
  },
  logoGreen: {
    color: '#66A95A',
  },
  logoBrown: {
    color: '#B59440',
  },
  buttonWrapper: {
    gap: 20,
    alignItems: 'center',
  },
  ovalButton: {
    borderWidth: 2,
    borderColor: '#D9D9D9',
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 40,
  },
  buttonText: {
    color: '#A1A5F5',
    fontSize: 20,
    fontWeight: '600',
  },
});