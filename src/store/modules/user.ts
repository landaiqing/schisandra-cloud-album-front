import {defineStore} from 'pinia'
import {ref} from 'vue'

export const useAuthStore = defineStore(
    'user',
    () => {
        const user = ref<any>()

        function setUser(data: any) {
            user.value = data
        }

        function getUser() {
            return user.value
        }

        function clearUser() {
            user.value = void 0
        }

        return {
            user,
            setUser,
            getUser,
            clearUser
        }
    },
    {
        // 开启数据持久化
        persist: true
    }
)
