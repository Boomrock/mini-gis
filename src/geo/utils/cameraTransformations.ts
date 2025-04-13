import Point from "@geo/primitive/Point.js";

export function worldToScreen(worldX: number, worldY: number, cameraX: number, cameraY: number, scale: number): Point {
    const screenX = (worldX - cameraX) * scale;
    const screenY = (worldY - cameraY) * scale;
    return new Point(screenX, screenY);
}
export function PointInsideScreen(point: Point, screenHeight: number, screenWidht: number): boolean{
    return point.y >= 0 && point.y < screenHeight && point.x >= 0 && point.x < screenWidht;
}