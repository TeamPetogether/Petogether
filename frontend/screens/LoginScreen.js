// screens/LoginScreen.js
import React, { useState } from 'react';
import axios from 'axios';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image
} from 'react-native';
import { API_BASE_URL } from '../constants';


export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
  
    const handleLogin = async () => {
      console.log('로그인 시도:', email, password); // ✅ 1단계
    
      try {
        const res = await axios.post(`${API_BASE_URL}/login`, {
          email,
          password,
        });
    
        console.log('로그인 응답:', res.status, res.data); // ✅ 2단계
    
        if (res.status === 200) {
          navigation.navigate('Main');
        }
      } catch (error) {
        console.log('로그인 실패:', error.response?.data || error.message); // ✅ 3단계
        
        // 로그인 실패 시 알림창 표시
        if (error.response?.status === 401) {
          Alert.alert(
            '로그인 실패',
            '이메일 또는 비밀번호가 일치하지 않습니다.',
            [{ text: '확인' }]
          );
        } else {
          Alert.alert(
            '로그인 실패',
            '로그인 중 문제가 발생했습니다. 다시 시도해주세요.',
            [{ text: '확인' }]
          );
        }
      }
    };
  
    return (
    <SafeAreaView style={styles.container}>
      <Image source={require('../assets/Heart.png')} style={styles.heartImage} />
      <Text style={styles.logo}>
        <Text style={styles.logoGreen}>Pet</Text>
        <Text style={styles.logoBrown}>ogether</Text>
      </Text>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="이메일"
          placeholderTextColor="#aaa"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="비밀번호"
          placeholderTextColor="#aaa"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>로그인</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.signupText}>아직 계정이 없으신가요? 회원가입</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF9F1',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  heartImage: {
    width: 80,
    height: 80,
    marginTop: 170,
    marginBottom: 10,
    resizeMode: 'contain',
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
  form: {
    width: '80%',
    marginBottom: 30,
  },
  input: {
    height: 38,
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
    fontSize: 14,
  },
  button: {
    backgroundColor: '#A1A5F5',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  signupText: {
    marginTop: 10,
    color: '#888',
    textDecorationLine: 'underline',
  },
});