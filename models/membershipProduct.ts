import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../util/database";
import { Influencer } from "./influencer";
import { Membership } from "./membership";

// MembershipProductAttributes 인터페이스 정의
export interface MembershipProductAttributes {
  id: number;
  influencer_id: number;
  level: number;
  name: string;
  image?: string | null;
  price: number;
  benefits?: string | null;
  created_at?: Date;
  modified_at?: Date;
  is_active?: number;
}

// MembershipProduct 생성 시 필요한 속성 정의
interface MembershipProductCreationAttributes
  extends Optional<
    MembershipProductAttributes,
    "id" | "created_at" | "modified_at" | "benefits"
  > {}

// MembershipProduct 클래스 정의
export class MembershipProduct
  extends Model<
    MembershipProductAttributes,
    MembershipProductCreationAttributes
  >
  implements MembershipProductAttributes
{
  public id!: number;
  public influencer_id!: number;
  public level!: number;
  public name!: string;
  public image?: string | null;
  public price!: number;
  public benefits?: string | null;
  public created_at?: Date;
  public modified_at?: Date;
  public is_active?: number;
}

// 모델 초기화
MembershipProduct.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    influencer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    level: {
      type: DataTypes.TINYINT,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    benefits: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const rawValue = this.getDataValue("benefits");

        if (!rawValue || rawValue.trim() === "") {
          return [];
        }

        return rawValue
          .split(",")
          .map((b) => b.trim())
          .filter((b) => b !== "");
      },
      set(value: string[] | string | null) {
        if (Array.isArray(value)) {
          // 배열인 경우 비어있는 값 제거하고 쉼표로 구분된 문자열로 저장
          this.setDataValue(
            "benefits",
            value.filter((b) => b.trim() !== "").join(","),
          );
        } else if (typeof value === "string") {
          // 문자열인 경우 앞뒤 공백 제거
          this.setDataValue("benefits", value.trim());
        } else {
          this.setDataValue("benefits", null);
        }
      },
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    modified_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    is_active: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1,
    }
  },
  {
    sequelize,
    modelName: "MembershipProduct",
    tableName: "Membership_Product",
    timestamps: false, // createdAt, updatedAt 사용하지 않음
  },
);
MembershipProduct.belongsTo(Influencer, {
  foreignKey: "influencer_id",
  as: "influencer",
});
Influencer.hasMany(MembershipProduct, {
  foreignKey: "influencer_id",
  as: "products",
});
