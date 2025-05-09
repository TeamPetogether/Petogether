// screens/SignupScreen.js
import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import axios from 'axios';

export default function SignupScreen({ navigation }) {
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPw, setConfirmPw] = useState('');

  const handleSignup = async () => {
    if (!nickname || !email || !password || !confirmPw) {
      Alert.alert('모든 항목을 입력해주세요.');
      return;
    }

    if (password !== confirmPw) {
      Alert.alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      const res = await axios.post('http://192.168.45.36:8000/signup', {
        nickname,
        email,
        password,
      });
      console.log('회원가입 성공:', res.data);
      Alert.alert('회원가입 완료! 로그인 해주세요.');
      navigation.navigate('Login');
    } catch (err) {
      console.log('회원가입 실패:', err.response?.data || err.message);
      Alert.alert('회원가입 실패', err.response?.data?.detail || '알 수 없는 오류');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.logo}>
        <Text style={styles.logoGreen}>Pet</Text>
        <Text style={styles.logoBrown}>ogether</Text>
      </Text>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="닉네임"
          placeholderTextColor="#aaa"
          value={nickname}
          onChangeText={setNickname}
        />
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
        secureTextEntry={true}
        textContentType="oneTimeCode"  // 핵심: password 대신 이걸로 속이기
        autoComplete="off"
        autoCorrect={false}
        autoCapitalize="none"
        importantForAutofill="no"
        />
        <TextInput
        style={styles.input}
        placeholder="비밀번호 확인"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={confirmPw}
        onChangeText={setConfirmPw}
        textContentType="none"
        autoComplete="off"
        autoCorrect={false}
        importantForAutofill="no"
        />  
        <TouchableOpacity style={styles.button} onPress={handleSignup}>
          <Text style={styles.buttonText}>회원가입</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.loginText}>이미 계정이 있으신가요? 로그인</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF9F1',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  logo: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  logoGreen: {
    color: '#66A95A',
  },
  logoBrown: {
    color: '#B59440',
  },
  form: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    height: 48,
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 12,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#A1A5F5',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginText: {
    marginTop: 10,
    color: '#888',
    textDecorationLine: 'underline',
  },
});