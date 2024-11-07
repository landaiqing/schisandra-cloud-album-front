import type {Ref} from 'vue';
import {
    computed,
    getCurrentInstance,
    onBeforeUnmount,
    onMounted,
    onUnmounted,
    reactive,
    ref,
    toValue,
    useSlots,
    watch
} from 'vue';

/**
 * 组合式函数
 * 监听给定名称或名称数组的插槽是否存在，支持监听单个插槽或一组插槽的存在
 *
 * @param slotsName - 插槽的名称或名称数组，默认为 'default'
 * @returns 如果是单个插槽名称，则返回一个计算属性，表示该插槽是否存在
 *          如果是插槽名称数组，则返回一个 reactive 对象，其中的每个属性对应该插槽是否存在
 */
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

/**
 * 组合式函数
 * 使用 Vue 的生命周期钩子添加和移除事件监听器
 *
 * 该函数旨在提供一种优雅的方式来管理事件监听器，避免在组件卸载后仍保留事件监听器，
 * 从而可能导致内存泄漏的问题；通过结合 Vue 的 onMounted 和 onUnmounted 钩子，
 * 在组件挂载时添加事件监听器，并在组件卸载时移除它
 *
 * @param target 目标元素或对象；可以是 DOM 元素或其他支持 addEventListener 的对象
 * @param event 要监听的事件名称
 * @param callback 事件被触发时执行的回调函数
 */
export function useEventListener(target: HTMLElement | Window | Document, event: string, callback: EventListenerOrEventListenerObject): void {
    // 也可以用字符串形式的 CSS 选择器来寻找目标 DOM 元素
    onMounted(() => target.addEventListener(event, callback as EventListenerOrEventListenerObject));
    onUnmounted(() => target.removeEventListener(event, callback as EventListenerOrEventListenerObject));
}


/**
 * 使用 requestAnimationFrame 实现的延迟 setTimeout 或间隔 setInterval 调用函数
 *
 * @param fn 要执行的函数
 * @param delay 延迟的时间，单位为 ms，默认为 0，表示不延迟立即执行
 * @param interval 是否间隔执行，如果为 true，则在首次执行后，以 delay 为间隔持续执行
 * @returns 返回一个对象，包含一个 id 属性，该 id 为 requestAnimationFrame 的调用 ID，可用于取消动画帧
 */
export function rafTimeout(fn: () => void, delay: number = 0, interval: boolean = false): object {
    let start: number | null = null; // 记录动画开始的时间戳
    function timeElapse(timestamp: number) {
        // 定义动画帧回调函数
        /*
          timestamp参数：与 performance.now() 的返回值相同，它表示 requestAnimationFrame() 开始去执行回调函数的时刻
        */
        if (!start) {
            // 如果还没有开始时间，则以当前时间为开始时间
            start = timestamp;
        }
        const elapsed = timestamp - start;
        if (elapsed >= delay) {
            try {
                fn(); // 执行目标函数
            } catch (error) {
                console.error('Error executing rafTimeout function:', error);
            }
            if (interval) {
                // 如果需要间隔执行，则重置开始时间并继续安排下一次动画帧
                start = timestamp;
                raf.id = requestAnimationFrame(timeElapse);
            }
        } else {
            raf.id = requestAnimationFrame(timeElapse);
        }
    }

    interface AnimationFrameID {
        id: number
    }

    // 创建一个对象用于存储动画帧的 ID，并初始化动画帧
    const raf: AnimationFrameID = {
        id: requestAnimationFrame(timeElapse)
    };
    return raf;
}

/**
 * 用于取消 rafTimeout 函数
 *
 * @param raf - 包含请求动画帧 ID 的对象；该 ID 是由 requestAnimationFrame 返回的
 *              该函数旨在取消之前通过 requestAnimationFrame 请求的动画帧
 *              如果传入的 raf 对象或其 id 无效，则会打印警告
 */
export function cancelRaf(raf: { id: number }): void {
    if (raf && raf.id && typeof raf.id === 'number') {
        cancelAnimationFrame(raf.id);
    } else {
        console.warn('cancelRaf received an invalid id:', raf);
    }
}

/**
 * 组合式函数
 * 使用 ResizeObserver 观察 DOM 元素尺寸变化
 *
 * 该函数提供了一种方便的方式来观察一个或多个元素的尺寸变化，并在变化时执行指定的回调函数
 *
 * @param target 要观察的目标，可以是 Ref 对象、Ref 数组、HTMLElement 或 HTMLElement 数组
 * @param callback 当元素尺寸变化时调用的回调函数
 * @param options ResizeObserver 选项，用于定制观察行为
 * @returns 返回一个对象，包含停止和开始观察的方法，使用者可以调用 start 方法开始观察，调用 stop 方法停止观察
 */
