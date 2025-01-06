// 메시지
import { DataTypes } from 'sequelize';
import { sequelize } from '../util/database';
import { User } from "./user";
import { Influencer } from './influencer';


export const Message = sequelize.define(
    'Message',
    {
        room_id: { type: DataTypes.INTEGER },
        user_id: { type: DataTypes.INTEGER },
        message_content: { type: DataTypes.STRING(1000) }
    },
    {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: false,
        tableName: 'Message',
    }
);

// 관계 설정은 한쪽에서만 해주면 되고, 조인을 거는 쪽에서 해줘야한다.
Message.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Message.belongsTo(Influencer, { foreignKey: 'user_id', as: 'influencer' })

// Message.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
// User.hasMany(Message, { foreignKey: 'user_id', as: 'messages' });
