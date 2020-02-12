// 同时发送异步请求的次数
let ajaxTimes = 0;
export const request=(params)=>{
    // 判断url是否带有/my/
    let header = {...params.header};
    if (params.url.includes("/my/")){
        // 带上token
        header["Authorization"] = wx.getStorageSync('token');
    }
    ajaxTimes++;
    // 显示加载中
    wx.showLoading({
        title: "加载中",
        mask: true
    });
    // 定义公告的url
    const baseUrl = "https://api.zbztb.cn/api/public/v1"
    return new Promise((resolve, reject)=>{
        wx.request({
            ...params,
            header: header,
            url: baseUrl + params.url,
            success: (result)=>{
                resolve(result.data.message);
            },
            fail: (err)=>{
                reject(err);
            },
            complete:() => {
                ajaxTimes--;
                // 当所有请求都成功返回了数据，再关闭窗口
                if (ajaxTimes === 0){
                    wx.hideLoading();
                }
            }
        })
    })
}
