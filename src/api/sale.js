import request from '@/utils/request'
export function saleChanceSelectAllList(params) {
    return request({
        url:'/saleChance/selectAllByPage',
        method:'get',
        params:params
    })
}

export function saleDevplaSelectAllList(params) {
    return request({
        url:'/saleChance/selectAllByPage',
        method:'get',
        params:params
    })
}

// export function updateStatus(id,params) {
//     return request({
//         url:'/flash/update/status/'+id,
//         method:'post',
//         params:params
//     })
// }
export function deleteChance(id) {
  return request({
    url:'/saleChance/delectASaleChance',
    method:'post',
    data:"saleChanceId=" + id
  })
}
export function createChance(data) {
  return request({
    url:'/saleChance/addSaleChance',
    method:'post',
    data:data
  })
}
export function updateChance(data) {
  return request({
    url:'/saleChance/editSaleChance',
    method:'post',
    data:data
  })
}
