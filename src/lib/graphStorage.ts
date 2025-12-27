// src/lib/graphStorage.ts

import { GraphData, Entity, Relationship } from '@/types/graph';

const STORAGE_KEY = 'porcelain-graph-data';

export const loadGraphData = (): GraphData => {
  if (typeof window === 'undefined') return { entities: [], relationships: [] };
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : { entities: [], relationships: [] };
};

export const saveGraphData = (data: GraphData): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const addEntity = (entity: Entity): void => {
  const data = loadGraphData();
  data.entities.push(entity);
  saveGraphData(data);
};

export const updateEntity = (id: string, updates: Partial<Entity>): void => {
  const data = loadGraphData();
  const index = data.entities.findIndex(e => e.id === id);
  if (index !== -1) {
    data.entities[index] = { ...data.entities[index], ...updates };
    saveGraphData(data);
  }
};

export const deleteEntity = (id: string): void => {
  const data = loadGraphData();
  data.entities = data.entities.filter(e => e.id !== id);
  data.relationships = data.relationships.filter(r => r.from !== id && r.to !== id);
  saveGraphData(data);
};

export const addRelationship = (relationship: Relationship): void => {
  const data = loadGraphData();
  data.relationships.push(relationship);
  saveGraphData(data);
};

export const deleteRelationship = (id: string): void => {
  const data = loadGraphData();
  data.relationships = data.relationships.filter(r => r.id !== id);
  saveGraphData(data);
};