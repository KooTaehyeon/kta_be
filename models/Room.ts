//채팅방 모델
import { DataTypes } from 'sequelize';
import { sequelize } from '../util/database';

export const Room = sequelize.define(
    'Room',
    {
        room_name: { type: DataTypes.STRING, allowNull: true },
        influencer_id: { type: DataTypes.INTEGER },
        visibility_level: {
            type: DataTypes.TINYINT,
            defaultValue: 1,
        },
    },
    {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        tableName: 'Room',
    }
)