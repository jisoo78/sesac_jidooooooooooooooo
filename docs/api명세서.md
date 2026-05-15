# KOWEPO Anomaly Dashboard API 명세서

## 1. 문서 개요
- 프로젝트명: `kowepo-anomaly-dashboard`
- 작성일: 2026-05-08
- 기준 소스: 전체 `src` 및 설정 파일
- 상태 구분
  - 현재 구현 API: 없음
  - 권장 API: 화면 기능 기준으로 도출

## 2. 현재 구현 상태
- 프론트 코드 내 `fetch/axios` 호출 없음
- 서버 라우트(`express app.get/post`) 없음
- 모든 데이터는 컴포넌트 내부/상수 파일의 Mock 데이터 사용

## 3. 권장 API 명세 (화면 연동 기준)

## 3.1 공통
- Base URL: `/api/v1`
- 인증(권장): `Authorization: Bearer <token>`
- 공통 응답
  - 성공: `{ success: true, data: ... }`
  - 실패: `{ success: false, error: { code, message } }`

## 3.2 발전소/모니터링

### 1) 발전소 목록 조회
- `GET /plants`
- Query
  - `status` (optional): `normal|caution|none`
- Response(data)
  - `Plant[]`

### 2) 발전소별 발전기 목록
- `GET /plants/{plantId}/generators`
- Response(data)
  - `Generator[]`

### 3) 발전기별 자산 목록
- `GET /generators/{generatorId}/assets`
- Response(data)
  - `Asset[]`

### 4) 자산 센서 목록
- `GET /assets/{assetId}/sensors`
- Response(data)
  - `Sensor[]`

### 5) 자산 시계열 데이터
- `GET /assets/{assetId}/timeseries`
- Query
  - `metric`: `mse|current|tempNDE|tempDE|vibNDE1|vibNDE2|vibDE1|vibDE2`
  - `from`, `to` (ISO datetime)
  - `interval` (optional): `1m|5m|15m|1h`
- Response(data)
  - `{ assetId, metric, points: [{ time, value }] }`

## 3.3 이상 알람

### 6) 알람 목록 조회
- `GET /alerts`
- Query
  - `status` (optional): `unconfirmed|confirmed|resolved|processing|false_alarm`
  - `plantId` (optional)
  - `q` (optional): 알람 ID 검색
  - `page`, `size` (optional)
- Response(data)
  - `{ items: Alert[], total, page, size }`

### 7) 알람 확인 처리
- `PATCH /alerts/{alertId}/status`
- Body
```json
{
  "status": "confirmed",
  "processedBy": "정비B팀 이현우",
  "memo": "현장 점검 후 모니터링 전환"
}
```
- Response(data)
  - `Alert`

## 3.4 AI 분석(RAG)

### 8) 분석 리포트 목록
- `GET /rag/reports`
- Query
  - `assetId` (optional)
  - `severity` (optional): `Medium|High|Critical`
- Response(data)
  - `[{ id, title, asset, status, time, score, summary }]`

### 9) 분석 리포트 상세
- `GET /rag/reports/{reportId}`
- Response(data)
  - `{ id, title, summary, rootCause, recommendations, references }`

### 10) 리포트 재분석 요청
- `POST /rag/reports/{reportId}/reanalyze`
- Body
```json
{
  "reason": "latest-sensor-update"
}
```
- Response(data)
  - `{ jobId, status }`

### 11) 리포트 PDF 다운로드
- `GET /rag/reports/{reportId}/export?format=pdf`
- Response
  - `application/pdf` 바이너리

## 3.5 관리자

### 12) 수신자 목록 조회
- `GET /admin/receivers`
- Query
  - `plantId` (optional)
  - `active` (optional)
- Response(data)
  - `AdminEmail[]`

### 13) 수신자 등록
- `POST /admin/receivers`
- Body
```json
{
  "name": "김관리",
  "email": "kimgwanri@kowepo.co.kr",
  "plantId": "태안",
  "assetScope": "전체"
}
```
- Response(data)
  - `AdminEmail`

### 14) 수신자 삭제
- `DELETE /admin/receivers/{receiverId}`
- Response(data)
  - `{ id, deleted: true }`

### 15) 사용자 계정 목록 조회
- `GET /admin/users`
- Response(data)
  - `User[]`

### 16) 사용자 계정 생성
- `POST /admin/users`
- Body
```json
{
  "name": "홍길동",
  "loginId": "honggildong",
  "role": "viewer",
  "department": "발전운영팀"
}
```
- Response(data)
  - `User`

### 17) 알림 발송 로그 조회
- `GET /admin/notification-logs`
- Query
  - `plantId` (optional)
  - `channel` (optional): `Email|Slack`
  - `status` (optional): `success|failed`
  - `from`, `to` (optional)
- Response(data)
  - `{ items: [{ id, time, name, channel, status, plant, source, msg }], total }`

## 4. 타입 기준(프론트 타입 정합)
- 프론트 기준 타입 파일: `src/types.ts`
- 백엔드 DTO도 동일 필드명 유지 권장
  - 상태값 enum: `normal|caution|none`
  - 알람 처리상태 enum: `unconfirmed|confirmed|resolved|processing|false_alarm`

## 5. 우선 연동 순서 제안
1. `GET /plants` + `GET /plants/{plantId}/generators`
2. `GET /generators/{generatorId}/assets` + `GET /assets/{assetId}/timeseries`
3. `GET /alerts` + `PATCH /alerts/{alertId}/status`
4. `GET /rag/reports`, `GET /rag/reports/{reportId}`
5. 관리자 API 일괄 연동
