import {defineStore} from 'pinia';
import {computed, ref} from 'vue';
import {theme} from 'ant-design-vue';
import variables from '@/assets/styles/colors.module.scss';

/**
 * theme 配置
 */
export const useThemeStore = defineStore(
    'theme',
    () => {
        const themeName = ref<string>('blue'); // 主题名称
        const darkMode = ref<string>('light'); // 颜色模式
        const themeConfig = computed(() => {
            document.documentElement.setAttribute('data-theme', themeName.value);
            document.documentElement.setAttribute('data-dark', darkMode.value);
            // 主题配置
            return {
                token: {
                    colorPrimary: variables[themeName.value] || 'rgba(96,165,250,.9)',
                    borderRadius: 10,
                    colorSuccess: '#1dc779',
                    colorWarning: '#ffb302',
                    colorError: '#cf4444',
                    colorInfo: variables[themeName.value] || 'rgba(96,165,250,.9)',
                    wireframe: true
                },
                algorithm: darkMode.value === 'light' ? theme.defaultAlgorithm : theme.darkAlgorithm
            };
        });
        const setThemeName = (value: string) => {
            themeName.value = value;
        };
        const toggleDarkMode = () => {
            darkMode.value = darkMode.value === "dark" ? "light" : "dark";
        };
        return {themeName, themeConfig, darkMode, setThemeName, toggleDarkMode};
    },
    {
        persistedState: {
            persist: true,
            storage: localStorage,
            key: 'STORE-THEME',
            includePaths: ['themeName', 'darkMode']
        }
    }
);
