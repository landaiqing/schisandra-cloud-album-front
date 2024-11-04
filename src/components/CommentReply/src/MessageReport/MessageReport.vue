<template>
  <!--举报窗口-->
  <AModal draggable="true" v-model:open="comment.showMessageReport" :title="t('comment.reportSeletion')" :width="600"
          @cancel="comment.closeReportMessage"
          @ok="handleReport">
    <div class="message-report-main">
      <ARadioGroup v-model:value="comment.reportType">
        <AFlex :vertical="true">
          <ASpace direction="vertical">
            <span class="message-report-title">违反法律法规</span>
            <div class="message-report-content">
              <ARadio :style="radioStyle" :value="1">违法违规</ARadio>
              <ARadio :style="radioStyle" :value="2">色情</ARadio>
              <ARadio :style="radioStyle" :value="3">低俗</ARadio>
              <ARadio :style="radioStyle" :value="4">赌博诈骗</ARadio>
              <ARadio :style="radioStyle" :value="5">违法信息外链</ARadio>
            </div>
          </ASpace>
          <ASpace direction="vertical">
            <span class="message-report-title">谣言类不实信息</span>
            <div class="message-report-content">
              <ARadio :style="radioStyle" :value="6">涉政谣言</ARadio>
              <ARadio :style="radioStyle" :value="7">虚假不实信息</ARadio>
              <ARadio :style="radioStyle" :value="8">涉社会事件谣言</ARadio>
            </div>
          </ASpace>
          <ASpace direction="vertical">
            <span class="message-report-title">侵犯个人权益</span>
            <div class="message-report-content">
              <ARadio :style="radioStyle" :value="9">人身攻击</ARadio>
              <ARadio :style="radioStyle" :value="10">侵犯隐私</ARadio>
            </div>
          </ASpace>
          <ASpace direction="vertical">
            <span class="message-report-title">有害社区环境</span>
            <div class="message-report-content">
              <ARadio :style="radioStyle" :value="11">垃圾广告</ARadio>
              <ARadio :style="radioStyle" :value="12">引战</ARadio>
              <ARadio :style="radioStyle" :value="13">刷屏</ARadio>
              <ARadio :style="radioStyle" :value="14">作品不相关</ARadio>
              <ARadio :style="radioStyle" :value="15">违规抽奖</ARadio>
              <ARadio :style="radioStyle" :value="16">青少年不良信息</ARadio>
            </div>
          </ASpace>
          <ASpace direction="vertical">
            <span class="message-report-title">其他</span>
            <div class="message-report-content">
              <ARadio :style="radioStyle" :value="17">
                其他
              </ARadio>
              <ATextarea style="margin-top: 10px" v-if="comment.reportType === 17" v-model:value="comment.reportContent"
                         placeholder="请填写举报内容" :rows="1"/>
            </div>
          </ASpace>
        </AFlex>
      </ARadioGroup>
    </div>
  </AModal>

</template>
<script lang="ts" setup>
import {reactive} from "vue";
import {useI18n} from "vue-i18n";
import useStore from "@/store";

const {t} = useI18n();
const comment = useStore().comment;
const radioStyle = reactive({
  color: 'var(--comment-report-text-color)',
  fontSize: '13px',
  fontWeight: 'bold'
});

/**
 * 提交举报信息
 */
function handleReport() {
  const data: any = {
    comment_id: comment.commentId,
    report_type: comment.reportType,
    report_content: comment.reportContent
  };
  console.log(data);
}
</script>
<style scoped lang="less" src="./index.scss">

</style>
