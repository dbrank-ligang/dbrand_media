<template>
  <div class="selectAddPopBox">
    <el-popover :visible="visible" placement="bottom" :width="736" popper-class="custom-popover">
      <div v-if="!isSuggestPath">
        <div class="listTitle">头部媒体类别卡片自选</div>
        <div class="treeBox">
          <el-tree
            style="margin-bottom: 20px"
            :data="topListArr"
            node-key="id"
            :expand-on-click-node="false"
            :check-strictly="true"
            :props="defaultProps"
            ref="treeRef"
          >
            <template #default="{ node, data }">
              <span class="custom-tree-node" :id="`tree-node-${data.id}`">
                <el-checkbox
                  v-for="item in node.label"
                  :key="item"
                  v-show="item !== null"
                  :label="item"
                  v-model="data.check"
                  change
                />
                <span> </span>
              </span>
            </template>
          </el-tree>
        </div>
        <div class="listTitle">细分媒体圈层卡片自选</div>
        <div class="treeBox">
          <el-tree
            style="margin-bottom: 20px"
            :data="xifenListArr"
            node-key="id"
            :expand-on-click-node="false"
            :check-strictly="true"
            :props="defaultProps"
          >
            <template #default="{ node, data }">
              <span class="custom-tree-node" :id="`tree-node-${data.id}`">
                <el-checkbox
                  v-for="item in node.label"
                  :key="item"
                  v-show="item !== null"
                  :label="item"
                  v-model="data.check"
                  change
                />
                <span> </span>
              </span>
            </template>
          </el-tree>
        </div>
      </div>

      <div class="addListBox" style="margin-top: 10px">
        <div class="addTitle">我要新增：</div>

        <el-autocomplete
          v-model="inputValue"
          :fetch-suggestions="querySearch"
          :trigger-on-focus="false"
          class="inline-input w-50"
          style="width: 350px"
          maxlength="5"
          placeholder="请一次输入一个媒体类别或圈层类别，限5个字以内。s"
          @select="handleSelect"
          @keyup.enter="handleInputConfirm"
          value-key="name"
        />
      </div>
      <div class="tagBox">
        <el-tag
          v-for="tag in newType"
          :key="tag"
          type="info"
          size="small"
          closable
          :disable-transitions="false"
          @close="handleClose(tag)"
          style="margin-right: 10px"
        >
          {{ tag }}
        </el-tag>
      </div>

      <div style="margin: 0; text-align: right" ref="popoverBtnRef">
        <el-button size="small" text @click="cancelChange" class="buttonStyle_cancel">取消</el-button>
        <el-button size="small" type="primary" @click="confirmChange" class="buttonStyle"> 确定 </el-button>
      </div>
      <template #reference>
        <div class="selectTab">
          <div v-for="item in tabArr" :key="item.title" :style="getStyle(item)" @click="activeBtn(item)">
            {{ item.title }}
          </div>
        </div>
      </template>
    </el-popover>
  </div>
</template>

<script setup lang="ts" name="selectAddPop">
import { inject, onMounted, ref, onActivated, h } from "vue";
import { ElButton, ElMessageBox } from "element-plus";
import { ElNotification } from "element-plus";
import { useCurrBrandStore } from "@/stores/modules/currBrand";
import { userMediaTypeApi, searchMediaTypeApi, saveUserMediaTypeApi } from "@/api/modules/media";
import { useRouter } from "vue-router";
import QRCode from "@/assets/images/QRcode.jpg";

const handleCustomCategoryClick = inject<Function>("handleCustomCategoryClick");
const router = useRouter();
// 获取当前路由对象
const currentRoute = router.currentRoute.value;
const currBrandStore = useCurrBrandStore();
const isSuggestPath = ref(false); //false 是媒体推荐页的我要新增，不展示自选类别
const lastQueryArr = ref([] as any); // 我要新增时 最后一次搜索的数组
const newType = ref([] as any); // 新增大类的数组
const visible = ref(false);
const popoverBtnRef = ref();
const treeRef = ref();
const tabArr = ref([
  { title: "自选类别", isActive: false },
  { title: "我要新增", isActive: false }
]);
const defaultProps = {
  children: "child",
  label: "name"
};
const topListArr = ref([]);
const topListArrOld = ref([]); // 存放上次的topListArr
const xifenListArr = ref([]);
const xifenListArrOld = ref([]); // 存放上次的xifenListArr

function isParentPopover(target) {
  while (target) {
    if (target.classList && (target.classList.contains("el-popover") || target.classList.contains("el-notification"))) {
      return true; // 找到 el-popover
    }
    target = target.parentElement; // 移动到父元素
  }
  return false; // 没有找到 el-popover/el-notification
}

