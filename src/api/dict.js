import request from '@/utils/request'
export function fetchList(params) {
  return request({
    url:'/datadic/selectAll',
    method:'get',
    params:params
  })
}

export function createDatadic(data) {
  return request({
    url:'/datadic/insertDatadic',
    method:'post',
    data:data
  })
}


export function updateDatadic(data) {
  return request({
    url:'/datadic/updateDatadic',
    method:'post',
    data:data
  })
}
export function deleteDatadic(id) {
  return request({
    url:'/datadic/deleteDatadicById',
    method:'post',
    data:"id=" + id
  })
}


