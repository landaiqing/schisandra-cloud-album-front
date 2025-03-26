import {defineStore} from 'pinia';
import {generateClientId} from "@/api/client";
import {message} from "ant-design-vue";
import {useI18n} from "vue-i18n";
import {getGiteeUrl, getGithubUrl, getQQUrl} from "@/api/oauth";
import {userLogoutApi} from "@/api/auth";
import {ref} from "vue";

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
        const settings = reactive({
            enableAI: true,
            enableMobileUpload: true,
            publicProfile: true,
            enableComment: true,
            saveSearchHistory: true
        });
        
        // 邮箱弹窗状态
        const emailModalState = reactive({
            bindEmailVisible: false,
            updateEmailVisible: false,
            unbindEmailVisible: false
        });

        // 手机弹窗状态
        const phoneModalState = reactive({
            bindPhoneVisible: false,
            updatePhoneVisible: false,
            unbindPhoneVisible: false
        });

        // 密码弹窗状态
        const passwordModalState = reactive({
            setPasswordVisible: false,
            updatePasswordVisible: false
        });

        // 第三方登录弹窗状态
        const thirdPartyModalState = reactive({
            visible: false
        });

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
                        const currentUrl = new URL(window.location.href);
                        const redirect = currentUrl.searchParams.get('redirect');
                        if (redirect) {
                            router.push(redirect);
                        } else {
                            router.push('/main/photo/all');
                        }
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

        /**
         * Logout the user and clear the token and user info
         */
        async function logout() {
            const res: any = await userLogoutApi();
            if (res && res.code === 200) {
                localStorage.removeItem('STORE-USER');
                setTimeout(() => {
                    router.push('/login');
                }, 1000);
            }
        }


        // 打开绑定邮箱弹窗
        function openBindEmailModal() {
            emailModalState.bindEmailVisible = true;
            emailModalState.updateEmailVisible = false;
            emailModalState.unbindEmailVisible = false;
        }

        // 打开修改邮箱弹窗
        function openUpdateEmailModal() {
            emailModalState.bindEmailVisible = false;
            emailModalState.updateEmailVisible = true;
            emailModalState.unbindEmailVisible = false;
        }

        // 打开解绑邮箱弹窗
        function openUnbindEmailModal() {
            emailModalState.bindEmailVisible = false;
            emailModalState.updateEmailVisible = false;
            emailModalState.unbindEmailVisible = true;
        }

        // 关闭所有邮箱弹窗
        function closeAllEmailModals() {
            emailModalState.bindEmailVisible = false;
            emailModalState.updateEmailVisible = false;
            emailModalState.unbindEmailVisible = false;
        }

        // 打开绑定手机弹窗
        function openBindPhoneModal() {
            phoneModalState.bindPhoneVisible = true;
            phoneModalState.updatePhoneVisible = false;
            phoneModalState.unbindPhoneVisible = false;
        }

        // 打开修改手机弹窗
        function openUpdatePhoneModal() {
            phoneModalState.bindPhoneVisible = false;
            phoneModalState.updatePhoneVisible = true;
            phoneModalState.unbindPhoneVisible = false;
        }

        // 打开解绑手机弹窗
        function openUnbindPhoneModal() {
            // 移除解绑手机功能，保留函数但不执行任何操作
            // 不再设置unbindPhoneVisible为true
            phoneModalState.bindPhoneVisible = false;
            phoneModalState.updatePhoneVisible = false;
        }

        // 关闭所有手机弹窗
        function closeAllPhoneModals() {
            phoneModalState.bindPhoneVisible = false;
            phoneModalState.updatePhoneVisible = false;
            phoneModalState.unbindPhoneVisible = false;
        }

        // 打开设置密码弹窗
        function openSetPasswordModal() {
            passwordModalState.setPasswordVisible = true;
            passwordModalState.updatePasswordVisible = false;
        }

        // 打开修改密码弹窗
        function openUpdatePasswordModal() {
            passwordModalState.setPasswordVisible = false;
            passwordModalState.updatePasswordVisible = true;
        }

        // 关闭所有密码弹窗
        function closeAllPasswordModals() {
            passwordModalState.setPasswordVisible = false;
            passwordModalState.updatePasswordVisible = false;
        }

        // 打开第三方登录弹窗
        function openThirdPartyModal() {
            thirdPartyModalState.visible = true;
        }

        // 关闭第三方登录弹窗
        function closeThirdPartyModal() {
            thirdPartyModalState.visible = false;
        }

        return {
            user,
            token,
            clientId,
            settings,
            emailModalState,
            phoneModalState,
            passwordModalState,
            thirdPartyModalState,
            getGithubRedirectUrl,
            getGiteeRedirectUrl,
            getQQRedirectUrl,
            getClientId,
            openGithubUrl,
            openGiteeUrl,
            openQQUrl,
            clear,
            logout,
            openBindEmailModal,
            openUpdateEmailModal,
            openUnbindEmailModal,
            closeAllEmailModals,
            openBindPhoneModal,
            openUpdatePhoneModal,
            openUnbindPhoneModal,
            closeAllPhoneModals,
            openSetPasswordModal,
            openUpdatePasswordModal,
            closeAllPasswordModals,
            openThirdPartyModal,
            closeThirdPartyModal
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
            key: 'STORE-USER',
            includePaths: ['user', 'token', "clientId","settings","emailModalState","phoneModalState","passwordModalState","thirdPartyModalState"]
        }
    }
);
