export function urlToBlob(url: string): Promise<Blob> {
    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
            }
            return response.blob();
        })
        .catch(error => {
            console.error(error);
            throw error;
        });
}
