// models/comment.ts
import { Model, DataTypes } from 'sequelize';
import sequelize from '../util/database';
import { User } from './user';

export class Comment extends Model {
  id?: number;
  content?: string;
  user_id?: number;
  user?: any;
  parent_comment_id?:number|string
}
Comment.init(
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
    post_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    parent_comment_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    hidden_yn: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    // created_at: {
    //   type: DataTypes.DATE,
    //   defaultValue: DataTypes.NOW,
    // },
    // modified_at: {
    //   type: DataTypes.DATE,
    //   defaultValue: DataTypes.NOW,
    // }
  },
  { 
    sequelize, 
    createdAt: 'created_at', // DB에서 생성 시간 필드 이름
    updatedAt: 'modified_at', // DB에서 수정 시간 필드 이름, modelName: 'Comment'}
    tableName: "Comment",
    timestamps: true,
  });

