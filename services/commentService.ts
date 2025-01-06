// services/commentService.ts
import {Comment} from '../models/comment';

// DB댓글 저장
export const createComment = async (commentData: any) => {
  return await Comment.create(commentData);
};

// 게시글의 댓글 조회
export const getComments = async (postId: number) => {
  return await Comment.findAll({
    where: {
      post_id: postId,
      parent_comment_id: null,
      hidden_yn: false
    },
    order: [['created_at', 'DESC']]
  });
};

// 대댓글 조회
export const getReplies = async (commentId: number) => {
  return await Comment.findAll({
    where: {
      parent_comment_id: commentId,
      hidden_yn: false
    },
    order: [['created_at', 'ASC']]
  });
};

// 댓글 수정
export const updateComment = async (commentId: number, content: string) => {
  return await Comment.update(
    { 
      content,
      modified_at: new Date()
    },
    {
      where: { id: commentId }
    }
  );
};

// 댓글 삭제 (숨김 처리)
export const deleteComment = async (commentId: number) => {
  return await Comment.update(
    { hidden_yn: true },
    { where: { id: commentId } }
  );
};