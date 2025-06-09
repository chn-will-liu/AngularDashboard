import { compose, flipX, identity, scale, translate } from 'transformation-matrix';
import { AdjacentVertex } from './../../../core/lane.types';

import { TestBed } from '@angular/core/testing';

import { Vertex } from '../../../core/lane.types';
import { VerticesTransformService } from './vertices-transform.service';

describe('VerticesTransformService', () => {
  let service: VerticesTransformService;

  let vertexId = 0;
  function ineedaVertex(coordinates: [number, number], adjacent?: AdjacentVertex[]): Vertex {
    return {
      id: ++vertexId,
      name: 'vertex ' + vertexId,
      isEntry: false,
      location: { coordinates },
      adjacent: adjacent ?? [],
    };
  }

  beforeEach(() => {
    vertexId = 0;
    TestBed.configureTestingModule({
      providers: [VerticesTransformService],
    });
    service = TestBed.inject(VerticesTransformService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getTransformMatrix', () => {
    it('should calculate the transformation matrix correctly - vertical lane', () => {
      // Arrrange
      // w: 10, h: 20
      const vertices = [ineedaVertex([10, 10]), ineedaVertex([20, 30])];
      const viewportConfig = { width: 100, height: 100, marginPercentage: 0 };

      // Act
      const matrix = service.getTransformMatrix(vertices, viewportConfig);

      // Assert
      // left top point has to be moved to (25, 0)
      expect(matrix).toEqual(compose(translate(0, 100), flipX(), translate(15, -10), scale(5, 5, 10, 10)));
    });

    it('should calculate the transformation matrix correctly - horizontal lane', () => {
      // Arrrange
      // w: 40, h: 20
      const vertices = [ineedaVertex([10, 10]), ineedaVertex([50, 30])];

      const viewportConfig = { width: 100, height: 100, marginPercentage: 0 };

      // Act
      const matrix = service.getTransformMatrix(vertices, viewportConfig);

      // Assert
      // left top point has to be moved to (0, 25)
      expect(matrix).toEqual(compose(translate(0, 100), flipX(), translate(-10, 15), scale(2.5, 2.5, 10, 10)));
    });

    it('should consider interior path and viewport margin', () => {
      // Arrrange
      // w: 40, h: 20
      const vertices = [
        ineedaVertex([10, 10]),
        ineedaVertex([20, 20], [{ adjacentVertex: 1, interiorPath: [{ coordinates: [50, 30] }] }]),
      ];

      const viewportConfig = { width: 100, height: 100, marginPercentage: 0.2 };

      // Act
      const matrix = service.getTransformMatrix(vertices, viewportConfig);

      // Assert
      // after scale its left, top corner needs to be ((0, 15) + 20)=(20,35)
      expect(matrix).toEqual(compose(translate(0, 100), flipX(), translate(10, 25), scale(1.5, 1.5, 10, 10)));
    });

    it('should be able to scale down', () => {
      // Arrrange
      const vertices = [ineedaVertex([10, 10]), ineedaVertex([210, 210])];
      const viewportConfig = { width: 100, height: 100, marginPercentage: 0 };

      // Act
      const matrix = service.getTransformMatrix(vertices, viewportConfig);

      // Assert
      expect(matrix).toEqual(compose(translate(0, 100), flipX(), translate(-10, -10), scale(0.5, 0.5, 10, 10)));
    });

    describe('edge cases', () => {
      it('should handle single vertical lane path', () => {
        // Arrrange
        // w: 0, h: 20
        const vertices = [ineedaVertex([10, 10]), ineedaVertex([10, 30])];
        const viewportConfig = { width: 100, height: 100, marginPercentage: 0.1 };

        // Act
        const matrix = service.getTransformMatrix(vertices, viewportConfig);

        // Assert
        // left top point has to be moved to (50, 10)
        expect(matrix).toEqual(compose(translate(0, 100), flipX(), translate(40, 0), scale(4, 4, 10, 10)));
      });

      it('should handle single horizontal lane path', () => {
        // Arrrange
        // w: 0, h: 20
        const vertices = [ineedaVertex([10, 10]), ineedaVertex([30, 10])];
        const viewportConfig = { width: 100, height: 100, marginPercentage: 0.1 };

        // Act
        const matrix = service.getTransformMatrix(vertices, viewportConfig);

        // Assert
        // left top point has to be moved to (10, 50)
        expect(matrix).toEqual(compose(translate(0, 100), flipX(), translate(0, 40), scale(4, 4, 10, 10)));
      });

      it('should handle single point lane path', () => {
        // Arrrange
        const vertices = [ineedaVertex([10, 10])];
        const viewportConfig = { width: 100, height: 100, marginPercentage: 0 };

        // Act
        const matrix = service.getTransformMatrix(vertices, viewportConfig);

        // Assert
        // No scale, just translate to the center
        expect(matrix).toEqual(compose(translate(0, 100), flipX(), translate(40, 40)));
      });

      it('should handle empty lane', () => {
        // Arrrange
        const vertices: Vertex[] = [];
        const viewportConfig = { width: 100, height: 100, marginPercentage: 0 };

        // Act
        const matrix = service.getTransformMatrix(vertices, viewportConfig);

        // Assert
        // simply the identity matrix
        expect(matrix).toEqual(identity());
      });
    });
  });

  describe('transform', () => {
    it('should transform vertices', () => {
      // Arrrange
      const vertices = [
        ineedaVertex([10, 10]),
        ineedaVertex([20, 20], [{ adjacentVertex: 1, interiorPath: [{ coordinates: [50, 30] }] }]),
      ];

      const expected: Vertex[] = [
        {
          ...vertices[0],
          location: {
            coordinates: [30, 10],
          },
        },
        {
          ...vertices[1],
          adjacent: [{ adjacentVertex: 1, interiorPath: [{ coordinates: [110, 50] }] }],
          location: {
            coordinates: [50, 30],
          },
        },
      ];

      const matrix = compose(translate(10, -10), scale(2));

      // Act
      const transformedVertices = service.transform(vertices, matrix);

      // Assert
      expect(transformedVertices).toEqual(expected);
    });
  });
});
