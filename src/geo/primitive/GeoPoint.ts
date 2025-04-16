import Metadata from "@geo/Metadata";
import GeoObject from "@geo/primitive/GeoObject";
import Point from "@geo/primitive/Point";
import GeoStyle from "@geo/styles/GeoStyle";

export default class GeoPoint extends GeoObject {

    constructor(point: Point, style: GeoStyle = null, selectedStyle: GeoStyle = null,  metadata: Metadata = {description:""}) {
        super([point], style, selectedStyle, metadata);
    }

    get point(): Point {
        return this.points[0];
    }

    set point(value: Point) {
        this.points[0] = value;
    }

    public toString(): string {
        return `(${this.points[0].toString()})`;
    }
    public draw(ctx: CanvasRenderingContext2D, isSelected: boolean = false): void {
        super.draw(ctx);
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.point.x, this.point.y, 5, 0, Math.PI * 2); // x, y, радиус, начальный угол, конечный угол
        if(isSelected){
            this._selectedStyle.apply(ctx);
        }
        else{
            this._style?.apply(ctx);
        }
        ctx.fill();
        ctx.stroke();
        ctx.restore()
    }
    contains(point: Point): boolean {
        const radius = 5; // радиус точки
        const dx = this.point.x - point.x;
        const dy = this.point.y - point.y;
        return dx * dx + dy * dy <= radius * radius;
    }
    private degreesToRadians(deg) : number {
        return deg * Math.PI / 180;
      }
    

}