// 监听全局点击事件
document.addEventListener("click", event => {
  if (!visible.value) return;
  const popoverRef = document.querySelector(".el-popover");
  const buttonRef0 = document.getElementsByClassName("selectTab")[0];
  const buttonRef1 = document.getElementsByClassName("selectTab")[1];
  if (!popoverRef) {
    return;
  }
  // 如果点击在按钮外且没有点击到popover，则关闭popover
  if (
    !buttonRef1.contains(event.target as Node) &&
    !buttonRef0.contains(event.target as Node) &&
    !popoverRef.contains(event.target as Node) &&
    !isParentPopover(event.target) &&
    !(event.target instanceof Element && event.target.tagName === "LI")
  ) {
    // 空白 TODO 判断是否操作了类别或者新增     若有改动弹出提示语
    // 判断是否有修改，可以顺序不同
    if (
      arraysEqual(topListArrOld.value, topListArr.value) &&
      arraysEqual(xifenListArrOld.value, xifenListArr.value) &&
      newType.value.length <= 0
    ) {
      // 没有修改，直接关闭
      tabArr.value.forEach(el => {
        el.isActive = false;
        cancelChange(); // 不保存修改关闭弹框
      });
    } else {
      ElMessageBox.confirm(`是否保留当前更改？`, "温馨提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        draggable: true
      })
        .then(async () => {
          //需要保存就跳到弹窗的按钮位置
          popoverBtnRef.value.scrollIntoView({ behavior: "smooth" });
        })
        .catch(() => {
          cancelChange(); // 不保存修改关闭弹框
        });
    }
  }
});
// 判断两个数组是否相同，主要比较check字段
function arraysEqual(arr1, arr2) {
  if (arr1.length !== arr2.length) return false;

  // 将两个数组按照某个关键属性排序，例如根据 id
  const sortedArr1 = arr1.slice().sort((a, b) => a.id - b.id);
  const sortedArr2 = arr2.slice().sort((a, b) => a.id - b.id);

  // 比较排序后的数组
  return sortedArr1.every((item, index) => {
    return item.check === sortedArr2[index].check; // 根据需要的属性进行比较
  });
}

// 取出二维数组中check等于true的id 拼成数组
const flattenAndCheck = (items: any[]) => {
  return items.reduce((result: any[], item: { check: any; id: any; child: any }) => {
    // 如果当前项有 check 属性且为 true，则添加其 id 到结果数组中
    if (item.check) {
      result.push(item.id);
    }
    // 如果当前项有 child 属性，则递归调用 flattenAndCheck
    if (Array.isArray(item.child)) {
      result.push(...flattenAndCheck(item.child));
    }
    return result;
  }, []);
};
//  获取细分圈层
const getXifenTypeArr = async () => {
  const { data } = await userMediaTypeApi({ brandId: currBrandStore.currBrandObj.brandId, type: "subdivide" });
  xifenListArr.value = data as any;
  xifenListArrOld.value = JSON.parse(JSON.stringify(data)) as any;
};
//  获取头部媒体
const getTopArr = async () => {
  const { data } = await userMediaTypeApi({ brandId: currBrandStore.currBrandObj.brandId, type: "top" });
  topListArr.value = data as any;
  topListArrOld.value = JSON.parse(JSON.stringify(data)) as any;
};

onActivated(() => {
  tabArr.value.forEach(el => {
    el.isActive = false;
  });
  visible.value = false;
});
//  tab切换样式
const getStyle = (item: { isActive: any }) => {
  if (item.isActive) {
    return { color: "#948000", borderBottom: "1px solid #948000" };
  }
  return {};
};
// tab切换点击事件
const activeBtn = (item: { isActive: boolean }) => {
  visible.value = true;
  let currentState = item.isActive;
  tabArr.value.forEach(el => {
    el.isActive = false;
  });
  item.isActive = !currentState;
  getTopArr();
  getXifenTypeArr();
};

// 提交完成后的弹窗 自定义组件
const showNotificationWithImage = () => {
  // 显示 Notification
  ElNotification({
    dangerouslyUseHTMLString: true, // 允许使用HTML字符串
    // message: htmlContent
    message: h(
      "div",
      {
        style: "display: flex;  justify-content: space-between;"
      },
      [
        h("img", {
          src: QRCode,
          alt: "Notification Image",
          style: "width: 100px; height: 100px; margin-right: 10px; vertical-align: middle; display: inline-block;"
        }),
        h(
          "div",
          {
            style: "font-size: 13px; color: #333; line-height: 20px; display: flex; flex-direction: column;align-self: center;"
          },
          [h("span", "收到您的需求！"), h("span", "我们会尽快处理，"), h("span", "可联系榜女郎获知更新进度")]
        )
      ]
    ),
    duration: 0
  });
};
// 确认提交按钮
const confirmChange = () => {
  tabArr.value = [
    { title: "自选类别", isActive: false },
    { title: "我要新增", isActive: false }
  ];
  try {
    saveUserMediaType({
      brandId: currBrandStore.currBrandObj.brandId,
      brandName: "海尔",
      topMediaTypeIds: flattenAndCheck(topListArr.value),
      subMediaTypeIds: flattenAndCheck(xifenListArr.value),
      newType: newType.value
    });
    // 媒体推荐页 只用到我要新增
    if (isSuggestPath.value && newType.value.length < 1) {
      ElNotification({
        type: "warning",
        title: "提示",
        message: "未新增任何内容"
      });
    } else {
      cancelChange();
    }
  } catch (error) {
    console.log(error);
  }
};
// 取消按鈕
const cancelChange = () => {
  tabArr.value.forEach(el => {
    el.isActive = false;
  });
  visible.value = false;
  newType.value = [];
  inputValue.value = ""; // 清空我要新增input框的值
  if (!isSuggestPath.value) {
    tabArr.value = [
      { title: "自选类别", isActive: false },
      { title: "我要新增", isActive: false }
    ];
  } else {
    tabArr.value = [{ title: "我要新增", isActive: false }];
  }
};

