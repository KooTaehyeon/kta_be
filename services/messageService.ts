import { Message } from '../models/Message';
import sequelize from '../util/database';
import { QueryTypes } from 'sequelize';
import { uploadToS3, deleteFromS3 } from '../util/uplode';

export const getMessageByroomUserInfo = async (roomId: number, limit: number, offset: number) => {
    try {
        const query = `
            SELECT 
                m.id AS message_id,
                m.room_id,
                m.user_id,
                m.message_content,
                m.created_at,
                u.username,
                u.profile_picture,
                i.id as influencer_id,
                i.follower,
                i.banner_picture,
                i.category
            FROM 
                Message m
            INNER JOIN 
                User u
            ON 
                m.user_id = u.id
            LEFT JOIN 
                Influencer i
            ON 
                u.id = i.user_id
            WHERE 
                m.room_id = :roomId
            ORDER BY 
                m.created_at DESC
            LIMIT :limit OFFSET :offset;
        `;

        const messages = await sequelize.query(query, {
            type: QueryTypes.SELECT,
            replacements: {
                roomId,
                limit,
                offset,
            },
        });

        return messages.reverse();
    } catch (error) {
        console.error('메세지 관련 유저 정보 디비 불러오기 실패:', error);
        throw new Error("메세지 관련 유저 정보 디비 불러오기 실패");
    }
};

export const uploadImage = async (file: Express.Multer.File) => {
    try {
        const url = await uploadToS3(file);
        return url;
    } catch (error) {
        console.error('이미지 업로드 실패:', error);
        throw new Error("이미지 업로드 실패");
    }
};

export const deleteMessage = async (id: string, key: string) => {
    const transaction = await sequelize.transaction();
    try {
        await Message.destroy({ where: { id }, transaction });
        await deleteFromS3(key);
        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        console.error('메시지 삭제 실패:', error);
        throw new Error("메시지 삭제 실패");
    }
};

