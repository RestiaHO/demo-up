/**
 * 搜索相关
 */
import request from '../utils/request.js'
/**
 * 联想建议
*/
export const getSearchSuggestions = query => {
  return request({
    method: 'GET',
    url: '/v1_0/suggestion',
    params: {
      q: query
    }
  })
}
/**
 * 搜索结果
*/
export const getSearchResult = params => {
  return request({
    method: 'GET',
    url: '/v1_0/search',
    params
  })
}
