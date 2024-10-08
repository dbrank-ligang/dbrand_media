<template>
  <template v-for="subItem in menuList" :key="subItem.path">
    <el-sub-menu v-if="subItem.children?.length" :index="subItem.path">
      <template #title>
        <!-- <el-icon v-if="subItem.meta.icon">
          <component :is="subItem.meta.icon"></component>
        </el-icon> -->
        <span class="sle">{{ subItem.meta.title }}</span>
      </template>
      <SubMenu :menu-list="subItem.children" />
    </el-sub-menu>
    <el-menu-item v-else :index="subItem.path" :disabled="subItem.meta.isDisabled" @click="handleClickMenu(subItem)">
      <!-- <el-icon v-if="subItem.meta.icon">
        <component :is="subItem.meta.icon"></component>
      </el-icon> -->
      <template #title>
        <span class="sle">{{ subItem.meta.title }}</span>
      </template>
    </el-menu-item>
  </template>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

defineProps<{ menuList: Menu.MenuOptions[] }>();

const router = useRouter();
const handleClickMenu = (subItem: Menu.MenuOptions) => {
  if (subItem.meta.isDisabled) return;
  if (subItem.meta.isLink) return window.open(subItem.meta.isLink, "_blank");
  router.push(subItem.path);
};
</script>

<style lang="scss">
.el-menu-item {
  display: inline-block;
  // width: 90px;
  height: 34px;
  text-align: center;
  line-height: 32px;
  margin-top: 37px !important;
  color: #000000;
  background: #ffffff;
  border: 2px solid #000000;
  border-radius: 10px;
}
.el-sub-menu .el-sub-menu__title:hover {
  // color: var(--el-menu-hover-text-color) !important;
  // background-color: transparent !important;
}
.el-menu--collapse {
  .is-active {
    .el-sub-menu__title {
      // color: #ffffff !important;
      // background-color: var(--el-color-primary) !important;
    }
  }
}
.el-menu-item {
  &:hover {
    color: var(--el-menu-hover-text-color);
  }
  &.is-active {
    // width: 90px;
    // height: 34px;
    // text-align: center;
    // line-height: 32px;
    font-weight: bolder;
    color: #000000;
    background-color: rgb(255 221 0);

    // color: var(--el-menu-active-color) !important;
    // background-color: var(--el-menu-active-bg-color) !important;
  }
}
.vertical,
.classic,
.transverse {
  .el-menu-item {
    &.is-active {
      &::before {
        left: 0;
      }
    }
  }
}
.columns {
  .el-menu-item {
    &.is-active {
      &::before {
        right: 0;
      }
    }
  }
}
</style>
