# 빌드 단계 (Node.js 환경에서 앱 빌드)
FROM node:18-alpine AS builder

# 작업 디렉토리 설정
WORKDIR /app

# package.json과 lock 파일 복사 → 의존성 설치
COPY package*.json ./
RUN npm install

# 소스 코드 복사 → 앱 빌드
COPY . .
RUN npm run build

---

# Nginx를 사용한 정적 파일 서빙
FROM nginx:alpine

# 빌드된 정적 파일을 Nginx 기본 경로에 복사
COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
