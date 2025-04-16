import { scaleFactor } from "@geo/utils/GeoProjection";
import { CanvasManager } from "./CanvasManager";
import Point from "@geo/primitive/Point";
import { LayerManager } from "./LayerManager";

// InputManager.ts
export class InputManager {
    private canvasManager: CanvasManager;
    private layersContainer: HTMLDivElement;
    private transform: { scale: number; translate: { x: number; y: number } } = { scale: 1, translate: { x: 0, y: 0 } };
    private isMouseDown: boolean = false;
    private lastPosition: { x: number; y: number } = { x: 0, y: 0 };
    private layerManager: LayerManager;

    constructor(canvasManager: CanvasManager, layerManager: LayerManager, layersContainerId: string) {
        this.canvasManager = canvasManager;
        this.layerManager = layerManager;
        this.layersContainer = document.getElementById(layersContainerId) as HTMLDivElement;
        this.setupCanvasEvents();
    }

    private setupCanvasEvents(): void {
        const canvas = this.canvasManager.canvas;
        canvas.addEventListener('wheel', (e) => this.handleWheel(e));
        canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        canvas.addEventListener('dblclick', (e) => this.handleDblclickMouse(e));
        canvas.addEventListener('contextmenu', (e) => e.preventDefault());
        window.addEventListener("keydown", (event) => {
            if (event.key === "s" || event.key === "S") {
                        
                console.log("activate S")
                if(this.canvasManager.isRulerActive){
                    this.canvasManager.deactivateRuler();
                    return;
                }
                this.canvasManager.activateRuler("segment"); // или "polyline"
            }
            if (event.key === "r" || event.key === "R") {
                
                console.log("activate R")

                if(this.canvasManager.isRulerActive){
                    this.canvasManager.deactivateRuler();
                    return;
                }
                this.canvasManager.activateRuler("polyline"); // или "polyline"

            }
        });
    }
    handleDblclickMouse(e: MouseEvent): any {
        const mouseX = this.mousePosition.x;
        const mouseY = this.mousePosition.y;
        const worldPoint = this.canvasManager.screenToWorld(new Point(mouseX, mouseY));
    
        this.layerManager.selectObjectAt(worldPoint);
    }

    
    get mousePosition(): Point{
        return new Point( this.lastPosition.x, this.lastPosition.y);
    }

    public getTransform() {
        return this.transform;
    }
    
    public resetTransform(): void {
        this.transform = { scale: 1, translate: { x: 0, y: 0 } };
    }

    private handleWheel(event: WheelEvent): void {
        event.preventDefault();
        const delta = event.deltaY;
        if (delta === 0) return;
        const scaleDelta = delta > 0 ? 0.9 : 1.1;
        this.transform.scale *= scaleDelta;
        this.canvasManager.requestRender();
    }

    private handleMouseDown(event: MouseEvent): void {

        const pos = this.getCanvasCursorPosition(event);
        this.lastPosition = pos;

    // Правая кнопка — активация линейки
        if (event.button === 2 && this.canvasManager.isRulerActive) {
            const worldPoint = this.canvasManager.screenToWorld(new Point(pos.x, pos.y));
            this.canvasManager.rulerTool.addPoint(worldPoint);
            return;
        }

        this.canvasManager.requestRender();
        this.isMouseDown = true;
        
    }

    private handleMouseUp(event: MouseEvent): void {
        this.isMouseDown = false;
    }

    private handleMouseMove(event: MouseEvent): void {
        if (!this.isMouseDown) return;
        const currentPosition = this.getCanvasCursorPosition(event);
        const deltaX = currentPosition.x - this.lastPosition.x;
        const deltaY = currentPosition.y - this.lastPosition.y;
        // Компенсация масштаба
        const scale = this.canvasManager.scale;
        const maxScale = Math.max(scale.x, scale.y);
        const inverseScale = 1 / Math.abs(maxScale);
        // Применяем коэффициенты преобразования:
        // 1. inverseScale - компенсирует текущий масштаб
        // 2. scaleFactor - глобальный коэффициент из гео-библиотеки
        this.transform.translate.x += deltaX * inverseScale;
        this.transform.translate.y += deltaY * inverseScale;
        this.lastPosition = currentPosition;
        this.canvasManager.requestRender();
    }

    private getCanvasCursorPosition(event: MouseEvent): { x: number, y: number } {
        const rect = this.canvasManager.canvas.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
    }
    

}
