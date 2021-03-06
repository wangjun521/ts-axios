import { isDate, isPlainObject, isURLSearchParams } from './util'


interface UrlOrigin {
  protocol: string
  host: string
}

function encode(val: string): string {
  return encodeURIComponent(val)
    .replace(/%40/, '@')
    .replace(/&3A/ig, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/ig, ',')
    .replace(/%20/g, '+')
    .replace(/%5B/ig, '[')
    .replace(/%5D/ig, ']')
}

export function buildUrl(url: string, params?: any, paramsSerializer?: (params: any) => string): string {
  if (!params) {
    return url
  }
  let serializedParams
  if (paramsSerializer) {
    serializedParams = paramsSerializer(serializedParams)
  } else if (isURLSearchParams(params)) {
    serializedParams = params.toString()
  } else {
    const parts: string[] = []
    Object.keys(params).forEach(key => {
      const val = params[key]
      if (val === null || typeof val === 'undefined') {
        return
      }
      let values = []
      if (Array.isArray(val)) {
        values = val
        key += '[]'
      } else {
        values = [val]
      }
      values.forEach(val => {
        if (isDate(val)) {
          val = val.toISOString()
        } else if (isPlainObject(val)) {
          val = JSON.stringify(val)
        }
        parts.push(`${encode(key)}=${encode(val)}`)
      })
    })
    serializedParams = parts.join('&')
  }
  if (serializedParams) {
    const markIndex = serializedParams.indexOf('#')
    if (markIndex > -1) {
      url = url.slice(0, markIndex)
    }
    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams
  }
  return url
}

export function isAbsoluteURL(url: string): boolean {
  return /(^[a-z][a-z\d\+\-\.]*:)?\/\//i.test(url)
}

export function combineURL(baseURL: string, relativeRUL?: string): string {
  return relativeRUL? baseURL.replace(/\/+$/, '') + '/' + relativeRUL.replace(/^\/+/, '') : baseURL
}

export function isSameOrigin(requestURL: string): boolean {
  const parsedOrigin = resolveURL(requestURL)
  return parsedOrigin.protocol === currentOrigin.protocol && parsedOrigin.host === currentOrigin.host
}

const urlParsingNode = document.createElement('a')
const currentOrigin = resolveURL(window.location.href)

function resolveURL(url: string): UrlOrigin {
  urlParsingNode.setAttribute('href', url)
  const { protocol, host } = urlParsingNode
  return {
    protocol,
    host
  }
}
