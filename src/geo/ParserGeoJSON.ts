import Layer from "@geo/compositions/Layer";
import GeoPoint from "@geo/primitive/GeoPoint";
import Polygon from "@geo/primitive/GeoPolygon";
import Point from "./primitive/Point";
import GeoPolyline from "./primitive/GeoPolyline";
import { GreenPolygonStyle, RedPolygonStyle } from "./styles/PolygonStyle";
import PolylineStyle, { SolidBluePolylineStyle } from "./styles/PolylineStyle";

export const parseGeoJSON = (geoJSON, layerName) => {
  const layer = new Layer([]);

  geoJSON.features.forEach((feature) => {
    const geometry = feature.geometry;

    switch (geometry.type) {
      case 'Point':
        if (geometry.coordinates.length === 2) {
          const point = new GeoPoint(modifyCoords(geometry.coordinates));
          layer.add(point);
        }
        break;

      case 'LineString':
        if (Array.isArray(geometry.coordinates)) {
          const lineCoords = geometry.coordinates.map(
            (coord) => modifyCoords(coord)
          );
          layer.add(new GeoPolyline(lineCoords, SolidBluePolylineStyle));
        }
        break;

      case 'Polygon':
        if (Array.isArray(geometry.coordinates) && Array.isArray(geometry.coordinates[0])) {
          const polygonCoords = geometry.coordinates[0].map(
            (coord) => modifyCoords(coord)
          );
          layer.add(new Polygon(polygonCoords, GreenPolygonStyle));
        }
        break;

      case 'MultiLineString':
        if (Array.isArray(geometry.coordinates)) {
          geometry.coordinates.forEach((lineCoords) => {
            if (Array.isArray(lineCoords)) {
              const linePoints = lineCoords.map((coord) => modifyCoords(coord));
              layer.add(new GeoPolyline(linePoints, RedPolygonStyle));
            }
          });
        }
        break;

      case 'MultiPolygon':
        if (Array.isArray(geometry.coordinates)) {
          geometry.coordinates.forEach((polygonCoords) => {
            if (Array.isArray(polygonCoords) && Array.isArray(polygonCoords[0])) {
              const polygonPoints = polygonCoords[0].map(
                (coord) => modifyCoords(coord)
              );
              layer.add(new Polygon(polygonPoints, RedPolygonStyle));
            }
          });
        }
        break;

      default:
        console.warn(`Unsupported geometry type: ${geometry.type}`);
        break;
    }

  });

  return layer;
};
export const scaleFactor = 100;

function geoToMercator(coord) {
    const [lon, lat] = coord;
    const R = 6378137 * scaleFactor; // Радиус сферы (WGS84), м [[6]]
    const latRad = (lat * Math.PI) / 180;
    const lonRad = (lon * Math.PI) / 180;
  
    // Формула проекции Меркатора
    const x = R * lonRad;
    const y = R * Math.log(Math.tan(Math.PI / 4 + latRad / 2));
    
    return [x, y];
  }
function modifyCoords(coord: any): Point {
    coord = geoToMercator(coord);
    return new Point(coord[0], coord[1] * -1);
}
