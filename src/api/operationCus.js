import request from '@/utils/request'

export function fetchContactList(params) {
  return request({
    url:'/communicate/selectByCId',
    method:'get',
    params:params
  })
}
export function fetchLinkmanList(params) {
  return request({
    url:'/customerLinkman/selectByCId',
    method:'get',
    params:params
  })
}
export function fetchOrderList(params) {
  return request({
    url:'/customerOrder/selectById',
    method:'get',
    params:params
  })
}

export function fetchLossList(data) {
  return request({
    url:'/customerLoss/selectByParams',
    method:'post',
    data:data
  })
}

export function createLinkman(data) {
  return request({
    url:'/customerLinkman/insertLinkman',
    method:'post',
    data:data
  })
}
export function createOrder(data) {
  return request({
    url:'/customerOrder/insertOrder',
    method:'post',
    data:data
  })
}

export function createContact(data) {
  return request({
    url:'/communicate/insertCommunication',
    method:'post',
    data:data
  })
}

export function updateLinkman(data) {
  return request({
    url:'/customerLinkman/updateLinkman',
    method:'post',
    data:data
  })
}

export function deleteLinkman(id) {
  return request({
    url: '/customerLinkman/deleteLinkmanById',
    method: 'post',
    data:"id="+ id
  })
}


