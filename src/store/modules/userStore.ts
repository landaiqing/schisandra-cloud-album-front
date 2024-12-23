import {defineStore} from 'pinia';
import {generateClientId} from "@/api/client";
import {message} from "ant-design-vue";
import {useI18n} from "vue-i18n";
import {getGiteeUrl, getGithubUrl, getQQUrl} from "@/api/oauth";

export const useAuthStore = defineStore(
    'user',
    () => {
        const user: any = reactive({
            uid: '',
            username: '',
            nickname: '',
            avatar: '',
            status: '',
        });
        const token: any = reactive({
            accessToken: '',
            expireAt: '',
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
            if (res && res.code === 200) {
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
        const messageHandler = async (e: MessageEvent) => {
            if (typeof e.data === 'string') {
                const res: any = JSON.parse(e.data);
                if (res && res.code === 200) {
                    const {uid, access_token, expire_at, username, avatar, nickname, status} = res.data;
                    user.uid = uid;
                    user.username = username;
                    user.avatar = avatar;
                    user.nickname = nickname;
                    user.status = status;
                    token.accessToken = access_token;
                    token.expireAt = expire_at;
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

        function clear() {
            token.accessToken = "";
            token.expireAt = "";
            user.avatar = "";
            user.uid = "";
            user.username = "";
            user.nickname = "";
            user.status = "";
        }


        return {
            user,
            token,
            clientId,
            getGithubRedirectUrl,
            getGiteeRedirectUrl,
            getQQRedirectUrl,
            getClientId,
            openGithubUrl,
            openGiteeUrl,
            openQQUrl,
            clear
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
            includePaths: ['user', 'token', "clientId"]
        }
    }
);
