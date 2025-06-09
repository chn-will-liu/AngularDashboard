import { TestBed } from '@angular/core/testing';

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { compose, identity, scale, translate } from 'transformation-matrix';
import { Lane, Vertex } from '../../core/lane.types';
import { LaneSvgComponent } from './lane-svg.component';
import { VerticesTransformService } from './vertices-transform/vertices-transform.service';

describe('LaneSvgComponent', () => {
  beforeEach(async () => {
    TestBed.overrideComponent(LaneSvgComponent, {
      set: {
        imports: [],
        schemas: [NO_ERRORS_SCHEMA],
      },
    });

    await TestBed.configureTestingModule({
      imports: [LaneSvgComponent],
      providers: [
        {
          provide: VerticesTransformService,
          useValue: {
            getTransformMatrix: () => identity(),
            transform: (vertices: unknown) => vertices,
          },
        },
      ],
    }).compileComponents();
  });

  it('should create the component', () => {
    // Arrange
    const fixture = TestBed.createComponent(LaneSvgComponent);
    const laneSvg = fixture.componentInstance;

    // Act / Assert
    expect(laneSvg).toBeTruthy();
  });

  it('should call transform service and calculate the transformMatrix correctly', () => {
    // Arrange
    const fixture = TestBed.createComponent(LaneSvgComponent);
    const laneSvgComponent = fixture.componentInstance;
    const laneSvgComponentRef = fixture.componentRef;
    const transformService = TestBed.inject(VerticesTransformService);
    const mockLane = { vertices: [] as Vertex[] } as Lane;
    const expectedMatrix = compose(translate(100, 100), scale(2, 2));

    // Mock the lane input
    laneSvgComponentRef.setInput('lane', mockLane);
    spyOn(transformService, 'getTransformMatrix').and.returnValue(expectedMatrix);

    // Act
    fixture.detectChanges();

    // Assert
    expect(transformService.getTransformMatrix).toHaveBeenCalled();
    expect(laneSvgComponent['transformMatrix']()).toEqual(expectedMatrix);
    expect(laneSvgComponent['scale']()).toEqual(2);
    expect(laneSvgComponent['laneWidthInPixels']()).toEqual(5); // 2.5 * 2
  });

  it('should render transformed vertices correctly', () => {
    // Arrange
    const fixture = TestBed.createComponent(LaneSvgComponent);
    const laneSvgComponentRef = fixture.componentRef;
    const transformService = TestBed.inject(VerticesTransformService);
    const transformedVertices: Vertex[] = [
      {
        id: 1,
        name: 'v1',
        adjacent: [],
        isEntry: false,
        vertexType: 'SERVICE_POINT',
        location: { coordinates: [10, 0] },
      },
      {
        id: 2,
        name: 'v2',
        adjacent: [],
        isEntry: false,
        vertexType: 'LANE_MERGE',
        location: { coordinates: [100, 100] },
      },
    ];
    laneSvgComponentRef.setInput('lane', { vertices: [] as Vertex[] } as Lane);
    spyOn(transformService, 'transform').and.returnValue(transformedVertices);

    // Act
    fixture.detectChanges();

    // Assert
    const vertexMarkers = fixture.debugElement.queryAll(By.css('[data-testId="laneVertexMarker"]'));
    const vertexLabels = fixture.debugElement.queryAll(By.css('[data-testId="laneVertexLabel"]'));
    expect(vertexMarkers.length).toBe(transformedVertices.length);
    expect(vertexMarkers[0].attributes['x']).toBe('10');
    expect(vertexMarkers[0].attributes['y']).toBe('0');
    expect(vertexLabels[0].nativeElement.textContent).toContain('v1');
    expect(vertexMarkers[1].attributes['x']).toBe('100');
    expect(vertexMarkers[1].attributes['y']).toBe('100');
    expect(vertexLabels[1].nativeElement.textContent).toContain('v2');
  });
});
