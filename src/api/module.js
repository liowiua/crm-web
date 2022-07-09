import request from '@/utils/request'

export function fetchList(params) {
  return request({
    url: 'admin/module/list',
    method: 'get',
    params: params
  })
}

export function hiddenModule(params) {
  return request({
    url: 'admin/module/hide',
    method: 'get',
    params: params
  })
}

export function getListByRole(id) {
  return request({
    url: '/admin/role/queryAllPermission',
    method: 'get',
    params: {roleid:id}
  })
}
export function authenticate(id, modules) {
  return request({
    url: '/admin/role/authenticate',
    method: 'post',
    data: {
      id,
      modules
    }
  })
}
