import { AxiosRequestConfig } from './types'

const defaults: AxiosRequestConfig = {
  method: 'get',
  timeout: 0,
  headers: {
    common: {
      Accept: 'application/json, text/plain, */*'
    }
  }
}

const methodsNoData = ['get', 'head', 'options', 'delete']

methodsNoData.forEach(method => {
  defaults.headers[method] = {}
})

const methodsWithData = ['post', 'patch', 'put']

methodsWithData.forEach(method => {
  defaults.headers[method] = {
    'Content-type': 'application/x-www-form-urlencoded'
  }
})

export default defaults
