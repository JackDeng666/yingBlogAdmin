import request from './request'

class Statistics {
  async getSiteInfo(){
    return await request({
      method: 'get',
      url: 'statistics/getSiteInfo'
    })
  }
  async updateOwnerInfo(data){
    return await request({
      method: 'post',
      url: 'statistics/updateOwnerInfo',
      data
    })
  }
}

export default new Statistics()
