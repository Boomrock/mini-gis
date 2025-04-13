import Metadata from "@geo/Metadata";
import GeoObject from "@geo/primitive/GeoObject";
import Point from "@geo/primitive/Point";
import GeoStyle from "@geo/styles/GeoStyle";

export default class GeoPoint extends GeoObject {

    constructor(point: Point, style: GeoStyle = null, metadata: Metadata = {description:""}) {
        super([point], style, metadata);
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

    private degreesToRadians(deg) : number {
        return deg * Math.PI / 180;
      }
    
    private mercatorProjection(lat, lon): Point {

        const R = 6378137; // Радиус Земли в метрах (WGS84)
        const x = R * this.degreesToRadians(lon);
        const y = R * Math.log(Math.tan(Math.PI / 4 + this.degreesToRadians(lat) / 2));
        return new Point(x, y);
    }
}
