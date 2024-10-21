// useWebSocketStore.ts
import {defineStore} from 'pinia';
import {reactive} from 'vue';
import {WebSocketService} from '@/utils/websocket/websocket.ts';

type MessageCallback = (data: any) => void;
type EventCallback = () => void;
export const useWebSocketStore = defineStore('websocket', () => {
    const state = reactive({
        wsService: null as WebSocketService | null,
    });

    function initialize(options: {
        url: string;
        protocols?: string | string[];
        reconnectTimeout?: number
    }) {
        state.wsService = new WebSocketService(options);
        state.wsService?.open();
    }

    function sendMessage(data: any) {
        state.wsService?.send(data);
    }

    function on(event: 'message', callback: MessageCallback) {
        state.wsService?.on(event, callback);
    }

    function onEvent(event: 'open' | 'error' | 'close', callback: EventCallback) {
        state.wsService?.on(event, callback);
    }

    function close(isActiveClose: boolean) {
        state.wsService?.close(isActiveClose);
    }

    // 新增的获取 WebSocket 状态的方法
    function getReadyState() {
        return state.wsService ? state.wsService.getReadyState() : WebSocket.CLOSED;
    }

    return {
        initialize,
        sendMessage,
        on,
        onEvent,
        close,
        getReadyState
    };
}, {
    persist: false,
});
