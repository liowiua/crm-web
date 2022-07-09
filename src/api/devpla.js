import request from '@/utils/request'

export function fetchList(data) {
  return request({
    url: '/cusDevPlan/selectByParams',
    method: 'post',
    data: data
  })
}

export function findCustomer(params) {
  return request({
    url: '/cusDevPlan/selectById',
    method: 'get',
    params: params
  })
}

export function fetchDevPlaList(params) {
  return request({
    url: '/cusDevPlan/selectBySaleChanceId',
    method: 'get',
    params: params
  })
}

export function createDevPlaItem(data) {
  return request({
    url: '/cusDevPlan/insertCusDevPlan',
    method: 'post',
    data: data
  })
}

export function updateDevPlaItem(data) {
  return request({
    url: '/cusDevPlan/updateCusDevPlan',
    method: 'post',
    data: data
  })
}

export function updateUser(data) {
  return request({
    url: '/admin/user/update',
    method: 'post',
    data: data
  })
}

export function updateStatus(params) {
  return request({
    url: '/saleChance/updateDevResult/',
    method: 'get',
    params: params
  })
}

export function deleteDevPla(params) {
  return request({
    url: '/cusDevPlan/deleteById',
    method: 'get',
    params:params
  })
}

export function getRoleByAdmin(id) {
  return request({
    url: '/admin/role/' + id,
    method: 'get'
  })
}

export function fetchRoleList() {
  return request({
    url: '/admin/role/list',
    method: 'get'
  })
}

export function allocRole(id, roles) {
  return request({
    url: '/admin/user/allocate',
    method: 'post',
    data: {
      id,
      roles
    }
  })
}
