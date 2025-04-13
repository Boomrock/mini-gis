import GeoStyle from "./GeoStyle";

// Класс PolygonStyle с настройками стилей
export default class PolygonStyle extends GeoStyle {
    private _fillStyle: string = '#00F2'; // Полупрозрачный синий фон по умолчанию
    private _strokeStyle: string = '#000'; // Цвет контура по умолчанию
    private _lineWidth: number = 2; // Толщина линии по умолчанию

    // Геттеры и сеттеры для настройки стилей
    get fillStyle(): string {
        return this._fillStyle;
    }

    set fillStyle(value: string) {
        this._fillStyle = value;
    }

    get strokeStyle(): string {
        return this._strokeStyle;
    }

    set strokeStyle(value: string) {
        this._strokeStyle = value;
    }

    get lineWidth(): number {
        return this._lineWidth;
    }

    set lineWidth(value: number) {
        if (value <= 0) {
            throw new Error("Line width must be greater than zero.");
        }
        this._lineWidth = value;
    }

    // Метод apply применяет стили к контексту
    apply(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = this._fillStyle;
        ctx.strokeStyle = this._strokeStyle;
        const matrix = ctx.getTransform();
        const scaleX = Math.sqrt(matrix.a * matrix.a + matrix.b * matrix.b);
        const scaleY = Math.sqrt(matrix.c * matrix.c + matrix.d * matrix.d);
        ctx.lineWidth = this._lineWidth / (scaleX + scaleY); // Учитываем масштаб
    }
}

// Константный стиль: Полупрозрачный красный фон, черный контур, толщина 2
export const RedPolygonStyle = new PolygonStyle();
RedPolygonStyle.fillStyle = '#FF0000'; // Полупрозрачный красный
RedPolygonStyle.strokeStyle = '#000';    // Черный контур
RedPolygonStyle.lineWidth = 2;           // Толщина линии

// Константный стиль: Полупрозрачный зеленый фон, белый контур, толщина 3
export const GreenPolygonStyle = new PolygonStyle();
GreenPolygonStyle.fillStyle = '#00FF00'; // Полупрозрачный зеленый
GreenPolygonStyle.strokeStyle = '#FFF';     // Белый контур
GreenPolygonStyle.lineWidth = 3;            // Толщина линии

// Константный стиль: Полупрозрачный синий фон, желтый контур, толщина 1
export const BluePolygonStyle = new PolygonStyle();
BluePolygonStyle.fillStyle = '#0000FF'; // Полупрозрачный синий
BluePolygonStyle.strokeStyle = '#FF0';    // Желтый контур
BluePolygonStyle.lineWidth = 1;           // Толщина линии
