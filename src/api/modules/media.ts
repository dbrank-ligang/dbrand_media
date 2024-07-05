import http from "@/api";

// 用户信息
export const userInfoApi = () => {
  return http.get(`/user/userInfo`, {}, { loading: true }); // 正常 post json 请求  ==>  application/json
};

//媒体推荐页面
//媒体大类 下拉框
export const mediaTypeApi = param => {
  return http.get(`/mediaType/list`, param, { loading: false });
};
//平台类别
export const dictListApi = param => {
  return http.get(`/dict/list`, param, { loading: false });
};
// 推荐、不推荐 列表
export const recommandMediaApi = param => {
  return http.get(`/media/recommandMedia`, param, { loading: false });
};
