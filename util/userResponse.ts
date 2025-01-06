export const formatUserResponse = (user: any) => ({
    id: user.id,
    username: user.username,
    email: user.email,
    about_me: user.about_me,
    profile_picture: user.profile_picture,
    influencer: user.Influencer
      ? {
          id: user.Influencer.id,
          follower: user.Influencer.follower,
          banner_picture: user.Influencer.banner_picture,
          category: user.Influencer.category,
        }
      : null,
  });
  