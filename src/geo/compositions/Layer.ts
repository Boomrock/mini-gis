import GeoObject from "@geo/primitive/GeoObject";
import Point from "@geo/primitive/Point";
import { PointInsideScreen, worldToScreen } from "@geo/utils/cameraTransformations";

export default class Layer {
    private _geoObjects: GeoObject[];
    private _topLeft: Point = new Point(0, 0);
    private _bottomRight: Point = new Point(0, 0);
    private _boundsIsUpdate: boolean = false;

    constructor(geoObjects: GeoObject[]) {
        this._geoObjects = geoObjects;
        this._boundsIsUpdate = false;
    }

    public add(object: GeoObject) {
        this._geoObjects.push(object);
        this._boundsIsUpdate = false;
    }

    // Метод для обновления границ top_left и bottom_right
    public updateBounds(): void {

        if(this._boundsIsUpdate){
            return;
        }

        if (this._geoObjects.length === 0) {
            // Если нет объектов, устанавливаем границы в (0, 0)
            this._topLeft = new Point(0, 0);
            this._bottomRight = new Point(0, 0);
            return;
        }

        // Инициализируем минимумы и максимумы первыми точками первого объекта
        let minX = Infinity;
        let minY = Infinity;
        let maxX = -Infinity;
        let maxY = -Infinity;

        // Проходим по всем объектам и их точкам
        this._geoObjects.forEach(obj => {
            obj.points.forEach(point => {
                minX = Math.min(minX, point.x);
                minY = Math.min(minY, point.y);
                maxX = Math.max(maxX, point.x);
                maxY = Math.max(maxY, point.y);
            });
        });


        if (minX === Infinity || minY === Infinity || maxX === -Infinity || maxY === -Infinity) {
            this._topLeft = new Point(0, 0);
            this._bottomRight = new Point(0, 0);
            return;
        }
        

        // Устанавливаем новые значения top_left и bottom_right
        this._topLeft = new Point(minX, minY);
        this._bottomRight = new Point(maxX, maxY);
        this._boundsIsUpdate = true;

    }

    // Геттеры для top_left и bottom_right
    get topLeft(): Point {
        this.updateBounds();
        return this._topLeft;
    }

    get bottomRight(): Point {
        this.updateBounds();
        return this._bottomRight;
    }

    // Метод для получения объектов в экранных координатах
    public screensObject(cameraX: number, cameraY: number, scale: number): GeoObject[] {
        return this._geoObjects.map(obj => {
            // Преобразуем точки объекта в экранные координаты
            const transformedPoints = obj.points.map(point =>
                worldToScreen(point.x, point.y, cameraX, cameraY, scale)
            );

            // Создаем новый объект с обновленными точками
            const transformedObject = Object.create(obj); // Клонируем объект
            transformedObject._points = transformedPoints; // Обновляем точки

            return transformedObject;
        });
    }

    public filterScreensObject(screenObjects: GeoObject[], screenHeight: number, screenWidth: number): GeoObject[] {
        return screenObjects
            .map(obj => {
                const filterPoints = obj.points.filter(screenPoint =>
                    PointInsideScreen(screenPoint, screenHeight, screenWidth)
                );
                const transformedObject = Object.create(obj); // Клонируем объект
                transformedObject._points = filterPoints;
                return transformedObject;
            })
            .filter(obj => obj._points.length > 0);
    }

    public draw(ctx: CanvasRenderingContext2D, lod: number) {
        this._geoObjects.forEach(obj => obj.draw(ctx, lod));
    }

    get objects(): GeoObject[] {
        return this._geoObjects;
    }
}