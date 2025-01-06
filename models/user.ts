import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../util/database';
// UserAttributes 정의: 모델에서 실제 사용하는 데이터 필드
export interface UserAttributes {
  id: number;
  username: string;
  email: string;
  password: string;
  about_me?: string;
  profile_picture?: string;
  follow?: string[];
  created_at?: Date;
  modified_at?: Date;
  Influencer?: {
    id: number;
    follower: string[];
    banner_picture?: string;
    category?: string;
  }; // 관계 타입 추가
}

// UserCreationAttributes 정의: 유저 생성 시 필요한 필드
type UserCreationAttributes = Optional<
  UserAttributes,
  | 'id'
  | 'about_me'
  | 'profile_picture'
  | 'follow'
  | 'created_at'
  | 'modified_at'
  | 'username'
>;

// User 모델 정의
export const User = sequelize.define<
  Model<UserAttributes, UserCreationAttributes>
>(
  'User',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING(255), // VARCHAR(255)
      allowNull: true, // 중복 허용
    },
    email: {
      type: DataTypes.STRING(255), // VARCHAR(255)
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(255), // VARCHAR(255)
      allowNull: false,
    },
    about_me: {
      type: DataTypes.TEXT, // TEXT 타입
      allowNull: true,
    },
    profile_picture: {
      type: DataTypes.STRING(1000),
      allowNull: true,
    },
    follow: {
      type: DataTypes.JSON, // JSON 타입
      defaultValue: [], // 기본값 빈 배열
      allowNull: false,
    },
  },
  {
    timestamps: true, // Sequelize가 기본적으로 createdAt, updatedAt 관리
    createdAt: 'created_at', // DB에서 이름을 created_at으로 설정
    updatedAt: 'modified_at', // DB에서 이름을 modified_at으로 설정
    tableName: 'User', // 테이블 이름을 User로 설정
  }
);

// 관계 설정

// User.hasMany(Message, { foreignKey: 'user_id', as: 'messages' });
