import Metadata from "@geo/Metadata";
import GeoObject from "@geo/primitive/GeoObject";
import Point from "@geo/primitive/Point";
import GeoStyle from "@geo/styles/GeoStyle";

export default class GeoPolyline extends GeoObject {

    constructor(points: Point[], style: GeoStyle = null, selectedStyle: GeoStyle = null, metadata: Metadata = {description:""}) {
        super(points, style, selectedStyle, metadata);
    }

    public draw(ctx: CanvasRenderingContext2D, isSelected: boolean = false): void {
        super.draw(ctx)
        ctx.beginPath();
        ctx.save()
        ctx.moveTo(this.points[0].x, this.points[0].y);
        
        for (let i = 1; i < this.points.length; i += 1) {
            ctx.lineTo(this.points[i].x, this.points[i].y);
        }
        if(isSelected){
            this._selectedStyle?.apply(ctx);
        }
        else{
            this._style?.apply(ctx);
        }
        ctx.stroke();
        ctx.restore();
    }
    public contains(point: Point, ctx: CanvasRenderingContext2D): boolean {
        const matrix = ctx.getTransform();
        const scaleX = Math.sqrt(matrix.a * matrix.a + matrix.b * matrix.b);
        const scaleY = Math.sqrt(matrix.c * matrix.c + matrix.d * matrix.d);
        const threshold = 5 / (scaleX + scaleY); ;

        for (let i = 0; i < this.points.length - 1; i++) {
            const p1 = this.points[i];
            const p2 = this.points[i + 1];
            if (this.pointNearSegment(point, p1, p2, threshold)) return true;
        }
        return false;
    }

    private pointNearSegment(
        p: Point,
        a: Point,
        b: Point,
        threshold: number
    ): boolean {
        // Вектор AB
        const ab = new Point(b.x - a.x, b.y - a.y);
        // Вектор AP
        const ap = new Point(p.x - a.x, p.y - a.y);
        // Длина AB^2
        const abLenSquared = ab.x * ab.x + ab.y * ab.y;
    
        // Проекция точки P на отрезок AB (в виде скалярного значения от 0 до 1)
        let t = 0;
        if (abLenSquared !== 0) {
            t = (ap.x * ab.x + ap.y * ab.y) / abLenSquared;
            t = Math.max(0, Math.min(1, t)); // clamp от 0 до 1
        }
    
        // Координаты ближайшей точки на отрезке
        const closest = new Point(a.x + ab.x * t, a.y + ab.y * t);
    
        // Расстояние от точки P до ближайшей точки на отрезке
        const dx = p.x - closest.x;
        const dy = p.y - closest.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
    
        return distance <= threshold;
    }
    
    public toString(): string {
        return this.points.map(point => point.toString()).join(" -> ");
    }
}
