import { Server as SocketIOServer, Socket } from "socket.io";
import http from "http";
import { initializeRabbitMQ, sendMsgToQueue } from "../services/producer";
import { userSocketMap } from "./socketState";

let io: SocketIOServer | null = null;

// RabbitMQ 초기화 플래그
let isRabbitMQInitialized = false;

// 소켓 초기화
export const initializeSocket = (server: http.Server): SocketIOServer | null => {
  console.log("Initializing Socket.IO...");
  io = new SocketIOServer(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", handleConnection);
  console.log("Socket.IO initialized.");
  return io;
};

// 소켓 연결 핸들러
const handleConnection = (socket: Socket): void => {
  console.log("Socket connected:", socket.id);

  // 사용자 등록 이벤트 처리
  socket.on("register", (userId: string, callback: (ack: { status: string; message: string }) => void) => {
    registerUser(userId, socket);
    callback({ status: "ok", message: `User ${userId} registered successfully.` });
  });

  // 테스트 알림 이벤트
  socket.on("test_notification", async (data: { influencerId: string; message: string }) => {
    await handleTestNotification(data);
  });

  // 연결 해제 이벤트 처리
  socket.on("disconnect", () => {
    handleDisconnection(socket);
  });
};

// 사용자 등록
const registerUser = (userId: string, socket: Socket): void => {
  userSocketMap.set(userId, socket.id);
  socket.join(userId);
  console.log(`User ${userId} registered with socket ${socket.id}`);
  logUserSocketMap();
};

// 사용자 연결 해제
const handleDisconnection = (socket: Socket): void => {
  userSocketMap.forEach((value, key) => {
    if (value === socket.id) {
      userSocketMap.delete(key);
      console.log(`User ${key} disconnected.`);
    }
  });
  logUserSocketMap();
};

// 테스트 알림 처리
const handleTestNotification = async (data: { influencerId: string; message: string }): Promise<void> => {
  try {
    // RabbitMQ 초기화: 중복 초기화 방지
    if (!isRabbitMQInitialized) {
      console.log("Initializing RabbitMQ...");
      await initializeRabbitMQ();
      isRabbitMQInitialized = true;
    }

    console.log("Sending test notification to RabbitMQ:", data);
    await sendMsgToQueue(data);
    console.log("Test notification sent to RabbitMQ.");
  } catch (error) {
    console.error("Failed to send test notification to RabbitMQ:", error);
  }
};

// 디버깅: userSocketMap 로그 출력
const logUserSocketMap = (): void => {
  console.log("Current userSocketMap:", JSON.stringify([...userSocketMap]));
};

// Socket.IO 인스턴스 반환
export const getSocketInstance = (): SocketIOServer | null => io;
