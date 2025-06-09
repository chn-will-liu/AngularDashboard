import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ApplicationRef, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { subscribeSpyTo } from '@hirez_io/observer-spy';

import { environment } from '../../environments/environment';
import { LaneApiService } from './lane-api.service';
import { Lane, LaneBasic } from './lane.types';

describe('lane-api.service', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LaneApiService, provideHttpClient(), provideHttpClientTesting()],
    });
  });

  it('should create the service', () => {
    // Arrange / Act
    const service = TestBed.inject(LaneApiService);

    // Assert
    expect(service).toBeTruthy();
  });

  describe('fetchLaneBasicList', () => {
    it('should call the correct endpoint and return an array of LaneBasic', () => {
      // Arrange
      const service = TestBed.inject(LaneApiService);
      const expectedUrl = `${environment.API_BASE_URL}/lanes-basic`;
      const mockResponse: LaneBasic[] = [
        { id: '1', name: 'Lane 1' },
        { id: '2', name: 'Lane 2' },
      ];

      const httpTesting = TestBed.inject(HttpTestingController);

      // Act
      const basicList$ = service.fetchLaneBasicList();
      const responseSpy = subscribeSpyTo(basicList$);

      const req = httpTesting.expectOne(expectedUrl, 'HTTP request to fetch lane basic list');
      req.flush(mockResponse);

      // Assert
      expect(responseSpy.getValues()).toEqual([mockResponse]);
    });
  });

  describe('fetchLane', () => {
    it('should call the correct endpoint and return a Lane object', () => {
      // Arrange
      const service = TestBed.inject(LaneApiService);
      const laneId = '123';
      const expectedUrl = `${environment.API_BASE_URL}/lanes/${laneId}`;
      const mockResponse = { id: laneId, name: 'Test Lane' };
      const httpTesting = TestBed.inject(HttpTestingController);
      // Act
      const lane$ = service.fetchLane(laneId);
      const responseSpy = subscribeSpyTo(lane$);
      const req = httpTesting.expectOne(expectedUrl, 'HTTP request to fetch lane by ID');
      req.flush(mockResponse);

      // Assert
      expect(responseSpy.getValues()).toEqual([mockResponse]);
    });
  });

  describe('getLaneBasicListResource', () => {
    it('should call the correct endpoint and return an array of LaneBasic', async () => {
      // Arrange
      const service = TestBed.inject(LaneApiService);
      const expectedUrl = `${environment.API_BASE_URL}/lanes-basic`;
      const mockResponse: LaneBasic[] = [
        { id: '1', name: 'Lane 1' },
        { id: '2', name: 'Lane 2' },
      ];

      const httpTesting = TestBed.inject(HttpTestingController);

      // Act
      const basicListResource = TestBed.runInInjectionContext(() => service.getLaneBasicListResource());
      TestBed.tick();

      const req = httpTesting.expectOne(expectedUrl, 'HTTP request to fetch lane basic list');
      req.flush(mockResponse);

      await TestBed.inject(ApplicationRef).whenStable();

      // Assert
      expect(basicListResource.isLoading()).toBeFalse();
      expect(basicListResource.value()).toEqual(mockResponse);
    });
  });

  describe('getLaneResource', () => {
    it('should call the correct endpoint and return a Lane object', async () => {
      // Arrange
      const service = TestBed.inject(LaneApiService);
      const laneId = '123';
      const expectedUrl = `${environment.API_BASE_URL}/lanes/${laneId}`;
      const mockResponse = { id: laneId, name: 'Test Lane' } as Lane;
      const httpTesting = TestBed.inject(HttpTestingController);

      // Act
      const laneResource = TestBed.runInInjectionContext(() => service.getLaneResource(signal(laneId)));
      TestBed.tick();

      const req = httpTesting.expectOne(expectedUrl, 'HTTP request to fetch lane by ID');
      req.flush(mockResponse);

      await TestBed.inject(ApplicationRef).whenStable();

      // Assert
      expect(laneResource.isLoading()).toBeFalse();
      expect(laneResource.value()).toEqual(mockResponse);
    });
  });
});
