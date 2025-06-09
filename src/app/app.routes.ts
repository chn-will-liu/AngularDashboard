import { Routes } from '@angular/router';
import { LaneListComponent } from './lane-list/lane-list.component';
import { LaneComponent } from './lane/lane.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'lanes',
  },
  {
    path: 'lanes',
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: LaneListComponent,
      },
      {
        path: ':laneId',
        component: LaneComponent,
      },
    ],
  },
];
