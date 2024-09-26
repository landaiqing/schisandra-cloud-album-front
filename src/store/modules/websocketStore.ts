// useWebSocketStore.ts
import {defineStore} from 'pinia';
import {onUnmounted, reactive} from 'vue';
import {WebSocketService} from '@/utils/websocket/websocket.ts';

type MessageCallback = (data: any) => void;
type EventCallback = () => void;
export const useWebSocketStore = defineStore('websocket', () => {
    const state = reactive({
        wsService: null as WebSocketService | null,
    });

    function initialize(options: { url: string; protocols?: string | string[]; reconnectTimeout?: number }) {
        state.wsService = new WebSocketService(options);
        state.wsService.open();

        onUnmounted(() => {
            state.wsService?.close(true);
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

    function close() {
        state.wsService?.close();
    }

    return {
        initialize,
        sendMessage,
        on,
        onEvent,
        close,
    };
});
