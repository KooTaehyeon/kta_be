import { Model, DataTypes } from "sequelize";
import { sequelize } from "../util/database";
import { MembershipProduct } from "./membershipProduct";

// TypeScript 타입 정의
export interface MembershipAttributes {
  id?: number;
  user_id: number;
  product_id: number;
  start_date: Date;
  status: string;
  created_at?: Date;
  modified_at?: Date;
}

// Sequelize 모델 정의
export class Membership
  extends Model<MembershipAttributes>
  implements MembershipAttributes {
  public id!: number;
  public user_id!: number;
  public product_id!: number;
  public start_date!: Date;
  public status!: string;
  public readonly created_at!: Date;
  public readonly modified_at!: Date;
}

Membership.init(
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
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("active", "inactive"),
      allowNull: false,
      defaultValue: "active",
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    modified_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "Membership",
    underscored: true, // 필드 이름 자동 변환
    timestamps: false,
  },
);

// // 관계 설정
// Membership.belongsTo(MembershipProduct, {
//   foreignKey: "product_id",
//   as: "product",
// });


