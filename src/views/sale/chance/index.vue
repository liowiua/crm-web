<template>
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button type="danger" size="mini" class="btn-add" @click="handleDelete()" style="margin-left: 10px">删除</el-button>
      <el-button type="primary" size="mini" class="btn-add" @click="handleAssign()" style="margin-left: 10px">指派经理</el-button>
      <el-button  size="mini" class="btn-add" @click="handleUpdate()" style="margin-left: 10px">编辑</el-button>
      <el-button size="mini" class="btn-add" @click="handleAdd()" style="margin-left: 20px">添加</el-button>

    </el-card>
    <el-scrollbar class="table-container">
      <el-table ref="flashTable"
                :data="list"
                style="width: 1500px;"
                @selection-change="handleSelectionChange"
                v-loading="listLoading" border>
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column label="编号" width="100" align="center">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column label="机会来源" width="140" align="center">
          <template slot-scope="scope">{{scope.row.chanceSource}}</template>
        </el-table-column>
        <el-table-column label="客户名称" width="140" align="center">
          <template slot-scope="scope">{{scope.row.customerName}}</template>
        </el-table-column>
        <el-table-column label="成功几率" width="100" align="center">
          <template slot-scope="scope">{{scope.row.cgjl}}</template>
        </el-table-column>
        <el-table-column label="概要" width="140" align="center">
          <template slot-scope="scope">{{scope.row.overview}}</template>
        </el-table-column>
        <el-table-column label="开发经理" width="140" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.assignMan != null">{{scope.row.assignMan}}</span>
            <span v-else>未指派经理</span>
          </template>
        </el-table-column>
        <el-table-column label="联系人" width="140" align="center">
          <template slot-scope="scope">{{scope.row.linkMan}}</template>
        </el-table-column>
        <el-table-column label="联系号码" width="140" align="center">
          <template slot-scope="scope">{{scope.row.linkPhone}}</template>
        </el-table-column>
        <el-table-column label="描述" width="140" align="center">
          <template slot-scope="scope">{{scope.row.description}}</template>
        </el-table-column>
      </el-table>
    </el-scrollbar>
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper"
        :current-page.sync="chanceQuery.pageCount"
        :page-size="chanceQuery.pageSize"
        :page-sizes="[5,10,15]"
        :total="total">
      </el-pagination>
    </div>
    <el-dialog
      title="营销机会管理"
      :visible.sync="dialogVisible"
      width="40%">
      <el-form :model="saleChance"
               ref="saleChanceForm"
               label-width="150px" size="small">
        <el-form-item label="客户名称：">
          <el-input v-model="saleChance.customerName" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="机会来源：">
          <el-input v-model="saleChance.chanceSource" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="联系人：">
          <el-input v-model="saleChance.linkMan" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="联系电话：">
          <el-input v-model="saleChance.linkPhone" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="概要：">
          <el-input v-model="saleChance.overview" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="成功几率(%)：">
          <el-input v-model="saleChance.cgjl" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="机会描述：">
          <el-input v-model="saleChance.description" 
                    type="textarea"
                    :rows="2"
                    placeholder="请输入内容"
                    style="width: 250px"></el-input>
        </el-form-item>

        <!-- 添加机会子菜单，指派选择框 -->
        <!-- <el-form-item label="指派给：">
          <el-select v-model="value" placeholder="请选择" > 
            <el-option
              v-for="item in optionsList2"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item> -->
        
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleDialogConfirm()" size="small">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="指派营销机会"
      :visible.sync="AssigndialogVisible"
      width="40%">
      <el-form :model="saleChance"
               ref="saleChanceForm"
               label-width="150px" size="small">
        <!-- 添加机会子菜单，指派选择框 -->
        <el-form-item label="指派给：">
          <el-select v-model="manager" placeholder="请选择" > 
            <el-option
              v-for="item in optionsList"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleAssignDialogConfirm()" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>

  import {saleChanceSelectAllList,deleteChance, createChance, updateChance} from '@/api/sale';//
  import {fetchManagerList} from '@/api/user';


  import {formatDate} from '@/utils/date';

  const defaultchanceQuery = {
    pageCount: 1,
    pageSize: 10,
    customerId: null,
    name: null
  };
  const defaultChancePromotion = {
    id: null,
    title: null,
    startDate: null,
    endDate: null,
    status: 0
  };
  export default {
    name: 'saleChanceList',
    data() {
      return {
        chanceQuery: Object.assign({}, defaultchanceQuery),
        list: null,
        total: null,
        listLoading: false,
        dialogVisible: false,
        AssigndialogVisible:false,
        saleChance: Object.assign({}, defaultChancePromotion),
        isEdit: false,
        multipleSelection: [],
        manager:null,

        optionsList: [],
        

      }
    },
    created() {
      this.getList();
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
        this.chanceQuery = Object.assign({}, defaultchanceQuery);
      },
      handleSearchList() {
        this.chanceQuery.pageCount = 1;
        this.getList();
      },
      handleSizeChange(val) {
        this.chanceQuery.pageCount = 1;
        this.chanceQuery.pageSize = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.chanceQuery.pageCount = val;
        this.getList();
      },
      handleSelectionChange(val) {  //wait
      this.multipleSelection = val;
    },
      handleAdd() {
        this.dialogVisible = true;
        this.isEdit = false;
        this.saleChance = Object.assign({},defaultChancePromotion);
      },

      handleDelete() {
        this.$confirm('是否要删除该客户?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteChance(this.multipleSelection[0].id).then(() => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.getList();
          });
        });
      },
      handleAssign() {
        this.AssigndialogVisible = true;
      },
      handleUpdate() {
        if(this.onlySelectOne()){
          this.dialogVisible = true;
          this.isEdit = true;
          this.saleChance.customerName = this.multipleSelection[0].customerName;
          this.saleChance.chanceSource = this.multipleSelection[0].chanceSource;
          this.saleChance.linkMan = this.multipleSelection[0].linkMan;
          this.saleChance.linkPhone = this.multipleSelection[0].linkPhone;
          this.saleChance.overview = this.multipleSelection[0].overview;
          this.saleChance.cgjl = this.multipleSelection[0].cgjl;
          this.saleChance.description = this.multipleSelection[0].description;
          this.saleChance.id = this.multipleSelection[0].id;
        }

      },
      handleAssignDialogConfirm() {
        this.$confirm('是否要确认?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          updateChance({id:this.multipleSelection[0].id,assignMan:this.manager}).then(() => {
          this.$message({
            message: '指派成功！',
            type: 'success'
          });
          this.AssigndialogVisible =false;
          this.getList();
        })
        })
      },
      handleDialogConfirm() {
        this.$confirm('是否要确认?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (this.isEdit) {
            console.log(this.multipleSelection[0]);
            updateChance(this.saleChance).then(() => {
              this.$message({
                message: '修改成功！',
                type: 'success'
              });
              this.dialogVisible =false;
              this.getList();
            })
          } else {
            createChance(this.saleChance).then(() => {
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
      linkmanManagement() {
      if(this.onlySelectOne())        
        this.$router.push({path:'/customer/linkman', query:{id: this.multipleSelection[0].id}})
    },
      onlySelectOne(){
      if(this.multipleSelection.length > 1){
        this.$message.error('只能选择一个角色哦');
        return false;
      }
      if(this.multipleSelection.length === 0){
        this.$message.error('你还没有选择任何角色');
        return false;
      }
      return true;
    },
      handleSelectSession(index,row){
        this.$router.push({path:'/sms/selectSession',query:{saleChanceId:row.id}})
      },
      getList() {
        this.listLoading = false;   //waitting  code  true
        fetchManagerList().then(response => {
          this.optionsList = response.data;
        });
        saleChanceSelectAllList(this.chanceQuery).then(response => {
          this.listLoading = false;
           this.list = response.data.list;
           this.total = response.data.total;
        });
        
        }
    }
  }
</script>
<style>
  .el-table{
    padding-bottom: 17px;
  }
</style>


