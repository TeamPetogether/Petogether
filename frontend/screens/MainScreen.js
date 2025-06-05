// screens/MainScreen.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function MainScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <Image source={require('../assets/Petogether.png')} style={styles.logoImage} />
      <Text style={styles.logo}>
        <Text style={styles.logoGreen}>PET</Text>
        <Text style={styles.logoBrown}>OGETHER</Text>
      </Text>

      <View style={styles.grid}>
        <View style={styles.row}>
          <TouchableOpacity style={styles.squareButton} onPress={() => navigation.navigate('Daily')}>
            <Text style={styles.icon}>💖</Text>
            <Text style={styles.menuText}>데일리</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.squareButton} onPress={() => navigation.navigate('Walk')}>
            <Text style={styles.icon}>🌱</Text>
            <Text style={styles.menuText}>산책</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <TouchableOpacity style={styles.squareButton} onPress={() => navigation.navigate('Vaccination')}>
            <Text style={styles.icon}>💉</Text>
            <Text style={styles.menuText}>접종</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.squareButton} onPress={() => navigation.navigate('BreedSelect')}>
            <Text style={styles.icon}>📋</Text>
            <Text style={styles.menuText}>체크</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF9F1',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 100,
  },
  logoImage: {
    width: 120,
    height: 120,
    marginTop: 110,
    marginBottom: 10,
    resizeMode: 'contain',
  },
  logo: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  logoGreen: {
    color: '#66A95A',
  },
  logoBrown: {
    color: '#B59440',
  },
  grid: {
    marginTop: 30,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  squareButton: {
    width: 120,
    height: 120,
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#D9D9D9',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  icon: {
    fontSize: 36,
    marginBottom: 8,
  },
  menuText: {
    fontSize: 18,
    color: '#A1A5F5',
    fontWeight: 'bold',
  },
});