// Import statements remain the same
import { parseGeoJSON, scaleFactor } from "@geo/ParserGeoJSON";
import GeoObject from "@geo/primitive/GeoObject";
import Layer from "@geo/compositions/Layer";
import Point from "@geo/primitive/Point";
import { app } from "electron";
// Get canvas reference safely
const canvas = document.getElementById('canvas') as HTMLCanvasElement | null;


// Encapsulate state in an object
const appState = {
  canvas: canvas,
  ctx: (canvas.getContext('2d') as CanvasRenderingContext2D),
  layers: new Map<any, Layer>(),
  isMouseDown: false,
  lastPosition: { x: 0, y: 0 },
  transform: { 
    scale: 1,
    translate: { x: 0, y: 0 }
  },
  animationFrame: null as number | null,
  allScale: 1,
  scale: new Point(0,0) as Point,
  needRender: false
};

initCanvas();
function initCanvas() {
  const canvas = document.getElementById('canvas');
  // Функция для обновления разрешения
  const updateResolution = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      
      // Устанавливаем буферное разрешение
      // Устанавливаем буферное разрешение (реальное разрешение для рисования)
      appState.canvas.width = rect.width * dpr;
      appState.canvas.height = rect.height * dpr;
      // Учет масштабирования CSS
      const scaleX = appState.canvas.width / rect.width;
      const scaleY = appState.canvas.height / rect.height;
      appState.scale = new Point(scaleX, scaleY);

  };

  // Первоначальная настройка
  updateResolution();
  
  // Обновляем при изменении размера окна
  window.addEventListener('resize', () => {
      updateResolution();
      console.log("resize");
      // Тут можно вызвать перерисовку содержимого
  });
  appState.needRender = true;

}

// Event listener setup
document.getElementById('open-file-btn')!
  .addEventListener('click', () => {
    window.electronAPI.openFile();
  });

// Event handlers
const handleWheel = (event: WheelEvent) => {
  event.preventDefault();
  
  const delta = event.deltaY;
  if(delta == 0){
    return;
  }
  const scaleDelta = delta > 0 ? 0.9 : 1.1;
  appState.transform.scale *= scaleDelta;
  appState.allScale = appState.allScale * scaleDelta;
  appState.needRender = true;


};

const handleMouseDown = (event: MouseEvent) => {
  appState.isMouseDown = true;
  appState.lastPosition = {
    x: event.clientX - appState.canvas.getBoundingClientRect().left,
    y: event.clientY - appState.canvas.getBoundingClientRect().top
  };
  appState.needRender = true;
};


const handleMouseUp = () => {
  appState.isMouseDown = false;
};

const handleMouseMove = (event: MouseEvent) => {

  if (!appState.isMouseDown || !appState.layers) return;
  
  const rect = appState.canvas.getBoundingClientRect();
  const currentX = event.clientX - rect.left;
  const currentY = event.clientY - rect.top;
  let scale = 1 / Math.sqrt(Math.abs(appState.allScale)); 
  console.log("scale " + scale);
  console.log("allScale " + appState.allScale);
  appState.transform.translate.x += (currentX - appState.lastPosition.x) * scale * scaleFactor * 100000;
  appState.transform.translate.y += (currentY - appState.lastPosition.y) * scale * scaleFactor * 100000;
  appState.lastPosition = { x: currentX, y: currentY };
  appState.needRender = true;


};

// File selection handler
window.electronAPI.onFileSelected(async (content) => {
  try {
    const jsonData = JSON.parse(content as string);
    const layer = parseGeoJSON(jsonData, "EPSG:4326"); // Specify CRS

    const viewLayer = createLayer();
    layersContainer.appendChild(viewLayer);

    appState.layers.set(viewLayer, layer);

    const bottomWorld = layer.bottomRight;
    const topWorld = layer.topLeft;

    console.log("bottomWorld", bottomWorld);
    console.log("topWorld", topWorld);

    // Вычисляем центр объекта в мировой системе:
    const layerCenter = new Point(
      (topWorld.x + bottomWorld.x) / 2,
      (topWorld.y + bottomWorld.y) / 2
    );

    // Вычисляем центр экрана:
    const screenCenter = screenToWorld(
      appState.ctx,
      new Point(appState.canvas.width / appState.scale.x / 2, appState.canvas.height / appState.scale.y / 2)
    );
    const screenSizeInWorld = screenToWorld(
      appState.ctx,
      new Point(appState.canvas.width / appState.scale.x, appState.canvas.height / appState.scale.y)
    );

    // Вычисляем масштаб для подгонки, если требуется
    const scaleFactor = calculateScaleToFitScreen(topWorld, bottomWorld, screenSizeInWorld.x, screenSizeInWorld.y);

    // Разница между центром объекта и центром экрана:
    const delta = new Point(
      -layerCenter.x + screenCenter.x,
      -layerCenter.y + screenCenter.y
    );

    console.log("Calculated scale factor:", scaleFactor);
    console.log("Layer center:", layerCenter);
    console.log("Screen center:", screenCenter);
    console.log("Delta (translation):", delta);

    // Применяем перевод камеры:
    GeoObject.clear()
    GeoObject.translate(delta.x, delta.y);
    // Применяем накопленные преобразования к контексту
    GeoObject.scale(scaleFactor, scaleFactor, layerCenter);
    GeoObject.transform(appState.ctx);
    appState.needRender = true;
  } catch (e) {
    console.error("Invalid GeoJSON:", e);
  }
});

