import GeoStyle from "@geo/styles/GeoStyle";

export default class TextStyle extends GeoStyle {
    // Публичные свойства, которые можно менять после создания экземпляра
    public color: string = "black";
    public fontSize: number = 100;
    public fontFamily: string = "Arial";

    // Применяет стиль к контексту рисования
    apply(ctx: CanvasRenderingContext2D): void {
        const matrix = ctx.getTransform();

        // Вычисляем масштаб (учитываем аффинное преобразование)
        const scaleX = Math.sqrt(matrix.a * matrix.a + matrix.b * matrix.b);
        const scaleY = Math.sqrt(matrix.c * matrix.c + matrix.d * matrix.d);

        // Настраиваем цвет и шрифт с компенсацией масштаба
        ctx.fillStyle = this.color;
        ctx.font = `${this.fontSize / (scaleX + scaleY)}px ${this.fontFamily}`;
    }
}
export const defaultText:TextStyle  = new TextStyle(); 
