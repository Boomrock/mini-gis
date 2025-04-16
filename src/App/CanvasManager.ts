import GeoObject from "@geo/primitive/GeoObject";
import Point from "@geo/primitive/Point";
import { RulerTool } from "./RulerTool";
import { RedPolygonStyle } from "@geo/styles/PolygonStyle";
import { SolidBluePolylineStyle } from "@geo/styles/PolylineStyle";

// CanvasManager.ts
export class CanvasManager {


    public canvas: HTMLCanvasElement;
    public ctx: CanvasRenderingContext2D;
    public deviceScale: Point;
    public needRender: boolean;
    public rulerTool: RulerTool;

    get scale():Point{
        const transform = this.ctx.getTransform();
        return new Point(transform.a, transform.d);
    }
    public isRulerActive: boolean = false;

    public activateRuler(mode: "segment" | "polyline") {
        this.rulerTool.start(mode);
        console.log("activateRuler")
        this.isRulerActive = true;
    }
    
    public deactivateRuler() {
        this.rulerTool.stop();
        console.log("deactivateRuler")

        this.isRulerActive = false;
    }
    constructor(canvasId: string) {
        this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d')!;
        this.deviceScale = new Point(1, 1);
        this.rulerTool = new RulerTool(this, "segment", SolidBluePolylineStyle, "container"); 
        
        this.updateResolution();
        window.addEventListener('resize', () => this.updateResolution());
    }
    
    private updateResolution(): void {
        const rect = this.canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        this.deviceScale = new Point(scaleX, scaleY);
    }

    // Преобразование координат экрана в мировые
    public screenToWorld(point: Point): Point {
        const transform = this.ctx.getTransform().inverse();
        const domPoint = new DOMPoint(point.x * this.deviceScale.x, point.y * this.deviceScale.y);
        const transformed = transform.transformPoint(domPoint);
        return new Point(transformed.x, transformed.y);
    }
       // Метод вычисляет коэффициент масштабирования для подгона географических границ под размеры экрана.
       public calculateScaleToFitScreen(
        topWorld: Point, 
        bottomWorld: Point, 
        screenWidth: number, 
        screenHeight: number
    ): number {
        const geoWidth = Math.abs(bottomWorld.x - topWorld.x);
        const geoHeight = Math.abs(bottomWorld.y - topWorld.y);
        const scaleX = Math.abs(screenWidth) / geoWidth;
        const scaleY = Math.abs(screenHeight) / geoHeight;
        return Math.min(scaleX, scaleY);
    }
    requestRender() {
        this.needRender = true;
    }
    /**
     * Центрирует отображение слоя. Метод:
     * - Вычисляет центр слоя (среднее между topWorld и bottomWorld)
     * - Определяет центр экрана в мировых координатах
     * - Вычисляет размеры экрана в мировых координатах
     * - Рассчитывает масштаб, позволяющий отобразить весь слой
     * - Применяет трансформации через GeoObject (сдвиг и масштабирование)
     * 
     * @param bound1 Левая верхняя граница слоя в мировых координатах.
     * @param bound2 Правая нижняя граница слоя в мировых координатах.
     */
    public centerLayer(bound1: Point, bound2: Point): void {
        // Вычисляем центр слоя.
        const layerCenter = new Point(
            (bound1.x + bound2.x) / 2,
            (bound1.y + bound2.y) / 2
        );

        // Определяем центр экрана в мировых координатах.
        const screenCenter = this.screenToWorld(
            new Point(
                this.canvas.width / this.deviceScale.x / 2,
                this.canvas.height / this.deviceScale.y / 2
            )
        );

        // Определяем размер экрана в мировых координатах.
        let screenSizeInWorld = this.screenToWorld(
            new Point(
                this.canvas.width / this.deviceScale.x,
                this.canvas.height / this.deviceScale.y
            )
        );

        const screenTopLeftToWorld = this.screenToWorld(new Point(0,0))

        screenSizeInWorld = screenSizeInWorld.subtract(screenTopLeftToWorld);

        // Вычисляем коэффициент масштабирования, позволяющий вместить весь слой.
        const scaleToFit = this.calculateScaleToFitScreen(
            bound1,
            bound2,
            screenSizeInWorld.x,
            screenSizeInWorld.y
        );

        console.log("scaleToFit", scaleToFit);

        // Вычисляем сдвиг, чтобы центр слоя совпал с центром экрана.
        const delta = new Point(
            screenCenter.x - layerCenter.x,
            screenCenter.y - layerCenter.y
        );

        // Применяем трансформации: сначала очищаем, затем сдвигаем и масштабируем.
        GeoObject.clear();
        GeoObject.translate(delta.x, delta.y);
        GeoObject.scale(scaleToFit, scaleToFit, layerCenter);
        GeoObject.transform(this.ctx);
        this.needRender = true;
    }


    
    clear() {
        const leftTop = this.screenToWorld(
            new Point(0, 0)
        );
        
        const rightBottom = this.screenToWorld(
            new Point(this.canvas.width, this.canvas.height)
        );
        
        this.ctx.clearRect(
            leftTop.x,
            leftTop.y,
            rightBottom.x - leftTop.x,
            rightBottom.y - leftTop.y
        );
    }
}
