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
        <el-form :inline="true" :model="query" size="small" label-width="140px">
          <el-form-item>
            <el-input 
              v-model="query.name" 
              class="input-width" 
              placeholder="用户名" 
              clearable>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-select v-model="query.userType" 
              class="input-width" 
              placeholder="用户类型" clearable>
              <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id">
            </el-option>
            </el-select>  
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button type="danger" size="mini" class="btn-add" @click="handleSelectSession(scope.$index, scope.row)" style="margin-left: 10px">删除</el-button>
      <el-button size="mini" class="btn-add" @click="handleAdd()" style="margin-left: 20px">添加</el-button>
    </el-card>
    <el-scrollbar class="table-container">
      <el-table ref="flashTable"
                :data="list"
                style="width: 100%;"
                v-loading="listLoading" border>
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column label="编号" width="80" align="center">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column label="用户名称" width="90" align="center">
          <template slot-scope="scope">{{scope.row.userName}}</template>
        </el-table-column>
        <el-table-column label="真实姓名" width="80" align="center">
          <template slot-scope="scope">{{scope.row.trueName}}</template>
        </el-table-column>
        <el-table-column label="用户邮箱" width="150" align="center">
          <template slot-scope="scope">{{scope.row.email}}</template>
        </el-table-column>
        <el-table-column label="用户号码" width="120" align="center">
          <template slot-scope="scope">{{scope.row.phone}}</template>
        </el-table-column>
        <el-table-column label="创建时间" width="120" align="center">
          <template slot-scope="scope">{{scope.row.createDate | formatDate}}</template>
        </el-table-column>
        <el-table-column label="是否启用" width="80" align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.isValid"
              active-color="#4abf8a"
              inactive-color="#f78989"
              :active-value="1"
              :inactive-value="0"
              @change="handleStatusChange(scope.$index, scope.row)">
            </el-switch>
            </template>
        </el-table-column>
        <el-table-column label="操作"  align="center">
          <template slot-scope="scope">
            <el-button size="mini"
                       @click="handleAllocate(scope.row.id)">
              分配角色
            </el-button>
            <el-button size="mini"
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
        :current-page.sync="query.pageNum"
        :page-size="query.pageSize"
        :page-sizes="[5,10,15]"
        :total="total">
      </el-pagination>
    </div>
    <el-dialog
      title="用户管理-添加用户"
      :visible.sync="dialogVisible"
      width="40%">
      <el-form :model="User"
               ref="UserForm"
               label-width="150px" size="small">
        <el-form-item label="用户名：">
          <el-input v-model="User.userName" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="密码：">
          <el-input v-model="User.password" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="真实姓名：">
          <el-input v-model="User.trueName" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="邮箱：">
          <el-input v-model="User.email" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="手机号：">
          <el-input v-model="User.phone" style="width: 250px"></el-input>
        </el-form-item>
        
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleDialogConfirm()" size="small">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="分配角色"
      :visible.sync="AllocateDialogVisible"
      width="40%">
      <el-form :model="User"
               ref="UserForm"
               label-width="150px" size="small">
        <el-form-item label="角色：">
          <el-select v-model="allcatedRoleList" 
              multiple
              filterable
              allow-create
              default-first-option
              placeholder="请选择角色"> 
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="AllocateDialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleAllocateConfirm()" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import {fetchList, deleteUser, createUser, updateUser, fetchRoleList, allocRole} from '@/api/user';
  import {formatDate} from '@/utils/date';

  const defaultQuery = {
    pageNum: 1,
    pageSize: 10,
    userType: null,
    name: null,

  };
  const defaultUser = {
    id: null,
    title: null,
    startDate: null,
    endDate: null,
    status: 0
  };
  export default {
    name: 'defaultUserList',
    data() {
      return {
        query: Object.assign({}, defaultQuery),
        list: null,
        total: null,
        listLoading: false,
        dialogVisible: false,
        AllocateDialogVisible: false,
        User: Object.assign({}, defaultUser),
        isEdit: false,
        allcatedRoleList: [],
        roleList: [],
        allcatedId: null
      }
    },
    created() {
      this.getList();
      //获取所有角色
      this.getRoleList();
    },
    filters: {
      formatActiveStatus(row) {
        let nowTime = new Date().getTime();
        if (nowTime >= row.startDate && nowTime <= row.endDate) {
          return '客户进行中';
        } else if (nowTime > row.endDate) {
          return '客户已结束';
        } else {
          return '客户未开始';
        }
      },
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
        this.query = Object.assign({}, defaultQuery);
      },
      handleSearchList() {
        this.query.pageNum = 1;
        this.getList();
      },
      handleSizeChange(val) {
        this.query.pageNum = 1;
        this.query.pageSize = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.query.pageNum = val;
        this.getList();
      },
      //添加用户
      handleAdd() {
        this.dialogVisible = true;
        this.isEdit = false;
        this.User = Object.assign({},defaultUser);
      },

      handleStatusChange(index, row) {
        this.$confirm('是否要修改该状态?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          console.log(row);
          updateUser(row).then(() => {
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
          deleteUser(row.id).then(() => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.getList();
          });
        });
      },
      //更新角色
      handleUpdate(index, row) {
        this.dialogVisible = true;
        this.isEdit = true;
        this.User = Object.assign({},row);
      },
      handleAllocate(index) {
        this.allcatedId = index;
        this.AllocateDialogVisible = true;
        this.isEdit = true;
      },
      handleDialogConfirm() {
        this.$confirm('是否要确认?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (this.isEdit) {
            allocRole(this.User).then(() => {
              this.$message({
                message: '修改成功！',
                type: 'success'
              });
              this.dialogVisible =false;
              this.getList();
            })
          } else {
            createUser(this.User).then(() => {
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
      handleAllocateConfirm() {
        this.$confirm('是否要确认?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          allocRole(this.allcatedId,this.allcatedRoleList).then(() => {
            this.$message({
              message: '修改成功！',
              type: 'success'
            });
            this.AllocateDialogVisible =false;
            this.getList();
          })
        })
      },
      handleSelectSession(index,row){
        this.$router.push({path:'/sms/selectSession',query:{UserId:row.id}})
      },
      getList() {
        this.listLoading = true;   //waitting  code  true
        fetchList(this.query).then(response => {
          this.listLoading = false;
          this.list = response.data.list;
          this.total = response.data.total;
        });
      },
      //获取角色列表
      getRoleList(){
        fetchRoleList().then(response => {
          this.roleList = response.data.list;
        });
      }
    }
  }
</script>
<style></style>


