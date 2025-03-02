<template>
  <div class="editor-container">
    <a-upload
        :before-upload="handleBeforeUpload"
        :show-upload-list="false"
    >
      <a-button icon="upload" class="upload-button">Upload Image</a-button>
    </a-upload>
    <div class="canvas-container">
      <canvas ref="canvas" width="600" height="400"></canvas>
    </div>
    <div class="controls">
      <a-button @click="undo">撤消</a-button>
      <a-button @click="redo">重做</a-button>
      <a-button @click="flipHorizontal">水平翻转</a-button>
      <a-button @click="rotate">旋转</a-button>
      <a-button @click="addText">添加文本</a-button>
      <a-button @click="applyFilter">应用过滤器</a-button>
      <!-- Add more buttons for other features -->
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue';
import * as fabric from 'fabric';

export default defineComponent({
  name: 'ImageEditor',
  props: {
    imageUrl: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const canvas = ref<HTMLCanvasElement | null>(null);
    let fabricCanvas: fabric.Canvas;
    const history = ref<any[]>([]);
    const redoStack = ref<any[]>([]);

    onMounted(() => {
      if (canvas.value) {
        fabricCanvas = new fabric.Canvas(canvas.value);
        fabricCanvas.on('object:modified', saveState);
        fabricCanvas.on('object:added', saveState);

        // Add mouse wheel zoom functionality
        fabricCanvas.on('mouse:wheel', (opt) => {
          const delta = opt.e.deltaY;
          let zoom = fabricCanvas.getZoom();
          zoom *= 0.999 ** delta;
          if (zoom > 20) zoom = 20;
          if (zoom < 0.01) zoom = 0.01;
          fabricCanvas.zoomToPoint(new fabric.Point(opt.e.offsetX, opt.e.offsetY), zoom);
          opt.e.preventDefault();
          opt.e.stopPropagation();
        });

        loadImage(props.imageUrl);
      }
    });

    watch(() => props.imageUrl, (newUrl) => {
      loadImage(newUrl);
    });

    const loadImage = async (url: string) => {
      try {
        const img = await fabric.Image.fromURL(url, { crossOrigin: 'anonymous' });
        fabricCanvas.clear();
        img.set({
          left: fabricCanvas.getWidth() / 2,
          top: fabricCanvas.getHeight() / 2,
          originX: 'center',
          originY: 'center',
          scaleX: fabricCanvas.getWidth() / img.width!,
          scaleY: fabricCanvas.getHeight() / img.height!,
        });
        fabricCanvas.add(img);
        fabricCanvas.renderAll();
        saveState();
      } catch (error) {
        console.error('Error loading image:', error);
      }
    };

    const saveState = () => {
      redoStack.value = [];
      history.value.push(JSON.stringify(fabricCanvas));
    };

    const handleBeforeUpload = (file: File) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imgObj = new Image();
        imgObj.src = e.target?.result as string;
        imgObj.onload = () => {
          fabricCanvas.clear();
          const img = new fabric.Image(imgObj, {
            left: fabricCanvas.getWidth() / 2,
            top: fabricCanvas.getHeight() / 2,
            originX: 'center',
            originY: 'center',
            scaleX: fabricCanvas.getWidth() / imgObj.width,
            scaleY: fabricCanvas.getHeight() / imgObj.height,
          });
          fabricCanvas.add(img);
          fabricCanvas.renderAll();
          saveState();
        };
      };
      reader.readAsDataURL(file);
      return false;
    };

    const undo = () => {
      if (history.value.length > 1) {
        redoStack.value.push(history.value.pop()!);
        fabricCanvas.loadFromJSON(history.value[history.value.length - 1], () => {
          fabricCanvas.renderAll();
        });
      }
    };

    const redo = () => {
      if (redoStack.value.length > 0) {
        const state = redoStack.value.pop()!;
        history.value.push(state);
        fabricCanvas.loadFromJSON(state, () => {
          fabricCanvas.renderAll();
        });
      }
    };

    const flipHorizontal = () => {
      const activeObject = fabricCanvas.getActiveObject();
      if (activeObject) {
        activeObject.toggle('flipX');
        fabricCanvas.renderAll();
        saveState();
      }
    };

    const rotate = () => {
      const activeObject = fabricCanvas.getActiveObject();
      if (activeObject) {
        activeObject.rotate((activeObject.angle || 0) + 90);
        fabricCanvas.renderAll();
        saveState();
      }
    };

    const addText = () => {
      const text = new fabric.Textbox('Edit me', {
        left: fabricCanvas.getWidth() / 2,
        top: fabricCanvas.getHeight() / 2,
        width: 200,
        fontSize: 20,
        originX: 'center',
        originY: 'center',
        editable: true,
      });
      fabricCanvas.add(text);
      fabricCanvas.setActiveObject(text);
      fabricCanvas.renderAll();
      saveState();
    };

    const applyFilter = () => {
      const activeObject = fabricCanvas.getActiveObject();
      if (activeObject && activeObject instanceof fabric.Image) {
        activeObject.filters = activeObject.filters || [];
        activeObject.filters.push(new fabric.Image.filters.Grayscale());
        activeObject.applyFilters();
        fabricCanvas.renderAll();
        saveState();
      }
    };

    return {
      canvas,
      handleBeforeUpload,
      undo,
      redo,
      flipHorizontal,
      rotate,
      addText,
      applyFilter,
    };
  },
});
</script>

<style scoped>
.editor-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f0f2f5;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.upload-button {
  margin-bottom: 20px;
  background-color: #1890ff;
  color: white;
  border: none;
  transition: background-color 0.3s;
}

.upload-button:hover {
  background-color: #40a9ff;
}

.canvas-container {
  border: 2px dashed #d9d9d9;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 20px;
}

canvas {
  display: block;
}

.controls {
  display: flex;
  gap: 10px;
}

.controls a-button {
  background-color: #1890ff;
  color: white;
  border: none;
  transition: background-color 0.3s;
}

.controls a-button:hover {
  background-color: #40a9ff;
}
</style>

