<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <el-button
          style="float:right"
          type="primary"
          @click="handleSearchList()"
          size="small">
          查询搜索
        <i class="el-icon-search"></i>
        </el-button>
        <el-button
          style="float:right;margin-right: 15px"
          @click="handleResetSearch()"
          size="small">
          重置
        </el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="chanceQuery" size="small" label-width="140px">
          <el-form-item>
            <el-input 
              v-model="chanceQuery.name" 
              class="input-width" 
              placeholder="角色名" 
              clearable>
            </el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button type="primary" 
        size="mini" 
        class="btn-add"  
        @click="handleAuthenticate()" 
        style="margin-left: 10px">
        <i class="fa fa-shield" aria-hidden="true"></i>
        授权
      </el-button>
      <el-button 
        size="mini" 
        class="btn-add" 
        @click="handleAdd()" 
        style="margin-left: 20px">
        添加
      </el-button>
    </el-card>
    <el-scrollbar class="table-container">
      <el-table ref="roleTable"
                :data="list"
                style="width: 100%;"
                @selection-change="handleSelectionChange"
                v-loading="listLoading" border>
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column label="编号" width="100" align="center">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column label="角色名称" align="center">
          <template slot-scope="scope">{{scope.row.roleName}}</template>
        </el-table-column>
        <el-table-column label="角色备注" width="140" align="center">
          <template slot-scope="scope">{{scope.row.roleRemark}}</template>
        </el-table-column>
        <el-table-column label="创建时间" width="140" align="center">
          <template slot-scope="scope">{{scope.row.createDate | formatDate}}</template>
        </el-table-column>
        <el-table-column label="修改时间" width="140" align="center">
          <template slot-scope="scope">{{scope.row.updateDate | formatDate}}</template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button size="mini"
                       type="text"
                       @click="handleUpdate(scope.$index, scope.row)">
              编辑
            </el-button>
            <el-button size="mini"
                       type="danger"
                       @click="handleDelete(scope.$index, scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-scrollbar>
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper"
        :current-page.sync="chanceQuery.pageNum"
        :page-size="chanceQuery.pageSize"
        :page-sizes="[5,10,15]"
        :total="total">
      </el-pagination>
    </div>
    <el-dialog
      title="角色管理-角色添加"
      :visible.sync="dialogVisible"
      width="40%">
      <el-form :model="rolePromotion"
               ref="rolePromotionForm"
               label-width="150px" size="small">
        <el-form-item label="角色名称：">
          <el-input v-model="rolePromotion.roleName" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="角色备注：">
          <el-input v-model="rolePromotion.roleRemark" style="width: 250px"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleDialogConfirm()" size="small">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="授权管理"
      :visible.sync="authenticateDialogVisible"
      width="40%"
      >
      <el-form :model="rolePromotion"
               ref="rolePromotionForm"
               label-width="150px" size="small"
               v-if="dialogKey">
        <el-checkbox-group :key="dialogKey" v-model="authenticationList">
          <el-checkbox v-for="item in menuList" :key="item.id" :checked="item.checked" :label="item.title" ></el-checkbox>
        </el-checkbox-group>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeAuthenticateDialog" size="small">取 消</el-button>
        <el-button type="primary" @click="handleAuthenticateDialogConfirm()" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import {fetchList, updateStatus, deleteRole, createRole, updateRole, fetchModuleList} from '@/api/role';
  import {getListByRole, authenticate} from '@/api/module';//
  import {formatDate} from '@/utils/date';

  const defaultchanceQuery = {
    pageNum: 1,
    pageSize: 10,
    customerId: null,
    name: null
  };
  const defaultRolePromotion = {
    id: null,
    title: null,
    startDate: null,
    endDate: null,
    status: 0
  };
  const defaultPaginateVal = {
    pageNum: 1,
    pageSize: 30,
  };
  export default {
    name: 'rolePromotionList',
    data() {
      return {
        chanceQuery: Object.assign({}, defaultchanceQuery),
        list: null,
        total: null,
        listLoading: false,
        dialogVisible: false,
        dialogKey: true,
        authenticateDialogVisible: false,
        authenticatedId: null,
        rolePromotion: Object.assign({}, defaultRolePromotion),
        isEdit: false,
        multipleSelection: [],
        menuList: [],
        authenticationList:[]
      }
    },
    created() {
      this.getList();
    },
    filters: {
      formatDate(time) {
        if (time == null || time === '') {
          return 'N/A';
        }
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd')
      }
    },
    methods: {
      handleResetSearch() {
        this.chanceQuery = Object.assign({}, defaultchanceQuery);
      },
      handleSearchList() {
        this.chanceQuery.pageNum = 1;
        this.getList();
      },
      handleSizeChange(val) {
        this.chanceQuery.pageNum = 1;
        this.chanceQuery.pageSize = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.chanceQuery.pageNum = val;
        this.getList();
      },
      handleAdd() {
        this.dialogVisible = true;
        this.isEdit = false;
        this.rolePromotion = Object.assign({},defaultRolePromotion);
      },
      //授权开始
      handleAuthenticate() {
          // this.$message.error('你还没有选择任何角色');
        if(this.multipleSelection.length > 1){
          this.$message.error('只能选择一个角色哦');
          return
        }
        if(this.multipleSelection.length === 0){
          this.$message.error('你还没有选择任何角色');
          return
        }
                //查询选中的角色的权限列表
        getListByRole(this.multipleSelection[0].id).then(res => {
          this.authenticationList = res.data.list.map(i => {return i.id});
        });

        //从后端获取所有权限
        this.getModule();

        this.authenticateDialogVisible = true;
      },

      handleSelectionChange(val) {  //wait
        this.multipleSelection = val;
      },

      handleStatusChange(index, row) {
        this.$confirm('是否要修改该状态?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          updateStatus(row.id, {status: row.status}).then(() => {
            this.$message({
              type: 'success',
              message: '修改成功!'
            });
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消修改'
          });
          this.getList();
        });
      },
      handleDelete(index, row) {
        this.$confirm('是否要删除该客户?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteRole(row.id).then(() => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.getList();
          });
        });
      },
      handleUpdate(index, row) {
        this.dialogVisible = true;
        this.isEdit = true;
        this.rolePromotion = Object.assign({},row);
      },

      handleDialogConfirm() {
        this.$confirm('是否要确认?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (this.isEdit) {
            updateRole(this.rolePromotion).then(() => {
              this.$message({
                message: '修改成功！',
                type: 'success'
              });
              this.dialogVisible =false;
              this.getList();
            })
          } else {
            createRole(this.rolePromotion).then(() => {
              this.$message({
                message: '添加成功！',
                type: 'success'
              });
              this.dialogVisible =false;
              this.getList();
            })
          }
        })
      },

      handleAuthenticateDialogConfirm(){
        this.$confirm('是否要确认?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.authenticationList = this.authenticationList.map(item => {
            let t = this.menuList.filter(i => {
              return i.title == item;
            });
            return t[0].id;
          });
          authenticate(this.multipleSelection[0].id, this.authenticationList).then(() => {
            this.$message({
              message: '修改成功！',
              type: 'success'
            });
            this.closeAuthenticateDialog();
            this.getList();
          })
        })
      },

      getList() {
        this.listLoading = true;   //waitting  code  true
        fetchList(this.chanceQuery).then(response => {
          this.listLoading = false;
          this.list = response.data.list;
          this.total = response.data.total;
        });
      },

      getModule() {
        fetchModuleList(defaultPaginateVal).then(response => {
          this.menuList = response.data.list.filter(i => {return i.title !== null} );
          this.menuList = this.menuList.map(i => {
            if(this.authenticationList.filter(item => {return item == i.id}).length > 0){
              i.checked = true;
            }else{
              i.checked = false;
            }
              return i;
          });
          this.authenticationList = [];
          
        });
      },

      forceRender(){
        this.dialogKey += 1;
        console.log(this.dialogKey);
      },

      closeAuthenticateDialog(){
        this.authenticateDialogVisible = false;
      }
    }
  }
</script>
<style>

.el-table{
  padding-bottom: 17px;
}
</style>


