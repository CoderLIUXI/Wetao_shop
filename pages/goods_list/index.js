// pages/goods_list/index.js
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
            value: "综合",
            isActive: true
        }, {
            id: 1,
            value: "销量",
            isActive: false
        }, {
            id: 2,
            value: "价格",
            isActive: false
        }],
        goodsList: []
    },
    // 接口需要的参数
    QueryParams: {
      query: "",
        cid: "",
        pagenum: 1,
        pagesize: 10
    },

    // 总页数
    totalPages: 1,

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.QueryParams.cid = options.cid || "";
        this.QueryParams.query = options.query || "";
        this.getGoodsList();
    },

    // 获取商品列表数据
    async getGoodsList() {
        const res = await request({
            url:"/goods/search",
            data: this.QueryParams
        })
        // 计算总页数
        const total = res.total;
        this.totalPages = Math.ceil(total/this.QueryParams.pagesize)
        this.setData({
            goodsList: [...this.data.goodsList, ...res.goods]
        })

        // 关闭下拉刷新的窗口
        wx.stopPullDownRefresh();
    },

    handleTabsItemChange(e){
        // 获取被点击的标题索引
        const {index} = e.detail;
        let {tabs} = this.data;
        tabs.forEach((v,i) => i===index ? v.isActive=true : v.isActive=false);
        this.setData({
            tabs: tabs
        })
    },

    // 页面上滑，滚动条触底事件
    onReachBottom() {
        // 判断还有没有下一页
        if (this.QueryParams.pagenum >= this.totalPages) {
            // 没有下一页
            wx.showToast({ title: "没有下一页数据了" })
        }else {
            // 有下一页
            this.QueryParams.pagenum++;
            this.getGoodsList();
        }
    },

    // 监听下拉刷新事件
    onPullDownRefresh() {
        // 重置数组
        this.setData({
            goodsList: []
        })
        // 重置页码
        this.QueryParams.pagenum = 1;
        // 发送请求
        this.getGoodsList();
    }

})
