import http from "@/api";

// 用户信息
export const userInfoApi = () => {
  return http.get(`/user/userInfo`, {}, { loading: true }); // 正常 post json 请求  ==>  application/json
};

//首页
//概览
export const overviewApi = param => {
  return http.get(`/statistic/overview`, param, { loading: false });
};
// 覆盖图
export const fugaituApi = param => {
  return http.get(`/statistic/fugaitu`, param, { loading: false });
};

//获取自选类别
export const userMediaTypeApi = param => {
  return http.get(`/mediaType/getUserMediaType`, param, { loading: false });
};
// 新增大类
export const saveUserMediaTypeApi = param => {
  return http.post(`/mediaType/saveUserMediaType`, param, { loading: false });
};

//--媒体推荐页面
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

// 媒体搜索页面
// 媒体模糊搜索
export const searchMediaApi = param => {
  return http.get(`/media/searchMedia`, param, { loading: false });
};
// 搜索历史列表
export const searchMediaHistoryApi = () => {
  return http.get(`/media/searchMediaHistory`, {}, { loading: true });
};
// 添加搜索历史
export const addMediaHistoryApi = param => {
  return http.post(`/media/addMediaHistory`, param, { loading: false });
};
// 推荐标签列表
export const dictListJsonApi = () => {
  return http.get(`/dict/listJson?code=biaoqiantuijian`, {}, { loading: false });
};

// 媒体详情页面
// 媒体导航列表
export const mediaNavApi = param => {
  return http.get(`/media/unionInfo2`, param, { loading: false });
};
// 媒体&账号列表
export const accountListApi = param => {
  return http.get(`/media/accountList2`, param, { loading: false });
};

// 账号详情
export const accountApi = param => {
  return http.get(`/media/account`, param, { loading: false });
};

// 内容列表
export const articlesApi = param => {
  return http.get(`/article/getArticles`, param, { loading: false });
};

// 我要新增模糊搜索
export const searchMediaTypeApi = param => {
  return http.get(`/mediaType/searchMediaType`, param, { loading: false });
};

// 未搜索到的媒体 做保存
export const addMediaNotExistApi = param => {
  return http.post(`/media/addMediaNotExist`, param, { loading: false });
};
