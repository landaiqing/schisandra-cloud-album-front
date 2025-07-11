import {defineConfig, loadEnv} from 'vite';
import vue from '@vitejs/plugin-vue';
import * as path from 'path';
import viteCompression from "vite-plugin-compression";
import {createHtmlPlugin} from "vite-plugin-html";
import {nodePolyfills} from "vite-plugin-node-polyfills";
import Components from 'unplugin-vue-components/vite';
import {AntDesignVueResolver} from 'unplugin-vue-components/resolvers';
import AutoImport from 'unplugin-auto-import/vite';
import {chunkSplitPlugin} from 'vite-plugin-chunk-split';
import vitePluginBundleObfuscator from 'vite-plugin-bundle-obfuscator';
const defaultObfuscatorConfig: any = {
    excludes: [],
    enable: true,
    log: true,
    autoExcludeNodeModules: true,
    threadPool: {
        size: 4,
        enable: true,
    },
    options: {
        compact: true,
        controlFlowFlattening: true,
        controlFlowFlatteningThreshold: 1,
        deadCodeInjection: false,
        debugProtection: false,
        debugProtectionInterval: 0,
        disableConsoleOutput: false,
        identifierNamesGenerator: 'hexadecimal',
        log: false,
        numbersToExpressions: false,
        renameGlobals: false,
        selfDefending: true,
        simplify: true,
        splitStrings: false,
        stringArray: false,
        stringArrayCallsTransform: false,
        stringArrayCallsTransformThreshold: 0.5,
        stringArrayEncoding: [],
        stringArrayIndexShift: true,
        stringArrayRotate: true,
        stringArrayShuffle: true,
        stringArrayWrappersCount: 1,
        stringArrayWrappersChainedCalls: true,
        stringArrayWrappersParametersMaxCount: 2,
        stringArrayWrappersType: 'variable',
        stringArrayThreshold: 0.75,
        unicodeEscapeSequence: false,
    }
};
export default defineConfig(({mode}: { mode: string }): object => {
        const env: Record<string, string> = loadEnv(mode, process.cwd());
        return {
            publicDir: 'public',
            base: '/',
            resolve: {
                //设置别名
                alias: {
                    '@': path.resolve(__dirname, 'src')
                }
            },
            optimizeDeps: {
                exclude: ['.vite'],
                force: false,
                needsInterop: [".vite"],
            },
            worker: {
                format: 'es'
            },
            plugins: [
                vue(),
                vitePluginBundleObfuscator(defaultObfuscatorConfig),
                chunkSplitPlugin({
                    strategy: "default",
                    useEntryName: true,
                }),
                Components({
                    dts: true,
                    dirs: ['src/components', 'src/views'],
                    resolvers: [
                        AntDesignVueResolver({
                            importStyle: false,
                            resolveIcons: true
                        }),
                    ],
                }),
                AutoImport({
                    include: [
                        /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
                        /\.vue$/,
                        /\.vue\?vue/, // .vue
                        /\.md$/, // .md
                    ],
                    imports: ['vue', 'vue-router', 'pinia', '@vueuse/core'],
                    dts: './auto-import.d.ts',
                    defaultExportByFilename: true,
                    dirsScanOptions: {
                        types: true
                    },
                    vueTemplate: true,
                    vueDirectives: true,
                    viteOptimizeDeps: true,
                    injectAtEnd: true,
                    //ant-design-vue
                    resolvers: [AntDesignVueResolver({
                        importStyle: false,
                        resolveIcons: true
                    })],
                    eslintrc: {
                        enabled: false,
                        filepath: './.eslintrc-auto-import.json',
                        globalsPropValue: true
                    }
                }),
                nodePolyfills(),
                viteCompression({
                    filter: /\.(js|mjs|css|html)$/, // 压缩的文件类型
                    verbose: true, // 是否在控制台中输出压缩结果
                    disable: false,
                    threshold: 10240, // 如果体积大于阈值，将被压缩，单位为b，体积过小时请不要压缩，以免适得其反
                    algorithm: "gzip", // 压缩算法，可选['gzip'，' brotliccompress '，'deflate '，'deflateRaw']
                    ext: ".gz",
                    deleteOriginFile: true, // 源文件压缩后是否删除
                }),
                createHtmlPlugin({
                    minify: true,
                    /**
                     * 在这里写entry后，你将不需要在`index.html`内添加 script 标签，原有标签需要删除
                     * @default src/main.ts
                     */
                    entry: "src/main.ts",
                    /**
                     * 如果你想将 `index.html`存放在指定文件夹，可以修改它，否则不需要配置
                     * @default index.html
                     */
                    template: "index.html",
                    /**
                     * 需要注入 index.html ejs 模版的数据
                     */
                    inject: {
                        data: {
                            title: env.VITE_TITLE_NAME,
                        },
                    },
                }),
            ],
            css: {
                preprocessorOptions: {
                    scss: {
                        api: "modern-compiler",
                        javascriptEnabled: true,
                        additionalData: `@use "@/assets/styles/scroll-bar.scss"; @use "@/assets/styles/theme.scss";`
                    },
                    less: {
                        javascriptEnabled: true,
                    },
                },
                modules: {
                    // 一般我们可以通过 generateScopedName 属性来对生成的类名进行自定义
                    // 其中，name 表示当前文件名，local 表示类名
                    generateScopedName: "[name]__[local]___[hash:base64:5]",
                },

            },

            esbuild: {
                drop: env.VITE_NODE_ENV === 'production' ? ['console', 'debugger'] : [],
            },
            build: {
                outDir: "dist", // 指定输出路径
                assetsDir: "assets", // 指定生成静态文件目录
                assetsInlineLimit: "4096", // 小于此阈值的导入或引用资源将内联为 base64 编码
                cssCodeSplit: true, // 启用 CSS 代码拆分
                sourcemap: false, // 构建后是否生成 source map 文件
                minify: "esbuild", // 指定使用哪种混淆器
                write: true, // 启用将构建后的文件写入磁盘
                emptyOutDir: true, // 构建时清空该目录
                brotliSize: true, // 启用 brotli 压缩大小报告
                chunkSizeWarningLimit: 15000, // chunk 大小警告的限制
                watch: null, // 设置为 {} 则会启用 rollup 的监听器
                rollupOptions: {  // 自定义底层的 Rollup 打包配置
                    output: {
                        format: 'es',
                        chunkFileNames: 'js/[name]-[hash].js', // 引入文件名的名称
                        entryFileNames: 'js/[name]-[hash].js', // 包的入口文件名称
                        assetFileNames: '[ext]/[name]-[hash].[ext]',// 资源文件像 字体，图片等
                    },
                }
            },
            server: {
                proxy: {
                    [env.VITE_APP_BASE_API]: {
                        //后端接口的baseurl
                        target: env.VITE_API_BASE_URL,
                        //是否允许跨域
                        changeOrigin: true,
                        rewrite: (path: string) => path.replace(RegExp(`^${env.VITE_APP_BASE_API}`), ""),
                    },
                },
            },
        };
    }
)
;
