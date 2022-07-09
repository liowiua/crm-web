import { asyncRouterMap, constantRouterMap } from '@/router/index';

//判断是否有权限访问该菜单
function hasPermission(menus, route) {     //检查某路由是否存在后端菜单中，若存在，修改之，返回布尔值
  if (route.name) {
    let currMenu = getMenu(route.name, menus);
    if (currMenu!=null) {
      //设置菜单的标题、图标和可见性
      if (currMenu.title != null && currMenu.title !== '') {
        route.meta.title = currMenu.title;    
      }
      // if (currMenu.icon != null && currMenu.title !== '') {
      //   route.meta.icon = currMenu.icon;
      // }
      if(currMenu.hidden!=null){
        route.hidden = currMenu.hidden;
      }
      if (currMenu.sort != null && currMenu.sort !== '') {
        route.sort = currMenu.sort;
      }
      return true;
    } else {
      route.sort = 0;
      if (route.hidden !== undefined && route.hidden === true) {
        route.sort=-1;
        return true;
      } else {
        return false;
      }
    }
  } else {
    return true
  }
}

//根据路由名称获取菜单
function getMenu(routerName, menus) {     //检查某路由是否存在后端菜单中
  for (let i = 0; i < menus.length; i++) {
    let menu = menus[i];
    if (menu.name === routerName) {

      return menu;
    }
  }
  return null;
}

//对菜单进行排序
// function sortRouters(accessedRouters) {
//   for (let i = 0; i < accessedRouters.length; i++) {
//     let router = accessedRouters[i];
//     if(router.children && router.children.length > 0){
//       router.children.sort(compare("sort"));
//     }
//   }
//   accessedRouters.sort(compare("sort"));
// }

//降序比较函数
// function compare(p){
//   return function(m,n){
//     let a = m[p];
//     let b = n[p];
//     return b - a;
//   }
// }

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers;
      state.routers = constantRouterMap.concat(routers);
    }
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      return new Promise(resolve => {
        const { menus } = data;
        // const { username } = data;
        const accessedRouters = asyncRouterMap.filter(v => {   //过滤存在后端菜单中的路由
          //admin帐号直接返回所有菜单
          // if(username==='admin') return true;
          if (hasPermission(menus, v)) {      //menus为后端菜单列表，判断前端的V是否在里面，简要修改
            if (v.children && v.children.length > 0) {
              v.children = v.children.filter(child => {
                if (hasPermission(menus, child)) {
                  return child
                }
                return false;
              });
              return v   //二级菜单存在与否都返回v
            } else {
              return v
            }
          }
          return false;
        });
        //对菜单进行排序
        // sortRouters(accessedRouters);
        // commit('SET_ROUTERS', asyncRouterMap);

        commit('SET_ROUTERS', accessedRouters);
        resolve();
      })
    }
  }
};

export default permission;

