// pages/cart/index.js
import { getSetting,chooseAddress,openSetting,showModal,showToast } from "../../utils/asyncWx.js";
import regeneratorRuntime from '../../lib/runtime/runtime.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    cart: [],
    allChecked: false,
    totalPrice: 0,
    totalNum: 0
  },

  onShow() {
    // 获取缓存中得收货地址
    const address = wx.getStorageSync('address');
    // 获取缓存中的购物车数据
    const cart = wx.getStorageSync("cart") || [];
    // 计算总价格和数量
    this.setCart(cart);
    this.setData({
      address: address
    })
  },

  // 收货地址事件
  async handleChooseAddress(){
    try {
      // 获取权限状态
      const res1 = await getSetting();
      const scopeAddress = res1.authSetting["scope.address"];
      if (scopeAddress === false) {
        await openSetting()
      }
      let address = await chooseAddress();
      address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo;
      // 地址信息存入缓存
      wx.setStorageSync('address', address);
    } catch (err) {
      console.log(err)
    }
  },

  // 商品选中状态变化事件
  handleItemChange(e) {
    // 获取对应商品ID
    const goods_id = e.currentTarget.dataset.id;
    // 获取购物车数组
    let {cart} = this.data;
    // 找到被修改的商品对象的索引
    let index = cart.findIndex(v => v.goods_id === goods_id);
    cart[index].checked = !cart[index].checked;
    // 重新计算总价和数量并存入缓存
    this.setCart(cart);
  },

  // 设置购物车选中状态同时 重新计算 价格、数量等
  setCart(cart) {
    wx.setStorageSync('cart', cart);
    // 全选状态
    let allChecked = true;
    // 总价格，总数量
    let totalPrice = 0;
    let totalNum = 0;
    // 循环并累加购物车中的商品价格和数量
    cart.forEach(v => {
      if(v.checked){
        totalPrice += v.goods_price * v.num;
        totalNum += v.num;
        // 若存在商品没有选中
      }else {
        allChecked = false;
      }
    })
    // 如果购物车为空，则全选为false
    allChecked = (cart.length !== 0 ? allChecked : false);
    this.setData({
      cart: cart,
      allChecked: allChecked,
      totalPrice: totalPrice,
      totalNum: totalNum
    })
    wx.setStorageSync("cart", cart);
  },

  // 全选按钮状态变化
  handleItemAllCheck() {
    // 获取data中的数据
    let {cart, allChecked} = this.data;
    allChecked = !allChecked;
    cart.forEach(v => v.checked = allChecked);
    this.setCart(cart);
  },

  // 商品数量编辑功能
  async handleItemNumEdit(e) {
    // 获取对应的商品id和操作类型
    const {id, operation} = e.currentTarget.dataset;
    // 获取购物车信息
    let {cart} = this.data;
    // 找到该商品在购物车信息里对应的下标
    const index = cart.findIndex(v => v.goods_id === id);
    // 判断是否执行删除
    if (cart[index].num === 1 && operation === -1) {
      const res = await showModal({content: "您是否要从购物车移除该商品?"});
      if (res.confirm) {
        cart.splice(index, 1);
        this.setCart(cart);
      }
    }else {
      // 进行数量属性修改操作
      cart[index].num += operation;
      this.setCart(cart);
    }
  },

  // 点击结算按钮
  async handlePay() {
    const {address, totalNum} = this.data;
    if(!address.userName){
      await showToast({title: "请设置收获地址信息！"});
      return
    }
    if(totalNum === 0) {
      await showToast({title: "购物车是空的哦！-_-"});
      return
    }
    wx.navigateTo({
      url: '/pages/pay/index'
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  }

})
