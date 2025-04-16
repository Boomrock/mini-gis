import GeoStyle from "@geo/styles/GeoStyle";

export default class PolylineStyle extends GeoStyle {
    private _fillStyle: string = '#33bbff'; // Цвет линии по умолчанию
    private _radius: number = 2;          // Толщина линии по умолчанию

    // Геттеры и сеттеры для настройки стилей
    get fillStyle(): string {
        return this._fillStyle;
    }

    set fillStyle(value: string) {
        this._fillStyle = value;
    }

    get radius(): number {
        return this._radius;
    }

    set radius(value: number) {
        if (value <= 0) {
            throw new Error("Line width must be greater than zero.");
        }
        this._radius = value;
    }


    // Метод apply применяет стили к контексту
    apply(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = this.fillStyle;

        const matrix = ctx.getTransform();
        const scaleX = Math.sqrt(matrix.a * matrix.a + matrix.b * matrix.b);
        const scaleY = Math.sqrt(matrix.c * matrix.c + matrix.d * matrix.d);

        // Устанавливаем толщину линии с учетом масштаба
        ctx.lineWidth = this._radius / Math.max(scaleX, scaleY);

        // Устанавливаем тип линии (сплошная или пунктирная)
    }
}

// Константный стиль: Сплошная синяя линия, толщина 2
export const BluePoint = new PolylineStyle();
BluePoint.fillStyle = '#33bbff';
BluePoint.radius = 10;

// Константный стиль: Пунктирная красная линия, толщина 3
export const RedPoint = new PolylineStyle();
RedPoint.fillStyle = '#ff3333';
RedPoint.radius = 3;

// Константный стиль: Сплошная зеленая линия, толщина 1
export const GreenPoint = new PolylineStyle();
GreenPoint.fillStyle = '#33ff33';
GreenPoint.radius = 3;

// Константный стиль: Пунктирная черная линия, толщина 2
export const BlackPoint = new PolylineStyle();
BlackPoint.fillStyle = '#000000';
BlackPoint.radius = 2;