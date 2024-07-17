import { defineStore } from "pinia";
import piniaPersistConfig from "@/stores/helper/persist";

// 当前选中的品牌对象
export const useCurrBrandStore = defineStore("currBrandObj", {
  state: () => {
    return {
      currBrandObj: {
        brandId: null,
        brandName: "",
        competitor: [] as any
      }
    };
  },
  getters: {},
  actions: {
    setCurrBrandObj(currBrandObj) {
      this.currBrandObj = { ...currBrandObj };
    }
  },
  persist: piniaPersistConfig("currBrandObj")
});
