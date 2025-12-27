// src/components/Graph.tsx

'use client';

import React, { useCallback, useEffect, useState } from 'react';
import {
  ReactFlow,
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  MiniMap,
  NodeProps,
  Handle,
  Position,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { GraphData, Entity, Relationship } from '@/types/graph';
import { loadGraphData, addEntity, addRelationship, deleteEntity, deleteRelationship, saveGraphData } from '@/lib/graphStorage';
import { v4 as uuidv4 } from 'uuid';
import EntityModal from './EntityModal';
import RelationshipModal from './RelationshipModal';
import RelationshipDeleteModal from './RelationshipDeleteModal';
import Sidebar from './Sidebar';

const entityColors: Record<string, string> = {
  Porcelain: '#ff6b6b',
  Technique: '#4ecdc4',
  Material: '#45b7d1',
  Shape: '#96ceb4',
  Glaze: '#ffeaa7',
  Pattern: '#dda0dd',
  Kiln: '#98d8c8',
  Period: '#f7dc6f',
  Source: '#bb8fce',
  Image: '#85c1e9',
};

const CustomNode: React.FC<NodeProps> = ({ data }) => {
  return (
    <div style={{ background: data.color, padding: 10, borderRadius: 5, color: 'white', cursor: 'pointer' }}>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
      {data.label}
    </div>
  );
};

const nodeTypes = {
  custom: CustomNode,
};

const Graph: React.FC = () => {
  const [graphData, setGraphData] = useState<GraphData>({ entities: [], relationships: [] });
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);
  const [isEntityModalOpen, setIsEntityModalOpen] = useState(false);
  const [pendingConnection, setPendingConnection] = useState<Connection | null>(null);
  const [isRelationshipModalOpen, setIsRelationshipModalOpen] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; nodeId: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<EntityType[]>([]);
  const [expandedNode, setExpandedNode] = useState<string | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const data = loadGraphData();
    setGraphData(data);
    updateNodesAndEdges(data, searchQuery, selectedTypes, expandedNode);
  }, [searchQuery, selectedTypes, expandedNode]);

  useEffect(() => {
    // Save positions when nodes change
    const updatedEntities = graphData.entities.map(entity => {
      const node = nodes.find(n => n.id === entity.id);
      if (node) {
        return { ...entity, position: node.position };
      }
      return entity;
    });
    if (JSON.stringify(updatedEntities) !== JSON.stringify(graphData.entities)) {
      const newData = { ...graphData, entities: updatedEntities };
      setGraphData(newData);
      saveGraphData(newData);
    }
  }, [nodes, graphData.entities]);

  const updateNodesAndEdges = (data: GraphData, query: string, types: EntityType[], expandId: string | null) => {
    let filteredEntities = data.entities;

    if (query) {
      filteredEntities = filteredEntities.filter(entity =>
        entity.name.toLowerCase().includes(query.toLowerCase()) ||
        (entity.description && entity.description.toLowerCase().includes(query.toLowerCase()))
      );
    }

    if (types.length > 0) {
      filteredEntities = filteredEntities.filter(entity => types.includes(entity.type));
    }

    if (expandId) {
      const connectedIds = new Set<string>();
      connectedIds.add(expandId);
      data.relationships.forEach(rel => {
        if (rel.from === expandId) connectedIds.add(rel.to);
        if (rel.to === expandId) connectedIds.add(rel.from);
      });
      filteredEntities = filteredEntities.filter(entity => connectedIds.has(entity.id));
    }

    const visibleEntityIds = new Set(filteredEntities.map(e => e.id));

    const newNodes: Node[] = filteredEntities.map((entity) => ({
      id: entity.id,
      type: 'custom',
      position: entity.position || { x: Math.random() * 500, y: Math.random() * 500 },
      data: { label: `${entity.type}: ${entity.name}`, color: entityColors[entity.type] || '#ccc' },
    }));

    const newEdges: Edge[] = data.relationships
      .filter(rel => visibleEntityIds.has(rel.from) && visibleEntityIds.has(rel.to))
      .map((rel) => ({
        id: rel.id,
        source: rel.from,
        target: rel.to,
        label: rel.type,
      }));

    setNodes(newNodes);
    setEdges(newEdges);
  };

  const onConnect = useCallback(
    (params: Connection) => {
      setPendingConnection(params);
      setIsRelationshipModalOpen(true);
    },
    []
  );

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    const entity = graphData.entities.find(e => e.id === node.id);
    if (entity) {
      setSelectedEntity(entity);
      setIsEntityModalOpen(true);
    }
  }, [graphData.entities]);

  const onNodeContextMenu = useCallback((event: React.MouseEvent, node: Node) => {
    event.preventDefault();
    setContextMenu({ x: event.clientX, y: event.clientY, nodeId: node.id });
  }, []);

  const onEdgeClick = useCallback((event: React.MouseEvent, edge: Edge) => {
    setSelectedEdge(edge);
    setIsDeleteModalOpen(true);
  }, []);

  const addNewEntity = () => {
    const newEntity: Entity = {
      id: uuidv4(),
      type: 'Porcelain',
      name: 'New Porcelain',
    };
    addEntity(newEntity);
    setGraphData((prev) => ({ ...prev, entities: [...prev.entities, newEntity] }));
    updateNodesAndEdges({ ...graphData, entities: [...graphData.entities, newEntity] }, searchQuery, selectedTypes, expandedNode);
  };

  const onConfirmRelationship = (type: RelationshipType, notes?: string) => {
    if (!pendingConnection?.source || !pendingConnection?.target) return;
    const newRel: Relationship = {
      id: uuidv4(),
      from: pendingConnection.source,
      to: pendingConnection.target,
      type,
      notes,
    };
    addRelationship(newRel);
    setEdges((eds) => addEdge({ ...pendingConnection, id: newRel.id, label: newRel.type }, eds));
    setPendingConnection(null);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilter = (types: EntityType[]) => {
    setSelectedTypes(types);
  };

  const handleShowAll = () => {
    setExpandedNode(null);
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(graphData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'porcelain-graph-data.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImport = (data: GraphData) => {
    setGraphData(data);
    saveGraphData(data);
    updateNodesAndEdges(data, searchQuery, selectedTypes, expandedNode);
  };

  const handleEntityUpdate = () => {
    const data = loadGraphData();
    setGraphData(data);
    updateNodesAndEdges(data, searchQuery, selectedTypes, expandedNode);
  };

  const handleDeleteEntity = (id: string) => {
    deleteEntity(id);
    handleEntityUpdate();
    setIsEntityModalOpen(false);
  };

  const handleDeleteRelationship = () => {
    if (selectedEdge) {
      deleteRelationship(selectedEdge.id);
      handleEntityUpdate();
      setIsDeleteModalOpen(false);
      setSelectedEdge(null);
    }
  };

  return (
    <div className="flex h-screen">
      {sidebarOpen && (
        <Sidebar onSearch={handleSearch} onFilter={handleFilter} selectedTypes={selectedTypes} onShowAll={handleShowAll} onExport={handleExport} onImport={handleImport} />
      )}
      <div className="flex-1 relative">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute top-4 left-4 z-10 bg-gray-500 text-white px-2 py-1 rounded text-sm"
        >
          {sidebarOpen ? 'Hide' : 'Show'} Sidebar
        </button>
        <button onClick={addNewEntity} className="absolute top-4 left-20 z-10 bg-blue-500 text-white px-4 py-2 rounded">
          Add Entity
        </button>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onNodeContextMenu={onNodeContextMenu}
          onEdgeClick={onEdgeClick}
          nodeTypes={nodeTypes}
          fitView
        >
          <Controls />
          <MiniMap />
          <Background />
        </ReactFlow>
        {contextMenu && (
          <div
            className="fixed inset-0 z-10"
            onClick={() => setContextMenu(null)}
          >
            <div
              className="absolute bg-white border border-gray-300 rounded shadow-lg"
              style={{ left: contextMenu.x, top: contextMenu.y }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="block px-4 py-2 text-left hover:bg-gray-100 w-full"
                onClick={() => {
                  setExpandedNode(contextMenu.nodeId);
                  setContextMenu(null);
                }}
              >
                Show Connections
              </button>
            </div>
          </div>
        )}
        <EntityModal
          entity={selectedEntity}
          isOpen={isEntityModalOpen}
          onClose={() => setIsEntityModalOpen(false)}
          onUpdate={handleEntityUpdate}
          onDelete={handleDeleteEntity}
        />
        <RelationshipModal
          isOpen={isRelationshipModalOpen}
          onClose={() => setIsRelationshipModalOpen(false)}
          onConfirm={onConfirmRelationship}
        />
        <RelationshipDeleteModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onDelete={handleDeleteRelationship}
          relationshipType={selectedEdge?.label || ''}
        />
      </div>
    </div>
  );
};

export default Graph;