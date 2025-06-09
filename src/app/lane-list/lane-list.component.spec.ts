import { TestBed } from '@angular/core/testing';
import { LaneApiService } from '../core/lane-api.service';

import { HttpResourceRef } from '@angular/common/http';
import { NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { By } from '@angular/platform-browser';
import { LaneBasic } from '../core/lane.types';
import { LaneListComponent } from './lane-list.component';

describe('LaneListComponent', () => {
  beforeEach(async () => {
    TestBed.overrideComponent(LaneListComponent, {
      set: {
        imports: [],
        schemas: [NO_ERRORS_SCHEMA],
      },
    });

    await TestBed.configureTestingModule({
      imports: [LaneListComponent],
      providers: [
        {
          provide: LaneApiService,
          useValue: { getLaneBasicListResource: () => void 0 },
        },
      ],
    }).compileComponents();
  });

  it('should create the lane list component', () => {
    const fixture = TestBed.createComponent(LaneListComponent);
    const laneList = fixture.componentInstance;
    expect(laneList).toBeTruthy();
  });

  describe('laneListResource', () => {
    it('should call getLaneBasicListResource on LaneApiService', () => {
      // Arrange
      const laneApiService = TestBed.inject(LaneApiService);
      const laneListResource = {
        isLoading: signal(true),
        hasValue: signal(false),
        value: signal<LaneBasic[] | undefined>(undefined),
        error: signal<Error | null>(null),
      };

      spyOn(laneApiService, 'getLaneBasicListResource').and.returnValue(
        laneListResource as unknown as HttpResourceRef<LaneBasic[] | undefined>
      );

      const fixture = TestBed.createComponent(LaneListComponent);

      // Act
      fixture.detectChanges();

      // Assert
      expect(fixture.nativeElement.textContent).toContain('Loading lane list...');

      // Act
      laneListResource.isLoading.set(false);
      laneListResource.hasValue.set(true);
      laneListResource.value.set([
        {
          id: '1',
          name: 'Lane 01',
        },
        {
          id: '2',
          name: 'Lane 02',
        },
      ]);

      fixture.detectChanges();

      // Assert
      const laneEl = fixture.debugElement.queryAll(By.css('[data-testId="laneItemLink"]'));
      expect(laneEl.length).toBe(2);
      expect(laneEl[0].nativeElement.textContent).toBe('Lane 01');
      expect(laneEl[1].nativeElement.textContent).toBe('Lane 02');
    });
  });
});
