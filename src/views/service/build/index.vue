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
        <el-form :inline="true" :model="serviceQuery.createPeople" size="small" label-width="140px">
          <el-form-item>
            <el-input 
              v-model="serviceQuery.name" 
              class="input-width" 
              placeholder="客户名称" 
              clearable>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-select v-model="serviceQuery.serveType" placeholder="请选择" >
            <el-option
              v-for="item in optionsList"
              :key="item.label"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button size="mini" class="btn-add" @click="handleAdd()" style="margin-left: 20px">创建服务</el-button>
    </el-card>
    <el-scrollbar class="table-container" >
      <el-table ref="flashTable"
                :data="list"
                style="width: 100%;"
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
        <el-table-column label="服务请求内容" width="200" align="center">
          <template slot-scope="scope">{{scope.row.serviceRequest}}</template>
        </el-table-column>
        <el-table-column label="创建人" width="80"  align="center">
          <template slot-scope="scope">{{scope.row.createPeople}}</template>
        </el-table-column>
        <el-table-column label="创建时间"  align="center">
          <template slot-scope="scope">{{scope.row.createDate | formatDate}}</template>
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
      title="添加服务"
      :visible.sync="dialogVisible"
      width="35%"
      class="info-dialog">
      <el-form :model="service"
        ref="serviceForm"
        size="small">
        <el-form-item label="服务类型">
          <el-select v-model="service.serveType" placeholder="请选择" >
            <el-option
              v-for="item in optionsList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>

        </el-form-item>
        <el-form-item label="客户姓名">
          <el-input v-model="service.customer" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="服务请求">
          <el-input type="textarea" v-model="service.serviceRequest" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="服务概要">
          <el-input type="textarea" v-model="service.overview" style="width: 250px"></el-input>
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
import {fetchList, createService} from '@/api/service';
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
      optionsList: [{ value: 6,label: '咨询'}, //el-select选择器的选项
                        {value: 7,label: '建议'},
                        {value: 8,label: '投诉'},
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

    handleUpdate(index, row) {
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
        this.service.createPeople = this.$store.getters.id;
        createService(this.service).then(() => {
          this.$message({
            message: '添加成功',
            type: 'success'
          });
          this.dialogVisible =false;
          this.getList();
        })
      })
    },

    handleSelectionChange(val) {  //wait
      this.multipleSelection = val;
    },
    getList() {
      this.listLoading = true;   //waitting  code  true
      fetchList(this.serviceQuery).then(response => {
        this.listLoading = false;
        this.list = response.data.list;
      }).catch(err => console.log(err));
    }
  }
}
</script>
<style lang="scss" scoped>

.second-col, .first-col {
  text-align: right;
  padding-right: 13px;
}

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