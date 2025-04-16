// GeoProjection.ts

import Point from "@geo/primitive/Point";

export const scaleFactor = 100;

export default class GeoProjection {
  private static readonly R = 6378137 * scaleFactor;

  /**
   * Преобразует координаты [долгота, широта] в проекцию Меркатора (x, y).
   */
  public static toMercator(coord: [number, number]): Point {
    const [lon, lat] = coord;
    const latRad = (lat * Math.PI) / 180;
    const lonRad = (lon * Math.PI) / 180;

    const x = this.R * lonRad;
    const y = this.R * Math.log(Math.tan(Math.PI / 4 + latRad / 2));

    return new Point(x, -y); // инвертируем y для Canvas-системы координат
  }

  /**
   * Обратное преобразование из проекции Меркатора (x, y) в [долгота, широта].
   */
  public static fromMercator(point: Point): [number, number] {
    const x = point.x;
    const y = -point.y; // обратно инвертируем y

    const lon = (x / this.R) * (180 / Math.PI);
    const lat = (2 * Math.atan(Math.exp(y / this.R)) - Math.PI / 2) * (180 / Math.PI);

    return [lon, lat];
  }
}

