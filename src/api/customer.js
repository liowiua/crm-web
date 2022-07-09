import request from '@/utils/request'
export function fetchList(data) {
  return request({
    url:'/customers/selectByParams',
    method:'post',
    data:data
  })
}

export function fetchLossList(data) {
  return request({
    url:'/customerLoss/selectByParams',
    method:'post',
    data:data
  })
}

export function fetchReprievePlaList(params) {
  return request({
    url:'/customerReprieve/selectByLossId',
    method:'get',
    params:params
  })
}

export function deleteCustomer(id) {
  return request({
    url:'/customers/delete',
    method:'post',
    data:"customerId=" + id
  })
}

export function deleteReprieve(params) {
  return request({
    url:'/customerReprieve/deleteById',
    method:'get',
    params:params
  })
}


export function createCustomer(data) {
  return request({
    url:'/customers/insert',
    method:'post',
    data:data
  })
}

export function createReprieve(data) {
  return request({
    url:'/customerReprieve/insertCustomerReprieve',
    method:'post',
    data:data
  })
}


export function updateCustomer(data) {
  return request({
    url:'/customers/edit',
    method:'post',
    data:data
  })
}
export function updateReprieve(data) {
  return request({
    url:'/customerReprieve/updateCustomerReprieve',
    method:'post',
    data:data
  })
}
export function updateLossState(params) {
  return request({
    url:'/customerLoss/updateCustomerLossStateById',
    method:'get',
    params:params
  })
}

