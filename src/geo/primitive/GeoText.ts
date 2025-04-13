import Metadata from "@geo/Metadata";
import GeoObject from "@geo/primitive/GeoObject";
import Point from "@geo/primitive/Point";

class GeoText extends GeoObject {
    draw(ctx: CanvasRenderingContext2D): void {
    }
    private _text: string;

    constructor(point: Point, text: string, metadata: Metadata = {description:""}) {
        super([point], metadata);
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
