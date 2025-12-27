// src/types/graph.ts

export type EntityType =
  | 'Porcelain'
  | 'Technique'
  | 'Material'
  | 'Shape'
  | 'Glaze'
  | 'Pattern'
  | 'Kiln'
  | 'Period'
  | 'Source'
  | 'Image';

export type RelationshipType =
  | 'HAS_TECHNIQUE'
  | 'HAS_GLAZE'
  | 'HAS_PATTERN'
  | 'MADE_AT'
  | 'DATED_TO'
  | 'MENTIONED_IN'
  | 'PHOTOED';

export interface Entity {
  id: string;
  type: EntityType;
  name: string;
  description?: string;
  imageUrl?: string;
  notes?: string;
  // Additional properties can be added here
}

export interface Relationship {
  id: string;
  from: string; // Entity ID
  to: string; // Entity ID
  type: RelationshipType;
  notes?: string;
}

export interface GraphData {
  entities: Entity[];
  relationships: Relationship[];
}