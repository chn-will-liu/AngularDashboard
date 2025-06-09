import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Lane } from '../../core/lane.types';
import { AdjacentLineComponent } from './adjacent-line/adjacent-line.component';
import { VerticesTransformService } from './vertices-transform/vertices-transform.service';

@Component({
  selector: 'svg[app-lane-svg]',
  templateUrl: './lane-svg.component.html',
  styleUrl: './lane-svg.component.scss',
  imports: [AdjacentLineComponent, RouterLink],
  host: {
    '[attr.width]': 'svgWidth',
    '[attr.height]': 'svgHeight',
    '[attr.viewBox]': '`0 0 ${svgWidth} ${svgHeight}`',
    xmlns: 'http://www.w3.org/2000/svg',
  },
})
export class LaneSvgComponent {
  private readonly transformService = inject(VerticesTransformService);

  protected readonly svgWidth = 1920;
  protected readonly svgHeight = 1080;
  protected readonly laneWidthInMeters = 2.5; // The width of the lane in meters

  public readonly lane = input.required<Lane>();

  protected readonly transformMatrix = computed(() => {
    return this.transformService.getTransformMatrix(this.lane().vertices, {
      width: this.svgWidth,
      height: this.svgHeight,
      marginPercentage: 0.08, // 8% margin around the viewbox
    });
  });

  /**
   * The scale factor for the lane to be fit into the viewport.
   * Since we keep the aspect ratio of the orginal lane, the scale factor is the same for both x and y axes.
   */
  protected readonly scale = computed(() => this.transformMatrix().a);
  protected readonly laneWidthInPixels = computed(() => this.scale() * this.laneWidthInMeters);
  protected readonly transformedVertices = computed(() => {
    return this.transformService.transform(this.lane().vertices, this.transformMatrix());
  });

  /**
   * A map of transformed vertices by their ID.
   * This is useful for quick lookups of vertices by their ID when rendering the adjacency paths.
   */
  protected readonly transformedVerticesMap = computed(() => {
    const vertices = this.transformedVertices();
    return new Map(vertices.map(vertex => [vertex.id, vertex]));
  });
}
