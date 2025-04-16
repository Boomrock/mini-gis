import Metadata from "@geo/Metadata";
import Point from "@geo/primitive/Point";
import GeoStyle from "@geo/styles/GeoStyle";

export default abstract class GeoObject {

    static transformMatrix: DOMMatrix = new DOMMatrix();
    
    public points : Point[];
    
    protected _metadata : Metadata;
    protected _pivot: Point = new Point(0, 0);
    protected _style: GeoStyle;
    protected _selectedStyle: GeoStyle;

    constructor(points: Point[], style: GeoStyle = null, selectedStyle: GeoStyle = null, metadata: Metadata = {description:""}) {
        this._metadata = metadata;
        this.points = points;
        if(this.points.length > 0){
            this._pivot = this.getAveragePoint()!;
        }
        this._style = style;
        this._selectedStyle = selectedStyle;
    }

    get metadata(): Metadata {
        return this._metadata;
    }

    set metadata(value: Metadata) {
        this._metadata = value;
    }
    
    public getAveragePoint(): Point | null {
        if (this.points.length === 0) {
            return null; // Если массив пустой, возвращаем null
        }

        const sum = this.points.reduce((acc, point) => {
            acc.x += point.x;
            acc.y += point.y;
            return acc;
        }, { x: 0, y: 0 });

        const averageX = sum.x / this.points.length;
        const averageY = sum.y / this.points.length;

        return new Point(averageX, averageY);
    }

    // Базовые аффинные преобразования
    public static translate(dx: number, dy: number): void {
        this.transformMatrix.translateSelf(dx, dy);
    }

    public static rotate(angle: number): void {
        this.transformMatrix.rotateSelf(angle);
    }

    public static scale(scaleX: number, scaleY: number = scaleX, center: Point): void {
        this.transformMatrix.translateSelf(center.x, center.y)
        this.transformMatrix.scaleSelf(scaleX, scaleY);
        this.transformMatrix.translateSelf(-center.x, -center.y)
    }

    public static clear(): void{
        this.transformMatrix = new DOMMatrix();
    }

    public static transform(ctx: CanvasRenderingContext2D){
        ctx.transform(
            GeoObject.transformMatrix.a,
            GeoObject.transformMatrix.b,
            GeoObject.transformMatrix.c,
            GeoObject.transformMatrix.d,
            GeoObject.transformMatrix.e,
            GeoObject.transformMatrix.f
        );
    }
    // Абстрактные методы
    public contains(point: Point, ctx: CanvasRenderingContext2D = null):boolean{ return false; }
    public draw(ctx: CanvasRenderingContext2D, isSelected: boolean = false): void{};
    abstract toString(): string;
}
