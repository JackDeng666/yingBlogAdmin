import request from './request'
class Message {
  async getMessageList(params){
    return await request({
      url: 'message/getMessageList',
      method: 'get',
      params
    })
  }
  async deleteMessage(data){
    return await request({
      url: 'message/deleteMessage',
      method: 'post',
      data
    })
  }
}
export default new Message()
