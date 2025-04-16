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

    public toString(): string {
        return `x: ${this.x}, y: ${this.y}`;
    }

    public distanceTo(other: Point): number {
        const dx = this._x - other._x;
        const dy = this._y - other._y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    // Операция сложения двух точек
    public add(other: Point): Point {
        return new Point(this._x + other._x, this._y + other._y);
    }

    // Операция вычитания двух точек
    public subtract(other: Point): Point {
        return new Point(this._x - other._x, this._y - other._y);
    }

    // Операция умножения точки на число (скаляр)
    public multiply(scalar: number): Point {
        return new Point(this._x * scalar, this._y * scalar);
    }

    // Операция деления точки на число (скаляр)
    public divide(scalar: number): Point {
        if (scalar === 0) {
            throw new Error("Division by zero is not allowed.");
        }
        return new Point(this._x / scalar, this._y / scalar);
    }

    // Операция отрицания точки (инверсия координат)
    public negate(): Point {
        return new Point(-this._x, -this._y);
    }
}