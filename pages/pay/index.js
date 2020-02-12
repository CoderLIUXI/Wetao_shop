// pages/cart/index.js
import { getSetting,chooseAddress,openSetting,showModal,showToast,startSoterAuthentication } from "../../utils/asyncWx.js";
import regeneratorRuntime from '../../lib/runtime/runtime.js';
import { request } from "../../request/index.js";


Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    cart: [],
    totalPrice: 0,
    totalNum: 0
  },

  onShow() {
    // 获取缓存中得收货地址
    const address = wx.getStorageSync('address');
    // 获取缓存中的购物车数据
    let cart = wx.getStorageSync("cart") || [];
    // 选中状态的商品
    cart = cart.filter(v => v.checked);

    // 总价格，总数量
    let totalPrice = 0;
    let totalNum = 0;
    // 循环并累加购物车中的商品价格和数量
    cart.forEach(v => {
      totalPrice += v.goods_price * v.num;
      totalNum += v.num;
    })
    this.setData({
      cart: cart,
      totalPrice: totalPrice,
      totalNum: totalNum,
      address: address
    })

  },

  // 点击支付按钮
  async handleOrderPay() {
    //判断缓存中有没有token
    const token = wx.getStorageSync('token');
    if (!token) {
      wx.navigateTo({
        url: '/pages/auth/index'
      });
      return;
    }
    // 创建订单
    const header = {Authorization: token};
    // 准备请求体参数
    const order_price = this.data.totalPrice;
    const consignee_addr = this.data.address.all;
    const cart = this.data.cart;
    let goods = [];
    cart.forEach(v => goods.push({
      goods_id: v.goods_id,
      goods_number: v.num,
      goods_price: v.goods_price
    }))
    const orderParams = {
      order_price,
      consignee_addr,
      goods
    }
    // 准备发送请求，创建订单
    const {order_number, order_id} = await request({ url:"/my/orders/create", method:"POST", data: orderParams})
    // 发起预支付的接口(无效)
    // const res = await request({ url:"/my/orders/req_unifiedorder", method: "POST", data: {order_number} });
    // 验证指纹信息，模拟发起微信支付
    await startSoterAuthentication()
    await showToast({title:"支付成功"})
    // 把付款成功的order_id存入缓存，待付款就不渲染这些订单
    let paidOrdersId = wx.getStorageSync("paidOrdersId") || [];
    paidOrdersId.push(order_id);
    wx.setStorageSync("paidOrdersId", paidOrdersId);
    // 获取购物车所有商品
    let newCart = wx.getStorageSync("cart");
    // 若支付成功，则过滤掉购物车中选中的商品
    newCart = newCart.filter(v => !v.checked);
    // 重新设置回缓存
    wx.setStorageSync('cart', newCart);
    // 支付成功，跳转到订单页面
    wx.redirectTo({
      url: "/pages/order/index"
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  }

})
