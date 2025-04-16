import Metadata from "@geo/Metadata";
import Point from "@geo/primitive/Point";
import GeoObject from "@geo/primitive/GeoObject";
import GeoStyle from "@geo/styles/GeoStyle";

export default class Polygon extends GeoObject {
    constructor(points: Point[], style: GeoStyle = null, selectedStyle: GeoStyle = null, metadata: Metadata = {description:""}) {
        super(points, style, selectedStyle, metadata);
        if (points.length < 3) {
            throw new Error("A polygon must have at least three points.");
        }
    }
    contains(point: Point): boolean {
        // алгоритм "луча" — определяет, внутри ли точка полигона
        let inside = false;
        const n = this.points.length;
        for (let i = 0, j = n - 1; i < n; j = i++) {
            const pi = this.points[i], pj = this.points[j];
            if ((pi.y > point.y) !== (pj.y > point.y) &&
                point.x < (pj.x - pi.x) * (point.y - pi.y) / (pj.y - pi.y) + pi.x) {
                inside = !inside;
            }
        }
        return inside;
    }
    
    public draw(ctx: CanvasRenderingContext2D, isSelected: boolean = false): void {
        super.draw(ctx)
        // Начинаем новый путь
        ctx.save()
        ctx.beginPath();
        
        // Перемещаемся к первой точке
        const points = this.points;
        if (points.length < 3) return; // Защита (хотя проверка уже в конструкторе)
        
        ctx.moveTo(points[0].x, points[0].y);
        
        // Соединяем все точки
        for (let i = 1; i < points.length; i += 1) {
            ctx.lineTo(points[i].x, points[i].y);
        }
        
        // Закрываем путь (соединяем последнюю точку с первой)
        ctx.closePath();
        if(isSelected){
            this._selectedStyle.apply(ctx);
        }
        else{
            this._style?.apply(ctx);
        }

        // Рисуем контур и заливку
        ctx.stroke();
        ctx.fill(); // Уберите, если не нужна заливка
        ctx.restore();
    }
    public toString(): string {
        return this.points.map(point => point.toString()).join(" -> ") + " -> " + this.points[0].toString();
    }
}