import request from '@/utils/request'
export function fetchList(data) {
  return request({
    url:'/customerServe/selectByParams',
    method:'post',
    data:data
  })
}

export function createService(data) {
  return request({
    url:'/customerServe/insertCustomerServe',
    method:'post',
    data:data
  })
}


export function assignService(data) {
  return request({
    url:'/customerServe/assignedCustomerServe',
    method:'post',
    data:data
  })
}

export function handleService(data) {
  return request({
    url:'/customerServe/procedCustomerServe',
    method:'post',
    data:data
  })
}

export function feedBackService(data) {
  return request({
    url:'/customerServe/feedBackCustomerServe',
    method:'post',
    data:data
  })
}

export function archivedService(data) {
  return request({
    url:'/customerServe/archivedCustomerServe',
    method:'post',
    data:data
  })
}

