import {defineStore} from 'pinia';
import {ref} from 'vue';
import {User} from "@/types/user";
import {parse, stringify} from "zipson/lib";


export const useAuthStore = defineStore(
    'user',
    () => {
        const user = ref<User>();

        function setUser(data: User) {
            user.value = data;
        }

        function getUser() {
            return user.value;
        }

        function clearUser() {
            user.value = void 0;
        }

        return {
            user,
            setUser,
            getUser,
            clearUser
        };
    },
    {
        // 开启数据持久化
        persist: {
            key: 'user',
            storage: localStorage,
            paths: ["user"],
            serializer: {
                deserialize: parse,
                serialize: stringify,
            },
        }
    }
);
