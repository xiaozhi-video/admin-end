<script lang="ts" setup>

import { registerApi } from '/@/api/admin'
import { ElForm, ElMessage, FormProps } from 'element-plus'
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const formEl = ref<InstanceType<typeof ElForm>>()

const form = reactive({
  nickname: '',
  password: '',
})

const rules: FormProps['rules'] = {
  nickname: [
    { required: true, message: '昵称不能为空', trigger: 'blur' },
    { min: 2, max: 16, message: '昵称长度要求2-16之间', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '密码不能为空', trigger: 'blur' },
    { min: 8, max: 16, message: '密码长度要求8-16之间', trigger: 'blur' },
  ],
}

const submit = async () => {
  formEl.value!.validate().then(async () => {
    const { data, status } = await registerApi(form)
    if(status === 200) {
      ElMessage.success('注册成功')
      router.replace({
        name: 'adminerEdit',
        query: {
          adminId: data.insertId,
        },
      })
    }
  }).catch(() => {

  })
}

</script>

<template>
  <el-form ref="formEl" :model="form" :rules="rules">
    <el-form-item label="昵称" prop="nickname">
      <el-input v-model="form.nickname"/>
    </el-form-item>
    <el-form-item label="密码" prop="password">
      <el-input v-model="form.password" show-password type="password"/>
    </el-form-item>
  </el-form>
  <div class="center">
    <el-button type="primary" @click="submit">提交</el-button>
  </div>
</template>

<style lang="scss" scoped>
.center {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>
<script lang="ts">
export default { name: 'AccountForm' }
</script>
