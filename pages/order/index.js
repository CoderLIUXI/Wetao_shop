// pages/order/index.js
import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        id: 0,
        value: "全部",
        isActive: true
      }, {
        id: 1,
        value: "待付款",
        isActive: false
      }, {
        id: 2,
        value: "待发货",
        isActive: false
      }, {
        id: 3,
        value: "退货/退款",
        isActive: false
      }],
    orders: []
  },

  // 获取订单列表的方法
  async getOrders(type) {
    const res = await request({ url: "/my/orders/all", data: {type} });
    // 当显示待付款页面时
    if (type===2){
      // 从缓存取出支付成功的订单ID数组
      let paidOrdersId = wx.getStorageSync('paidOrdersId') || [];
      // 循环id数组并过滤掉已经付款成功的订单
      paidOrdersId.forEach((value)=>{
        res.orders = res.orders.filter(v => v.order_id !== value)
      })
      // 当显示待发货页面时
    }else if (type===3){
      // 把所有订单中的付款成功的订单选出来
      const res3 = await request({ url: "/my/orders/all", data: 1 });
      // 从缓存取出支付成功的订单ID数组
      let paidOrdersId = wx.getStorageSync('paidOrdersId') || [];
      // 从所有订单中过滤掉没有付款的订单
      paidOrdersId.forEach((value) => {
        res.orders.push(res3.orders.filter(v => v.order_id === value)[0]);
      })
    }
    this.setData({
      orders: res.orders.map(v => ({...v, create_time_cn: new Date(v.create_time*1000).toLocaleString()}))
    })
  },

  // 根据标题索引激活选中
  changeTitleByIndex(index) {
    let {tabs} = this.data;
    tabs.forEach((v,i) => i===index ? v.isActive=true : v.isActive=false);
    this.setData({
      tabs: tabs
    })
  },

  handleTabsItemChange(e){
    // 获取被点击的标题索引
    const {index} = e.detail;
    this.changeTitleByIndex(index);
    // 重新发送请求
    this.getOrders(index+1);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const token = wx.getStorageSync('token');
    if (!token){
      wx.navigateTo({
        url: "/pages/auth/index"
      });
      return;
    }
    // 获取当前小程序的页面栈
    let pages = getCurrentPages();
    let currentPage = pages[pages.length-1];
    const {type} = currentPage.options;
    // 根据type值确定激活的标题
    this.changeTitleByIndex(type-1);
    this.getOrders(type);
  }

})