export function useResizeObserver(
    target: Ref | Ref[] | HTMLElement | HTMLElement[],
    callback: ResizeObserverCallback,
    options: object = {}
) {
    const isSupported = useSupported(() => window && 'ResizeObserver' in window);
    let observer: ResizeObserver | undefined;
    const stopObservation = ref(false);
    const targets = computed(() => {
        const targetsValue = toValue(target);
        if (targetsValue) {
            if (Array.isArray(targetsValue)) {
                return targetsValue.map((el: any) => toValue(el)).filter((el: any) => el);
            } else {
                return [targetsValue];
            }
        }
        return [];
    });
    // 定义清理函数，用于断开 ResizeObserver 的连接
    const cleanup = () => {
        if (observer) {
            observer.disconnect();
            observer = undefined;
        }
    };
    // 初始化 ResizeObserver，开始观察目标元素
    const observeElements = () => {
        if (isSupported.value && targets.value.length && !stopObservation.value) {
            observer = new ResizeObserver(callback);
            targets.value.forEach((element: HTMLElement) => observer!.observe(element, options));
        }
    };
    // 监听 targets 的变化，当 targets 变化时，重新建立 ResizeObserver 观察
    watch(
        () => targets.value,
        () => {
            cleanup();
            observeElements();
        },
        {
            immediate: true, // 立即触发回调，以便初始状态也被观察
            flush: 'post'
        }
    );
    const stop = () => {
        stopObservation.value = true;
        cleanup();
    };
    const start = () => {
        stopObservation.value = false;
        observeElements();
    };
    // 在组件卸载前清理 ResizeObserver
    onBeforeUnmount(() => cleanup());
    return {
        stop,
        start
    };
}

// 辅助函数
export function useSupported(callback: () => unknown) {
    const isMounted = useMounted();
    return computed(() => {
        // to trigger the ref
        if (isMounted.value) {
            // no-op
        }
        ;
        return Boolean(callback());
    });
}

export function useMounted() {
    const isMounted = ref(false);
    // 获取当前组件的实例
    const instance = getCurrentInstance();
    if (instance) {
        onMounted(() => {
            isMounted.value = true;
        }, instance);
    }
    return isMounted;
}

/**
 * 防抖函数 debounce
 *
 * 主要用于限制函数调用的频率，当频繁触发某个函数时，实际上只需要在最后一次触发后的一段时间内执行一次即可
 * 这对于诸如输入事件处理函数、窗口大小调整事件处理函数等可能会频繁触发的函数非常有用
 *
 * @param fn 要执行的函数
 * @param delay 防抖的时间期限，单位 ms，默认为 300ms
 * @returns 返回一个新的防抖的函数
 */
export function debounce(fn: (...args: any[]) => any, delay: number = 300): any {
    let timer: any = null; // 使用闭包保存定时器的引用
    return function (...args: any[]) {
        // 返回一个包装函数
        if (timer) {
            // 如果定时器存在，则清除之前的定时器
            clearTimeout(timer);
        }
        // 设置新的定时器，延迟执行原函数
        timer = setTimeout(() => {
            fn(...args);
        }, delay);
    };
}


/**
 * 组合式函数
 * 使用 MutationObserver 观察 DOM 元素的变化
 *
 * 该函数提供了一个便捷的方式来订阅 DOM 元素的变动，当元素发生指定的变化时，调用提供的回调函数
 * 使用者可以指定要观察的一个或多个 DOM 元素，以及观察的选项和回调函数
 *
 * @param target 要观察的目标，可以是 Ref 对象、Ref 数组、HTMLElement 或 HTMLElement 数组
 * @param callback 当观察到变化时调用的回调函数
 * @param options MutationObserver 的观察选项，默认为空对象；例如:
 *          subtree: 是否监听以 target 为根节点的整个子树，包括子树中所有节点的属性
 *          childList: 是否监听 target 节点中发生的节点的新增与删除
 *          attributes: 是否观察所有监听的节点属性值的变化
 *          attributeFilter: 声明哪些属性名会被监听的数组；如果不声明该属性，所有属性的变化都将触发通知
 * @returns 返回一个对象，包含停止和开始观察的方法，使用者可以调用 start 方法开始观察，调用 stop 方法停止观察
 */
