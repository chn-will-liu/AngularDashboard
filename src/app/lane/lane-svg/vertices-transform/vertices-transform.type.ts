export interface BoundingBox {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface ViewportConfig {
  width: number;
  height: number;
  /**
   * The percentage of the viewport width and height to use as a margin around the content box.
   * `0.2` means 20% of the viewport width/height, `0.05` means 5% of the viewport width/height.
   * Don't use values greater than `0.5` as it will result in negative width/height of the content box.
   */
  marginPercentage: number;
}
