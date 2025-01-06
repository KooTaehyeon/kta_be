import amqp from "amqplib";

let connection: amqp.Connection | null = null;
let channel: amqp.Channel | null = null;
let isInitialized = false;

// RabbitMQ 초기화
export const initializeRabbitMQ = async (): Promise<void> => {
  if (isInitialized) {
    console.log("RabbitMQ is already initialized.");
    return;
  }

  try {
    connection = await amqp.connect(process.env.RABBITMQ_URL || "amqp://guest:guest@localhost:5672");
    channel = await connection.createChannel();
    await channel.assertExchange("notifications_exchange", "fanout", { durable: true });

    isInitialized = true;
    console.log("RabbitMQ connection and channel initialized.");
  } catch (error) {
    console.error("Failed to initialize RabbitMQ:", error);
  }
};

// 메시지 전송
export const sendMsgToQueue = async (postInfo: any): Promise<void> => {
  if (!channel) {
    console.error("RabbitMQ 채널이 초기화되지 않았습니다.");
    return;
  }

  try {
    channel.publish("notifications_exchange", "", Buffer.from(JSON.stringify(postInfo)), { persistent: true });
    console.log("프로듀서: 메시지 전송 완료.", postInfo);
  } catch (error) {
    console.error("메시지 보내기 실패:", error);
  }
};

// RabbitMQ 연결 종료
export const closeRabbitMQ = async (): Promise<void> => {
  try {
    if (channel) {
      await channel.close();
      console.log("RabbitMQ channel closed.");
    }
    if (connection) {
      await connection.close();
      console.log("RabbitMQ connection closed.");
    }
  } catch (error) {
    console.error("Failed to close RabbitMQ connection:", error);
  }
};
