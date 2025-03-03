import {defineStore} from 'pinia';
import {ref} from "vue";
import time from "@/assets/svgs/time.svg";
import location from "@/assets/svgs/location-album.svg";
import people from "@/assets/svgs/people-album.svg";
import thing from "@/assets/svgs/thing-album.svg";
import image from "@/assets/svgs/image.svg";


export const useSearchStore = defineStore(
    'search',
    () => {
        const options = reactive([
            {
                label: '时间',
                value: 'time',
                icon: time
            }, {
                label: '地点',
                value: 'location',
                icon: location
            }, {
                label: '人物',
                value: 'person',
                icon: people
            },
            {
                label: '事物',
                value: 'thing',
                icon: thing
            }, {
                label: '图片',
                value: 'picture',
                icon: image
            }
        ]);
        const searchOption = ref<string>(options[0].value);
        const searchValue = ref<string>('');

        const getIconByValue = (value: string) => {
            const option = options.find(option => option.value === value);
            return option ? option.icon : undefined;
        };

        // 图片搜索结果
        const searchResult = ref<any[]>([]);
        return {
            searchOption,
            options,
            searchValue,
            searchResult,
            getIconByValue
        };
    },
    {
        // 开启数据持久化
        persistedState: {
            persist: true,
            storage: localStorage,
            key: 'search',
            includePaths: ['searchOption', 'options']
        }
    }
);
