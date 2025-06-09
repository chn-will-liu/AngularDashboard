import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { LaneApiService } from '../core/lane-api.service';
import { LaneComponent } from './lane.component';

describe('LaneComponent', () => {
  beforeEach(async () => {
    TestBed.overrideComponent(LaneComponent, {
      set: {
        imports: [],
        schemas: [NO_ERRORS_SCHEMA],
      },
    });

    await TestBed.configureTestingModule({
      imports: [LaneComponent],
      providers: [
        {
          provide: LaneApiService,
          useValue: {
            getLaneResource: () => void 0,
          },
        },
      ],
    }).compileComponents();
  });

  it('should create the component', () => {
    // Arrange
    const fixture = TestBed.createComponent(LaneComponent);
    const lane = fixture.componentInstance;

    // Act / Assert
    expect(lane).toBeTruthy();
  });
});
