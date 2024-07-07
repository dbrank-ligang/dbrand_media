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
// 競品列表
export const competitorApi = param => {
  return http.get(`/media/competitorRecommandMedia`, param, { loading: false });
};

// 媒体搜索
// 媒体模糊搜索
export const searchMediaApi = param => {
  return http.get(`/media/searchMedia`, param, { loading: false });
};

// 媒体详情
// 媒体导航列表
export const mediaNavApi = param => {
  return http.get(`/media/unionInfo`, param, { loading: false });
};

// 媒体&账号列表
export const accountListApi = param => {
  return http.get(`/media/accountList`, param, { loading: false });
};
