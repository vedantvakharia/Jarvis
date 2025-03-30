### **1. Plotting and Graphing**

- `pg.plot(data, **kwargs)`: Quickly create a plot with the given data.
- `pg.plot(x, y, **kwargs)`: Plot `x` vs. `y` values.
- `pg.PlotWidget`: Widget for embedding plots in a PyQt application.
- `pg.PlotItem`: Handles the creation and management of plots within a widget.
- `pg.PlotDataItem`: Represents the actual data being plotted.

---

### **2. Widgets**

- `pg.GraphicsLayoutWidget`: A widget for organizing multiple plots or graphics.
- `pg.ViewBox`: Provides zooming, panning, and interactive view controls.
- `pg.ImageView`: Displays and analyzes image data (e.g., 2D arrays).
- `pg.TableWidget`: Displays tabular data.
- `pg.TreeWidget`: Displays hierarchical data in a tree structure.

---

### **3. Data Visualization**

- `pg.ImageItem`: Represents 2D image data.
- `pg.ColorBarItem`: Adds a color bar for interpreting color-mapped data.
- `pg.ScatterPlotItem`: Displays points for scatter plots.
- `pg.ErrorBarItem`: Adds error bars to plots.
- `pg.BarGraphItem`: Draws bar graphs.

---

### **4. Customization**

- `pg.setConfigOption(option, value)`: Configures global options (e.g., background color, antialiasing).
- `pg.setConfigOptions(**kwargs)`: Set multiple global options at once.
- `pg.mkBrush(*args, **kwargs)`: Create a brush for filling shapes.
- `pg.mkPen(*args, **kwargs)`: Create a pen for drawing lines.

---

### **5. Graphics and Layouts**

- `pg.GraphicsLayout`: A layout manager for graphics objects.
- `pg.GraphicsItem`: Base class for custom graphics items.
- `pg.AxisItem`: Customizable axis for plots.
- `pg.LabelItem`: Adds text labels to graphics layouts.
- `pg.TextItem`: Adds text annotations to plots.

---

### **6. Utilities**

- `pg.SpinBox`: A numerical input widget with spin buttons.
- `pg.ProgressDialog`: Displays a progress bar dialog.
- `pg.SignalProxy`: Converts high-frequency signals into manageable ones (e.g., mouse events).
- `pg.functions.siFormat(value)`: Formats numbers using SI prefixes.
- `pg.functions.logRange(min, max)`: Calculates a logarithmic range.

---

### **7. 3D Visualization**

- `pg.opengl.GLViewWidget`: Main widget for 3D visualization.
- `pg.opengl.GLAxisItem`: Adds axes to a 3D view.
- `pg.opengl.GLGridItem`: Adds a grid to the 3D view.
- `pg.opengl.GLScatterPlotItem`: Displays 3D scatter plots.

---

### **8. Interactive Features**

- `pg.MultiPlotItem`: Supports linked plots with multiple data series.
- `pg.Crosshair`: A tool for adding interactive crosshairs to plots.
- `pg.LinearRegionItem`: Creates selectable and zoomable regions in plots.
- `pg.InfiniteLine`: Adds draggable infinite lines for markers.

---

### **9. Signal and Event Handling**

- `pg.SignalProxy`: Reduces the frequency of Qt signals (e.g., for mouse movement events).
- `pg.InputField`: For creating input widgets within the graphics scene.

---

### **10. Exporting and IO**

- `pg.exporters.ImageExporter`: Exports plots as image files.
- `pg.exporters.CSVExporter`: Exports plot data as CSV files.

---

### **11. Debugging and Testing**

- `pg.debug`: Utilities for debugging, such as monitoring frame rates