import {defineStore} from 'pinia';
import {ref} from 'vue';
import {User} from "@/types/user";
import {parse, stringify} from "zipson/lib";
import {handleLocalforage} from "@/utils/localforage";


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
            paths: ['user'],
            storage: handleLocalforage,
            serializer: {
                deserialize: parse,
                serialize: stringify,
            },
        }
    }
);
