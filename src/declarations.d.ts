interface Window {
    electronAPI: {
      openFile: () => void;
      onFileSelected: (callback: (filePath: string) => void) => void;
    };
  }