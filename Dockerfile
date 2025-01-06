FROM node:lts


# 작업 디렉토리 설정
WORKDIR /usr/src/app

# package.json 및 package-lock.json 복사
COPY package*.json ./
# 환경 변수 설정
# ENV npm_config_platform=linux
# 선택적 종속성 무시 및 호환 패키지 설치
# RUN npm install --omit=optional
RUN npm install

# 소스 코드 복사
COPY . .

# 포트 노출
EXPOSE 4000
# CMD ["npx", "nodemon", "--exec", "npx ts-node", "app.ts"]
CMD ["npx", "nodemon"]

# 아래 코드는 실제 배포 및 실행 환경에서 유효함
#CMD ["npx", "tsx", "app.ts"] 
