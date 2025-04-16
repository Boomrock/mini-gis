import Layer from "@geo/compositions/Layer";
import GeoPoint from "@geo/primitive/GeoPoint";
import Polygon from "@geo/primitive/GeoPolygon";
import GeoPolyline from "./primitive/GeoPolyline";
import { GreenPolygonStyle, RedPolygonStyle } from "./styles/PolygonStyle";
import PolylineStyle, { SolidBluePolylineStyle, SolidGreenPolylineStyle } from "./styles/PolylineStyle";
import { GreenPoint } from "./styles/PointStyle";
import GeoProjection from "./utils/GeoProjection";

export const parseGeoJSON = (geoJSON, layerName) => {
  const layer = new Layer([]);

  geoJSON.features.forEach((feature) => {
    const geometry = feature.geometry;

    switch (geometry.type) {
      case 'Point':
        if (geometry.coordinates.length === 2) {
          const point = new GeoPoint(GeoProjection.toMercator(geometry.coordinates), GreenPoint);
          layer.add(point);
        }
        break;

      case 'LineString':
        if (Array.isArray(geometry.coordinates)) {
          const lineCoords = geometry.coordinates.map(
            (coord) => GeoProjection.toMercator(coord)
          );
          layer.add(new GeoPolyline(lineCoords, SolidBluePolylineStyle,SolidGreenPolylineStyle ));
        }
        break;

      case 'Polygon':
        if (Array.isArray(geometry.coordinates) && Array.isArray(geometry.coordinates[0])) {
          const polygonCoords = geometry.coordinates[0].map(
            (coord) => GeoProjection.toMercator(coord)
          );
          layer.add(new Polygon(polygonCoords, GreenPolygonStyle, RedPolygonStyle));
        }
        break;

      case 'MultiLineString':
        if (Array.isArray(geometry.coordinates)) {
          geometry.coordinates.forEach((lineCoords) => {
            if (Array.isArray(lineCoords)) {
              const linePoints = lineCoords.map((coord) => GeoProjection.toMercator(coord));
              layer.add(new GeoPolyline(linePoints, SolidGreenPolylineStyle, SolidBluePolylineStyle));
            }
          });
        }
        break;

      case 'MultiPolygon':
        if (Array.isArray(geometry.coordinates)) {
          geometry.coordinates.forEach((polygonCoords) => {
            if (Array.isArray(polygonCoords) && Array.isArray(polygonCoords[0])) {
              const polygonPoints = polygonCoords[0].map(
                (coord) => GeoProjection.toMercator(coord)
              );
              layer.add(new Polygon(polygonPoints, GreenPolygonStyle, RedPolygonStyle));
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

