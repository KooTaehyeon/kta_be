import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../util/database"; // Sequelize 인스턴스 가져오기
import { User } from "./user";
import { Feed } from "./feed";

interface NotificationAttributes {
  id: number;
  user_id: number;
  feed_id: number;
  is_read: boolean;
  created_at: Date;
  updated_at: Date;
}

interface NotificationCreationAttributes
  extends Optional<
    NotificationAttributes,
    "id" | "created_at" | "updated_at"
  > {}

export class Notification
  extends Model<NotificationAttributes, NotificationCreationAttributes>
  implements NotificationAttributes
{
  public id!: number;
  public user_id!: number;
  public feed_id!: number;
  public is_read!: boolean;
  public created_at!: Date;
  public updated_at!: Date;
}

// 모델 초기화
Notification.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    feed_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    is_read: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      onUpdate: "SET DEFAULT",
    },
  },
  {
    sequelize,
    modelName: "Notification",
    tableName: "Notifications",
    timestamps: false, // created_at, updated_at을 수동 관리
  },
);
Notification.belongsTo(User, { foreignKey: "user_id", as: "user" });
Notification.belongsTo(Feed, { foreignKey: "feed_id", as: "feed" });
