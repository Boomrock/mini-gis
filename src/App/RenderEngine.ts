// RenderEngine.ts
import GeoObject from "@geo/primitive/GeoObject";
import Point from "@geo/primitive/Point";
import { CanvasManager } from "./CanvasManager";
import { InputManager } from "./InputManager";
import { LayerManager } from "./LayerManager";

export class RenderEngine {
    private canvasManager: CanvasManager;
    private inputManager: InputManager;
    private layerManager: LayerManager;
    private animationFrame: number | null = null;

    constructor(canvasManager: CanvasManager, inputManager: InputManager, layerManager: LayerManager) {
        this.canvasManager = canvasManager;
        this.inputManager = inputManager;
        this.layerManager = layerManager;
    }
    
    public startRenderLoop(): void {
        const renderLoop = () => {
            this.render();
            this.animationFrame = requestAnimationFrame(renderLoop);
        };
        this.animationFrame = requestAnimationFrame(renderLoop);
    }
    
    public stopRenderLoop(): void {
        if (this.animationFrame)
            cancelAnimationFrame(this.animationFrame);
    }
    
    private render(): void {
        if (!this.canvasManager.needRender) return;

        const ctx = this.canvasManager.ctx;
        GeoObject.clear();
        this.canvasManager.clear();

        // Применяем накопленные преобразования из InputManager
        const transform = this.inputManager.getTransform();
        GeoObject.translate(transform.translate.x, transform.translate.y);
        
        const center = this.canvasManager.screenToWorld(new Point(
            this.inputManager.mousePosition.x,
            this.inputManager.mousePosition.y
        ));
        GeoObject.scale(transform.scale, transform.scale, center);
 
        // Применяем трансформации
        GeoObject.transform(ctx);
        
        // Отрисовка слоёв
        this.layerManager.drawLayers(ctx);

        if(this.canvasManager.isRulerActive){
            this.canvasManager.rulerTool.draw(ctx);
            console.log("draw")
        }
        // Сбрасываем временные преобразования
        this.inputManager.resetTransform();
        this.canvasManager.needRender = false;
    }
}
