import Point from "@geo/primitive/Point";
import { CanvasManager } from "./CanvasManager";
import PolylineStyle from "@geo/styles/PolylineStyle";
import { defaultText } from "@geo/styles/TextStyle";
import { scaleFactor } from "@geo/utils/GeoProjection";

export type RulerMode = "segment" | "polyline";

export class RulerTool {
    private points: Point[] = [];
    private mode: RulerMode = "segment";
    private isActive: boolean = false;
    private style: PolylineStyle;
    private canvasManager: CanvasManager;
    container: HTMLElement;

    constructor(canvasManager: CanvasManager, mode: RulerMode = "segment", style: PolylineStyle, dataId:string) {
        this.mode = mode;
        this.style = style;
        this.container =  document.getElementById(dataId);
        this.canvasManager = canvasManager;
    }

    public start(mode: RulerMode  = "segment") {
        this.mode = mode;
        this.points = [];
        this.isActive = true;
    }

    public stop() {
        this.points = [];
        this.isActive = false;
    }

    public addPoint(worldPoint: Point) {
        if (!this.isActive) return;
        console.log("add")
        if (this.mode === "segment" && this.points.length >= 2) {
            console.log(this.mode);
            this.points = [];
        }

        this.points.push(worldPoint);
        this.canvasManager.requestRender();
    }

    public draw(ctx: CanvasRenderingContext2D) {
        if (!this.isActive || this.points.length === 0) return;

        ctx.save();
        ctx.beginPath();

        const screenPoints = this.points;

        ctx.moveTo(screenPoints[0].x, screenPoints[0].y);
        for (let i = 1; i < screenPoints.length; i++) {
            ctx.lineTo(screenPoints[i].x, screenPoints[i].y);
        }
        this.style?.apply(ctx)


        const distance = this.calculateDistance();
        console.log(distance);
        if (distance > 0) {
            this.container.textContent = `${(distance / (1000 * scaleFactor)).toFixed(2)} км`;
        }
        ctx.stroke();
        ctx.restore();
    }

    private calculateDistance(): number {
        let total = 0;
        for (let i = 1; i < this.points.length; i++) {
            const dx = this.points[i].x - this.points[i - 1].x;
            const dy = this.points[i].y - this.points[i - 1].y;
            total += Math.sqrt(dx * dx + dy * dy);
        }
        return total;
    }
}
