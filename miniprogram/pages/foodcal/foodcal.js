
// 引用百度地图微信小程序JSAPI模块 
var bmap = require('../../libs/bmap-wx.js');
var wxMarkerData = [];
Page({
  data: {
    markers: [],
    latitude: '',
    longitude: '',
    placeData: {},
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    cal: '',
    hiddencontent:true,
    hiddenmap: true,
    items: [{
        name: '0',
        value: '维持体重',
        bgColor: 'transparent',
        chose: false

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
    sports: [{
      name:'游泳45分钟',
      cal:'300'
    },
     {
        name: '散步1小时',
        cal: '255'
    }, 
    {
        name: '跑步30分钟',
        cal: '240'
      },
      {
        name: '跳操30分钟',
        cal: '170'
      }],
    classify: '',
    place: "",
    imgurl: "",
    breakfast: [],
    lunch: [],
    dinner: [],
    addmeal: [],
    breakfastCal:'',
    lunchCal:'',
    dinnerCal:'',
    addmealCal:'',
    totalCal:''
  },
  makertap: function (e) {
    var that = this;
    var id = e.markerId;
    that.showSearchInfo(wxMarkerData, id);
    that.changeMarkerColor(wxMarkerData, id);
  },
  onLoad: function() {
   
    this.onQuery()
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }
    wx.showShareMenu({
      withShareTicket: true
    })
   
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          console.log(res.authSetting['scope.userInfo'])
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
            }
          })
        } else{
          wx.navigateTo({
            url: '../index/index',
          })
        }
       
       
      }
    })

    
  },
  givemoney:function(){
    wx.navigateToMiniProgram({
      appId: 'wx18a2ac992306a5a4',
      path: 'pages/apps/largess/detail?id=5gSRro5yY08%3D',
      extraData: {
        foo: 'bar'
      },
      envVersion: 'release',
      success(res) {
        console.log("跳转给赞小程序");
      }
    })
  },
  gotodianping: function () {
    wx.navigateToMiniProgram({
      appId: 'wx623b509bd76c3e71',
      path: '',
      extraData: {
        foo: 'bar'
      },
      envVersion: 'release',
      success(res) {
        console.log("跳转大众小程序");
      }
    })
  },
  showSearchInfo: function (data, i) {
    var that = this;
    console.log(data[i]);
    that.setData({
      placeData: {
        title: '名称：' + data[i].title + '\n',
        address: '地址：' + data[i].address + '\n',
        telephone: '电话：' + data[i].telephone
      }
    });
  },
  changeMarkerColor: function (data, i) {
    var that = this;
    var markers = [];
    for (var j = 0; j < data.length; j++) {
      if (j == i) {
        // 此处需要在相应路径放置图片文件 
        data[j].iconPath = "../../img/marker_yellow.png";
      } else {
        // 此处需要在相应路径放置图片文件 
        data[j].iconPath = "../../img/marker_red.png";
      }
      markers[j] = data[j];
    }
    that.setData({
      markers: markers
    });
  },
  //获取经纬度
  getLocation: function (e) {

    var that = this;
    // 新建百度地图对象 
    var BMap = new bmap.BMapWX({
      ak: 'tFZzwkWBKBgLsgsxvK5GQ95F'
    });
    var fail = function (data) {
      console.log(data)
    };
    var success = function (data) {
      wxMarkerData = data.wxMarkerData;
      console.log(wxMarkerData);
      that.setData({
        markers: wxMarkerData
      });
      that.setData({
        latitude: wxMarkerData[0].latitude
      });
      that.setData({
        longitude: wxMarkerData[0].longitude
      });
    }
    // 发起POI检索请求 
    BMap.search({
      "query": '美食',
      fail: fail,
      success: success,
      // 此处需要在相应路径放置图片文件 
      iconPath: '../../img/marker_red.png',
      // 此处需要在相应路径放置图片文件 
      iconTapPath: '../../img/marker_red.png'
    });
    // wx.getLocation({
    //   type: 'wgs84',
    //   success: function (res) {
    //     // console.log(res);
    //     var latitude = res.latitude
    //     var longitude = res.longitude
    //     //弹框
    //     // wx.showModal({
    //     //   title: '当前位置',
    //     //   content: "纬度:" + latitude + ",经度:" + longitude,
    //     // })
    //   }
    // })
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
  whatsEatToday: function(e) {
    var that = this
    var classify = that.data.items
    var choseClassify
    var place = that.data.placeitems
    var chosePlace
    var cal = that.data.cal
    for (var i = 0; i < classify.length; i++) {
      if (classify[i].chose) {
        choseClassify = classify[i].name;
      }
    }
    for (var j = 0; j < place.length; j++) {
      if (place[j].chose) {
        chosePlace = place[j].name;
      }
    }
    if ( chosePlace == undefined) {
      wx.showModal({
        title: '',
        content: '请选择分类标签',
      })
    }
    console.log(choseClassify + " 和 " + chosePlace)
    //图片显示路径地址
    // wx.cloud.getTempFileURL({
    //   fileList: ['cloud://cloud-3fe4cb.636c-cloud-3fe4cb/my-image.jpg'],
    //   success: res => {
    //     // fileList 是一个有如下结构的对象数组
    //     // [{
    //     //    fileID: 'cloud://xxx.png', // 文件 ID
    //     //    tempFileURL: '', // 临时文件网络链接
    //     //    maxAge: 120 * 60 * 1000, // 有效期
    //     // }]
    //     console.log(res.fileList[0].tempFileURL)
    //     this.setData({
    //       imgurl:res.fileList[0].tempFileURL
    //     })
    //     console.log(this.data.imgurl);

    //   },
    //   fail: console.error
    // })

    //如果选择家/食堂
    if ( chosePlace === '0') {
     
      this.onQueryTodayBreakfast();
      this.onQueryTodayLunch();
      this.onQueryTodayDinner();
      this.onQueryTodayAddmeal();
     // this.caltotal(this.data.breakfastCal);
      console.log("点击按钮"+this.data.breakfastCal);
      // if (this.data.breakfastCal != '' && this.data.lunchCal != '' && this.data.dinnerCal != '' && this.data.addmealCal!=''){
        this.setData({
          hiddencontent: false,
          hiddenmap: true
        })
      // }
     
    } 
    //如果选择便利店
    else if (chosePlace === '1'){
      this.onQueryTodayBreakfastStore();
      this.onQueryTodayLunchStore();
      this.onQueryTodayDinnerStore();
      this.onQueryTodayAddmealStore();
      this.setData({
        hiddencontent: false,
        hiddenmap: true
      })
    }
    //如果选择附近美食
    else if (chosePlace === '2'){
    //  this.getLocation();
    //   this.setData({
    //     hiddenmap: false,
    //     hiddencontent:true
    //   })
    //   console.log(this.data.hiddenmap)
    this.gotodianping();
    }


  },
  //查询这个人今日早餐--在家
  onQueryTodayBreakfast: function() {
    var max, max1
    var random1, random2, random3
    var arr = new Array();
    var randomarr = new Array();
    var breakfastCal

    const db = wx.cloud.database()
    const _ = db.command
    // 查询当前用户所有的 users
    db.collection('foods').where(_.or([{
        foodType: '早eat'
      },
      {
        foodType: '早drink'
      }
    ])).get({
      success: res => {
        // this.setData({
        //   cal: res.data[0].calculaste
        // })
        max = res.data.length;
        console.log(this.createRandom(this.randomArr(max), 3))
        randomarr = this.createRandom(this.randomArr(max), 3)
        random1 = randomarr[0];
        random2 = randomarr[1];
        random3 = randomarr[2];


        var obj1 = new Object();
        var obj2 = new Object();
        var obj3 = new Object();
        obj1.foodid = res.data[random1].foodId
        obj1.foodname = res.data[random1].foodName
        obj1.foodNum = res.data[random1].foodNum
        obj1.foodCal = res.data[random1].foodCal
        obj2.foodid = res.data[random2].foodId
        obj2.foodname = res.data[random2].foodName
        obj2.foodNum = res.data[random2].foodNum
        obj2.foodCal = res.data[random2].foodCal
        obj3.foodid = res.data[random3].foodId
        obj3.foodname = res.data[random3].foodName
        obj3.foodNum = res.data[random3].foodNum
        obj3.foodCal = res.data[random3].foodCal
        arr.push(obj1)
        arr.push(obj2)

        arr.push(obj3)
        breakfastCal = obj1.foodCal + obj2.foodCal + obj3.foodCal
       
        //  return arr

        this.setData({
          breakfast: arr,
          breakfastCal:breakfastCal
        })
        console.log(arr);
        console.log('[数据库] [查询记录] 成功: ', res)
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
  //查询这个人今日早餐--便利店
  onQueryTodayBreakfastStore: function () {
    var max, max1
    var random1, random2, random3
    var arr = new Array();
    var randomarr = new Array();
    var breakfastCal

    const db = wx.cloud.database()
    const _ = db.command
    // 查询当前用户所有的 users
    db.collection('store').where(_.or([{
      foodType: '早eat'
    },
    {
      foodType: '早drink'
    }
    ])).get({
      success: res => {
        // this.setData({
        //   cal: res.data[0].calculaste
        // })
        max = res.data.length;
        console.log(max);
        console.log(this.createRandom(this.randomArr(max), 3))
        randomarr = this.createRandom(this.randomArr(max), 3)
        random1 = randomarr[0];
        random2 = randomarr[1];
        random3 = randomarr[2];


        var obj1 = new Object();
        var obj2 = new Object();
        var obj3 = new Object();
        obj1.foodid = res.data[random1].foodId
        obj1.foodname = res.data[random1].foodName
        obj1.foodNum = res.data[random1].foodNum
        obj1.foodCal = res.data[random1].foodCal
        obj2.foodid = res.data[random2].foodId
        obj2.foodname = res.data[random2].foodName
        obj2.foodNum = res.data[random2].foodNum
        obj2.foodCal = res.data[random2].foodCal
        obj3.foodid = res.data[random3].foodId
        obj3.foodname = res.data[random3].foodName
        obj3.foodNum = res.data[random3].foodNum
        obj3.foodCal = res.data[random3].foodCal
        arr.push(obj1)
        arr.push(obj2)

        arr.push(obj3)
        breakfastCal = obj1.foodCal + obj2.foodCal + obj3.foodCal

        //  return arr

        this.setData({
          breakfast: arr,
          breakfastCal: breakfastCal
        })
        console.log(arr);
        console.log('[数据库] [查询记录] 成功: ', res)
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
  //查询这个人今日午餐--在家
  onQueryTodayLunch: function() {
    var max, max1
    var random1, random2, random3
    var arr = new Array();
    var randomarr = new Array();
    var lunchCal
    const db = wx.cloud.database()
    const _ = db.command
    // 查询当前用户所有的 users
    db.collection('foods').where({
      foodType: '中晚eat'
    }).get({
      success: res => {
        // this.setData({
        //   cal: res.data[0].calculaste
        // })
        max = res.data.length;
        console.log(this.createRandom(this.randomArr(max), 3))
        randomarr = this.createRandom(this.randomArr(max), 3)
        random1 = randomarr[0];
        random2 = randomarr[1];
        random3 = randomarr[2];


        var obj1 = new Object();
        var obj2 = new Object();
        var obj3 = new Object();
        obj1.foodid = res.data[random1].foodId
        obj1.foodname = res.data[random1].foodName
        obj1.foodNum = res.data[random1].foodNum
        obj1.foodCal = res.data[random1].foodCal
        obj2.foodid = res.data[random2].foodId
        obj2.foodname = res.data[random2].foodName
        obj2.foodNum = res.data[random2].foodNum
        obj2.foodCal = res.data[random2].foodCal
        obj3.foodid = res.data[random3].foodId
        obj3.foodname = res.data[random3].foodName
        obj3.foodNum = res.data[random3].foodNum
        obj3.foodCal = res.data[random3].foodCal
        arr.push(obj1)
        arr.push(obj2)

        arr.push(obj3)
        lunchCal = obj1.foodCal + obj2.foodCal + obj3.foodCal
        //  return arr

        this.setData({
          lunch: arr,
          lunchCal:lunchCal
        })
        console.log(arr);
        console.log('[数据库] [查询记录] 成功: ', res)
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
  //查询这个人今日午餐--便利店
  onQueryTodayLunchStore: function () {
    var max, max1
    var random1, random2, random3
    var arr = new Array();
    var randomarr = new Array();
    var lunchCal
    const db = wx.cloud.database()
    const _ = db.command
    // 查询当前用户所有的 users
    db.collection('store').where({
      foodType: '中晚eat'
    }).get({
      success: res => {
        // this.setData({
        //   cal: res.data[0].calculaste
        // })
        max = res.data.length;
        console.log(this.createRandom(this.randomArr(max), 1))
        randomarr = this.createRandom(this.randomArr(max), 1)
        random1 = randomarr[0];
       


        var obj1 = new Object();
        obj1.foodid = res.data[random1].foodId
        obj1.foodname = res.data[random1].foodName
        obj1.foodNum = res.data[random1].foodNum
        obj1.foodCal = res.data[random1].foodCal
     
        arr.push(obj1)
   
        lunchCal = obj1.foodCal

        this.setData({
          lunch: arr,
          lunchCal: lunchCal
        })
        console.log(arr);
        console.log('[数据库] [查询记录] 成功: ', res)
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
  //查询这个人今日晚餐--在家
  onQueryTodayDinner: function() {
    var max, max1
    var random1, random2, random3
    var arr = new Array();
    var randomarr = new Array();
    var dinnerCal
    const db = wx.cloud.database()
    const _ = db.command
    // 查询当前用户所有的 users
    db.collection('foods').where({
      foodType: '中晚eat'
    }).get({
      success: res => {
        // this.setData({
        //   cal: res.data[0].calculaste
        // })
        max = res.data.length;
        console.log(this.createRandom(this.randomArr(max), 3))
        randomarr = this.createRandom(this.randomArr(max), 3)
        random1 = randomarr[0];
        random2 = randomarr[1];
        random3 = randomarr[2];


        var obj1 = new Object();
        var obj2 = new Object();
        var obj3 = new Object();
        obj1.foodid = res.data[random1].foodId
        obj1.foodname = res.data[random1].foodName
        obj1.foodNum = res.data[random1].foodNum
        obj1.foodCal = res.data[random1].foodCal
        obj2.foodid = res.data[random2].foodId
        obj2.foodname = res.data[random2].foodName
        obj2.foodNum = res.data[random2].foodNum
        obj2.foodCal = res.data[random2].foodCal
        obj3.foodid = res.data[random3].foodId
        obj3.foodname = res.data[random3].foodName
        obj3.foodNum = res.data[random3].foodNum
        obj3.foodCal = res.data[random3].foodCal
        arr.push(obj1)
        arr.push(obj2)

        arr.push(obj3)
        dinnerCal = obj1.foodCal + obj2.foodCal + obj3.foodCal
        //  return arr

        this.setData({
          dinner: arr,
          dinnerCal:dinnerCal
        })
        console.log(arr);
        console.log('[数据库] [查询记录] 成功: ', res)
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
  //查询这个人今日晚餐--便利店
  onQueryTodayDinnerStore: function () {
    var max, max1
    var random1, random2, random3
    var arr = new Array();
    var randomarr = new Array();
    var dinnerCal
    const db = wx.cloud.database()
    const _ = db.command
    // 查询当前用户所有的 users
    db.collection('store').where({
      foodType: '中晚eat'
    }).get({
      success: res => {
        // this.setData({
        //   cal: res.data[0].calculaste
        // })
        max = res.data.length;
        console.log(this.createRandom(this.randomArr(max), 1))
        randomarr = this.createRandom(this.randomArr(max), 1)
        random1 = randomarr[0];
    

        var obj1 = new Object();
        obj1.foodid = res.data[random1].foodId
        obj1.foodname = res.data[random1].foodName
        obj1.foodNum = res.data[random1].foodNum
        obj1.foodCal = res.data[random1].foodCal
       
        arr.push(obj1)
      
        dinnerCal = obj1.foodCal
        //  return arr

        this.setData({
          dinner: arr,
          dinnerCal: dinnerCal
        })
        console.log(arr);
        console.log('[数据库] [查询记录] 成功: ', res)
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
  //查询这个人今日加餐--在家
  onQueryTodayAddmeal: function () {
    var max, max1
    var random1, random2, random3
    var arr = new Array();
    var randomarr = new Array();
    var addmealCal
    const db = wx.cloud.database()
    const _ = db.command
    // 查询当前用户所有的 users
    db.collection('foods').where({
      foodType: '加餐'
    }).get({
      success: res => {
        // this.setData({
        //   cal: res.data[0].calculaste
        // })
        max = res.data.length;
        console.log(this.createRandom(this.randomArr(max), 2))
        randomarr = this.createRandom(this.randomArr(max), 2)
        random1 = randomarr[0];
        random2 = randomarr[1];
   


        var obj1 = new Object();
        var obj2 = new Object();
        obj1.foodid = res.data[random1].foodId
        obj1.foodname = res.data[random1].foodName
        obj1.foodNum = res.data[random1].foodNum
        obj1.foodCal = res.data[random1].foodCal
        obj2.foodid = res.data[random2].foodId
        obj2.foodname = res.data[random2].foodName
        obj2.foodNum = res.data[random2].foodNum
        obj2.foodCal = res.data[random2].foodCal
        
        arr.push(obj1)
        arr.push(obj2)
        addmealCal = obj1.foodCal+obj2.foodCal
        //  return arr

        this.setData({
          addmeal: arr,
          addmealCal: addmealCal
        })
        console.log(arr);
        console.log('[数据库] [查询记录] 成功: ', res)
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
  //跳转问卷页面
  questionshow: function (res) {
    wx.navigateTo({
      url: '/pages/question/question',
    })

  },
  //查询这个人今日加餐--便利店
  onQueryTodayAddmealStore: function () {
    var max, max1
    var random1, random2, random3
    var arr = new Array();
    var randomarr = new Array();
    var addmealCal
    const db = wx.cloud.database()
    const _ = db.command
    // 查询当前用户所有的 users
    db.collection('store').where({
      foodType: '加餐'
    }).get({
      success: res => {
        // this.setData({
        //   cal: res.data[0].calculaste
        // })
        max = res.data.length;
        console.log(this.createRandom(this.randomArr(max), 2))
        randomarr = this.createRandom(this.randomArr(max), 2)
        random1 = randomarr[0];
      



        var obj1 = new Object();
      
        obj1.foodid = res.data[random1].foodId
        obj1.foodname = res.data[random1].foodName
        obj1.foodNum = res.data[random1].foodNum
        obj1.foodCal = res.data[random1].foodCal
       

        arr.push(obj1)
       
        addmealCal = obj1.foodCal 
        //  return arr

        this.setData({
          addmeal: arr,
          addmealCal: addmealCal
        })
        console.log(arr);
        console.log('[数据库] [查询记录] 成功: ', res)
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
  caltotal:function(){
    this.setData({
      totalCal: this.data.breakfastCal + this.data.lunchCal + this.data.dinnerCal
    })
    
  },
  createRandom:function(arr,maxNum){
    var numArr = [];
    //最大的循环次数
    var arrLength = arr.length;
    for (var i = 0; i < arrLength; i++) {
      //获取arr的长度
      var Rand = arr.length
      //取出随机数 
      var number = Math.floor(Math.random() * arr.length); //生成随机数num
      //往新建的数组里面传入数值
      numArr.push(arr[number]);
      //传入一个删除一个，避免重复
      arr.splice(number, 1);
      if (arr.length <= arrLength - maxNum) {
        return numArr;
      }
    }
  },
  randomArr: function (maxcount){
    var arr = [];
    for (var i = 0; i < maxcount; i++) {
      arr.push(i)
    }
    return arr;
  }
  //产生不重复的随机数
  // createRandom: function(num, min, max) {
  //   let arr = [],
  //     res = [],
  //     newArr;
  //   for (let i = min; i < max; i++) {
  //     arr.push(i);
  //   }
  //   console.log(arr.length)
  //   newArr = Object.assign([], arr);
  //   for (let item = 0; item < arr.length; item++) {
  //     let ran = Math.floor(Math.random() * arr.length);
  //     console.log(ran);
  //     res.push(newArr.splice(ran, 1)[0]);
  //   }
  //   res.length = num;
  //   return res;
  // }
  
});