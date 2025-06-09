import { TestBed } from '@angular/core/testing';
import { VertexLocation } from '../../../core/lane.types';
import { AdjacentLineComponent } from './adjacent-line.component';

describe('AdjacentLineComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdjacentLineComponent],
    }).compileComponents();
  });

  it('should create the Adjacent line component', () => {
    // Arrange / Act
    const fixture = TestBed.createComponent(AdjacentLineComponent);
    const adjacentLine = fixture.componentInstance;

    // Assert
    expect(adjacentLine).toBeTruthy();
  });

  describe('points', () => {
    it('should call getLaneBasicListResource on LaneApiService', () => {
      // Arrange
      const fixture = TestBed.createComponent(AdjacentLineComponent);
      const ajacentLineRef = fixture.componentRef;
      const vertex: VertexLocation = { coordinates: [0, 0] };
      const adjacent: VertexLocation = { coordinates: [100, 50] };
      const interiorPath: VertexLocation[] = [{ coordinates: [20, 30] }, { coordinates: [30, 40] }];

      ajacentLineRef.setInput('vertexLocation', vertex);
      ajacentLineRef.setInput('adjacentVertexLocation', adjacent);
      ajacentLineRef.setInput('interiorPath', interiorPath);

      // Act
      fixture.detectChanges();

      // Assert
      expect(fixture.debugElement.attributes['points']).toBe(`0,0 20,30 30,40 100,50`);
    });
  });
});
