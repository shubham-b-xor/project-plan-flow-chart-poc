# Project Plan Flow Chart Designer

![ReactFlow Designer Banner](./public/logo192.png)

A modern, interactive flow chart designer for project planning, built with React, TypeScript, Redux Toolkit, Material-UI, and ReactFlow.

---

## 🚀 Features

- **Drag-and-drop Node Creation**: Build custom workflows visually
- **Customizable Nodes & Edges**: Rich node types, edge styles, and labels
- **Properties Panel**: Edit node/edge properties in a collapsible side panel
- **Sidebar & TopBar**: Quick access to node types, project actions, and settings
- **Undo/Redo & Selection**: Intuitive editing with multi-select and keyboard shortcuts
- **Export & Import**: Save your flow as JSON or image, and reload anytime
- **Responsive & Themed UI**: Beautiful Material-UI design, dark/light support
- **Redux State Management**: All state managed globally for scalability

---

## 🛠️ Tech Stack

- [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [ReactFlow](https://reactflow.dev/) for diagramming
- [Redux Toolkit](https://redux-toolkit.js.org/) for state
- [Material-UI (MUI)](https://mui.com/) for UI components
- [Dnd Kit](https://dndkit.com/) for drag-and-drop
- [html-to-image](https://github.com/bubkoo/html-to-image) for export

---

## 📦 Getting Started

1. **Clone the repository**
   ```sh
   git clone https://github.com/shubham-b-xor/project-plan-flow-chart-poc.git
   cd project-plan-flow-chart-poc/ReactFlow
   ```
2. **Install dependencies**
   ```sh
   npm install
   ```
3. **Start the development server**
   ```sh
   npm start
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🖱️ Usage

- **Add Nodes**: Drag node types from the sidebar onto the canvas
- **Connect Nodes**: Drag from one node handle to another
- **Edit Properties**: Select a node/edge and use the properties panel
- **Save/Load**: Use the TopBar to export/import your flow
- **Customize**: Change node labels, descriptions, and UI options

---

## 📁 Project Structure

```
ReactFlow/
├── public/           # Static assets
├── src/
│   ├── components/   # Modular React components
│   ├── store/        # Redux slices & hooks
│   ├── config/       # Node/edge configs
│   ├── types/        # TypeScript types
│   ├── assets/       # Images & SVGs
│   └── utils/        # Utility functions
├── package.json
└── README.md
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 🌐 Live Demo

[Project Plan Flow Chart Designer (GitHub Pages)](https://shubham-b-xor.github.io/project-plan-flow-chart-poc)

---

> Made with ❤️ using React, Redux, and ReactFlow.
