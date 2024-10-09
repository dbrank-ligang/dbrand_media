import { defineStore } from "pinia";
// import { UserState } from "@/stores/interface";
import piniaPersistConfig from "@/stores/helper/persist";

export const useUserStore = defineStore({
  id: "user-meitu",
  state: () => ({
    userInfo: {} as any
  }),
  getters: {},
  actions: {
    // Set setUserInfo
    setUserInfo(userInfo) {
      this.userInfo = userInfo;
    }
  },
  persist: piniaPersistConfig("user-meitu")
});
