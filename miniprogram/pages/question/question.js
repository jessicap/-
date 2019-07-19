const app = getApp()

Page({
  data: {
    items: [{
        name: '1.15',
        value: '长时间坐着，很少运动',
        checked: 'true'
      },
      {
        name: '1.3',
        value: '偶尔运动散步，一周1-3次'
      },
      {
        name: '1.4',
        value: '持续运动，一周3-5次'
      },
      {
        name: '1.6',
        value: '热爱运动，一周6-7次'
      },
      {
        name: '1.8',
        value: '重度劳力工作'
      }
    ],
    age: '',
    height: '',
    weight: '',
    activity: '1.15',
    nickName: '',
    gender: '',
    city: '',
    province: '',
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    calculate: '',
    openid:'',
    queryResult:''
  },
  onLoad: function() {
    this.onGetOpenid();
  
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }
    // // 在页面onLoad回调事件中创建插屏广告实例
    // if (wx.createInterstitialAd) {
    //   interstitialAd = wx.createInterstitialAd({
    //     adUnitId: 'adunit-81914257bdb6997f'
    //   })
    //   interstitialAd.onLoad(() => { })
    //   interstitialAd.onError((err) => { })
    //   interstitialAd.onClose(() => { })
    // }

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
            }
          })
        }
      }
    })
   
  },
  onGetOpenid: function () {
    // 调用云函数
    
 wx.cloud.callFunction({
      name: 'login',
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
       app.globalData.openid = res.result.openid
        this.setData({
          openid:app.globalData.openid
        })
     //   return app.globalData.openid
        console.log(app.globalData.openid)
        this.onQuery();
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
    })

  },
  calshow: function(e) {
    wx.navigateTo({
      url: '/pages/foodcal/foodcal',
    })
  },
  ageInput: function(e) {
    this.setData({
      age: e.detail.value
    })
  },
  heightInput: function(e) {
    this.setData({
      height: e.detail.value
    })
  },
  weightInput: function(e) {
    this.setData({
      weight: e.detail.value
    })
  },
  radioChange(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    this.setData({
      activity: e.detail.value
    })
  },
  //查询数据库有没有这个用户
  onQuery: function () {
   
    const db = wx.cloud.database()
    
    // 查询当前用户所有的 counters
    db.collection('users').where({
      _openid: this.data.openid
    }).get({
      success: res => {

        if (res.data[0] == null){
          this.setData({
            queryResult: 'false'
          })
        }else{
          this.setData({
            queryResult: 'true'
          })
        }
        
        console.log(this.data.queryResult);
        console.log('[数据库] [查询记录] 成功: '+this.data.openid)
     
      },
      fail: err => {
        this.setData({
          queryResult: 'false'
        })
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
       
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
  },
  //新增到数据库
  onAdd: function() {

     if(this.data.queryResult==='true'){
       if (this.verifyquestion()){
      this.calculate()
      console.log(this.data.calculate)
   
      wx.cloud.callFunction({
        name:'update',
        data:{
          age:this.data.age,
          height:this.data.height,
          weight:this.data.weight,
          activity:this.data.activity,
          calculate:this.data.calculate
        },
        success:res=>{
          console.log('[云函数] [update] user openid: ', res.result)
          console.log('[云函数] [update] user appid: ', res.result.appid)
          console.log('更新数据成功')
        }
      })
      // const db = wx.cloud.database()
      // console.log(this.data.openid)
      //    db.collection('users').doc(this.data.openid).update({
      //   data: {
      //     age: this.data.age,
      //     height: this.data.height,
      //     weight: this.data.weight,
      //     activity: this.data.activity,
      //     // nickName: this.data.userInfo.nickName,
      //     // gender: this.data.userInfo.gender,
      //     // city: this.data.userInfo.city,
      //     // province: this.data.userInfo.province,
      //     // avatarUrl: this.data.avatarUrl,
      //     calculate: this.data.calculate
      //   },
      //   success: res => {
      //     // 在返回结果中会包含新创建的记录的 _id
      //     // this.setData({
      //     //   counterId: res._id
      //     //   //count: 1
      //     // })
      //     console.log(this.data.calculate)
      //     wx.showToast({
      //       title: '修改记录成功',
      //     })
      //     console.log('[数据库] [修改记录] 成功，记录 _id: ', res.calculate)
      //   },
      //   fail: err => {
      //     wx.showToast({
      //       icon: 'none',
      //       title: '修改记录失败'
      //     })
      //     console.error('[数据库] [修改记录] 失败：', err)
      //   }
      // })
      this.calshow();
    }
     }else{
    if (this.verifyquestion()){
      this.calculate()
      console.log(this.data.calculate)
      const db = wx.cloud.database()
      db.collection('users').add({
        data: {
          age: this.data.age,
          height: this.data.height,
          weight: this.data.weight,
          activity: this.data.activity,
          nickName: this.data.userInfo.nickName,
          gender: this.data.userInfo.gender,
          city: this.data.userInfo.city,
          province: this.data.userInfo.province,
          avatarUrl: this.data.avatarUrl,
          calculate: this.data.calculate
        },
        success: res => {
          // 在返回结果中会包含新创建的记录的 _id
          this.setData({
            counterId: res._id
            //count: 1
          })
          wx.showToast({
            title: '提交成功',
          })
          console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '提交失败'
          })
          console.error('[数据库] [新增记录] 失败：', err)
        }
      })
      this.calshow();
    }
     }
    
    
    
    
  },
  onFood:function(){
   
    wx.navigateTo({
      url: '../foodcal/foodcal',
    })
  },
  //计算卡路里
  calculate: function() {
    if (this.data.userInfo.gender === 2) {
      // calculate = (638 + (9.6 * this.data.weight) + (1.8 * this.data.height) - (4.7 * this.data.age)) *    this.data.activity
      this.setData({
        calculate: parseInt((638 + (9.6 * this.data.weight) + (1.8 * this.data.height) - (4.7 * this.data.age)) * this.data.activity)
      })
    } else if (this.data.userInfo.gender === 1) {
      // calculate = (66 + (13.7 * this.data.weight) + (5 * this.data.height) - (6.8 * this.data.age)) *    this.data.activity
      this.setData({
        calculate: parseInt((66 + (13.7 * this.data.weight) + (5 * this.data.height) - (6.8 * this.data.age)) * this.data.activity)
      })
    }
  },
  //校验问卷选项
  verifyquestion:function(){
    
    if(this.data.height===""){
      wx.showModal({
        title: '提示',
        content: '请输入身高',
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
      return false;
    }else if(this.data.weight===""){
      wx.showModal({
        title: '提示',
        content: '请输入体重',
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
      return false;
    }else if(this.data.age===""){
      wx.showModal({
        title: '提示',
        content: '请输入年龄',
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
      return false;
    }else{
      return true;
    }
  }
})