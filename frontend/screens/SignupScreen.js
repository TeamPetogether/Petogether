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
import { API_BASE_URL } from '../constants';

export default function SignupScreen({ navigation }) {
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPw, setConfirmPw] = useState('');

  const handleSignup = async () => {
    if (!nickname || !email || !password || !confirmPw) {
      Alert.alert(
        '입력 오류',
        '모든 항목을 입력해주세요.',
        [{ text: '확인' }]
      );
      return;
    }

    if (password !== confirmPw) {
      Alert.alert(
        '비밀번호 불일치',
        '비밀번호와 비밀번호 확인이 일치하지 않습니다.',
        [{ text: '확인' }]
      );
      return;
    }

    try {
      const res = await axios.post(`${API_BASE_URL}/signup`, {
        nickname,
        email,
        password,
      });
      console.log('회원가입 성공:', res.data);
      Alert.alert(
        '회원가입 완료',
        '회원가입이 완료되었습니다. 로그인 해주세요.',
        [{ text: '확인', onPress: () => navigation.navigate('Login') }]
      );
    } catch (err) {
      console.log('회원가입 실패:', err.response?.data || err.message);
      
      if (err.response?.status === 400) {
        Alert.alert(
          '회원가입 실패',
          '이미 존재하는 이메일입니다.',
          [{ text: '확인' }]
        );
      } else {
        Alert.alert(
          '회원가입 실패',
          '회원가입 중 문제가 발생했습니다. 다시 시도해주세요.',
          [{ text: '확인' }]
        );
      }
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
          autoComplete="off"
          autoCorrect={false}
        />
        <TextInput
          style={styles.input}
          placeholder="이메일"
          placeholderTextColor="#aaa"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          autoCorrect={false}
        />
        <TextInput
          style={styles.input}
          placeholder="비밀번호"
          placeholderTextColor="#aaa"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
          textContentType="oneTimeCode"
          autoComplete="off"
          autoCorrect={false}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="비밀번호 확인"
          placeholderTextColor="#aaa"
          value={confirmPw}
          onChangeText={setConfirmPw}
          secureTextEntry={true}
          textContentType="oneTimeCode"
          autoComplete="off"
          autoCorrect={false}
          autoCapitalize="none"
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