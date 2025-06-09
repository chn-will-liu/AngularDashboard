import { Component, computed, input } from '@angular/core';
import { VertexLocation } from '../../../core/lane.types';

@Component({
  selector: 'polyline[app-adjacent-line]',
  template: '',
  host: {
    '[attr.points]': 'points()',
  },
})
export class AdjacentLineComponent {
  public readonly vertexLocation = input.required<VertexLocation>();
  public readonly adjacentVertexLocation = input.required<VertexLocation>();
  public readonly interiorPath = input.required<VertexLocation[]>();

  protected readonly points = computed(() => {
    const points = [
      this.vertexLocation().coordinates,
      ...this.interiorPath().map(p => p.coordinates),
      this.adjacentVertexLocation().coordinates,
    ];
    return points.map(point => `${point[0]},${point[1]}`).join(' ');
  });
}
