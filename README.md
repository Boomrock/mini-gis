# Mini GIS

A simple geographic information system built using **Vite** and **Electron**, allowing you to work with **GeoJSON** files. The system provides basic functionality for visualizing data and measuring distances on a map.

---

## Key Features

- **GeoJSON File Reading**: Load and display geographic data from `.geojson` files.
- **Distance Measurement (Rulers)**:
  - Press `S` to start placing points as a **line segment**.
  - Press `R` to start placing points as a **polyline**.
- **Point Placement**: Points for measurements can be placed using the **right mouse button**.
- **Lightweight and Fast Startup**: Thanks to Vite, the application starts and compiles quickly.

---

## Installation and Launch

### Prerequisites

To work with the project, ensure you have the following dependencies installed:

- [Node.js](https://nodejs.org/) (version 16 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Steps to Launch

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-repository/Mini-GIS.git
   cd Mini-GIS
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```
   or
   ```bash
   yarn install
   ```

3. **Run the Application in Development Mode**:
   ```bash
   npm run dev
   ```
   or
   ```bash
   yarn dev
   ```

4. **Build the Application**:
   To create a production build, run:
   ```bash
   npm run build
   ```
   or
   ```bash
   yarn build
   ```

5. **Run the Built Application**:
   After building, you can launch the application using:
   ```bash
   npm run start
   ```
   or
   ```bash
   yarn start
   ```

---

## Usage

### Loading a GeoJSON File

1. Open the application.
2. Use the corresponding button or menu in the interface to load a `.geojson` file.
3. Once loaded, the data will be displayed on the map.

### Measuring Distances

1. Press `S` or `R` to activate measurement mode:
   - Key `S`: Creates a **line segment** between two points.
   - Key `R`: Creates a **polyline** consisting of multiple points.
2. Right-click on the map to place the first point.
3. Continue right-clicking to add points and construct the ruler.
4. The distance between points will be automatically calculated and displayed on the screen.
5. To reset the current measurement, press `S` or `R` again.

---

## Implementation Details

- **Line Segment (`S`)**: This mode allows you to measure the distance between two points. Measurement completes automatically after placing the second point.
- **Polyline (`R`)**: This mode allows you to sequentially add points and measure the total distance along a broken line. To finish the measurement, press `R` again.

---

## License

This project is distributed under the [MIT](LICENSE) license. You are free to use, modify, and distribute it in accordance with the license terms.

---

## Support

If you have any questions or issues, please create an issue in the repository or contact the author through the contact details provided in the profile.

---

**Thank you for using Mini GIS!**

---

### Additional Notes

- **Limitations**: The current version only supports GeoJSON files. If you need support for other formats, please let us know by creating an issue.
