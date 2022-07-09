import request from '@/utils/request'

export function fetchList(params) {
  return request({
    url: '/admin/role/list',
    method: 'get',
    params: params
  })
}

export function fetchModuleList(params) {
  return request({
    url: 'admin/module/list',
    method: 'get',
    params: params
  })
}

export function createRole(data) {
  return request({
    url: '/admin/role/create',
    method: 'post',
    data: data
  })
}

export function updateRole(data) {
  return request({
    url: '/admin/role/update',
    method: 'post',
    data: data
  })
}

export function updateStatus(id, params) {
  return request({
    url: '/admin/updateStatus/',
    method: 'post',
    params: params
  })
}

export function deleteRole(id) {
  return request({
    url: '/admin/role/delete',
    method: 'post',
    data: "id=" + id
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
