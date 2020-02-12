// pages/feedback/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        id: 0,
        value: "体验问题",
        isActive: true
      }, {
        id: 1,
        value: "商品、商家投诉",
        isActive: false
      }],
    // 被选择的图片数组
    chooseImgs: [],
    // 文本域的内容
    textVal: ""
  },

  // 外网的图片的路径和数组
  UpLoadImgs: [],

  // 点击+号选择图片
  handleChooseImg() {
    wx.chooseImage({
      // 同时选择的图片数量
      count: 9,
      // 图片格式，原图/压缩
      sizeType: ["original", "compressed"],
      // 图片来源 相册 照相机
      sourceType: ["labum", "camera"],
      success: (result) => {
        this.setData({
          // 图片数组进行拼接
          chooseImgs: [...this.data.chooseImgs, ...result.tempFilePaths]
        })
      }
    })
  },

  handleRemoveImg(e){
    // 获取被点击的图片的索引
    const {index} = e.currentTarget.dataset;
    // 获取data中的图片数组
    let {chooseImgs} = this.data;
    // 删除元素
    chooseImgs.splice(index, 1);
    this.setData({
      chooseImgs: chooseImgs
    })
  },

  handleTabsItemChange(e) {
    // 获取被点击的标题索引
    const {index} = e.detail;
    let {tabs} = this.data;
    tabs.forEach((v,i) => i===index ? v.isActive=true : v.isActive=false);
    this.setData({
      tabs: tabs
    })
  },

  // 文本域的输入事件
  handleTextInput(e) {
    this.setData({
      textVal:e.detail.value
    })
  },

  // 提交按钮的点击事件
  handleFormSubmit() {
    // 获取文本域的内容
    const {textVal, chooseImgs} = this.data;
    // 验证合法性
    if (!textVal.trim()){
      // 不合法
      wx.showToast({
        title: '请输入问题',
        icon: 'none'
      })
      return;
    }
    wx.showLoading({
      title: "正在上传中",
      mask: true
    })
    // 准备上传图片
    if(chooseImgs.length != 0){
      chooseImgs.forEach((v, i)=>{
        wx.uploadFile({
          url:"https://images.ac.cn/",
          filePath: v,
          name: "file",
          formData: {},
          success: (result) => {
            if (i === chooseImgs.length-1){
              wx.hideLoading();
            }
            this.setData({
              textVal: "",
              chooseImgs: []
            })
            // 返回上一个页面
            wx.navigateBack({
              delta: 1
            });
          }
        });
      })
    }else {
      wx.hideLoading();
      wx.navigateBack({
        delta: 1
      });
    }
  }

})
