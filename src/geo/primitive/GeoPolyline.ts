import Metadata from "@geo/Metadata";
import GeoObject from "@geo/primitive/GeoObject";
import Point from "@geo/primitive/Point";
import GeoStyle from "@geo/styles/GeoStyle";

export default class GeoPolyline extends GeoObject {

    constructor(points: Point[], style: GeoStyle = null, metadata: Metadata = {description:""}) {
        super(points, style, metadata);
    }

    public draw(ctx: CanvasRenderingContext2D, lod: number): void {
        super.draw(ctx, lod)
        ctx.beginPath();
        ctx.save()
        ctx.moveTo(this.points[0].x, this.points[0].y);
        
        for (let i = 1; i < this.points.length; i += lod) {
            ctx.lineTo(this.points[i].x, this.points[i].y);
        }
        this._style?.apply(ctx)
        ctx.stroke();
        ctx.restore();
    }
    public toString(): string {
        return this.points.map(point => point.toString()).join(" -> ");
    }
}
