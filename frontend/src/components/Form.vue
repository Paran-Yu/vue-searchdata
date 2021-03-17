<template>
<el-form ref="form" :model="form" label-width="80px">
<!-- 메인 주제 이름 쳐서 추가를 누르면 라벨 추가 -->
<!-- group name, keyword 생성 되어야 -->
  <div class="groups-wrapper" style="margin-bottom: 20px">
    <el-form-item label="키워드" style="margin-bottom:8px" label-width="90px">
      <el-input v-model="form.keyword">
        <el-button @click="saveKeyword" slot="append">키워드추가</el-button>
      </el-input>
    </el-form-item>
    <div v-if="keywords" class="tag-wrapper" style="margin-bottom: 15px">
    <el-tag @click="removeKeyword(keyword)" v-for="keyword in keywords" :key="keyword">
      {{keyword}}
    </el-tag>
    </div>

    <el-form-item label="주제" style="margin-bottom:8px" label-width="90px">
    <el-input v-model="form.groupName"></el-input>
      </el-form-item>
      <div v-if="keywordGroups">
        <el-tag @click="removeGroup(group.groupName)" v-for="(group, index) in keywordGroups" :key="index" style="margin-bottom: 5px">{{group.groupName}}</el-tag>
      </div>
      <el-button @click="saveGroup" type="primary">주제 생성하기</el-button>
  </div>

  <div class="groups-wrapper">
    <!-- 기간 -->
    <el-form-item label="시간축 설정" label-width="90px">
      <el-col :span="11">
        <el-date-picker type="date" placeholder="시작 날짜" v-model="form.startDate"></el-date-picker>
      </el-col>
      <el-col class="line" :span="11">
        <el-date-picker type="date" placeholder="종료 날짜" v-model="form.endDate"></el-date-picker>
      </el-col>
    </el-form-item>

    <el-form-item label="구간 단위" label-width="90px">
      <el-radio-group v-model="form.timeUnit">
        <el-radio label="date">date</el-radio>
        <el-radio label="week">week</el-radio>
        <el-radio label="month">month</el-radio>
      </el-radio-group>
    </el-form-item>
    
    <el-form-item label="디바이스" label-width="90px">
      <el-radio-group v-model="form.device">
        <el-radio label="all"></el-radio>
        <el-radio label="pc">pc</el-radio>
        <el-radio label="mo">모바일</el-radio>
      </el-radio-group>
    </el-form-item>
    
    <el-form-item label="성별" label-width="90px">
      <el-radio-group v-model="form.gender">
        <el-radio label="all">모두</el-radio>
        <el-radio label="m">남자</el-radio>
        <el-radio label="f">여자</el-radio>
      </el-radio-group>
    </el-form-item>

    <!-- ages 체크박스 -->
    <el-form-item label="나이" label-width="90px" style="margin-bottom:5px">
      <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange" style="margin: 0px">모두</el-checkbox>
      <el-checkbox-group v-model="form.ages" @change="handleCheckedCitiesChange">
        <el-checkbox v-for="(ageOption, i) in ageOptions" :label="String(i+1)" :key="i" style="margin-bottom: 0px">{{ageOption}}</el-checkbox>
      </el-checkbox-group>
    </el-form-item>
  </div>

  <el-form-item style="margin-bottom:5px">
    <el-button @click="onSubmit" type="primary">Create</el-button>
    <el-button>Cancel</el-button>
  </el-form-item>
</el-form>
</template>
    
<script>
  import {dataLap} from "../utils/axios";
  import moment from 'moment';
  import {mapActions, mapState} from 'vuex';

  const ageAll=['1','2','3','4','5','6','7','8','9','10','11'];
  const ageOptions = ['0~12세', '13~18세', '19~24세', '25~29세', '30~34세', '35~39세', '40~44세', '45~49세', '50~54세', '55~59세', '60세 이상'];

  export default {
    data() {
      return {
        form: {
          startDate: null,
          endDate: null,
          timeUnit: "month",
          groupName: "",
          keyword: "",
          device: "all",
          gender: "all",
          ages: [],
        },
        keywordGroups: [],
        keywords: [],
        checkAll: false,
        ageOptions,
        isIndeterminate: false
      }
    },
    methods: {
      ...mapActions(['generateChartData']),
      saveKeyword() {
        if(this.form.keyword){
          this.keywords.push(this.form.keyword);
        }
        this.form.keyword="";
      },

      saveGroup() {
        if(this.form.groupName){
          this.keywordGroups.push({
              groupName: this.form.groupName,
              keywords: this.keywords
          })
          this.form.groupName = "";
          this.keywords = [];
        }
      },

      removeKeyword(keyword) {
        this.keywords = this.keywords.filter((li) => li !== keyword)
      },

      // age 체크박스 설정
      handleCheckAllChange(val) {
        this.form.ages = val ? ageAll : [];
        this.isIndeterminate = false;
      },
      handleCheckedCitiesChange(value) {
        // console.log(value);
        let checkedCount = value.length;
        this.checkAll = checkedCount === this.ageOptions.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.ageOptions.length;
      },

      async onSubmit() {
        const {startDate, endDate, timeUnit, device, gender, ages} = this.form;

        const makeDate = date => {
          const toCalendarData = new Date(date);
          return `${toCalendarData.getFullYear()}-${toCalendarData.getMonth()}-${toCalendarData.getDate()}`;
        }

        if(this.keywordGroups.length && startDate && endDate && timeUnit && device && gender && ages){
          const data = {
              keywordGroups: this.keywordGroups,
              startDate: moment(startDate).format("YYYY-MM-DD"),
              endDate: moment().format("YYYY-MM-DD"),
              timeUnit,
              device,
              gender,
              ages
          };

          console.log(data);
          const result = await dataLap.post(data);
          // console.log(result.data);

          if(result.data.status === "OK"){
            this.generateChartData();
          }
        }
        else{
          alert("빈 값들을 입력해주세요");
        }
      }
    }
  }
</script>

<style>
*{
  font-family: AppleSDGothicNeoM00;
}
</style>