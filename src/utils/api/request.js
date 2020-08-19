import axios from 'axios'
import {Loading} from 'element-ui'
import {API_URL} from '../config'

let loading                 //加载动画
function startLoading(){
  loading = Loading.service({ fullscreen: true })
}
function stopLoading(){
  loading.close()
}

const instance = axios.create({
  baseURL: API_URL
})

const request = async json => {
  let {method,url,data,params} = json
  startLoading()
  let result
  if(method === 'get'){
    result = await instance({
      method,
      url,
      params,
      headers: {
        authorization: sessionStorage.getItem('jdAdminToken')
      }
    })
  } else {
    result = await instance({
      method,
      url,
      data,
      headers: {
        authorization: sessionStorage.getItem('jdAdminToken')
      }
    })
  }
  stopLoading()
  return result
}

export default request
