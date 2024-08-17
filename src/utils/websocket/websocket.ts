// src/utils/websocket.ts
import {onUnmounted} from 'vue';

interface WebSocketOptions {
    url: string;
    protocols?: string | string[];
    reconnectTimeout?: number;
}

type MessageCallback = (data: any) => void;
type EventCallback = () => void;

class WebSocketService {
    private ws: WebSocket | null = null;
    private callbacks: { [key: string]: (MessageCallback | EventCallback)[] } = {};
    private reconnectTimeoutMs: number = 5000; // 默认5秒重连间隔
    private heartbeatIntervalMs: number = 5000; // 默认5秒心跳间隔

    constructor(private options: WebSocketOptions) {
    }

    public open(): void {
        this.ws = new WebSocket(this.options.url, this.options.protocols);
        this.ws.addEventListener('open', this.handleOpen);
        this.ws.addEventListener('message', this.handleMessage);
        this.ws.addEventListener('error', this.handleError);
        this.ws.addEventListener('close', this.handleClose);
        setInterval(() => {
            if (this.ws && this.ws.readyState === WebSocket.OPEN) {
                this.send('ping');
            }
        }, this.heartbeatIntervalMs);
    }

    public close(isActiveClose = false): void {
        if (this.ws) {
            this.ws.close();
            if (!isActiveClose) {
                setTimeout(() => this.reconnect(), this.reconnectTimeoutMs);
            }
        }
    }

    public reconnect(): void {
        this.open();
    }

    public on(event: 'message', callback: MessageCallback): void;
    public on(event: 'open' | 'error' | 'close', callback: EventCallback): void;
    public on(event: string, callback: (...args: any[]) => void): void {
        if (!this.callbacks[event]) {
            this.callbacks[event] = [];
        }
        this.callbacks[event].push(callback);
    }

    private handleOpen = (): void => {
        console.log('WebSocket连接已建立');
        if (this.callbacks.open) {
            this.callbacks.open.forEach((cb) => (cb as EventCallback)());
        }
    };

    private handleMessage = (event: MessageEvent): void => {
        const data = JSON.parse(event.data);
        console.log('WebSocket接收到消息:', data);
        if (this.callbacks.message) {
            this.callbacks.message.forEach((cb) => (cb as MessageCallback)(data));
        }
    };

    private handleError = (error: Event): void => {
        console.error('WebSocket错误:', error);
        if (this.callbacks.error) {
            this.callbacks.error.forEach((cb) => (cb as EventCallback)());
        }
    };

    private handleClose = (): void => {
        console.log('WebSocket连接已关闭');
        if (this.callbacks.close) {
            this.callbacks.close.forEach((cb) => (cb as EventCallback)());
            if (!this.options.reconnectTimeout) {
                this.reconnect();
            }
        }
    };

    public send(data: any): void {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(data));
        } else {
            console.warn('尝试发送消息时WebSocket未连接');
        }
    }
}

export default function useWebSocket(options: WebSocketOptions) {
    const wsService = new WebSocketService(options);

    onUnmounted(() => {
        wsService.close(true);
    });

    return {
        open: wsService.open.bind(wsService),
        close: wsService.close.bind(wsService),
        reconnect: wsService.reconnect.bind(wsService),
        on: wsService.on.bind(wsService),
        send: wsService.send.bind(wsService)
    };
}
