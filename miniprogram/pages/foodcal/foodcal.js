
// 引用百度地图微信小程序JSAPI模块 
var bmap = require('../../libs/bmap-wx.js');
var wxMarkerData = [];
// 在页面中定义插屏广告
let interstitialAd = null


Page({
  data: {
    img: "../../images/gobg.png",
    wechat: "../../images/wechat.png",
    quan: "../../images/quan.png",
    contact:'../../images/contact.png',
    inputValue: "",
    maskHidden: false,
    name: "",
    touxiang: "",
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
    totalCal:'',
  },
  makertap: function (e) {
    var that = this;
    var id = e.markerId;
    that.showSearchInfo(wxMarkerData, id);
    that.changeMarkerColor(wxMarkerData, id);
  },
  onLoad: function() {
    // 在页面onLoad回调事件中创建插屏广告实例
    if (wx.createInterstitialAd) {
      interstitialAd = wx.createInterstitialAd({
        adUnitId: 'adunit-81914257bdb6997f'
      })
      interstitialAd.onLoad(() => { })
      interstitialAd.onError((err) => { })
      interstitialAd.onClose(() => { })
    }
  
    var that = this;
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
         // console.log(res.authSetting['scope.werun'])
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo,
                name:res.userInfo.nickName
              })
              wx.downloadFile({
                url: res.userInfo.avatarUrl, //仅为示例，并非真实的资源
                success: function (res) {
                  // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
                  if (res.statusCode === 200) {
                    console.log(res, "reererererer")
                    that.setData({
                      touxiang: res.tempFilePath
                    })
                  }
                }
              })
            }

            
          })

          // wx.getWeRunData({
          //   success(res){
          //     const encryptedData=res.encryptedData
          //     console.log(encryptedData)
          //     console.log(res.iv)
          //   }
          // })
        } else{
          wx.navigateTo({
            url: '../index/index',
          })
        }
       
       
      }
    })

    
  },
  //创建海报
  createposter:function(res){
    wx.navigateTo({
      url: '../poster/poster',
    })
  },
  //将canvas转换为图片保存到本地，然后将图片路径传给image图片的src
  createNewImg: function () {
    var that = this;
    var context = wx.createCanvasContext('mycanvas');
    context.setFillStyle("#ffffff")
    context.fillRect(0, 0, 375, 667)
    var path = "/images/gobg.png";
    //将模板图片绘制到canvas,在开发工具中drawImage()函数有问题，不显示图片
    //不知道是什么原因，手机环境能正常显示
    context.drawImage(path, 0, 0, 375, 183);
    var path1 = that.data.touxiang;
    console.log(path1, "path1")
    //将模板图片绘制到canvas,在开发工具中drawImage()函数有问题，不显示图片
    var path2 = "/images/txquan.png";
    var path3 = "/images/heise.png";
    var path4 = "/images/wenziBg.png";
    var path5 = "/images/wenxin.png";
    var path6 = "/images/xiaochengxu-code.jpg";
    var date=new Date();
    var year=date.getFullYear();
    var month=date.getMonth()+1;
    var day=date.getDate();
    console.log("year"+year);
  
    context.drawImage(path2, 126, 196, 120, 120);
    //不知道是什么原因，手机环境能正常显示
    // context.save(); // 保存当前context的状态

    var name = that.data.name;
    //绘制名字
    context.setFontSize(24);
    context.setFillStyle('#333333');
    context.setTextAlign('center');
    context.fillText(name, 185, 360);
    context.stroke();
    //绘制一起吃面标语
    // context.setFontSize(14);
    // context.setFillStyle('#333333');
    // context.setTextAlign('center');
    // context.fillText("邀请你一起去今日食啥", 185, 370);
    // context.stroke();
    //绘制验证码背景
    // context.drawImage(path3, 48, 390, 280, 84);
    // //绘制code码
    // context.setFontSize(40);
    // context.setFillStyle('#ffe200');
    // context.setTextAlign('center');
    // context.fillText(that.data.code, 185, 435);
    // context.stroke();
    //绘制左下角文字背景图
    context.drawImage(path4, 65, 380, 260, 140);
    context.setFontSize(14);
    context.setFillStyle('#333');
    context.setTextAlign('left');
    context.fillText(year+"年"+month+"月"+day+"日，"+"我吃了", 100, 415);
    context.stroke();
    context.setFontSize(14);
    context.setFillStyle('#333');
    context.setTextAlign('left');
    console.log(this.data.breakfast);
    var food = this.data.breakfast[0].foodname + "、" + this.data.lunch[0].foodname + "、" + this.data.dinner[0].foodname;
    if(food.length>14){
      food=food.substr(0,13)+"..."
    }
    context.fillText(food, 100, 435);
    context.stroke();
    context.setFontSize(14);
    context.setFillStyle('#333');
    context.setTextAlign('left');
    context.fillText("不知道今天吃什么吗？", 100, 455);
    context.stroke();
    context.setFontSize(14);
    context.setFillStyle('#333');
    context.setTextAlign('left');
    context.fillText("来看看这个神器吧！", 100, 475);
    context.stroke();
    //绘制右下角扫码提示语
    context.drawImage(path6, 150, 540, 80, 80);
    //context.drawImage(path5, 185, 578, 90, 25);
    context.setFontSize(12);
    context.setFillStyle('#333');
    context.setTextAlign('left');
    context.fillText("扫码或长按图片进入小程序", 115, 640);
    context.stroke();
    //绘制头像
    context.arc(186, 256, 50, 0, 2 * Math.PI) //画出圆
    context.strokeStyle = "#ffe200";
    context.clip(); //裁剪上面的圆形
    context.drawImage(path1, 136, 206, 100, 100); // 在刚刚裁剪的园上画图
    context.draw();
    //将生成好的图片保存到本地，需要延迟一会，绘制期间耗时
    setTimeout(function () {
      wx.canvasToTempFilePath({
        canvasId: 'mycanvas',
        success: function (res) {
          var tempFilePath = res.tempFilePath;
          that.setData({
            imagePath: tempFilePath,
            canvasHidden: true
          });
        },
        fail: function (res) {
          console.log(res);
        }
      });
    }, 200);
  },
  //点击保存到相册
  baocun: function () {
    var that = this
    wx.saveImageToPhotosAlbum({
      filePath: that.data.imagePath,
      success(res) {
        wx.showModal({
          content: '图片已保存到相册，赶紧晒一下吧~',
          showCancel: false,
          confirmText: '好的',
          confirmColor: '#333',
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定');
              /* 该隐藏的隐藏 */
              that.setData({
                maskHidden: false
              })
            }
          }, fail: function (res) {
            console.log(11111)
          }
        })
      }
    })
  },
  //点击生成
  formSubmit: function (e) {
    var that = this;
    this.setData({
      maskHidden: false
    });
    wx.showToast({
      title: '生成中...',
      icon: 'loading',
      duration: 1000
    });
    setTimeout(function () {
      wx.hideToast()
      that.createNewImg();
      that.setData({
        maskHidden: true
      });
    }, 1000)
  },
  onShow: function () {
    var that = this;
    wx.getUserInfo({
      success: res => {
        console.log(res.userInfo, "huoqudao le ")
        this.setData({
          name: res.userInfo.nickName,
        })
        wx.downloadFile({
          url: res.userInfo.avatarUrl, //仅为示例，并非真实的资源
          success: function (res) {
            // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
            if (res.statusCode === 200) {
              console.log(res, "reererererer")
              that.setData({
                touxiang: res.tempFilePath
              })
            }
          }
        })
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
      //  console.log('[数据库] [查询记录] 成功: ', res.data[0]._openid)
        console.log('[数据库] [查询记录] 成功: ', res.data[0].calculate)
        console.log('[数据库] [查询记录] 成功: ', res.data[0].nickName)
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
  
    // 在适合的场景显示插屏广告
    if (interstitialAd) {
      interstitialAd.show().catch((err) => {
        console.error(err)
      })
    }
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
  // //跳转重新填写问卷页面
  // requestionshow: function (res) {
  //   wx.navigateTo({
  //     url: '/pages/re-question/re-question',
  //   })

  // },
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