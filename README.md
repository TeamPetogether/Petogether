# 🐶 Petogether: 반려동물 다이어리 & 케어 기록 앱

**Petogether**는 `Pet + Together`의 합성어로, 가족 구성원 모두가 **강아지의 추억**, **건강**, **산책**, **접종**을 함께 관리할 수 있는 **올인원 다이어리 앱**입니다.

---

## 🔑 주요 기능

1. **데일리 다이어리**
   - 강아지의 사진과 메모를 날짜별로 저장
   - 가족 간 공유 가능 (캘린더 기반 UI)

2. **산책 기록 기능**
   - 산책 날짜별로 강아지의 산책 유형/경로/시간 기록
   - 품종별 권장 산책 횟수와 비교 가능

3. **견종 맞춤 케어**
   - 견종을 선택하면 해당 품종의 건강 유의사항/산책 권장 횟수 자동 안내
   - 매일 체크리스트 제공 (ex. 산책 횟수 충분한가요?)

4. **접종 관리 투두리스트**
   - 접종 종류, 예정일, 알러지 반응, 메모 등을 기록
   - 항목별 완료/수정/삭제 기능 지원

<h3>📱 앱 미리보기</h3>
<p align="center">
  <img src="https://github.com/user-attachments/assets/6585edea-739a-44ba-8c7f-46aa51f0eeb2" width="150"/>
  <img src="https://github.com/user-attachments/assets/fc5a7036-980d-44de-b5b9-9c6fe42eb221" width="150"/>
  <img src="https://github.com/user-attachments/assets/45c8c610-8e55-448e-bd88-df2147edf8a6" width="150"/>
  <img src="https://github.com/user-attachments/assets/d1ca25da-9fe1-411b-a6a3-f44b60fb3577" width="150"/>
  <img src="https://github.com/user-attachments/assets/32dd1fde-76ac-4d70-ae94-4d02a041ba2d" width="150"/>
  <img src="https://github.com/user-attachments/assets/c0e4718d-6969-4dc7-8504-217a3b024777" width="150"/>
  <img src="https://github.com/user-attachments/assets/729c3906-b4c1-42e9-93e9-58faf5337719" width="150"/>
  <img src="https://github.com/user-attachments/assets/15620d80-4455-4a1e-a8b0-b9c5616d020b" width="150"/>
  <img src="https://github.com/user-attachments/assets/1f339bc2-4d15-43ab-92cb-f9b776ade362" width="150"/>
  <img src="https://github.com/user-attachments/assets/331e3a59-b858-49a0-b704-4ccdc51e5c1a" width="150"/>
  <img src="https://github.com/user-attachments/assets/f1bc0ea2-5b30-4bf5-bf26-a256993210d0" width="150"/>
</p>

---

## ⚙️ 프로젝트 실행 방법

### 📱 Expo 실행 (프론트엔드)

```bash
npx expo start -c
```

### 🐍 FastAPI 서버 실행 (백엔드)

```bash
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

### 🐬 MySQL 시작

```bash
brew services start mysql
mysql -u root -p   # 비밀번호: petogether123!
```

### 🐬 MySQL 명령어

```sql
SHOW DATABASES;
USE petogether;
SHOW TABLES;
SELECT * FROM users;
DELETE FROM users WHERE id = 1;
```

### 📡 포트 확인 및 종료

```bash
lsof -i :8081
kill -9 <PID>
```

### 📡 맥 로컬 IP 확인

```bash
ipconfig getifaddr en0  # constants.js에 IP 직접 입력 필요
```

---

## 🔌 사용한 오픈소스

- [next-realworld-example-app](https://github.com/reck1ess/next-realworld-example-app)
- [DailyNotes](https://github.com/m0ngr31/DailyNotes)
- [react-native-date-picker](https://github.com/DieTime/react-native-date-picker)
- [Habo](https://github.com/xpavle00/Habo)
- [dog_traits_AKC](https://github.com/kkakey/dog_traits_AKC)
- [React Native Todo List](https://github.com/ImanAdithya/React-Native-Todo-List)

---

## 📦 API 구성 (요약)

| 기능        | 메서드    | URL                | 설명                |
| --------- | ------ | ------------------ | ----------------- |
| 유저 생성     | POST   | /signup            | 이메일, 비밀번호, 닉네임 등록 |
| 다이어리 저장   | POST   | /notes/            | 날짜별 사진/메모 저장      |
| 다이어리 조회   | GET    | /notes/{date}      | 특정 날짜 메모 조회       |
| 산책 저장/수정  | POST   | /walks/            | 날짜별 산책 기록 등록/업데이트 |
| 산책 기록 조회  | GET    | /walks/{date}      | 특정 날짜 산책 기록 조회    |
| 접종 등록     | POST   | /vaccinations      | 접종 항목 생성          |
| 접종 수정     | PUT    | /vaccinations/{id} | 접종 항목 수정          |
| 접종 삭제     | DELETE | /vaccinations/{id} | 접종 항목 삭제          |
| 견종 목록 조회  | GET    | /dogbreeds         | 견종 정보 리스트 반환      |
| 사용자 견종 저장 | POST   | /userdog           | 선택 견종 저장 (별도 테이블) |

---

## 👨‍👩‍👧‍👦 팀원 소개

| 이름 | 역할     |
| -- | ------ |
| 상아 | 풀스택    |
| 성은 | 백엔드 |
| 재노 | 프론트엔드  |

---

> 모든 가족이 함께 반려견의 추억과 건강을 기록하는 **Petogether**
>
> 지금 바로 시작해보세요 🐾