export function useMutationObserver(
    target: Ref | Ref[] | HTMLElement | HTMLElement[],
    callback: MutationCallback,
    options = {}
) {
    const isSupported = useSupported(() => window && 'MutationObserver' in window);
    const stopObservation = ref(false);
    let observer: MutationObserver | undefined;
    const targets = computed(() => {
        const targetsValue = toValue(target);
        if (targetsValue) {
            if (Array.isArray(targetsValue)) {
                return targetsValue.map((el: any) => toValue(el)).filter((el: any) => el);
            } else {
                return [targetsValue];
            }
        }
        return [];
    });
    // 定义清理函数，用于断开 MutationObserver 的连接
    const cleanup = () => {
        if (observer) {
            observer.disconnect();
            observer = undefined;
        }
    };
    // 初始化 MutationObserver，开始观察目标元素
    const observeElements = () => {
        if (isSupported.value && targets.value.length && !stopObservation.value) {
            observer = new MutationObserver(callback);
            targets.value.forEach((element: HTMLElement) => observer!.observe(element, options));
        }
    };
    // 监听 targets 的变化，当 targets 变化时，重新建立 MutationObserver 观察
    watch(
        () => targets.value,
        () => {
            cleanup();
            observeElements();
        },
        {
            immediate: true, // 立即触发回调，以便初始状态也被观察
            flush: 'post'
        }
    );
    const stop = () => {
        stopObservation.value = true;
        cleanup();
    };
    const start = () => {
        stopObservation.value = false;
        observeElements();
    };
    // 在组件卸载前清理 MutationObserver
    onBeforeUnmount(() => cleanup());
    return {
        stop,
        start
    };
}


/**
 * 消除 js 加减精度问题的加法函数
 *
 * 该函数旨在添加两个数字，考虑到它们可能是整数或小数；对于整数，直接返回它们的和
 * 对于小数，为了确保精确计算，将小数转换为相同长度的字符串进行处理，然后将结果转换回小数
 *
 * @param num1 第一个数字
 * @param num2 第二个数字
 * @returns 返回两个数字的和
 */
export function add(num1: number, num2: number): number {
    // 验证输入是否为有效的数字
    // Number.isNaN() 不会尝试将参数转换为数字；全局 isNaN() 函数会将参数强制转换为数字
    if (Number.isNaN(num1) || Number.isNaN(num2)) {
        throw new Error('Both num1 and num2 must be valid numbers.');
    }
    // 检查输入是否为小数
    const isDecimalNum1 = num1 % 1 !== 0;
    const isDecimalNum2 = num2 % 1 !== 0;
    if (!isDecimalNum1 && !isDecimalNum2) {
        return num1 + num2; // 如果两个数字都是整数，则直接返回它们的和
    }
    const num1DeciStr = String(num1).split('.')[1] ?? '';
    const num2DeciStr = String(num2).split('.')[1] ?? '';
    const maxLen = Math.max(num1DeciStr.length, num2DeciStr.length);
    const factor = Math.pow(10, maxLen);
    const num1Str = num1.toFixed(maxLen);
    const num2Str = num2.toFixed(maxLen);
    // 将小数点移除并转换为整数相加
    const result = (+num1Str.replace('.', '') + +num2Str.replace('.', '')) / factor;
    return result;
}


/**
 * 数字格式化函数
 *
 * 该函数提供了一种灵活的方式将数字格式化为字符串，包括设置精度、千位分隔符、小数点字符、前缀和后缀
 *
 * @param value 要格式化的数字或数字字符串
 * @param precision 小数点后的位数，默认为 2
 * @param separator 千分位分隔符，默认为 ','
 * @param decimal 小数点字符，默认为 '.'
 * @param prefix 数字前的字符串，默认为 undefined
 * @param suffix 数字后的字符串，默认为 undefined
 * @returns 格式化后的字符串；如果输入值不是数字或字符串，则抛出类型错误
 */
export function formatNumber(
    value: number | string,
    precision: number = 2,
    separator: string = ',',
    decimal: string = '.',
    prefix?: string,
    suffix?: string
): string {
    // 类型检查
    if (typeof value !== 'number' && typeof value !== 'string') {
        console.warn('Expected value to be of type number or string');
    }
    if (typeof precision !== 'number') {
        console.warn('Expected precision to be of type number');
    }
    // 处理非数值或NaN的情况
    const numValue = Number(value);
    if (isNaN(numValue) || !isFinite(numValue)) {
        return '';
    }
    if (numValue === 0) {
        return numValue.toFixed(precision);
    }
    let formatValue = numValue.toFixed(precision);
    // 如果 separator 是数值而非字符串，会导致错误，此处进行检查
    if (typeof separator === 'string' && separator !== '') {
        const [integerPart, decimalPart] = formatValue.split('.');
        formatValue =
            integerPart.replace(/(\d)(?=(\d{3})+$)/g, '$1' + separator) + (decimalPart ? decimal + decimalPart : '');
    }
    return (prefix || '') + formatValue + (suffix || '');
}
