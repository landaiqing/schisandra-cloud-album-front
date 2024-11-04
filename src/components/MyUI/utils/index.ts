/**
 * 组合式函数
 * 监听给定名称或名称数组的插槽是否存在，支持监听单个插槽或一组插槽的存在
 *
 * @param slotsName - 插槽的名称或名称数组，默认为 'default'
 * @returns 如果是单个插槽名称，则返回一个计算属性，表示该插槽是否存在
 *          如果是插槽名称数组，则返回一个 reactive 对象，其中的每个属性对应该插槽是否存在
 */
import { useSlots, reactive, computed } from 'vue';
export function useSlotsExist(slotsName: string | string[] = 'default') {
    const slots = useSlots(); // 获取当前组件的所有插槽
    // 检查特定名称的插槽是否存在且不为空
    const checkSlotsExist = (slotsName: string): boolean => {
        const slotsContent = slots[slotsName]?.();
        const checkExist = (slotContent: any) => {
            if (typeof slotContent.children === 'string') {
                // 排除 v-if="false" 的插槽内容
                if (slotContent.children === 'v-if') {
                    return false;
                }
                return slotContent.children.trim() !== '';
            } else {
                if (slotContent.children === null) {
                    if (slotContent.type === 'img' || typeof slotContent.type !== 'string') {
                        return true;
                    }
                } else {
                    return Boolean(slotContent.children);
                }
            }
        };
        if (slotsContent && slotsContent?.length) {
            const result = slotsContent.some((slotContent) => {
                return checkExist(slotContent);
            });
            return result;
        }
        return false;
    };
    if (Array.isArray(slotsName)) {
        const slotsExist = reactive<any>({});
        slotsName.forEach((item) => {
            const exist = computed(() => checkSlotsExist(item));
            slotsExist[item] = exist; // 将一个 ref 赋值给一个 reactive 属性时，该 ref 会自动解包
        });
        return slotsExist;
    } else {
        return computed(() => checkSlotsExist(slotsName));
    }
}
