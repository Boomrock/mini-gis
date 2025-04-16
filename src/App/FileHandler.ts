// FileHandler.ts
import { LayerManager } from "./LayerManager";

export class FileHandler {
    private layerManager: LayerManager;
    
    constructor(layerManager: LayerManager) {
        this.layerManager = layerManager;
        console.log("FileHandler")
        this.setupFileButton();
    }
    
    private setupFileButton(): void {
        const fileBtn = document.getElementById('open-file-btn');
        if (fileBtn) {
            console.log("setupFileButton")

            fileBtn.addEventListener('click', () => window.electronAPI.openFile());
        }
    }
    
    // Метод, вызываемый по событию выбора файла
    public onFileSelected({content, name}): void {
        name = this.getFileNameFromPath(name);
        this.layerManager.addLayer(content, name);
    }
    private getFileNameFromPath(path) {
        const parts = path.split(/[/\\]/); // Разделяем путь по '/' или '\'
        return parts[parts.length - 1];  // Возвращаем последний элемент
    }
}
