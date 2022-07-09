import request from '@/utils/request'

export function login(userName, password) {
  return request({
    url: '/user/login',
    method: 'post',
    data: {
      userName,
      password
    }
  })
}

export function getInfo() {
  return request({
    url: '/user/info',
    method: 'post',
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

export function fetchList(params) {
  return request({
    url: '/admin/user/listAll',
    method: 'get',
    params: params
  })
}

export function createUser(data) {
  return request({
    url: '/admin/user/create',
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

export function updateStatus(id, params) {
  return request({
    url: '/admin/updateStatus/' + id,
    method: 'post',
    params: params
  })
}

export function deleteUser(id) {
  return request({
    url: '/admin/delete/' + id,
    method: 'post'
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
export function fetchManagerList() {
  return request({
    url: '/admin/user/selectAllManager',
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
