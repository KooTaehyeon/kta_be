import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../util/database';

// FeedAttributes 정의: 모델에서 사용하는 데이터 필드
export interface FeedAttributes {
  id?: number;
  influencer_id: number;
  content?: string;
  images?: string[] | string; // images는 JSON 배열
  products?: { link: string; img: string; title: string }[] | string | string[]; // products는 객체 배열
  visibility_level?: number;
  likes?: string[] | string; // 좋아요 목록
  created_at?: Date;
  modified_at?: Date;
  influencer?: { user: { username: string; profile_picture: string } };
}

// FeedCreationAttributes 정의: 생성 시 필요한 필드
type FeedCreationAttributes = Optional<
  FeedAttributes,
  | 'influencer_id'
  | 'content'
  | 'images'
  | 'products'
  | 'visibility_level'
  | 'likes'
>;

// Feed 모델 정의
export const Feed = sequelize.define<
  Model<FeedAttributes, FeedCreationAttributes>
>(
  'Feed',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    influencer_id: {
      type: DataTypes.INTEGER,
      allowNull: false, // 반드시 필요한 필드
    },
    content: {
      type: DataTypes.STRING,
      allowNull: true, // 선택적 필드
    },
    images: {
      type: DataTypes.TEXT, // MySQL에서는 JSON 타입 사용
      allowNull: true,
      defaultValue: [], // 빈 배열로 초기화
    },
    products: {
      type: DataTypes.TEXT, // MySQL에서는 JSON 타입 사용
      allowNull: true,
      defaultValue: [], // 빈 배열로 초기화
    },
    visibility_level: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0, // 기본값 설정
    },
    likes: {
      type: DataTypes.TEXT, // MySQL에서는 JSON 타입 사용
      allowNull: true,
      defaultValue: '[]', // 기본값으로 빈 배열 설정
    },
  },
  {
    timestamps: true, // createdAt 및 updatedAt 자동 관리
    createdAt: 'created_at', // DB에서 생성 시간 필드 이름
    updatedAt: 'modified_at', // DB에서 수정 시간 필드 이름
    tableName: 'Feed', // 테이블 이름
  }
);
