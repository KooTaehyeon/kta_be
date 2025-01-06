import { Influencer } from '../models/influencer';
import { User } from '../models/user';


//구독하고 있는 멤버쉽 id로 인플루언서의 상세정보를 얻어옴
export const getInfluencerDetails = async (id: Number) => {

  try {
    const influencerDetails = await Influencer.findOne({
      where: { id: Number(id) }, // WHERE 조건
      include: [
        {
          model: User, // User 모델과 조인
          attributes: ["profile_picture", "username", "about_me"], // 필요한 컬럼만 가져오기
        },
      ],
    });

    if (!influencerDetails) {
      return;
    }

    return (influencerDetails); // 성공적으로 데이터 반환
  } catch (error: any) {
    console.error("Error fetching influencer details:", error.message);
  }
};





