// pages/search/index.js
import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods: [],
    // 控制取消按钮是否显示
    isFocus: false,
    // 输入框的值
    inpValue: ""
  },

  TimeId: -1,

  handleInput(e){
    //获取输入框的值
    const {value} = e.detail;
    // 检测合法性
    console.log(value);
    if(!value.trim()){
      // 值不合法
      this.setData({
        goods:[],
        isFocus: false
      })
      return;
    }
    // 值合法之后，再将按钮显示出来
    this.setData({
      isFocus: true
    })
    // 发送请求
    clearTimeout(this.TimeId);
    this.TimeId = setTimeout(()=>{
      this.qsearch(value);
    },1000)
  },

  // 发送请求的函数
  async qsearch(query){
    const res = await request({ url:"/goods/qsearch", data:{query} })
    this.setData({
      goods: res
    })
  },

  // 点击取消按钮
  handleCancel() {
    this.setData({
      inpValue: "",
      isFocus: false,
      goods: []
    })
  }

})
