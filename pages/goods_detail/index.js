// pages/goods_detail/index.js
import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsObj: {},
    // 商品是否被收藏过
    isCollect: false
  },

  // 商品对象
  GoodsInfo: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function () {
    let pages = getCurrentPages();
    let currentPages = pages[pages.length-1];
    let options = currentPages.options;
    const { goods_id } = options;
    this.getGoodsDetail(goods_id);
  },

  // 获取商品的详情数据
  async getGoodsDetail(goods_id) {
    const res = await request({ url: "/goods/detail", data: { goods_id } })
    this.GoodsInfo = res;
    // 获取缓存中的商品收藏的数组
    let collect = wx.getStorageSync('collect') || [];
    // 判断当前的商品是否被收藏
    let isCollect = collect.some(v => v.goods_id === this.GoodsInfo.goods_id);
    this.setData({
      goodsObj: {
        pics: res.pics,
        goods_name: res.goods_name,
        goods_price: res.goods_price,
        goods_introduce: res.goods_introduce.replace("/\.webp/g",".jpg")
      },
      isCollect: isCollect
    })
  },

  // 点击轮播图，放大预览
  handlePreviewImage(e) {
    // map构造数组
    const urls = this.GoodsInfo.pics.map(v => v.pics_mid);
    const current = e.currentTarget.dataset.url;
    wx.previewImage({
      current: current,
      urls: urls,
    });
  },

  // 加入购物车
  handleCartAdd() {
    // 获取缓存中的购物车数组
    let cart = wx.getStorageSync('cart') || [];
    // 判断商品对象是否存在于购物车数组中
    let index = cart.findIndex(v => v.goods_id === this.GoodsInfo.goods_id);
    if (index === -1) {
      // 不存在，将商品设置数量属性为1并添加进cart数组
      this.GoodsInfo.num = 1;
      // 添加商品选中状态
      this.GoodsInfo.checked = true;
      cart.push(this.GoodsInfo);
    }else {
      // 已存在，数量++
      cart[index].num++;
    }
    // 把购物车信息从新添加回缓存中
    wx.setStorageSync('cart', cart);
    // 弹窗提示
    wx.showToast({
      title: '加入成功！',
      icon: 'success',
      // mask为true时，1.5秒 之后才能继续点击加入购物车
      mask: true
    });
  },

  // 点击商品收藏
  handleCollect() {
    let isCollect = false;
    // 1 获取缓存中的商品收藏数组
    let collect = wx.getStorageSync('collect')|| [];
    // 2 判断该商品是否被收藏过
    let index = collect.findIndex(v => v.goods_id === this.GoodsInfo.goods_id);
    // 3 当index不等于-1时，表示已经收藏过了
    if (index !== -1){
      // 将缓存中收藏数组中的该商品删除
      collect.splice(index, 1);
      isCollect = false; // 取消收藏
      wx.showToast({
        title: '取消收藏',
        icon: 'success',
        mask: true
      });
    }else {
      // 没有收藏过,则将当前商品加入收藏数组
      collect.push(this.GoodsInfo);
      isCollect = true
      wx.showToast({
        title: '收藏成功!',
        icon: 'success',
        mask: true
      });
    }
    // 把数组存入缓存
    wx.setStorageSync('collect', collect);
    // 修改data中的属性 isCollect
    this.setData({
      isCollect: isCollect
    })
  }

})