// tag删除事件
const handleClose = (tag: string) => {
  newType.value.splice(newType.value.indexOf(tag), 1);
};

// TODO 这里有bug， 1、新增时候，已存在的复选框高亮显示；2、不存在的添加到下方的标签列表；
const inputValue = ref("");
const handleInputConfirm = () => {
  // inputValue.value是否在topListArr数组元素的neme数组中已存在，需要与name数组中元素的‘-’后的字符串比较，页面滚动到与inputValue.value相同的元素，且高亮显示
  let highlightTopItem = topListArr.value.find((item: any) => {
    return (
      Array.isArray(item.name) &&
      item.name.some(nameItem => {
        return nameItem && nameItem.split("-")[1] === inputValue.value;
      })
    );
  });

  let highlightXifenItem = xifenListArr.value.find((item: any) => {
    return (
      Array.isArray(item.name) &&
      item.name.some(nameItem => {
        return nameItem && nameItem.split("-")[1] === inputValue.value;
      })
    );
  });

  if (highlightTopItem || highlightXifenItem) {
    ElNotification({
      title: "提示",
      message: "当前新增媒体类别或圈层类别已存在", // todo 列表已存在的提示语待修改
      customClass: "my-notification",
      type: "warning",
      offset: 100
    });
    let element;
    if (highlightTopItem) {
      element = document.getElementById(`tree-node-${highlightTopItem.id}`);
    }
    if (highlightXifenItem) {
      element = document.getElementById(`tree-node-${highlightXifenItem.id}`);
    }
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      element.classList.add("yellowHighlight");
      setTimeout(() => {
        element.classList.remove("yellowHighlight");
      }, 3000); // 3秒后移除高亮
    }
  } else {
    const isLastQuery = lastQueryArr.value.some((item: any) => item.mediaName === inputValue.value);
    const isNewType = newType.value.some((item: any) => item === inputValue.value);
    if (inputValue.value && !isNewType && !isLastQuery) {
      newType.value.push(inputValue.value);
      inputValue.value = "";
    } else {
      ElNotification({
        title: "提示",
        message: "当前类型已存在",
        type: "warning"
      });
    }
  }
};

const querySearch = async (queryString: string, cb: any) => {
  // const { data } = await searchMediaApi({ keyword: queryString });
  const { data } = await searchMediaTypeApi({ keyword: queryString });
  lastQueryArr.value = data;
  cb(data);
};

const handleSelect = (item: Record<string, any>) => {
  console.log("input框的值", item);
};
// ---------

const saveUserMediaType = async (params: any) => {
  saveUserMediaTypeApi(params)
    .then(res => {
      console.log(res);
      inputValue.value = ""; // 清空我要新增input框的值
      //  这里刷新覆盖图
      if (handleCustomCategoryClick) {
        handleCustomCategoryClick();
      }
      // 保存是有新增标签，才显示弹窗
      if (params.newType.length > 0) {
        showNotificationWithImage();
      }
    })
    .catch(err => {
      console.log(err);
    });
};

onMounted(async () => {
  if (currentRoute.path === "/mediaSuggest/index") {
    isSuggestPath.value = true;
    tabArr.value = [{ title: "我要新增", isActive: false }];
  }
});
</script>

<style lang="scss">
.custom-popover {
  padding: 30px !important;
  border: 1px solid #ffdd00 !important;
}
.el-notification {
  background-color: #ffdd00 !important;
}
@keyframes flash {
  0% {
    background-color: yellow;
  }
  50% {
    background-color: transparent; /* 透明显示 */
  }
  100% {
    background-color: yellow;
  }
}
.yellowHighlight {
  animation: flash 1s infinite; /* 1秒循环动画 */
  transition: background-color 0.3s ease; /* 保留原来的过渡效果 */
}
.my-notification {
  z-index: 9999 !important; /* 设置一个较高的z-index值来确保图层在最上方 */
}
</style>
<style scoped lang="scss">
@import "./index.scss";
</style>
