export default class Point {
    private _x: number;
    private _y: number;

    constructor(x: number, y: number) {
        this._x = x;
        this._y = y;
    }

    get x(): number {
        return this._x;
    }

    set x(value: number) {
        this._x = value;
    }

    get y(): number {
        return this._y;
    }

    set y(value: number) {
        this._y = value;
    }
    public toString():string{
        return "x: " + this.x + " y: " + this.y
    }
    public distanceTo(other: Point): number {
        const dx = this._x - other._x;
        const dy = this._y - other._y;
        return Math.sqrt(dx * dx + dy * dy);
    }
}
