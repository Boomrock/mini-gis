import Metadata from "@geo/Metadata";
import Point from "@geo/primitive/Point";
import GeoObject from "@geo/primitive/GeoObject";
import GeoStyle from "@geo/styles/GeoStyle";

export default class Polygon extends GeoObject {
    constructor(points: Point[], style: GeoStyle = null, metadata: Metadata = {description:""}) {
        super(points, style, metadata);
        if (points.length < 3) {
            throw new Error("A polygon must have at least three points.");
        }
    }
    public draw(ctx: CanvasRenderingContext2D, lod: number): void {
        super.draw(ctx, lod)
        // Начинаем новый путь
        ctx.save()
        ctx.beginPath();
        
        // Перемещаемся к первой точке
        const points = this.points;
        if (points.length < 3) return; // Защита (хотя проверка уже в конструкторе)
        
        ctx.moveTo(points[0].x, points[0].y);
        
        // Соединяем все точки
        for (let i = 1; i < points.length; i = i + lod) {
            ctx.lineTo(points[i].x, points[i].y);
        }
        
        // Закрываем путь (соединяем последнюю точку с первой)
        ctx.closePath();
        
        this._style?.apply(ctx)

        // Рисуем контур и заливку
        ctx.stroke();
        ctx.fill(); // Уберите, если не нужна заливка
        ctx.restore();
    }
    public toString(): string {
        return this.points.map(point => point.toString()).join(" -> ") + " -> " + this.points[0].toString();
    }
}