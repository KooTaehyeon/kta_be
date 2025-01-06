import { Model, DataTypes } from "sequelize";
import { sequelize } from "../util/database";
import { User } from "./user";

export class InfluencerApplication extends Model { 
    id!: number;
    user_id!: number;
    category!: string;
    banner_picture!: string;
    reason!: string | null;
    status!: "pending" | "approved" | "rejected";
    created_at!: Date;
    reviewed_at!: Date | null;
    reviewed_by!: number | null;
}

InfluencerApplication.init(
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
        category: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        reason: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        status: {
            type: DataTypes.ENUM("pending", "approved", "rejected"),
            defaultValue: "pending",
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        reviewed_at: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        reviewed_by: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        banner_picture: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
  {
        sequelize,
        tableName: "InfluencerApplication",
        timestamps: false,
    }
);

// User와의 관계 설정 (1:1 관계)
User.hasOne(InfluencerApplication, { foreignKey: "user_id", onDelete: "CASCADE" });
InfluencerApplication.belongsTo(User, { foreignKey: "user_id" });