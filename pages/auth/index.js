// pages/auth/index.js
import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime.js';
import { login } from "../../utils/asyncWx.js";

Page({
  // 获取用户信息
  async handleGetUserInfo(e){
    try{
      const { encryptedData,rawData,iv,signature } = e.detail;
      // 获取小程序登录成功之后的code
      const {code} = await login();
      // 发送请求获取token
      const loginParams = { encryptedData,rawData,iv,signature,code }
      const res = await request({ url: "/users/wxlogin", data: loginParams, method: "POST" });
      if (res === null){
        console.log("非企业账号，无法获取token！")
      }
      const token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo";
      wx.setStorageSync('token', token);
      console.log("使用测试token！")
    }catch (err) {

    }
    wx.navigateBack({
      delta: 1
    });
  }

})
