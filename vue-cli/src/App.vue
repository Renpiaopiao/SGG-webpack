<template>
  <h1 class="title">hello app</h1>
  <el-button type="primary">按钮</el-button>
  <ul>
    <li><router-link to="/home">home</router-link></li>
    <li><router-link to="/about">about</router-link></li>
  </ul>
  <router-view></router-view>

</template>

<script>

import Home from './views/Home'
import { ElButton } from 'element-plus'
export default {
    name:"App",
    components:{
      ElButton
    }
}
</script>

<style>
    .title {
        color: blue;
    }
</style>