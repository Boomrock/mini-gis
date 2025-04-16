// LayerManager.ts
import GeoObject from "@geo/primitive/GeoObject";
import Layer from "@geo/compositions/Layer";
import Point from "@geo/primitive/Point";
import { parseGeoJSON } from "@geo/ParserGeoJSON";
import { CanvasManager } from "./CanvasManager";

interface LayerData {
    layer: Layer;
    visible: boolean;
}

export class LayerManager {
    private layers: Map<HTMLDivElement, LayerData> = new Map();
    private container: HTMLDivElement;
    private canvasManager: CanvasManager;
    selectedObject: GeoObject;

    constructor(canvasManager: CanvasManager, containerId: string) {
        this.canvasManager = canvasManager;
        this.container = document.getElementById(containerId) as HTMLDivElement;
    }

    public addLayer(geojsonContent: string, name: string): void {
        try {
            const jsonData = JSON.parse(geojsonContent);
            const layer = parseGeoJSON(jsonData, name);
            const layerElement = this.createLayerElement(name);

            this.container.appendChild(layerElement);
            this.layers.set(layerElement, { layer, visible: true });

            this.canvasManager.centerLayer(layer.topLeft, layer.bottomRight);
        } catch (e) {
            console.error("Invalid GeoJSON:", e);
        }
    }

    private createLayerElement(name: string): HTMLDivElement {
        const layerDiv = document.createElement('div');
        layerDiv.className = 'layer-item';
        layerDiv.draggable = true;
        layerDiv.textContent = name;

        const controlsDiv = document.createElement('div');
        controlsDiv.className = 'controls';

        const createButton = (text: string, title: string, handler: () => void) => {
            const btn = document.createElement('button');
            btn.textContent = text;
            btn.title = title;
            btn.onclick = handler;
            return btn;
        };

        controlsDiv.appendChild(createButton('👁️', 'Toggle Visibility', () => this.toggleLayerVisibility(layerDiv)));
        controlsDiv.appendChild(createButton('⬆️', 'Move Up', () => this.moveLayerUp(layerDiv)));
        controlsDiv.appendChild(createButton('⬇️', 'Move Down', () => this.moveLayerDown(layerDiv)));
        controlsDiv.appendChild(createButton('❌', 'Remove', () => this.removeLayer(layerDiv)));

        layerDiv.appendChild(controlsDiv);
        return layerDiv;
    }

    public toggleLayerVisibility(layerDiv: HTMLDivElement): void {
        const data = this.layers.get(layerDiv);
        if (data) {
            data.visible = !data.visible;
            const eyeBtn = layerDiv.querySelector('button[title="Toggle Visibility"]');
            if (eyeBtn) {
                eyeBtn.textContent = data.visible ? '👁️' : '🚫';
            }
            this.canvasManager.requestRender?.();
        }
    }

    public removeLayer(layer: HTMLDivElement): void {
        this.container.removeChild(layer);
        const layerData = this.layers.get(layer);
        if (layerData?.layer.objects.includes(this.selectedObject)) {
            this.selectedObject = null;
        }
        this.layers.delete(layer);
        this.canvasManager.requestRender();
    }

    public moveLayerUp(layer: HTMLDivElement): void {
        const prev = layer.previousElementSibling as HTMLElement | null;
        if (prev) {
            this.container.insertBefore(layer, prev);
            this.canvasManager.requestRender();
        }
    }

    public moveLayerDown(layer: HTMLDivElement): void {
        const next = layer.nextElementSibling?.nextElementSibling;
        if (next) {
            this.container.insertBefore(layer, next);
        } else {
            this.container.appendChild(layer);
        }
        this.canvasManager.requestRender();
    }

    public selectObjectAt(point: Point): void {
        for (const layer of this.getVisibleLayers()) {
            for (const obj of layer.objects) {
                if (obj.contains(point, this.canvasManager.ctx)) {
                    this.selectedObject = obj;
                    this.canvasManager.requestRender();
                    return;
                }
            }
        }
        this.selectedObject = null;
    }

    public getVisibleLayers(): Layer[] {
        const visibleLayers: Layer[] = [];
        this.layers.forEach(layerData => {
            if (layerData.visible) {
                visibleLayers.push(layerData.layer);
            }
        });
        return visibleLayers;
    }

    public drawLayers(ctx: CanvasRenderingContext2D): void {
        let children = Array.from(this.container.children) as HTMLDivElement[];
        children = children.reverse();
        for (const layerDiv of children) {
            const data = this.layers.get(layerDiv);
            if (data && data.visible) {
                data.layer.draw(ctx);
            }
        }
        this.selectedObject?.draw(ctx, true);
    }
}
