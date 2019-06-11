// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db=cloud.database()
const _=db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  console.log(wxContext.OPENID)
  try{
    return await db.collection('users').doc(wxContext.OPENID).update({
      data:{
        age: event.age,
        height: event.height,
        weight: event.weight,
        activity: event.activity,
        calculate: event.calculate
      }
    })
  }catch(e){
    console.error(e)
  }


 

  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}