function calculateScaleToFitScreen(top: Point, bottom: Point, screenWidth, screenHeight) {
  const geoWidth = Math.abs(bottom.x - top.x);
  const geoHeight = Math.abs(bottom.y - top.y);

  const scaleX = screenWidth / geoWidth;
  const scaleY = screenHeight / geoHeight;

  return Math.min(scaleX, scaleY);
}


// Rendering function
function render(): void {
    if (!appState.needRender || !appState.ctx || !appState.layers) 
    {
      return;
    }

    GeoObject.clear();
    let left_top = screenToWorld(
      appState.ctx, 
      new Point(0, 0));
    let right_bottom =
    screenToWorld(
      appState.ctx, 
      new Point(appState.canvas.width, appState.canvas.height));

    const width = right_bottom.x - left_top.x;
    const height = right_bottom.y - left_top.y;
    appState.ctx.clearRect(left_top.x, left_top.y, width, height);
    
    GeoObject.translate(
    appState.transform.translate.x, 
    appState.transform.translate.y);

    let center = screenToWorld(
      appState.ctx, 
      new Point(appState.lastPosition.x, appState.lastPosition.y));

    console.log(center.toString());
    GeoObject.scale(
      appState.transform.scale, 
      appState.transform.scale,
      center
    );
    appState.allScale *= appState.transform.scale;

    GeoObject.transform(appState.ctx);

    appState.layers.forEach(element => {
      element.draw(appState.ctx, 1);
    });
    
    appState.transform = {
      scale: 1,
      translate:{ x:0, y:0}
    }

    appState.needRender = false
};

setInterval(()=>{
  render()
}, 20);

function screenToWorld(
  ctx: CanvasRenderingContext2D,
  point: Point
): Point {
  // Получаем текущую матрицу преобразований
  const transform = ctx.getTransform().inverse();
  
  // Применяем матрицу к координатам
  const transformPoint = transform.transformPoint(new DOMPoint(point.x * appState.scale.x, point.y * appState.scale.y))  

  return new Point(transformPoint.x, transformPoint.y);
}

function transformPointWithContext(
  ctx: CanvasRenderingContext2D,
  point: Point
): Point {
  // Получаем текущую матрицу трансформации
  const transform = ctx.getTransform();

  // Применяем её к переданной точке
  const transformed = transform.transformPoint(new DOMPoint(point.x, point.y));

  // Возвращаем новую точку
  return new Point(transformed.x, transformed.y);
}

const layersContainer = document.getElementById('layers-container') as HTMLDivElement;

// Function to create a new layer element
function createLayer(): HTMLDivElement {
    const layerDiv = document.createElement('div');
    layerDiv.className = 'layer-item';
    layerDiv.draggable = true;
    layerDiv.textContent = `Layer ${appState.layers.size}`;

    const controlsDiv = document.createElement('div');
    controlsDiv.className = 'controls';

    const upButton = document.createElement('button');
    upButton.textContent = '⬆️';
    upButton.title = 'Move Up';
    upButton.onclick = () => moveLayerUp(layerDiv);

    const downButton = document.createElement('button');
    downButton.textContent = '⬇️';
    downButton.title = 'Move Down';
    downButton.onclick = () => moveLayerDown(layerDiv);

    const removeButton = document.createElement('button');
    removeButton.textContent = '❌';
    removeButton.title = 'Remove';
    removeButton.onclick = () => removeLayer(layerDiv);

    controlsDiv.appendChild(upButton);
    controlsDiv.appendChild(downButton);
    controlsDiv.appendChild(removeButton);

    layerDiv.appendChild(controlsDiv);

    return layerDiv;
}



// Remove a layer
function removeLayer(layer: HTMLDivElement): void {
    layersContainer.removeChild(layer);
    appState.layers.delete(layer);
}

// Move layer up
function moveLayerUp(layer: HTMLElement): void {
    const prev = layer.previousElementSibling as HTMLElement | null;
    if (prev) {
        layersContainer.insertBefore(layer, prev);
    }
}

// Move layer down
function moveLayerDown(layer: HTMLElement): void {
    const next = layer.nextElementSibling as HTMLElement | null;
    if (next) {
        layersContainer.insertBefore(next, layer);
    }
}

// Drag and drop functionality
layersContainer.addEventListener('dragstart', (e: DragEvent) => {
    if (e.target instanceof HTMLElement) {
        e.dataTransfer?.setData('text/plain', e.target.textContent || '');
        e.target.style.opacity = '0.4';
    }
});

layersContainer.addEventListener('dragend', (e: DragEvent) => {
    if (e.target instanceof HTMLElement) {
        e.target.style.opacity = '1';
    }
});

layersContainer.addEventListener('dragover', (e: DragEvent) => {
    e.preventDefault();
});

layersContainer.addEventListener('drop', (e: DragEvent) => {
    e.preventDefault();
    if (e.target instanceof HTMLElement && e.dataTransfer) {
        const data = e.dataTransfer.getData('text/plain');
        const draggedElement = Array.from(layersContainer.children).find(
            (el) => el.textContent?.includes(data)
        ) as HTMLElement | undefined;
        if (draggedElement) {
            layersContainer.removeChild(draggedElement);
            layersContainer.insertBefore(draggedElement, e.target);
        }
    }
});
// Event binding
appState.canvas.addEventListener('wheel', handleWheel);
appState.canvas.addEventListener('mousedown', handleMouseDown);
appState.canvas.addEventListener('mouseup', handleMouseUp);
appState.canvas.addEventListener('mousemove', handleMouseMove);

// Cleanup on unload
window.addEventListener('beforeunload', () => {
  if (appState.animationFrame) {
    cancelAnimationFrame(appState.animationFrame);
  }
});