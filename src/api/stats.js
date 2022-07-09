import request from '@/utils/request'
export function countCustomerMakeList() {
    return request({
        url:'/customers/countCustomerMake',
        method:'get',
    })
}
export function customerLossList(params) {
    return request({
        url:'/customerLoss/customerLossAnalysis',
        method:'get',
        params:params
    })
}
export function selectCustomerContributionByParams(params) {
    return request({
        url:'/customers/selectCustomerContributionByParams',
        method:'post',
        params:params
    })
}
