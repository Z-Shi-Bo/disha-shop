import service from "../service";

const common = {
  // 登录
  login: (params) => service.post("/login", params),
  // 获取用户信息
  getUserInfo: (params) => service.post("/getinfo", params),
  // 退出
  logout: (params) => service.post("/logout", params),
  // 修改密码
  updatePassword: (params) => service.post("/updatepassword", params),
};

export default common;