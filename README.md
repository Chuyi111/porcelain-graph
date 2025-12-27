# Porcelain Knowledge Graph

A web-based knowledge graph application for studying and organizing porcelain-related information. Connect porcelains to their techniques, materials, shapes, glazes, patterns, kilns, periods, sources, and images through an interactive graph interface.

## Features

- **Interactive Graph**: Visualize relationships between porcelain entities using React Flow.
- **Entity Management**: Add, edit, and delete nodes (porcelains, techniques, etc.).
- **Relationship Creation**: Connect entities with predefined relationship types.
- **Search & Filter**: Find entities by name/description or filter by type.
- **Show Connections**: Right-click nodes to view only connected entities.
- **Data Persistence**: Save data locally in browser storage.
- **Node Positioning**: Drag nodes; positions are saved and restored.
- **Export/Import**: Download/upload graph data as JSON.
- **Mobile Support**: PWA for offline use on mobile devices.
- **Responsive Design**: Collapsible sidebar for mobile screens.

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Graph Visualization**: React Flow
- **Data Storage**: LocalStorage (client-side)
- **PWA**: Manifest for installability

## ER Model

### Entities (Nodes)
- Porcelain
- Technique
- Material
- Shape
- Glaze
- Pattern
- Kiln
- Period
- Source
- Image

### Relationships (Edges)
- Porcelain -[HAS_TECHNIQUE]- Technique
- Porcelain -[HAS_GLAZE]- Glaze
- Porcelain -[HAS_PATTERN]- Pattern
- Porcelain -[MADE_AT]- Kiln
- Porcelain -[DATED_TO]- Period
- Porcelain -[MENTIONED_IN]- Source
- Porcelain -[PHOTOED]- Image

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd porcelain-graph
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Running the Server

1. Start the development server:
   ```bash
   npm run dev
   ```

2. For external access (e.g., mobile testing):
   - Run with host binding: `npm run dev -- -H 0.0.0.0`
   - Find your IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
   - Access via `http://<YOUR_IP>:3000`

3. For public access (ngrok):
   - Install ngrok: `npm install -g ngrok`
   - Run: `npx ngrok http 3000`
   - Use the provided URL in your browser.

4. Build for production:
   ```bash
   npm run build
   npm start
   ```

## Usage

### Desktop
1. Open `http://localhost:3000` in your browser.
2. **Add Entities**: Click "Add Entity" to create nodes.
3. **Edit Entities**: Click a node to edit details.
4. **Create Relationships**: Drag from one node to another; select type in modal.
5. **Search/Filter**: Use the sidebar to search or filter by type.
6. **Show Connections**: Right-click a node and select "Show Connections".
7. **Delete**: Click nodes/edges to delete.
8. **Export/Import**: Use sidebar buttons for data management.

### Mobile (iOS/Android)
1. Access the app via IP/ngrok URL in mobile browser.
2. Add to home screen: Tap share > "Add to Home Screen".
3. Use as a native app; data persists offline.
4. Toggle sidebar with the "Hide/Show Sidebar" button for more space.

## Data Storage

- All data is stored in browser localStorage.
- Export as JSON for backup/sharing.
- Import JSON to load saved graphs.

## Contributing

1. Fork the repository.
2. Create a feature branch.
3. Commit changes.
4. Push and create a pull request.

## License

MIT License
