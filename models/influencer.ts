// influencer.ts

import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../util/database";
import { User } from "./user"; // User 모델 가져오기

// InfluencerAttributes 정의: 모델에서 실제 사용하는 데이터 필드
export interface InfluencerAttributes {
  id: number;
  user_id: number;
  follower?: string; // JSON 형태로 저장되는 팔로워 정보
  banner_picture?: string;
  category?: string;
  created_at: Date;
  modified_at: Date;
  User?: {
    username?: string;
  }; // 관계 타입 추가
}

// InfluencerCreationAttributes 정의: Influencer 모델 생성 시 필요한 필드
type InfluencerCreationAttributes = Optional<
  InfluencerAttributes,
  "id" | "created_at" | "modified_at"
>;

// Influencer 모델 정의
export class Influencer
  extends Model<InfluencerAttributes, InfluencerCreationAttributes>
  implements InfluencerAttributes
{
  public id!: number; // 명시적으로 선언
  public user_id!: number;
  public follower!: string;
  public banner_picture?: string;
  public category?: string;
  public created_at!: Date;
  public modified_at!: Date;
}

Influencer.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    follower: {
      type: DataTypes.STRING(255),
      defaultValue: "[]",
      allowNull: false,
    },
    banner_picture: {
      type: DataTypes.STRING(1000),
      allowNull: true,
    },
    category: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    modified_at: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "Influencer",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "modified_at",
  },
);

// User와의 관계 설정 (1:1 관계)
User.hasOne(Influencer, { foreignKey: "user_id", onDelete: "CASCADE" });
Influencer.belongsTo(User, { foreignKey: "user_id" });
