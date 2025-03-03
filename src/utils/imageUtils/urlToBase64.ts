export async function urlToBase64(url: string): Promise<string> {
    try {
        const response = await fetch(url, {
            method: 'GET',
            mode: 'no-cors', // 确保请求模式为cors
            headers: {
                'Content-Type': 'image/*' // 根据实际情况调整类型
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const blob = await response.blob();
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64data = reader.result?.toString();
                resolve(base64data || '');
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    } catch (error) {
        console.error('Error converting URL to Base64:', error);
        return Promise.reject(error);
    }
}
