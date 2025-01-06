import { sequelize } from "../util/database";
import { User } from "./user";
import { Influencer } from "./influencer";
import { Feed } from "./feed";
import { Membership } from "./membership";
import { MembershipProduct } from "./membershipProduct";
import { Comment } from "./comment";
import { Notification } from "./notification";
import Payment from "./Payment";

// 관계 설정에서 alias가 'influencer'로 설정되었는지 확인
Influencer.hasMany(Feed, { foreignKey: "influencer_id", as: "feed" });
Feed.belongsTo(Influencer, { foreignKey: "influencer_id", as: "influencer" });

// User와 Influencer 간 관계에서 alias 'user'가 설정되어 있는지 확인
User.hasOne(Influencer, { foreignKey: "user_id", as: "influencer" });
Influencer.belongsTo(User, { foreignKey: "user_id", as: "user" });

Membership.belongsTo(MembershipProduct, {
  as: "product",
  foreignKey: "product_id",
});
MembershipProduct.hasMany(Membership, {
  foreignKey: "product_id",
});

// Feed와 Comment 간 관계 설정
Comment.belongsTo(User, { foreignKey: "user_id" });
User.hasMany(Comment, { foreignKey: "user_id" });

// Notification 관계 설정
Notification.belongsTo(User, { foreignKey: "user_id", as: "noti_user" });
User.hasMany(Notification, { foreignKey: "user_id", as: "notification" });

Notification.belongsTo(Feed, { foreignKey: "feed_id", as: "noti_feed" });
Feed.hasMany(Notification, { foreignKey: "feed_id", as: "notification" });

// Export하는 객체
export const db = {
  Comment,
  Feed,
  sequelize,
  User,
  Influencer,
  Membership,
  MembershipProduct,
  Notification,
  Payment,
};
