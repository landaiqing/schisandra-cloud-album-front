import {defineStore} from 'pinia';
import {reactive} from 'vue';
import {generateClientId} from "@/api/client";
import {getGithubUrl} from "@/api/oauth/github.ts";
import {getQQUrl} from "@/api/oauth/qq.ts";
import {getGiteeUrl} from "@/api/oauth/gitee.ts";
import {getUserDevice} from "@/api/user";
import message from "@/components/MyUI/Message/Message.vue";
import {useI18n} from "vue-i18n";

export const useAuthStore = defineStore(
    'user',
    () => {
        const user: any = reactive({
            access_token: '',
            uid: '',
            username: '',
            nickname: '',
            avatar: '',
            status: '',
        });
        const clientId = ref<string>('');
        const githubRedirectUrl = ref<string>('');
        const giteeRedirectUrl = ref<string>('');
        const qqRedirectUrl = ref<string>('');
        const router = useRouter();
        const {t} = useI18n();

        /**
         * Get the redirect url of Github OAuth
         */
        async function getGithubRedirectUrl() {
            const res: any = await getGithubUrl(clientId.value);
            if (res && res.code === 200 && res.data) {
                githubRedirectUrl.value = res.data;
            }
        }

        /**
         * Get the redirect url of Gitee OAuth
         */
        async function getGiteeRedirectUrl() {
            const res: any = await getGiteeUrl();
            if (res && res.code === 200) {
                giteeRedirectUrl.value = res.data;
            }
        }

        /**
         * Get the redirect url of QQ OAuth
         */
        async function getQQRedirectUrl() {
            const res: any = await getQQUrl(clientId.value);
            if (res && res.code === 200) {
                qqRedirectUrl.value = res.data;
            }
        }

        /**
         *  获取client_id
         */
        async function getClientId() {
            const res: any = await generateClientId();
            if (res && res.code === 200) {
                clientId.value = res.data;
            }
        }

        /**
         * 处理消息
         * @param e
         */
        const messageHandler = async (e: any) => {
            if (typeof e.data === 'string') {
                const res: any = JSON.parse(e.data);
                if (res && res.code === 200) {
                    user.uid = res.data.uid;
                    user.access_token = res.data.access_token;
                    user.username = res.data.username;
                    user.avatar = res.data.avatar;
                    user.nickname = res.data.nickname;
                    user.status = res.data.status;
                    await getUserDevice();
                    message.success(t('login.loginSuccess'));
                    window.removeEventListener("message", messageHandler);
                    setTimeout(() => {
                        router.push('/main/photo/all');
                    }, 1000);
                } else {
                    message.error(t('login.loginError'));
                    window.removeEventListener("message", messageHandler);
                }

            }
        };

        function openGithubUrl() {
            const iWidth = 800;                         //弹出窗口的宽度;
            const iHeight = 500;                        //弹出窗口的高度;
            //window.screen.height获得屏幕的高，window.screen.width获得屏幕的宽
            const iTop = (window.screen.height - 30 - iHeight) / 2;       //获得窗口的垂直位置;
            const iLeft = (window.screen.width - 10 - iWidth) / 2;        //获得窗口的水平位置;
            window.open(githubRedirectUrl.value, 'newwindow', 'height=' + iHeight + ',innerHeight=' + iHeight + ',width=' + iWidth + ',innerWidth=' + iWidth + ',top=' + iTop + ',left=' + iLeft + ',toolbar=no,menubar=no,scrollbars=auto,resizable=no,location=no,status=no');
            window.addEventListener("message", messageHandler);
        }


        /**
         * Open the Gitee OAuth page in a new window
         */
        function openGiteeUrl() {
            const iWidth = 800;                         //弹出窗口的宽度;
            const iHeight = 500;                        //弹出窗口的高度;
            //window.screen.height获得屏幕的高，window.screen.width获得屏幕的宽
            const iTop = (window.screen.height - 30 - iHeight) / 2;       //获得窗口的垂直位置;
            const iLeft = (window.screen.width - 10 - iWidth) / 2;        //获得窗口的水平位置;
            window.open(giteeRedirectUrl.value, '_blank', 'height=' + iHeight + ',innerHeight=' + iHeight + ',width=' + iWidth + ',innerWidth=' + iWidth + ',top=' + iTop + ',left=' + iLeft + ',toolbar=no,menubar=no,scrollbars=auto,resizable=no,location=no,status=no');
            window.addEventListener("message", messageHandler);
        }


        function openQQUrl() {
            const iWidth = 800;                         //弹出窗口的宽度;
            const iHeight = 500;                        //弹出窗口的高度;
            //window.screen.height获得屏幕的高，window.screen.width获得屏幕的宽
            const iTop = (window.screen.height - 30 - iHeight) / 2;       //获得窗口的垂直位置;
            const iLeft = (window.screen.width - 10 - iWidth) / 2;        //获得窗口的水平位置;
            window.open(qqRedirectUrl.value, 'newwindow', 'height=' + iHeight + ',innerHeight=' + iHeight + ',width=' + iWidth + ',innerWidth=' + iWidth + ',top=' + iTop + ',left=' + iLeft + ',toolbar=no,menubar=no,scrollbars=auto,resizable=no,location=no,status=no');
            window.addEventListener("message", messageHandler);
        }


        return {
            user,
            clientId,
            getGithubRedirectUrl,
            getGiteeRedirectUrl,
            getQQRedirectUrl,
            getClientId,
            openGithubUrl,
            openGiteeUrl,
            openQQUrl,
        };
    },
    {
        // 开启数据持久化
        // persist: {
        //     key: 'user',
        //     storage: localStorage,
        //     pick: ['user', "clientId", "githubRedirectUrl", "giteeRedirectUrl", "qqRedirectUrl"],
        // }
        persistedState: {
            persist: true,
            storage: localStorage,
            key: 'user',
            includePaths: ['user', "clientId", "githubRedirectUrl", "giteeRedirectUrl", "qqRedirectUrl"]
        }
    }
);
