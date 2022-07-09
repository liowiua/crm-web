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
        <el-form :inline="true" :model="serviceQuery" size="small" label-width="140px">
          <el-form-item>
            <el-input 
              v-model="serviceQuery.name" 
              class="input-width" 
              placeholder="客户名称" 
              clearable>
            </el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
    </el-card>
    <el-scrollbar class="table-container" >
      <el-table ref="flashTable"
                :data="list"
                style="width: 1500px;"
                @selection-change="handleSelectionChange"
                v-loading="listLoading" border>
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column label="编号" width="60" align="center">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column label="客户名" width="150" align="center">
          <template slot-scope="scope">{{scope.row.customer}}</template>
        </el-table-column>
        <el-table-column label="服务类型" width="80" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.serveType == 6" type="success">咨询</el-tag>
            <el-tag v-if="scope.row.serveType == 7" type="info">建议</el-tag>
            <el-tag v-if="scope.row.serveType == 8" type="danger">投诉</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="概要信息" width="200" align="center">
          <template slot-scope="scope">{{scope.row.overview}}</template>
        </el-table-column>
        <el-table-column label="创建人" width="100" align="center">
          <template slot-scope="scope">{{scope.row.createPeople}}</template>
        </el-table-column>
        <el-table-column label="创建时间" width="100" align="center">
          <template slot-scope="scope">{{scope.row.createDate | formatDate}}</template>
        </el-table-column>
        <el-table-column label="受理人" width="80"  align="center">
          <template slot-scope="scope">{{scope.row.assigner}}</template>
        </el-table-column>
        <el-table-column label="分配时间" width="100" align="center">
          <template slot-scope="scope">{{scope.row.assignTime | formatDate}}</template>
        </el-table-column>
        <el-table-column label="操作" width="90" align="center">
          <template slot-scope="scope">
            <el-button size="mini"
                      type="primary"
                      @click="handleAssign(scope.$index, scope.row)">
              分配
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="更新时间" width="100" align="center">
          <template slot-scope="scope">{{scope.row.updateDate | formatDate}}</template>
        </el-table-column>

      </el-table>

    </el-scrollbar>
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper"
        :current-page.sync="serviceQuery.pageCount"
        :page-size="serviceQuery.pageSize"
        :page-sizes="[10,20,30]"
        :total="total">
      </el-pagination>
    </div>
    <el-dialog
      title="服务分配"
      :visible.sync="dialogVisible"
      width="30%"
      class="info-dialog">
      <el-form :model="service"
        ref="serviceForm"
        size="small">
        <el-form-item label="受理人">
          <el-select v-model="service.assigner" placeholder="请选择" >
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
        <el-button type="primary" @click="handleDialogConfirm()" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {fetchList, deleteService, assignService} from '@/api/service';//
import {fetchManagerList} from '@/api/user';
import {formatDate} from '@/utils/date';

const defaultServiceQuery = {     //默认查询数据
  pageCount: 1,
  pageSize: 10,
  state:'fw_001',
  service: null,
  serveType: null,
};


const defaultService = {      //默认修改用户数据
  serviceName: null,
};
export default {
  name: 'serviceList',
  data() {
    return {
      serviceQuery: Object.assign({}, defaultServiceQuery),
      list: null,
      total: null,
      defaultServiceGrade: '',
      listLoading: false,
      dialogVisible: false,
      service: Object.assign({}, defaultService),
      isEdit: false,
      managerList: [],
      multipleSelection: [],
      optionsList: [],
      optionsList1: [{ value: '战略合作伙伴',label: '战略合作伙伴'}, //el-select选择器的选项
                        {value: '大客户',label: '大客户'},
                        {value: '重点开发客户',label: '重点开发客户'},
                        ],
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
      this.serviceQuery = Object.assign({}, defaultServiceQuery);
    },
    handleSearchList() {
      this.serviceQuery.pageNum = 1;
      this.getList();
    },
    handleSizeChange(val) {
      this.serviceQuery.pageNum = 1;
      this.serviceQuery.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.serviceQuery.pageNum = val;
      this.getList();
    },
    handleAdd() {
      this.dialogVisible = true;
      this.isEdit = false;
      this.service = Object.assign({},defaultService);
    },
    orderDetail() {
      if(this.onlySelectOne())
        this.$router.push({path:'/service/order', query:{id: this.multipleSelection[0].id}})
    },
    contactManagement() {
      if(this.onlySelectOne())
        this.$router.push({path:'/service/contact', query:{id: this.multipleSelection[0].id}})
    },
    linkmanManagement() {
      if(this.onlySelectOne())        
        this.$router.push({path:'/service/linkman', query:{id: this.multipleSelection[0].id}})
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
    handleDelete(index, row) {
      this.$confirm('是否要删除该客户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteService(row.id).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.getList();
        });
      });
    },
    handleAssign(index, row) {
      this.dialogVisible = true;
      this.isEdit = true;
      this.service = Object.assign({},row);
    },
    handleDialogConfirm() {
      this.$confirm('是否要确认?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log(this.service);
        assignService({id:this.service.id,assigner:this.service.assigner}).then(() => {
          this.$message({
            message: '修改成功！',
            type: 'success'
          });
          this.dialogVisible =false;
          this.getList();
        })
        
      })
    },
    handleSelectSession(index,row){
      this.$router.push({path:'/sms/selectSession',query:{serviceId:row.id}})
    },
    handleSelectionChange(val) {  //wait
      this.multipleSelection = val;
    },
    getList() {
      this.listLoading = true;   //waitting  code  true
      fetchManagerList().then(response => {
        this.optionsList = response.data;
      });
      fetchList(this.serviceQuery).then(response => {
        this.listLoading = false;
        this.list = response.data.list;
      }).catch(err => console.log(err));
    }
  }
}
</script>
<style lang="scss" scoped>

.table-container {
  th {
    padding: 0 !important;
    height: 48px;
    line-height: 48px;
  }
  td {
    padding: 0 !important;
    height: 48px;
    line-height: 48px;
  }
}

.el-table{
  padding-bottom: 17px;
}
</style>