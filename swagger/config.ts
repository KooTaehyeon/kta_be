const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'API 문서',
    },
    servers: [
      {
        url: 'http://localhost:4000',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          // 인증 방식 정의
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT', // JWT 토큰 사용
        },
      },
    },
    security: [
      {
        bearerAuth: [], // 전역 인증 적용
      },
    ],
  },
  apis: ['./swagger/*.ts'], // 이 경로가 정확한지 확인
};
export { swaggerOptions };
