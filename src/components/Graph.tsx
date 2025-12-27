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
} from 'reactflow';
import 'reactflow/dist/style.css';
import { GraphData, Entity, Relationship } from '@/types/graph';
import { loadGraphData, addEntity, addRelationship } from '@/lib/graphStorage';
import { v4 as uuidv4 } from 'uuid';
import EntityModal from './EntityModal';

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
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const data = loadGraphData();
    setGraphData(data);
    updateNodesAndEdges(data);
  }, []);

  const updateNodesAndEdges = (data: GraphData) => {
    const newNodes: Node[] = data.entities.map((entity) => ({
      id: entity.id,
      type: 'custom',
      position: { x: Math.random() * 500, y: Math.random() * 500 }, // Random for now
      data: { label: `${entity.type}: ${entity.name}`, color: entityColors[entity.type] || '#ccc' },
    }));
    const newEdges: Edge[] = data.relationships.map((rel) => ({
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
      if (!params.source || !params.target) return;
      const newRel: Relationship = {
        id: uuidv4(),
        from: params.source,
        to: params.target,
        type: 'HAS_TECHNIQUE', // Default, can be changed later
      };
      addRelationship(newRel);
      setEdges((eds) => addEdge({ ...params, id: newRel.id, label: newRel.type }, eds));
    },
    [setEdges]
  );

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    const entity = graphData.entities.find(e => e.id === node.id);
    if (entity) {
      setSelectedEntity(entity);
      setIsModalOpen(true);
    }
  }, [graphData.entities]);

  const addNewEntity = () => {
    const newEntity: Entity = {
      id: uuidv4(),
      type: 'Porcelain',
      name: 'New Porcelain',
    };
    addEntity(newEntity);
    setGraphData((prev) => ({ ...prev, entities: [...prev.entities, newEntity] }));
    updateNodesAndEdges({ ...graphData, entities: [...graphData.entities, newEntity] });
  };

  const handleEntityUpdate = () => {
    const data = loadGraphData();
    setGraphData(data);
    updateNodesAndEdges(data);
  };

  return (
    <div style={{ height: '100vh' }}>
      <button onClick={addNewEntity} className="absolute top-4 left-4 z-10 bg-blue-500 text-white px-4 py-2 rounded">
        Add Entity
      </button>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
      >
        <Controls />
        <MiniMap />
        <Background />
      </ReactFlow>
      <EntityModal
        entity={selectedEntity}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpdate={handleEntityUpdate}
      />
    </div>
  );
};

export default Graph;