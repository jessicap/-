Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    cal: '',
    items: [{
        name: '0',
        value: '维持体重',
        bgColor: 'transparent',
        chose:false

      },
      {
        name: '1',
        value: '减去脂肪',
        bgColor: 'transparent',
        chose: false

      },
      {
        name: '2',
        value: '增加肌肉',
        bgColor: 'transparent',
        chose: false

      }
    ],
    placeitems: [{
        name: '0',
        value: '家 / 食堂',
        bgColor: 'transparent',
      chose: false

      },
      {
        name: '1',
        value: '便 利 店',
        bgColor: 'transparent',
        chose: false

      },
      {
        name: '2',
        value: '附近美食',
        bgColor: 'transparent',
        chose: false

      }
    ],
    classify: '',
    place: "",
    imgurl:""
  },
  onLoad: function() {
    this.onQuery()
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }

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

    // this.setData({
    //   cal: wx.getStorageSync('cal')
    // })
    // console.log("用户卡路里："+this.data.cal)
  },
  choiceClassify: function(e) {
    var that = this
    var bgcolor = that.data.items[e.target.dataset.classify].bgColor;
    // var disable=that.data.items[e.target.dataset.classify].disabled;
    var bgColor = bgcolor == 'transparent' ? '#ff9999' : 'transparent';
    // var disabled = disable == false ? true : false;
    // var classnamechange = "items[" + e.target.dataset.classify + "].classname";
    var stylechange = "items[" + e.target.dataset.classify + "].bgColor";
    var chose = "items[" + e.target.dataset.classify + "].chose";

    for (var i = 0; i < that.data.items.length; i++) {
      //  var disabledchange = "items[" + i+ "].disabled";
      var otherchange = "items[" + i + "].bgColor";
      var otherchosechange = "items[" + i + "].chose";
      if (i != e.target.dataset.classify) {
        this.setData({
          [otherchange]: 'transparent',
          [otherchosechange]:false
        })
      }
    }

    // 设置背景颜色数据


    this.setData({
      // [classnamechange]:'chose'
      [stylechange]: bgColor,
      [chose]:true

    })
    console.log(e.target.dataset.classify);
    console.log(that.data.items);
  },
  choicePlace: function(e) {
    var that = this
    var bgcolor = that.data.placeitems[e.target.dataset.classify].bgColor;
    // var disable=that.data.items[e.target.dataset.classify].disabled;
    var bgColor = bgcolor == 'transparent' ? '#66cccc' : 'transparent';
    // var disabled = disable == false ? true : false;
    // var classnamechange = "items[" + e.target.dataset.classify + "].classname";
    var stylechange = "placeitems[" + e.target.dataset.classify + "].bgColor";
    var chose = "placeitems[" + e.target.dataset.classify + "].chose";

    for (var i = 0; i < that.data.placeitems.length; i++) {
      //  var disabledchange = "items[" + i+ "].disabled";
      var otherchange = "placeitems[" + i + "].bgColor";
      var otherchosechange = "placeitems[" + i + "].chose";
      if (i != e.target.dataset.classify) {
        this.setData({
          [otherchange]: 'transparent',
          [otherchosechange]: false
        })
      }
    }

    // 设置背景颜色数据


    this.setData({
      // [classnamechange]:'chose'
      [stylechange]: bgColor,
      [chose]: true
    })
    console.log(e.target.dataset.classify);
    console.log(that.data.placeitems);
  },
  //查询这个人每日所需卡路里
  onQuery: function() {
    const db = wx.cloud.database()
    // 查询当前用户所有的 users
    db.collection('users').where({
      _openid: this.data.openid
    }).get({
      success: res => {
        this.setData({
          cal: res.data[0].calculate
        })
        console.log('[数据库] [查询记录] 成功: ', res.data[0].calculate)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
  },
  //今天吃什么
  whatsEatToday:function(e){
    var that=this
    var classify=that.data.items
    var choseClassify
    var place= that.data.placeitems
    var chosePlace
    var cal=that.data.cal
    for(var i = 0; i < classify.length; i++) {
     if(classify[i].chose){
       choseClassify=classify[i].name;
     }
    }
    for (var j = 0; j < place.length; j++) {
      if (place[j].chose) {
        chosePlace = place[j].name;
      }
    }
    if(choseClassify==undefined||chosePlace==undefined){
      wx.showModal({
        title: '',
        content: '请选择分类标签',
      })
    }
   console.log(choseClassify+" 和 "+chosePlace)
    wx.cloud.getTempFileURL({
      fileList: ['cloud://cloud-3fe4cb.636c-cloud-3fe4cb/my-image.jpg'],
      success: res => {
        // fileList 是一个有如下结构的对象数组
        // [{
        //    fileID: 'cloud://xxx.png', // 文件 ID
        //    tempFileURL: '', // 临时文件网络链接
        //    maxAge: 120 * 60 * 1000, // 有效期
        // }]
        console.log(res.fileList[0].tempFileURL)
        this.setData({
          imgurl:res.fileList[0].tempFileURL
        })
        console.log(this.data.imgurl);

      },
      fail: console.error
    })
  


  }
});