Page({
  data: {
    items: [
      { name: '1', value: '长时间坐着，很少运动', checked: 'true'},
      { name: '2', value: '偶尔运动散步，一周1-3次' },
      { name: '3', value: '持续运动，一周3-5次' },
      { name: '4', value: '热爱运动，一周6-7次' },
      { name: '5', value: '重度劳力工作' }
    ]
  },
  calshow: function (e) {
    wx.navigateTo({
      url: '/pages/foodcal/foodcal',
    })
  },
  radioChange(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
  }
})