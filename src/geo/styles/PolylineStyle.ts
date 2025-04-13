import GeoStyle from "@geo/styles/GeoStyle";

export default class PolylineStyle extends GeoStyle {
    private _strokeStyle: string = '#33bbff'; // Цвет линии по умолчанию
    private _lineWidth: number = 2;          // Толщина линии по умолчанию
    private _lineDash: number[] = [];        // Тип линии: [] — сплошная, [5, 5] — пунктирная

    // Геттеры и сеттеры для настройки стилей
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

    get lineDash(): number[] {
        return this._lineDash;
    }

    set lineDash(value: number[]) {
        this._lineDash = value;
    }

    // Метод apply применяет стили к контексту
    apply(ctx: CanvasRenderingContext2D): void {
        ctx.strokeStyle = this._strokeStyle;

        const matrix = ctx.getTransform();
        const scaleX = Math.sqrt(matrix.a * matrix.a + matrix.b * matrix.b);
        const scaleY = Math.sqrt(matrix.c * matrix.c + matrix.d * matrix.d);

        // Устанавливаем толщину линии с учетом масштаба
        ctx.lineWidth = this._lineWidth / Math.max(scaleX, scaleY);

        // Устанавливаем тип линии (сплошная или пунктирная)
        ctx.setLineDash(this._lineDash);
    }
}

// Константный стиль: Сплошная синяя линия, толщина 2
export const SolidBluePolylineStyle = new PolylineStyle();
SolidBluePolylineStyle.strokeStyle = '#33bbff';
SolidBluePolylineStyle.lineWidth = 10;

// Константный стиль: Пунктирная красная линия, толщина 3
export const DashedRedPolylineStyle = new PolylineStyle();
DashedRedPolylineStyle.strokeStyle = '#ff3333';
DashedRedPolylineStyle.lineWidth = 3;
DashedRedPolylineStyle.lineDash = [5, 5]; // Пунктирная линия

// Константный стиль: Сплошная зеленая линия, толщина 1
export const SolidGreenPolylineStyle = new PolylineStyle();
SolidGreenPolylineStyle.strokeStyle = '#33ff33';
SolidGreenPolylineStyle.lineWidth = 3;

// Константный стиль: Пунктирная черная линия, толщина 2
export const DashedBlackPolylineStyle = new PolylineStyle();
DashedBlackPolylineStyle.strokeStyle = '#000000';
DashedBlackPolylineStyle.lineWidth = 2;
DashedBlackPolylineStyle.lineDash = [10, 10]; // Пунктирная линия