// pages/category/index.js
import {request} from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime.js';

Page({
    /**
     * 页面的初始数据
     */
    data: {
        // 左侧菜单数据
        leftMenuList: [],
        // 右侧商品数据
        rightContent: [],
        // 被点击的左侧的菜单
        currentIndex: 0,
        // 右侧内容的滚动条距离顶部的距离
        scrollTop: 0
    },
    // 接口返回数据
    Cates: [],
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // 判断本地缓存是否还存在，若存在，就使用本地缓存的数据
        const Cates = wx.getStorageSync('cates');
        if (!Cates) {
            this.getCates();
        }
        // 如果有旧数据
        else {
            // 定义过期时间(5分钟),若过期，则从新发送请求
            if (Date.now() - Cates.time > 1000 * 300) {
                this.getCates();
            } else { // 若没有过期，则使用缓存数据
                console.log("使用了缓存数据！")
                this.Cates = Cates.data;
                let leftMenuList = this.Cates.map(v => v.cat_name);
                let rightContent = this.Cates[0].children;
                this.setData({
                    leftMenuList,
                    rightContent
                })
            }
        }
    },
    // 获取分类数据
    async getCates() {
        const res = await request({url: "/categories"});
        // 此判断为防服务器接口Bug
        // 若message的长度不为0，则表示成功请求到了接口的品牌数据，就使用接口数据
        if (res.length !== 0) {
            console.log("使用了服务器接口数据！");
            this.Cates = res;
            // 把接口的数据存入本地存储中
            wx.setStorageSync('cates', {time: Date.now(), data: this.Cates});
            // 构造左侧的大菜单数据
            let leftMenuList = this.Cates.map(v => v.cat_name);
            // 构造右侧的商品数据
            let rightContent = this.Cates[0].children;
            this.setData({
                leftMenuList,
                rightContent
            })
        }

        // 若message长度为0，则表示接口失效，使用本地存储的数据
        else {
            console.log("使用了本地json数据");
            let data = require("goods.js");
            this.Cates = data.goods.message;
            // 把接口数据存入本地存储中
            wx.setStorageSync("cates", {time: Date.now(), data: this.Cates})
            // 构造左侧的大菜单数据
            let leftMenuList = this.Cates.map(v => v.cat_name);
            // 构造右侧的商品数据
            let rightContent = this.Cates[0].children;
            this.setData({
                leftMenuList,
                rightContent
            })
        }
    },

//左侧菜单的点击事件
    handleItemTap(e) {
        const {index} = e.currentTarget.dataset;
        // 当点击左侧菜单项时，根据id构造右侧的商品数据
        let rightContent = this.Cates[index].children;
        this.setData({
            currentIndex: index,
            rightContent,
            // 重新设置右侧内容的scroll-view标签距离顶部的距离
            scrollTop: 0
        })
    }
})
