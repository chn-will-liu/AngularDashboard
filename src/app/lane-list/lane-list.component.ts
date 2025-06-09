import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LaneApiService } from '../core/lane-api.service';

@Component({
  selector: 'app-lane-list',
  templateUrl: './lane-list.component.html',
  styleUrl: './lane-list.component.scss',
  imports: [RouterModule, CommonModule],
})
export class LaneListComponent {
  private readonly laneApiService = inject(LaneApiService);

  // For demonstration purpose, use toSignal to convert the observable to a signal when httpResource API is still not available yet.
  // protected laneList = toSignal(this.laneApiService.fetchLaneBasicList());

  protected laneListResource = this.laneApiService.getLaneBasicListResource();
}
