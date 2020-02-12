import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 轮播图数组
    swiperList: [],
    // 导航数组
    catesList: [],
    // 楼层数据
    floorList: []
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getSwiperList();
    this.getCateList();
    this.getFloorList();
  },

  // 获取轮播图数据
  async getSwiperList(){
    // request({url:"/home/swiperdata"})
    //     .then(result=>{
    //         /* 以下为服务器接口Bug修复补丁 */
    //         // result.forEach(item => {
    //         //     item.image_src = item.image_src.replace("cn//", "cn/");
    //         // })
    //         /* ------------结束----------- */
    //         this.setData({
    //             swiperList: result
    //         })
    //     })
      const res = await request({ url: "/home/swiperdata" });
      this.setData({
          swiperList: res
      })
  },

  // 获取分类导航数据
  async getCateList(){
    // request({url:"/home/catitems"})
    //     .then(result=>{
    //         /* 以下为服务器接口Bug修复补丁 */
    //         // result.forEach(item => {
    //         //     item.image_src = item.image_src.replace("cn//", "cn/");
    //         // })
    //         /* ------------结束----------- */
    //       this.setData({
    //         catesList: result
    //       })
    //     })
      const res = await request({ url: "/home/catitems" })
      this.setData({
          catesList: res
      })
  },

  // 获取楼层数据
  async getFloorList(){
    // request({url:"/home/floordata"})
    //     .then(result=>{
    //         /* 以下为服务器接口Bug修复补丁 */
    //         // result.forEach(item1 => {
    //         //     item1.floor_title.image_src = item1.floor_title.image_src.replace("cn//", "cn/")
    //         //     item1.product_list.forEach(item2 => {
    //         //         item2.image_src = item2.image_src.replace("cn//", "cn/")
    //         //     })
    //         // })
    //         /* ------------结束----------- */
    //       this.setData({
    //         floorList: result
    //       })
    //     })
      const res = await request({ url: "/home/floordata" })
      this.setData({
          floorList: res
      })
  }
})
