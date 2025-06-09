import { Component, inject, input } from '@angular/core';
import { LaneApiService } from '../core/lane-api.service';
import { LaneSvgComponent } from './lane-svg/lane-svg.component';

@Component({
  selector: 'app-lane',
  template: `
    @if (laneResource.hasValue()) {
      <svg app-lane-svg [lane]="laneResource.value()"></svg>
    }
  `,
  styles: `
    :host {
      display: block;
      flex: 1;
    }
  `,
  imports: [LaneSvgComponent],
})
export class LaneComponent {
  private readonly laneApiService = inject(LaneApiService);

  /**
   * The ID of the lane to display.
   */
  public readonly laneId = input.required<string>();

  /**
   * The lane resource that contains the lane data of the specified lane ID.
   */
  protected laneResource = this.laneApiService.getLaneResource(this.laneId);
}
