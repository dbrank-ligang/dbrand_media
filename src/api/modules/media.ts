import http from "@/api";
import { Media } from "@/api/interface/index";

// 用户信息
export const userInfoApi = () => {
  return http.post(`/user/userInfo`, {}, { loading: true }); // 正常 post json 请求  ==>  application/json
};

//媒体推荐页面
//媒体大类下拉框
export const mediaTypeApi = () => {
  return http.get<Media.ResMediaType[]>(`/mediaType/list`);
};
