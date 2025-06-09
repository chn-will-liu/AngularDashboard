import { Injectable } from '@angular/core';
import {
  applyToPoint,
  compose,
  flipX,
  identity,
  Matrix,
  scale as scaleTransform,
  translate,
} from 'transformation-matrix';

import { Vertex, VertexLocation } from '../../../core/lane.types';
import { BoundingBox, ViewportConfig } from './vertices-transform.type';

@Injectable({
  providedIn: 'root',
})
export class VerticesTransformService {
  /**
   * Calculate the transformation matrix to fit the lane vertices into the viewport.
   * @param vertices The vertices of a lane to transform to fit into the viewport.
   * @param viewportConfig The options for the transformation, including viewport dimensions and margin percentage.
   * @returns A transform matrix that can be applied to the lane vertices to fit them within the viewport.
   */
  public getTransformMatrix(vertices: Vertex[], viewportConfig: ViewportConfig): Matrix {
    const { width: viewportWidth, height: viewportHeight, marginPercentage } = viewportConfig;

    // Calculate the bounding box of the lane vertices
    const boundingBox = this.getBoundingBox(vertices);
    // Calculate the container box dimensions based on the viewport and margin percentage
    const marginX = viewportWidth * marginPercentage;
    const marginY = viewportHeight * marginPercentage;
    const containerBox: BoundingBox = {
      x: marginX,
      y: marginY,
      w: viewportWidth - 2 * marginX,
      h: viewportHeight - 2 * marginY,
    };
    return this.calculateTransformMatrix(boundingBox, containerBox, viewportHeight);
  }

  /**
   * Transforms the vertices according to the provided transformation matrix.
   * @param vertices A list vertices to transform to fit into the viewport.
   * @param transformMatrix The transformation matrix to apply to the vertices.
   * @returns A new list vertices transformed according to the provided matrix.
   */
  public transform(vertice: Vertex[], transformMatrix: Matrix): Vertex[] {
    const transformLocation = (location: VertexLocation): VertexLocation => {
      return {
        ...location,
        coordinates: applyToPoint(transformMatrix, location.coordinates),
      };
    };

    return vertice.map(vertex => ({
      ...vertex,
      location: transformLocation(vertex.location),
      adjacent: vertex.adjacent.map(adjacentVertex => ({
        ...adjacentVertex,
        interiorPath: adjacentVertex.interiorPath.map(transformLocation),
      })),
    }));
  }

  /**
   * Calculating the transform matrix to fit the box into the container box using `object-fit: contain`-like strategy.
   * @param box The bounding box that needs to be transformed
   * @param containerBox The containing box that you want the box to be fit into
   * @param viewportHeight The viewport height used to flip the content by X axis to denote the origin being (left, bottom)
   */
  private calculateTransformMatrix(box: BoundingBox, containerBox: BoundingBox, viewportHeight: number): Matrix {
    if (
      !this.isValidNumber(box.w) ||
      !this.isValidNumber(box.h) ||
      !this.isValidNumber(box.x) ||
      !this.isValidNumber(box.y)
    ) {
      return identity();
    }

    // Calculate the scale factor to contain the box
    const containerBoxAspectRatio = containerBox.w / containerBox.h;
    const boxAspectRatio = box.w / box.h;
    const scaleX = containerBox.w / box.w;
    const scaleY = containerBox.h / box.h;
    // If the box is wider than the container, scale by width; otherwise, scale by height
    let scale = boxAspectRatio > containerBoxAspectRatio ? scaleX : scaleY;

    // For edge cases like the box collapses into a line or even a single point, just simply don't scale
    if (!this.isValidNumber(scale)) {
      scale = 1;
    }

    // Calculate the translation offset based on scaling with transform-origin (top, left)
    const translateX = containerBox.x + (containerBox.w - box.w * scale) / 2 - box.x;
    const translateY = containerBox.y + (containerBox.h - box.h * scale) / 2 - box.y;

    // Flip by X axis to denote that in real word (0,0) is always the bottom left corner instead of top left
    // Be noticed that the order of composition is the reverse order of transform application.
    return compose(
      translate(0, viewportHeight),
      flipX(),
      translate(translateX, translateY),
      scaleTransform(scale, scale, box.x, box.y)
    );
  }

  /**
   * Gets the bounding box that could contain all the vertices.
   * @param vertices An array of vertices to
   * @returns The bounding box that could contain all the vertices.
   */
  private getBoundingBox(vertices: Vertex[]): BoundingBox {
    const interiorPathLocations = vertices.flatMap(v =>
      v.adjacent.flatMap(a => a.interiorPath.map(p => p.coordinates))
    );
    const coordinatesList = [...vertices.map(v => v.location.coordinates), ...interiorPathLocations];
    const xAxis = coordinatesList.map(c => c[0]);
    const yAxis = coordinatesList.map(c => c[1]);
    const xMin = Math.min(...xAxis);
    const xMax = Math.max(...xAxis);
    const yMin = Math.min(...yAxis);
    const yMax = Math.max(...yAxis);

    const width = xMax - xMin;
    const height = yMax - yMin;

    return { x: xMin, y: yMin, w: width, h: height };
  }

  private isValidNumber(n: number): boolean {
    return Number.isFinite(n) && !Number.isNaN(n);
  }
}
