export type VertexType = 'SERVICE_POINT' | 'PRE_MERGE_POINT' | 'LANE_MERGE';

export type Coordinates = [number, number];

export interface VertexLocation {
  coordinates: Coordinates;
}

export interface AdjacentVertex {
  /** adjacent vertext id */
  adjacentVertex: number;
  interiorPath: VertexLocation[];
}

export interface Vertex {
  id: number;
  name: string;
  vertexType?: VertexType;
  isEntry: boolean;
  location: VertexLocation;
  adjacent: AdjacentVertex[];
}

export interface LaneBasic {
  id: string;
  name: string;
}

export interface Lane extends LaneBasic {
  vertices: Vertex[];
}
