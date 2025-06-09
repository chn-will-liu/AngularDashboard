import { HttpClient, httpResource, HttpResourceRef } from '@angular/common/http';
import { inject, Injectable, Signal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Lane, LaneBasic } from './lane.types';

/**
 * Service for interacting with the lane API.
 * Provides methods to fetch basic lane information and detailed lane data.
 *
 * For demostration purpose, this service contains both rxjs-based methods for fetching data and
 * methods that use with Angular's experimental HttpResource API.
 * In a real world application, when the HttpResource API is stable, we would likely use the HttpResource methods.
 */
@Injectable({
  providedIn: 'root',
})
export class LaneApiService {
  private readonly baseUrl = environment.API_BASE_URL;
  private readonly endpoints = {
    laneBasicList: () => `${this.baseUrl}/lanes-basic`,
    laneById: (id: string) => `${this.baseUrl}/lanes/${id}`,
  };

  private readonly httpClient = inject(HttpClient);

  /**
   * Fetches a list of lanes with basic information including their IDs and names.
   * @returns An observable that emits an array of LaneBasic objects.
   */
  public fetchLaneBasicList(): Observable<LaneBasic[]> {
    return this.httpClient.get<LaneBasic[]>(this.endpoints.laneBasicList());
  }

  /**
   * Fetches detailed information about a specific lane by its ID.
   * @param id  The ID of the lane to fetch.
   * @returns  An observable that emits a Lane object containing detailed information about the lane.
   */
  public fetchLane(id: string): Observable<Lane> {
    return this.httpClient.get<Lane>(this.endpoints.laneById(id));
  }

  /**
   * This method uses Angular's experimental HttpResource API to fetch the list of lanes.
   * @returns An HttpResourceRef that provides access to a list of LaneBasic objects.
   */
  public getLaneBasicListResource(): HttpResourceRef<LaneBasic[] | undefined> {
    return httpResource<LaneBasic[]>(() => this.endpoints.laneBasicList());
  }

  /**
   * This method uses Angular's experimental HttpResource API to fetch a specific lane by its ID.
   * It returns an HttpResourceRef that provides access to a Lane object.
   * @param id The ID of the lane wrapped in a Signal.
   * @returns  An HttpResourceRef that provides access to a Lane object.
   */
  public getLaneResource(id: Signal<string>): HttpResourceRef<Lane | undefined> {
    return httpResource<Lane>(() => this.endpoints.laneById(id()));
  }
}
