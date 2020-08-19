import request from './request'
class User {
  async getUserList(params){
    return await request({
      method: 'get',
      url: 'user/getUserList',
      params
    })
  }
  async deleteUser(data){
    return await request({
      method: 'post',
      url: 'user/deleteUser',
      data
    })
  }
  async adminLogin(name,password){
    return await request({
      method: 'post',
      url: 'user/adminLogin',
      data: {
        name,
        password
      }
    })
  }
}

export default new User()
