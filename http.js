import axios from 'axios';

// axios.defaults.baseURL = 'https://cloudappapi.myspzh.com';
// axios.defaults.baseURL = 'https://cloudapptestapi.myspzh.com';
axios.defaults.baseURL = 'http://192.168.0.212:9002';
axios.defaults.timeout = 10000;
// 拦截器
axios.interceptors.response.use((response) => {
  if(response.hasOwnProperty("data") && typeof response.data == "object"){
  	if (response.data.code === 200) {// 成功
  	  return Promise.resolve(response)
  	} else {
      return Promise.resolve(response)
    }
  } else {
    return Promise.resolve(response)
  }

}, (error) => {
  // 请求取消 不弹出
  // 请求错误时做些事
  return Promise.reject(error)
})

export default axios;