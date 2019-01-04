Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    cal: '',
    hiddencontent:true,
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

    if ( chosePlace === '0') {
     
      this.onQueryTodayBreakfast();
      this.onQueryTodayLunch();
      this.onQueryTodayDinner();
      this.onQueryTodayAddmeal();
      this.caltotal(this.data.breakfastCal);
      console.log("点击按钮"+this.data.breakfastCal);
      // if (this.data.breakfastCal != '' && this.data.lunchCal != '' && this.data.dinnerCal != '' && this.data.addmealCal!=''){
        this.setData({
          hiddencontent: false
        })
      // }
     
    }


  },
  //查询这个人今日早餐
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
        obj1.foodname = res.data[random1].foodName
        obj1.foodNum = res.data[random1].foodNum
        obj1.foodCal = res.data[random1].foodCal
        obj2.foodname = res.data[random2].foodName
        obj2.foodNum = res.data[random2].foodNum
        obj2.foodCal = res.data[random2].foodCal
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
  //查询这个人今日午餐
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
        obj1.foodname = res.data[random1].foodName
        obj1.foodNum = res.data[random1].foodNum
        obj1.foodCal = res.data[random1].foodCal
        obj2.foodname = res.data[random2].foodName
        obj2.foodNum = res.data[random2].foodNum
        obj2.foodCal = res.data[random2].foodCal
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
  //查询这个人今日晚餐
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
        obj1.foodname = res.data[random1].foodName
        obj1.foodNum = res.data[random1].foodNum
        obj1.foodCal = res.data[random1].foodCal
        obj2.foodname = res.data[random2].foodName
        obj2.foodNum = res.data[random2].foodNum
        obj2.foodCal = res.data[random2].foodCal
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
  //查询这个人今日加餐
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
     
        obj1.foodname = res.data[random1].foodName
        obj1.foodNum = res.data[random1].foodNum
        obj1.foodCal = res.data[random1].foodCal
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