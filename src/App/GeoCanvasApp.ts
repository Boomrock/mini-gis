// GeoCanvasApp.ts
import { CanvasManager } from "./CanvasManager";
import { InputManager } from "./InputManager";
import { LayerManager } from "./LayerManager";
import { RenderEngine } from "./RenderEngine";
import { FileHandler } from "./FileHandler";

export default class GeoCanvasApp {
    private canvasManager: CanvasManager;
    private inputManager: InputManager;
    private layerManager: LayerManager;
    private renderEngine: RenderEngine;
    private fileHandler: FileHandler;

    constructor() {
        this.canvasManager = new CanvasManager('canvas');
        this.layerManager = new LayerManager(this.canvasManager, 'layers-container');
        this.inputManager = new InputManager(this.canvasManager, this.layerManager, 'layers-container');
        this.renderEngine = new RenderEngine(this.canvasManager, this.inputManager, this.layerManager);
        this.fileHandler = new FileHandler(this.layerManager);
        console.log("GeoCanvasApp")
        this.initialize();
    }
    
    private initialize(): void {
        this.renderEngine.startRenderLoop();
        // Подписка на событие выбора файла (через API Electron)
        window.electronAPI.onFileSelected((content: any) => this.fileHandler.onFileSelected(content));
    }
    
    public dispose(): void {
        // Открепляем слушатели событий и останавливаем цикл отрисовки
        // Для каждого модуля можно реализовать свои методы dispose
        this.renderEngine.stopRenderLoop();
    }
}
