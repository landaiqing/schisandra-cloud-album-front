// blur_detect.c
// emcc blur_detect.c -O3 -o blur_detect.js -s WASM=1 -s EXPORTED_FUNCTIONS="['_laplacian_blur_detect', '_malloc', '_free']" -s EXPORTED_RUNTIME_METHODS="['HEAPU8', 'setValue']" -s ALLOW_MEMORY_GROWTH=1 -s MODULARIZE=1 -s EXPORT_ES6=1 -s ENVIRONMENT='web'
// blur_detect.c
#include <stdint.h>
#include <math.h>
#include <stdlib.h>

#define RESTRICT __restrict__  // 兼容各编译器的限制指针

// 内存池优化（线程不安全，单线程环境专用）
static uint8_t* gray_buffer = NULL;
static size_t buffer_size = 0;

// 灰度转换优化（循环展开+寄存器重用）
static inline void rgb2gray(uint8_t* RESTRICT gray,
                           const uint8_t* RESTRICT rgba,
                           int total_pixels) {
    for (int i = 0; i < total_pixels; i += 4) {
        // 一次处理4个像素（16字节输入）
        const uint8_t* p = rgba + i*4;
        gray[i]   = (9798*p[0]  + 19235*p[1]  + 3736*p[2])  >> 15;
        gray[i+1] = (9798*p[4]  + 19235*p[5]  + 3736*p[6])  >> 15;
        gray[i+2] = (9798*p[8]  + 19235*p[9]  + 3736*p[10]) >> 15;
        gray[i+3] = (9798*p[12] + 19235*p[13] + 3736*p[14]) >> 15;
    }
}

// 主检测函数（内存访问优化版）
double laplacian_blur_detect(const uint8_t* RESTRICT rgba,
                            int width, int height) {
    const int gray_size = width * height;

    // 内存池管理（避免重复分配）
    if (gray_size > buffer_size) {
        free(gray_buffer);
        gray_buffer = (uint8_t*)malloc(gray_size);
        if (!gray_buffer) return NAN; // 使用NaN表示错误
        buffer_size = gray_size;
    }

    // 灰度转换
    rgb2gray(gray_buffer, rgba, width * height);

    // 卷积计算参数
    const int8_t kernel[9] = {0,1,0,1,-4,1,0,1,0};
    const int stride = width;
    int64_t variance = 0;
    const int h_bound = height-1, w_bound = width-1;

    // 内存局部性优化：按行缓存指针
    for (int y = 1; y < h_bound; ++y) {
        const uint8_t* row_prev = gray_buffer + (y-1)*stride;
        const uint8_t* row_curr = row_prev + stride;
        const uint8_t* row_next = row_curr + stride;

        // 列计算（展开循环减少分支预测）
        for (int x = 1; x < w_bound; ++x) {
            // 寄存器缓存邻域像素
            const uint8_t p0 = row_prev[x-1], p1 = row_prev[x], p2 = row_prev[x+1];
            const uint8_t p3 = row_curr[x-1], p4 = row_curr[x], p5 = row_curr[x+1];
            const uint8_t p6 = row_next[x-1], p7 = row_next[x], p8 = row_next[x+1];

            // 展开卷积运算
            const int sum =
                p0*kernel[0] + p1*kernel[1] + p2*kernel[2] +
                p3*kernel[3] + p4*kernel[4] + p5*kernel[5] +
                p6*kernel[6] + p7*kernel[7] + p8*kernel[8];

            variance += sum * sum;
        }
    }

    return variance / (double)((width-2)*(height-2));
}

// emcc blur_detect.c -O3 -o blur_detect.js -s WASM=1 -s EXPORTED_FUNCTIONS="['_laplacian_blur_detect', '_malloc', '_free']" -s EXPORTED_RUNTIME_METHODS="['HEAPU8', 'setValue']" -s ALLOW_MEMORY_GROWTH=1 -s MODULARIZE=1 -s EXPORT_ES6=1 -s ENVIRONMENT='web' -s STRICT=1 -flto
