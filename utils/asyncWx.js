export const getSetting=()=>{
    return new Promise((resolve, reject)=>{
        wx.getSetting({
            success: (result) => {
                resolve(result)
            },
            fail: (err) => {
                reject(err)
            }
        });
    })
}

export const chooseAddress=()=>{
    return new Promise((resolve, reject)=>{
        wx.chooseAddress({
            success: (result) => {
                resolve(result)
            },
            fail: (err) => {
                reject(err)
            }
        });
    })
}

export const openSetting=()=>{
    return new Promise((resolve, reject)=>{
        wx.openSetting({
            success: (result) => {
                resolve(result)
            },
            fail: (err) => {
                reject(err)
            }
        });
    })
}

export const showModal=({content})=>{
    return new Promise((resolve, reject)=>{
        wx.showModal({
            title: "提示",
            content: content,
            success: (res) => {
                resolve(res);
            },
            fail: (err) => {
                reject(err);
            }
        })
    })
}

export const showToast=({title})=>{
    return new Promise((resolve, reject)=>{
        wx.showToast({
            title: title,
            icon: "none",
            success: (res) => {
                resolve(res);
            },
            fail: (err) => {
                reject(err);
            }
        })
    })
}

export const login=()=>{
    return new Promise((resolve, reject)=>{
        wx.login({
            timeout: 10000,
            success: (result) => {
                resolve(result);
            },
            fail: (err) => {
                reject(err);
            }
        });
    })
}
// 微信支付接口
export const requestPayment=()=>{
    return new Promise((resolve, reject)=>{
        wx.requestPayment({
           'timeStamp': '',
           'nonceStr': '',
           'package': '',
           'signType': 'MD5',
           'paySign': '',
           'success':(res) => {
               resolve(res)
           },
           'fail': (res) => {
               reject(res)
           }
        })
    })
}

// 微信开始生物认证接口
export const startSoterAuthentication=()=>{
    return new Promise((resolve, reject)=>{
        wx.startSoterAuthentication({
            requestAuthModes: ['fingerPrint'],
            challenge: '123456',
            authContent: '验证已有指纹',
            'success':(res) => {
                resolve(res)
            },
            'fail': (res) => {
                reject(res)
            }
        })
    })
}
