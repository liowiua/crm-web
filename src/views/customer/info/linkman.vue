<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div style="margin-top: 15px">
        <el-button circle 
        @click="back()" 
        style="margin-left: 20px">
        <i class="el-icon-back" ></i>
      </el-button>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>联系人列表</span>
      <el-button 
        size="mini" 
        class="btn-add"  
        @click="handleAdd()" 
        style="margin-left: 10px">
        <i class="fa fa-plus" aria-hidden="true"></i>
        添加联系人
      </el-button>
    </el-card>
    <el-scrollbar class="table-container">
      <el-table ref="roleTable"
                :data="linkmanList"
                style="width: 100%;"
                @selection-change="handleSelectionChange"
                v-loading="listLoading" border>
        <el-table-column label="联系人姓名" align="center">
          <template slot-scope="scope">{{scope.row.linkName}}</template>
        </el-table-column>
        <el-table-column label="性别" width="60px" align="center">
          <template slot-scope="scope">{{scope.row.sex}}</template>
        </el-table-column>
        <el-table-column label="职位" align="center">
          <template slot-scope="scope">{{scope.row.zhiwei}}</template>
        </el-table-column>
        <el-table-column label="座机" align="center">
          <template slot-scope="scope">{{scope.row.officePhone}}</template>
        </el-table-column>
        <el-table-column label="手机号码" width="110px" align="center">
          <template slot-scope="scope">{{scope.row.phone}}</template>
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.isValid == 1" type="success">有效</el-tag>
            <el-tag v-else-if="scope.row.isValid == 0" type="danger">无效</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="100px" align="center">
          <template slot-scope="scope">{{scope.row.ceateDate |formatDate}}</template>
        </el-table-column>
        <el-table-column label="更新时间"  align="center">
          <template slot-scope="scope">{{scope.row.updateDate |formatDate}}</template>
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
        :current-page.sync="linkmanQuery.pageCount"
        :page-size="linkmanQuery.pageSize"
        :page-sizes="[5,10,15]"
        :total="total">
      </el-pagination>
    </div>
    <el-dialog
      title="添加联系人"
      :visible.sync="dialogVisible"
      width="40%">
      <el-form :model="linkman"
               ref="linkmanForm"
               label-width="150px" size="small">
        <el-form-item label="联系人姓名">
          <el-input v-model="linkman.linkName" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-input v-model="linkman.sex" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="职位">
          <el-input v-model="linkman.zhiwei" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="座机">
          <el-input v-model="linkman.officePhone" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="手机">
          <el-input v-model="linkman.phone" style="width: 250px"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleDialogConfirm()" size="small">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>
<script>
  // import { createReprieve, updateReprieve, updateLossState, deleteReprieve} from '@/api/customer'; //, 
  import {createLinkman, deleteLinkman, fetchLinkmanList, updateLinkman} from '@/api/operationCus'; //, 
  import {formatDate} from '@/utils/date';

  const defaultLinkman = {
    cusId: null,
    linkName: null,
    sex: null,
    officePhone: null,
    phone: null,
    zhiwei: null
  };

  // 	"ceateDate": "",
	// "cusId": 0,
	// "id": 0,
	// "": 0,
	// "": "",
	// "": "",
	// "": "",
	// "": "",
	// "updateDate": "",
	// "": ""

  const defaultPlanItemQuery = {
    id: null,
    pageCount: 1,
    pageSize: 10,
  };
  const defaultLinkmanQuery = {
    cId:null,
    pageCount: 1,
    pageSize: 5
  };
  export default {
    name: 'linkman',
    data() {
      return {
        customer:{},
        linkman: Object.assign({}, defaultLinkman),
        dialogVisible: false,
        lossReason: null,
        total: null,
        cusInfo:{title:"ok"},
        linkmanList: [],
        linkmanQuery: Object.assign({}, defaultLinkmanQuery),
        planItemQuery: Object.assign({}, defaultPlanItemQuery),
        list: null,
        listLoading: false,
        multipleSelection: [],
      }
    },
    created() {
      this.id = this.$route.query.id;
      this.state = this.$route.query.state;
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
      handleSizeChange(val) {
        this.linkmanQuery.pageNum = 1;
        this.linkmanQuery.pageSize = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.linkmanQuery.pageNum = val;
        this.getList();
      },
      handleAdd() {
        this.dialogVisible = true;
        this.isEdit = false;
      },

      handleSelectionChange(val) {  //wait
        this.multipleSelection = val;
      },
      //确认对话框操作
      handleDialogConfirm() {
        this.$confirm('是否要确认?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (!this.isEdit) {
            this.linkman.cusId = this.id;
            createLinkman(this.linkman).then(() => {
              this.$message({
                message: '添加成功！',
                type: 'success'
              });
              this.dialogVisible =false;
              this.getList();
          })
          }else{
            updateLinkman(this.linkman).then(() => {
              this.$message({
                message: '修改成功！',
                type: 'success'
              });
              this.dialogVisible =false;
              this.getList();
            })
          }
        })
      },
      //
      //更新项
      handleUpdate(index, row) {
        this.dialogVisible = true;
        this.isEdit = true;
        this.linkman = row;
        delete this.linkman.ceateDate;
        delete this.linkman.updateDate;
      },

      handleDelete(index, row) {
        this.$confirm('是否要删除该计划?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteLinkman(row.id).then(() => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.getList();
          });
        });
      },

      //获取开发计划项列表
      getList() {
        this.listLoading = true;   //waitting  code  true
        this.linkmanQuery.cId = this.id;
        fetchLinkmanList(this.linkmanQuery).then(response => {
          this.linkmanList = response.data;
          this.listLoading = false;
        })
      },

      closeAuthenticateDialog(){
        this.authenticateDialogVisible = false;
      },

      back(){
        this.$router.back();
      }
    }
  }
</script>
<style lang="scss" scoped>
  .el-table{
    padding-bottom: 17px;
  }

</style>


