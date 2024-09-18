import {ObjectDirective} from 'vue';

// 定义指令对象
const clickOutside: ObjectDirective = {
    mounted(el, binding) {
        // 获取指令绑定的回调函数
        const handler = binding.value;

        // 绑定click事件监听器
        const listener = (event: Event) => {
            // 判断点击位置是否在元素之外
            if (!el.contains(event.target as HTMLElement)) {
                // 若在元素之外，触发回调函数
                handler();
            }
        };

        // 将事件监听器添加到文档中
        document.addEventListener('click', listener);

        // 指令销毁时，移除事件监听器
        el.__vueClickOutside__ = listener;
    },
    unmounted(el) {
        // 移除事件监听器
        document.removeEventListener('click', el.__vueClickOutside__);
    },
};

export default clickOutside;
