import Metadata from "@geo/Metadata";
import GeoObject from "@geo/primitive/GeoObject";
import Point from "@geo/primitive/Point";
import GeoStyle from "@geo/styles/GeoStyle";

class GeoText extends GeoObject {
    draw(ctx: CanvasRenderingContext2D): void {
        super.draw(ctx)
        // Начинаем новый путь
        ctx.save()
        
        ctx.fillText('Hello, Canvas!', this.point.x, this.point.y);
        this._style?.apply(ctx)

        // Рисуем контур и заливку
        ctx.stroke();
        ctx.fill(); // Уберите, если не нужна заливка
        ctx.restore();

    }
    private _text: string;

    constructor(point: Point, text: string, style: GeoStyle, selectedStyle: GeoStyle = null, metadata: Metadata = {description:""}) {
        super([point], style, selectedStyle, metadata);
        this._text = text;
    }

    get point(): Point {
        return this.points[0];
    }

    set point(value: Point) {
        this.points[0] = value;
    }


    get text(): string {
        return this._text;
    }

    set text(value: string) {
        this._text = value;
    }
    
    public toString(): string {
        return `(${this._text})`;
    }
}
