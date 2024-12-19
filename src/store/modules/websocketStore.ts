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

    const readyState = ref<number>(WebSocket.CLOSED);


    function initialize(options: {
        url: string;
        protocols?: string | string[];
        reconnectTimeout?: number
    }) {
        state.wsService = new WebSocketService(options);
        state.wsService?.open();

        state.wsService?.on('open', () => {
            readyState.value = WebSocket.OPEN;
        });
        state.wsService?.on('close', () => {
            readyState.value = WebSocket.CLOSED;
        });
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
        readyState.value = WebSocket.CLOSED;
    }


    return {
        initialize,
        sendMessage,
        on,
        onEvent,
        close,
        readyState,
    };
}, {
    persistedState: {
        persist: false,
    }
});
