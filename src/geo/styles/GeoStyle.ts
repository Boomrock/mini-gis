import Metadata from "@geo/Metadata";
import Point from "@geo/primitive/Point";
import GeoObject from "@geo/primitive/GeoObject";

// Абстрактный класс GeoStyle
export default abstract class GeoStyle {
    abstract apply(ctx: CanvasRenderingContext2D): void;
}

