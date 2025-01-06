import { DataTypes, Model } from "sequelize";
import { sequelize } from "../util/database"; // Sequelize 인스턴스 가져오기
import { User } from "./user";
import { MembershipProduct } from "./membershipProduct";

class Payment extends Model {}

Payment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    order_id: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    order_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    payment_method: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    approved_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "Payment",
    tableName: "Payment",
    timestamps: false, // created_at을 직접 정의하므로 Sequelize의 기본 타임스탬프 비활성화
  }
);

// Foreign Key 관계 설정
Payment.belongsTo(User, { foreignKey: "user_id" });
Payment.belongsTo(MembershipProduct, { foreignKey: "product_id" });

export default Payment;