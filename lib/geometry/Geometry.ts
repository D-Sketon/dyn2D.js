import { Epsilon } from "../Epsilon";
import { AbstractShape } from "./AbstractShape";
import { Capsule } from "./Capsule";
import { Circle } from "./Circle";
import { Convex } from "./Convex";
import { Ellipse } from "./Ellipse";
import { HalfEllipse } from "./HalfEllipse";
import { Link } from "./Link";
import { Polygon } from "./Polygon";
import { Rectangle } from "./Rectangle";
import { Segment } from "./Segment";
import { Slice } from "./Slice";
import { Transform } from "./Transform";
import { Triangle } from "./Triangle";
import { Vector2 } from "./Vector2";
import { Wound } from "./Wound";

/** 2 * PI constant */
export const TWO_PI = Math.PI * 2;
/** The value of 1/3 */
export const INV_3 = 1 / 3;
/** The value of the inverse of the square root of 3; 1/sqrt(3) */
export const INV_SQRT_3 = 1 / Math.sqrt(3);

function _getWinding(points: Vector2[]): number {
  if (points == null)
    throw new TypeError("Geometry.getWinding: points");
  const len = points.length;
  if (len < 2)
    throw new RangeError("Geometry.getWinding: points.length < 2");
  let area = 0;
  for (let i = 0; i < len; i++) {
    const j = i + 1 == len ? 0 : i + 1;
    const p1 = points[i];
    const p2 = points[j];
    if (p1 == null) {
      throw new TypeError("Geometry.getWinding: points[" + i + "]");
    }
    if (p2 == null) {
      throw new TypeError("Geometry.getWinding: points[" + j + "]");
    }
    area += p1.cross(p2);
  }
  return area;
}

/**
 * Returns the winding, Clockwise or Counter-Clockwise, for the given list of points of a polygon.
 * @param points The {@link Polygon} points
 * @returns Negative for Clockwise winding; positive for Counter-Clockwise winding
 * @throws `TypeError` if points is null or an element of points is null
 * @throws `RangeError` if points.length < 2
 */
function getWinding(points: Vector2[]): number;
function getWinding(...points: Vector2[]): number;
function getWinding(...args: any[]): number {
  let points: Vector2[];
  if (args.length === 1 && Array.isArray(args[0])) {
    points = args[0];
  } else {
    points = args;
  }
  return _getWinding(points);
}

function _reverseWinding(points: Vector2[]): void {
  if (points == null)
    throw new TypeError("Geometry.reverseWinding: points");
  if (points.length < 2) return;
  points.reverse();
}

/**
 * Reverses the order of the polygon points within the given array.
 * @param points The {@link Polygon} points
 * @throws `TypeError` if points is null
 */
function reverseWinding(points: Vector2[]): void;
function reverseWinding(...points: Vector2[]): void;
function reverseWinding(...args: any[]): void {
  let points: Vector2[];
  if (args.length === 1 && Array.isArray(args[0])) {
    points = args[0];
  } else {
    points = args;
  }
  _reverseWinding(points);
}

function _getAverageCenter(points: Vector2[]): Vector2 {
  if (points == null)
    throw new TypeError("Geometry.getAverageCenter: points");
  const len = points.length;
  if (len === 0)
    throw new RangeError("Geometry.getAverageCenter: points.length === 0");
  if (len === 1) {
    const p = points[0];
    if (p == null)
      throw new TypeError("Geometry.getAverageCenter: points[0]");
    return p.copy();
  }
  const ac = new Vector2();
  for (let i = 0; i < len; i++) {
    const p = points[i];
    if (p == null)
      throw new TypeError("Geometry.getAverageCenter: points[" + i + "]");
    ac.add(p);
  }
  return ac.divide(len);
}

/**
 * Returns the centroid of the given points by performing an average.
 * @param points The list of points
 * @returns The centroid
 * @throws `TypeError` if points is null or an element of points is null
 * @throws `RangeError` if points.length === 0
 */
function getAverageCenter(points: Vector2[]): Vector2;
function getAverageCenter(...points: Vector2[]): Vector2;
function getAverageCenter(...args: any[]): Vector2 {
  let points: Vector2[];
  if (args.length === 1 && Array.isArray(args[0])) {
    points = args[0];
  } else {
    points = args;
  }
  return _getAverageCenter(points);
}


function _getAreaWeightedCenter(points: Vector2[]): Vector2 {
  const ac = getAverageCenter(points);
  const len = points.length;
  const center = new Vector2();
  let area = 0;
  for (let i = 0; i < len; i++) {
    const p1 = points[i].difference(ac);
    const p2 = points[(i + 1) % len].difference(ac);
    const cross = p1.cross(p2);
    area += cross / 2;
    center.add(p1.add(p2).multiply(INV_3).multiply(cross / 2));
  }
  if (Math.abs(area) <= Epsilon.E) {
    return points[0].copy();
  }
  center.divide(area).add(ac);
  return center;
}

/**
 * Returns the area weighted centroid for the given points.
 * @param points The {@link Polygon} points
 * @returns The area weighted centroid
 * @throws `TypeError` if points is null or an element of points is null
 * @throws `RangeError` if points.length === 0
 */
function getAreaWeightedCenter(points: Vector2[]): Vector2;
function getAreaWeightedCenter(...points: Vector2[]): Vector2;
function getAreaWeightedCenter(...args: any[]): Vector2 {
  let points: Vector2[];
  if (args.length === 1 && Array.isArray(args[0])) {
    points = args[0];
  } else {
    points = args;
  }
  return _getAreaWeightedCenter(points);
}

/**
 * Returns the maximum radius of the given vertices rotated about the origin.
 * @param vertices The {@link Polygon} points
 * @returns The maximum radius
 */
function getRotationRadius(vertices: Vector2[]): number;
function getRotationRadius(center: Vector2, vertices: Vector2[]): number;
function getRotationRadius(center: Vector2 | Vector2[], vertices?: Vector2[]): number {
  if (center instanceof Vector2 && vertices == null ||
    center == null && vertices == null
  ) return 0;
  if (center == null) {
    center = new Vector2();
  } else if (Array.isArray(center)) {
    vertices = center;
    center = new Vector2();
  }
  const len = vertices.length;
  if (len === 0) return 0;
  let r2 = 0;
  for (let i = 0; i < len; i++) {
    const v = vertices[i];
    if (v != null) {
      const d2 = center.distanceSquared(v);
      r2 = Math.max(r2, d2);
    }
  }
  return Math.sqrt(r2);
}

/**
 *  Returns an array of normalized vectors representing the normals of all the edges given the vertices.
 * @param vertices The vertices
 * @returns The normals
 * @throws `TypeError` if an element of vertices is null
 */
function getCounterClockwiseEdgeNormals(vertices: Vector2[]): Vector2[];
function getCounterClockwiseEdgeNormals(...vertices: Vector2[]): Vector2[];
function getCounterClockwiseEdgeNormals(...vertices: any[]): Vector2[] {
  if (vertices == null) return null;
  if (vertices.length === 1 && Array.isArray(vertices[0])) {
    vertices = vertices[0];
  }
  const len = vertices.length;
  if (len === 0) return null;
  if (len === 1 && vertices[0] == null) return null;

  const normals = new Array<Vector2>(len);
  for (let i = 0; i < len; i++) {
    const v1 = vertices[i];
    if (v1 == null) {
      throw new TypeError("Geometry.getCounterClockwiseEdgeNormals: vertices[" + i + "]");
    };
    const v2 = vertices[(i + 1) % len];
    if (v2 == null) {
      throw new TypeError("Geometry.getCounterClockwiseEdgeNormals: vertices[" + ((i + 1) % len) + "]");
    };
    const n = v1.to(v2).left();
    n.normalize();
    normals[i] = n;
  }
  return normals;
}

/**
 * Returns a new {@link Circle} with the given radius centered on the origin.
 * @param radius The radius in meters
 * @returns The {@link Circle}
 * @throws `RangeError` if radius <= 0
 */
function createCircle(radius: number): Circle {
  return new Circle(radius);
}

/**
 * Returns a new {@link Polygon} with the given vertices.
 * @param vertices The vertices
 * @returns The {@link Polygon}
 * @throws `TypeError` if an element of vertices is null
 * @throws `RangeError` if vertices.length < 3
 */
function createPolygon(...vertices: Vector2[]): Polygon {
  let len = vertices.length;
  const verts = new Array<Vector2>(len);
  for (let i = 0; i < len; i++) {
    const vertex = vertices[i];
    if (vertex != null) {
      verts[i] = vertex.copy();
    } else {
      throw new TypeError("Geometry.createPolygon: vertices[" + i + "]");
    }
  }
  return new Polygon(...verts);
}

/**
 * Returns a new {@link Polygon}, using the given vertices, centered at the origin.
 * @param vertices The vertices
 * @returns The {@link Polygon}
 * @throws `TypeError` if an element of vertices is null
 * @throws `RangeError` if vertices.length < 3
 */
function createPolygonAtOrigin(...vertices: Vector2[]): Polygon {
  const polygon = createPolygon(...vertices);
  const center = polygon.getCenter();
  polygon.translate(-center.x, -center.y);
  return polygon;
}

/**
 * Returns a new {@link Polygon} with count number of points, where the
 * points are evenly distributed around the unit circle.  The resulting {@link Polygon}
 * will be centered on the origin.
 * @param count The number of vertices
 * @param radius The radius from the center to each vertex in meters
 * @param theta The starting angle in radians
 * @returns The {@link Polygon}
 * @throws `RangeError` if count < 3
 * @throws `RangeError` if radius <= 0
 */
function createUnitCirclePolygon(count: number, radius: number, theta?: number): Polygon {
  if (theta === void 0) theta = 0.0;
  return createPolygonalCircle(count, radius, theta);
}

/**
 * Creates a square (equal height and width {@link Rectangle}) with the given size 
 * centered at the origin.
 * @param size The size of the square in meters
 * @returns The {@link Rectangle}
 * @throws `RangeError` if size <= 0
 */
function createSquare(size: number): Rectangle {
  if (size <= 0) {
    throw new RangeError('Geometry.createSquare: size must be positive.');
  }
  return new Rectangle(size, size);
}

/**
 * Creates a new {@link Rectangle} with the given width and height centered at the origin.
 * @param width The width of the rectangle in meters
 * @param height The height of the rectangle in meters
 * @returns The {@link Rectangle}
 * @throws `RangeError` if width <= 0
 * @throws `RangeError` if height <= 0
 */
function createRectangle(width: number, height: number): Rectangle {
  return new Rectangle(width, height);
}

/**
 * Creates a new {@link Triangle} with the given points centered at the origin.
 * @param p1 The first point
 * @param p2 The second point
 * @param p3 The third point
 * @returns The {@link Triangle}
 * @throws `TypeError` if p1 is null
 * @throws `TypeError` if p2 is null
 * @throws `TypeError` if p3 is null
 */
function createTriangle(p1: Vector2, p2: Vector2, p3: Vector2): Triangle {
  if (p1 == null) {
    throw new TypeError('Geometry.createTriangle: p1 is null.');
  }
  if (p2 == null) {
    throw new TypeError('Geometry.createTriangle: p2 is null.');
  }
  if (p3 == null) {
    throw new TypeError('Geometry.createTriangle: p3 is null.');
  }
  return new Triangle(p1.copy(), p2.copy(), p3.copy());
}

/**
 * Creates a right angle {@link Triangle} with the center at the origin.
 * @param p1 The first point
 * @param p2 The second point
 * @param p3 The third point
 * @returns The {@link Triangle}
 * @throws `TypeError` if p1 is null
 * @throws `TypeError` if p2 is null
 * @throws `TypeError` if p3 is null
 */
function createTriangleAtOrigin(p1: Vector2, p2: Vector2, p3: Vector2): Triangle {
  const triangle = createTriangle(p1, p2, p3);
  const center = triangle.getCenter();
  triangle.translate(-center.x, -center.y);
  return triangle;
}

/**
 * Creates a right angle {@link Triangle} with the center at the origin.
 * @param width The width of the base in meters
 * @param height The height in meters
 * @param mirror true if the triangle should be mirrored along the y-axis
 * @returns The {@link Triangle}
 * @throws `RangeError` if width <= 0
 * @throws `RangeError` if height <= 0
 */
function createRightTriangle(width: number, height: number, mirror?: boolean): Triangle {
  if (mirror === void 0) mirror = false;
  if (width <= 0) {
    throw new RangeError('Geometry.createRightTriangle: width must be positive.');
  }
  if (height <= 0) {
    throw new RangeError('Geometry.createRightTriangle: height must be positive.');
  }
  const top = new Vector2(0.0, height);
  const left = new Vector2(0.0, 0.0);
  const right = new Vector2(mirror ? -width : width, 0.0);
  let triangle: Triangle;
  if (mirror) {
    triangle = new Triangle(top, right, left);
  } else {
    triangle = new Triangle(top, left, right);
  }
  const center = triangle.getCenter();
  triangle.translate(-center.x, -center.y);
  return triangle;
}

/**
 * Creates an equilateral {@link Triangle} with the center at the origin.
 * @param height The height of the {@link Triangle} in meters
 * @returns The {@link Triangle}
 * @throws `RangeError` if height <= 0
 */
function createEquilateralTriangle(height: number): Triangle {
  if (height <= 0) {
    throw new RangeError('Geometry.createEquilateralTriangle: height must be positive.');
  }
  const a = 2.0 * height * INV_SQRT_3;
  return createIsoscelesTriangle(a, height);
}

/**
 * Creates an isosceles {@link Triangle} with the center at the origin.
 * @param width The width of the base in meters
 * @param height The height in meters
 * @returns The {@link Triangle}
 * @throws `RangeError` if width <= 0
 * @throws `RangeError` if height <= 0
 */
function createIsoscelesTriangle(width: number, height: number): Triangle {
  if (width <= 0) {
    throw new RangeError('Geometry.createIsoscelesTriangle: width must be positive.');
  }
  if (height <= 0) {
    throw new RangeError('Geometry.createIsoscelesTriangle: height must be positive.');
  }
  const top = new Vector2(0.0, height);
  const left = new Vector2(-width * 0.5, 0.0);
  const right = new Vector2(width * 0.5, 0.0);
  const triangle = new Triangle(top, left, right);
  const center = triangle.getCenter();
  triangle.translate(-center.x, -center.y);
  return triangle;
}

/**
 * Creates a new {@link Segment} from the origin to the given end point
 * @param end The end point
 * @returns The {@link Segment}
 * @throws `TypeError` if end is null
 */
function createSegment(end: Vector2): Segment;
/**
 * Creates a new {@link Segment} with the given points.
 * @param p1 The start point
 * @param p2 The end point
 * @returns The {@link Segment}
 * @throws `TypeError` if p1 is null
 * @throws `TypeError` if p2 is null
 */
function createSegment(p1: Vector2, p2: Vector2): Segment;
function createSegment(p1: Vector2, p2?: Vector2): Segment {
  if (p2 === void 0) return createSegment(new Vector2(), p1);
  if (p1 == null) {
    throw new TypeError('Geometry.createSegment: p1 is null.');
  }
  if (p2 == null) {
    throw new TypeError('Geometry.createSegment: p2 is null.');
  }
  return new Segment(p1.copy(), p2.copy());
}

/**
 * Creates a new {@link Segment} with the given points.
 * 
 * This method translates the {@link Segment} vertices so that the center is at the origin.
 * @param p1 The start point
 * @param p2 The end point
 * @returns The {@link Segment}
 * @throws `TypeError` if p1 is null
 * @throws `TypeError` if p2 is null
 */
function createSegmentAtOrigin(p1: Vector2, p2: Vector2): Segment {
  const segment = createSegment(p1, p2);
  const center = segment.getCenter();
  segment.translate(-center.x, -center.y);
  return segment;
}

/**
 * Creates a new {@link Segment} with the given length with the center
 * at the origin.
 * @param length The length of the segment in meters
 * @returns The {@link Segment}
 * @throws `RangeError` if length <= 0
 */
function createHorizontalSegment(length: number): Segment {
  if (length <= 0) {
    throw new RangeError('Geometry.createHorizontalSegment: length must be positive.');
  }
  const start = new Vector2(-length * 0.5, 0.0);
  const end = new Vector2(length * 0.5, 0.0);
  return new Segment(start, end);
}

/**
 * Creates a new {@link Segment} with the given length with the center
 * at the origin.
 * @param length The length of the segment in meters
 * @returns The {@link Segment}
 * @throws `RangeError` if length <= 0
 */
function createVerticalSegment(length: number): Segment {
  if (length <= 0) {
    throw new RangeError('Geometry.createHorizontalSegment: length must be positive.');
  }
  const start = new Vector2(0.0, -length * 0.5);
  const end = new Vector2(0.0, length * 0.5);
  return new Segment(start, end);
}

/**
 * Creates a new {@link Capsule} bounded by the given rectangle width and height.
 * 
 * The capsule will be axis-aligned and centered on the origin with the caps on the
 * ends of the largest dimension.
 * @param width The bounding rectangle width
 * @param height The bounding rectangle height
 * @returns The {@link Capsule}
 * @throws `RangeError` if width <= 0
 * @throws `RangeError` if height <= 0
 */
function createCapsule(width: number, height: number): Capsule {
  return new Capsule(width, height);
}

/**
 * Creates a new {@link Slice} with the given circle radius and arc length theta.
 * @param radius The circle radius
 * @param theta The total arc length in radians
 * @returns The {@link Slice}
 * @throws `RangeError` if radius <= 0
 * @throws `RangeError` if theta <= 0
 * @throws `RangeError` if theta > 2 * PI
 */
function createSlice(radius: number, theta: number): Slice {
  return new Slice(radius, theta);
}

/**
 * Creates a new {@link Slice} with the given circle radius and arc length theta.
 * 
 * The slice will be positioned with the <i>centroid</i> at the origin.
 * @param radius The circle radius
 * @param theta The total arc length in radians
 * @returns The {@link Slice}
 * @throws `RangeError` if radius <= 0
 * @throws `RangeError` if theta <= 0
 * @throws `RangeError` if theta > 2 * PI
 */
function createSliceAtOrigin(radius: number, theta: number): Slice {
  const slice = new Slice(radius, theta);
  slice.translate(-slice.center.x, -slice.center.y);
  return slice;
}

/**
 * Creates a new {@link Ellipse} bounded by the given rectangle width and height.
 * @param width The bounding rectangle width
 * @param height The bounding rectangle height
 * @returns The {@link Ellipse}
 * @throws `RangeError` if width <= 0
 * @throws `RangeError` if height <= 0
 */
function createEllipse(width: number, height: number): Ellipse {
  return new Ellipse(width, height);
}

/**
 * Creates a new {@link HalfEllipse} bounded by the given rectangle width and height.
 * @param width The bounding rectangle width
 * @param height The bounding rectangle height
 * @returns The {@link HalfEllipse}
 * @throws `RangeError` if width <= 0
 * @throws `RangeError` if height <= 0
 */
function createHalfEllipse(width: number, height: number): HalfEllipse {
  return new HalfEllipse(width, height);
}

/**
 * Creates a new {@link HalfEllipse} bounded by the given rectangle width and height.
 * @param width The bounding rectangle width
 * @param height The bounding rectangle height
 * @returns The {@link HalfEllipse}
 * @throws `RangeError` if width <= 0
 * @throws `RangeError` if height <= 0
 */
function createHalfEllipseAtOrigin(width: number, height: number): HalfEllipse {
  const half = new HalfEllipse(width, height);
  const c = half.getCenter();
  half.translate(-c.x, -c.y);
  return half;
}

/**
 * Creates a new {@link Polygon} in the shape of a circle with count number of vertices centered
 * on the origin.
 * @param count The number of vertices
 * @param radius The radius of the circle
 * @param theta The radial offset for the points in radians
 * @returns The {@link Polygon}
 * @throws `RangeError` if count < 3
 * @throws `RangeError` if radius <= 0
 */
function createPolygonalCircle(count: number, radius: number, theta?: number): Polygon {
  if (theta === void 0) theta = 0.0;
  if (count < 3) {
    throw new RangeError('Geometry.createPolygonalCircle: count must be greater than or equal to 3.');
  }
  if (radius <= 0) {
    throw new RangeError('Geometry.createPolygonalCircle: radius must be positive.');
  }
  const pin = TWO_PI / count;
  const vertices = new Array<Vector2>(count);

  const c = Math.cos(pin);
  const s = Math.sin(pin);
  let t = 0;

  let x = radius;
  let y = 0;
  if (theta != 0) {
    x = radius * Math.cos(theta);
    y = radius * Math.sin(theta);
  }

  for (let i = 0; i < count; i++) {
    vertices[i] = new Vector2(x, y);
    t = x;
    x = c * x - s * y;
    y = s * t + c * y;
  }

  return new Polygon(...vertices);
}

/**
 * Creates a new {@link Polygon} in the shape of a {@link Slice} with count number of vertices with the
 * circle center centered on the origin.
 * 
 * This method returns a polygon with count + 3 vertices.
 * @param count The number of vertices
 * @param radius The radius of the circle
 * @param theta The arc length of the slice in radians
 * @returns The {@link Polygon}
 * @throws `RangeError` if count < 1
 * @throws `RangeError` if radius <= 0
 * @throws `RangeError` if theta <= 0
 */
function createPolygonalSlice(count: number, radius: number, theta: number): Polygon {
  if (count < 1) {
    throw new RangeError('Geometry.createPolygonalSlice: count must be greater than or equal to 1.');
  }
  if (radius <= 0) {
    throw new RangeError('Geometry.createPolygonalSlice: radius must be positive.');
  }
  if (theta <= 0) {
    throw new RangeError('Geometry.createPolygonalSlice: theta must be positive.');
  }
  const pin = theta / (count + 1);
  const vertices = new Array<Vector2>(count + 3);

  const c = Math.cos(pin);
  const s = Math.sin(pin);
  let t = 0;

  let x = radius * Math.cos(-theta * 0.5);
  let y = radius * Math.sin(-theta * 0.5);

  vertices[0] = new Vector2(x, y);
  vertices[count + 1] = new Vector2(x, -y);

  for (let i = 1; i < count + 1; i++) {
    t = x;
    x = c * x - s * y;
    y = s * t + c * y;
    vertices[i] = new Vector2(x, y);
  }
  vertices[count + 2] = new Vector2();

  return new Polygon(...vertices);
}

/**
 * Creates a new {@link Polygon} in the shape of a {@link Slice} with count number of vertices centered on the origin.
 * 
 * This method returns a polygon with count + 3 vertices.
 * @param count The number of vertices
 * @param radius The radius of the circle
 * @param theta The arc length of the slice in radians
 * @returns The {@link Polygon}
 * @throws `RangeError` if count < 1
 * @throws `RangeError` if radius <= 0
 * @throws `RangeError` if theta <= 0
 */
function createPolygonalSliceAtOrigin(count: number, radius: number, theta: number): Polygon {
  const polygon = createPolygonalSlice(count, radius, theta);
  const center = polygon.getCenter();
  polygon.translate(-center.x, -center.y);
  return polygon;
}

/**
 * Creates a new {@link Polygon} in the shape of an ellipse with count number of vertices centered
 * on the origin.
 * @param count The number of vertices
 * @param width The width of the ellipse
 * @param height The height of the ellipse
 * @returns The {@link Polygon}
 * @throws `RangeError` if count < 4
 * @throws `RangeError` if width <= 0
 * @throws `RangeError` if height <= 0
 */
function createPolygonalEllipse(count: number, width: number, height: number): Polygon {
  if (count < 4) {
    throw new RangeError('Geometry.createPolygonalEllipse: count must be greater than or equal to 4.');
  }
  if (width <= 0) {
    throw new RangeError('Geometry.createPolygonalEllipse: width must be positive.');
  }
  if (height <= 0) {
    throw new RangeError('Geometry.createPolygonalEllipse: height must be positive.');
  }
  const a = width * 0.5;
  const b = height * 0.5;

  const n2 = Math.floor(count / 2);
  const pin2 = Math.PI / n2;
  const vertices = new Array<Vector2>(n2 * 2);

  let j = 0;
  for (let i = 0; i < n2 + 1; i++) {
    const t = pin2 * i;
    const x = a * Math.cos(t);
    const y = b * Math.sin(t);
    if (i > 0) {
      vertices[vertices.length - j] = new Vector2(x, -y);
    }
    vertices[j++] = new Vector2(x, y);
  }

  return new Polygon(...vertices);
}

/**
 * Creates a new {@link Polygon} in the shape of a half ellipse with count number of vertices with the
 * base at the origin.
 * 
 * Returns a polygon with count + 2 vertices.
 * @param count The number of vertices
 * @param width The width of the half ellipse
 * @param height The height of the half ellipse; should be the total height
 * @returns The {@link Polygon}
 * @throws `RangeError` if count < 4
 * @throws `RangeError` if width <= 0
 * @throws `RangeError` if height <= 0
 */
function createPolygonalHalfEllipse(count: number, width: number, height: number): Polygon {
  if (count < 4) {
    throw new RangeError('Geometry.createPolygonalHalfEllipse: count must be greater than or equal to 4.');
  }
  if (width <= 0) {
    throw new RangeError('Geometry.createPolygonalHalfEllipse: width must be positive.');
  }
  if (height <= 0) {
    throw new RangeError('Geometry.createPolygonalHalfEllipse: height must be positive.');
  }
  const a = width * 0.5;
  const b = height * 0.5;

  const inc = Math.PI / (count + 1);
  const vertices = new Array<Vector2>(count + 2);

  vertices[0] = new Vector2(a, 0);
  vertices[count + 1] = new Vector2(-a, 0);

  for (let i = 1; i < count + 1; i++) {
    const t = inc * i;
    const x = a * Math.cos(t);
    const y = b * Math.sin(t);
    vertices[i] = new Vector2(x, y);
  }

  return new Polygon(...vertices);
}

/**
 * Creates a new {@link Polygon} in the shape of a half ellipse with count number of vertices centered
 * on the origin.
 * 
 * Returns a polygon with count + 2 vertices.
 * @param count The number of vertices
 * @param width The width of the half ellipse
 * @param height The height of the half ellipse; should be the total height
 * @returns The {@link Polygon}
 * @throws `RangeError` if count < 4
 * @throws `RangeError` if width <= 0
 * @throws `RangeError` if height <= 0
 */
function createPolygonalHalfEllipseAtOrigin(count: number, width: number, height: number): Polygon {
  const polygon = createPolygonalHalfEllipse(count, width, height);
  const center = polygon.getCenter();
  polygon.translate(-center.x, -center.y);
  return polygon;
}

/**
 * Creates a new {@link Polygon} in the shape of a capsule using count number of vertices on each
 * cap, centered on the origin.  The caps will be on the ends of the largest dimension.
 * 
 * The returned polygon will have 4 + 2 * count number of vertices.
 * @param count The number of vertices
 * @param width The bounding rectangle width
 * @param height The bounding rectangle height
 * @returns The {@link Polygon}
 * @throws `RangeError` if count < 1
 * @throws `RangeError` if width <= 0
 * @throws `RangeError` if height <= 0
 */
function createPolygonalCapsule(count: number, width: number, height: number): Polygon {
  if (count < 1) {
    throw new RangeError('Geometry.createPolygonalCapsule: count must be greater than or equal to 1.');
  }
  if (width <= 0) {
    throw new RangeError('Geometry.createPolygonalCapsule: width must be positive.');
  }
  if (height <= 0) {
    throw new RangeError('Geometry.createPolygonalCapsule: height must be positive.');
  }
  if (Math.abs(width - height) < Epsilon.E) {
    return createPolygonalCircle(count, width);
  }
  const pin = Math.PI / (count + 1);
  const vertices = new Array<Vector2>(4 + 2 * count);

  const c = Math.cos(pin);
  const s = Math.sin(pin);
  let t = 0;

  let major = width;
  let minor = height;
  let vertical = false;
  if (width < height) {
    major = height;
    minor = width;
    vertical = true;
  }

  let radius = minor * 0.5;
  let offset = major * 0.5 - radius;
  let ox = 0;
  let oy = 0;
  if (vertical) {
    oy = offset;
  } else {
    ox = offset;
  }

  let n = 0;
  let ao = vertical ? 0 : Math.PI * 0.5;
  let x = radius * Math.cos(pin - ao);
  let y = radius * Math.sin(pin - ao);
  for (let i = 0; i < count; i++) {
    vertices[n++] = new Vector2(x + ox, y + oy);
    t = x;
    x = c * x - s * y;
    y = s * t + c * y;
  }

  if (vertical) {
    vertices[n++] = new Vector2(-radius, oy);
    vertices[n++] = new Vector2(-radius, -oy);
  } else {
    vertices[n++] = new Vector2(ox, radius);
    vertices[n++] = new Vector2(-ox, radius);
  }

  ao = vertical ? Math.PI : Math.PI * 0.5;
  x = radius * Math.cos(pin + ao);
  y = radius * Math.sin(pin + ao);
  for (let i = 0; i < count; i++) {
    vertices[n++] = new Vector2(x - ox, y - oy);
    t = x;
    x = c * x - s * y;
    y = s * t + c * y;
  }

  if (vertical) {
    vertices[n++] = new Vector2(radius, -oy);
    vertices[n++] = new Vector2(radius, oy);
  } else {
    vertices[n++] = new Vector2(-ox, -radius);
    vertices[n++] = new Vector2(ox, -radius);
  }

  return new Polygon(...vertices);
}

/**
 * Returns a new list containing the 'cleansed' version of the given listing of polygon points.
 * 
 * This method ensures the polygon has CCW winding, removes colinear vertices, and removes coincident vertices.
 * 
 * If the given list is empty, the list is returned.
 * @param points The list polygon points
 * @returns A new list containing the 'cleansed' version of the given listing of polygon points
 * @throws `TypeError` if points is null or if points contains null elements
 */
function cleanse(points: Vector2[]): Vector2[] {
  if (points == null) {
    throw new TypeError("Geometry.cleanse: points is null.");
  }
  const len = points.length;
  if (len == 0) return points;
  const result = [];

  let winding = 0.0;

  for (let i = 0; i < len; i++) {
    const point = points[i];

    const n = i - 1 < 0 ? len - 1 : i - 1;
    const m = i + 1 == len ? 0 : i + 1;
    const prev = points[n];
    const next = points[m];

    if (point == null)
      throw new TypeError("Geometry.cleanse: points[" + i + "] is null.");
    if (prev == null)
      throw new TypeError("Geometry.cleanse: points[" + n + "] is null.");
    if (next == null)
      throw new TypeError("Geometry.cleanse: points[" + m + "] is null.");
    const diff = point.difference(next);
    if (diff.isZero()) {
      continue;
    }

    const prevToPoint = prev.to(point);
    const pointToNext = point.to(next);

    if (!prevToPoint.isZero()) {
      const cross = prevToPoint.cross(pointToNext);
      if (Math.abs(cross) <= Epsilon.E) {
        continue;
      }
    }
    winding += point.cross(next);
    result.push(point);
  }
  if (winding < 0.0) {
    reverseWinding(result);
  }

  return result;
}

/**
 * Flips the given polygon about its center along the x-axis and
 * returns the result as a new polygon.
 * 
 * This method assumes that the line is through the origin.
 * @param polygon The polygon to flip
 * @param point The point to flip about
 * @returns The {@link Polygon}
 * @throws `TypeError` if polygon is null
 * @see {@link flip}
 */
function flipAlongTheXAxis(polygon: Polygon, point?: Vector2): Polygon {
  return flip(polygon, Vector2.X_AXIS, point ?? null);
}

/**
 * Flips the given polygon about its center along the y-axis and
 * returns the result as a new polygon.
 * 
 * This method assumes that the line is through the origin.
 * @param polygon The polygon to flip
 * @param point The point to flip about
 * @returns The {@link Polygon}
 * @throws `TypeError` if polygon is null
 * @see {@link flip}
 */
function flipAlongTheYAxis(polygon: Polygon, point?: Vector2): Polygon {
  return flip(polygon, Vector2.Y_AXIS, point ?? null);
}

/**
 * Flips the given polygon about the given line and returns the result
 * as a new polygon.
 * 
 * This method assumes that the line is through the origin.
 * @param polygon The polygon to flip
 * @param axis The axis to flip about
 * @param point The point to flip about
 * @returns The {@link Polygon}
 * @throws `TypeError` if polygon is null
 * @throws `TypeError` if axis is null
 * @throws `TypeError` if axis is zero
 */
function flip(polygon: Polygon, axis: Vector2, point?: Vector2): Polygon {
  if (polygon == null) {
    throw new TypeError("Geometry.flip: polygon is null.");
  }
  if (axis == null) {
    throw new TypeError("Geometry.flip: axis is null.");
  }
  if (axis.isZero()) {
    throw new TypeError("Geometry.flip: axis is zero.");
  }
  if (point == null) point = polygon.getCenter();
  axis.normalize();
  const pv = polygon.getVertices();
  const nv = new Array<Vector2>(pv.length);
  for (let i = 0; i < pv.length; i++) {
    const v0 = pv[i];
    const v1 = v0.difference(point);
    const proj = v1.dot(axis);
    const vp = axis.product(proj);
    const rv = vp.add(vp.x - v1.x, vp.y - v1.y);
    nv[i] = rv.add(point);
  }
  if (getWinding(nv) < 0.0) {
    reverseWinding(nv);
  }
  return new Polygon(...nv);
}

/**
 * Returns the Minkowski Sum of the given convex shapes.
 * 
 * This method computes the Minkowski Sum in O(n + m) time where n and m are the number
 * of vertices of the first and second convex respectively.
 * 
 * This method accepts any {@link Convex} {@link Wound} shape which basically means
 * {@link Polygon}s or {@link Segment}s.
 * 
 * This method will compute the minkowski sum based on the current position of the input
 * convex. This means that the result polygon may not be positioned at a location that's expected.
 * There are two ways to solve this. The preferred approach is that both input {@link Convex}
 * are centered at the origin. This ensures the result will be positioned at the origin AND
 * helps with the numeric accuracy of the computation. The alternative is to leave the input
 * {@link Convex} as is and translate the resulting {@link Polygon} by the negative of it's
 * current position.
 * @param convex1 The first convex shape
 * @param convex2 The second convex shape
 * @returns The {@link Polygon}
 * @throws `TypeError` if convex1 is null
 * @throws `TypeError` if convex2 is null
 * @throws `Error` if the shapes are colinear
 */
function basicMinkowskiSum<E extends Wound & Convex>(convex1: E, convex2: E): Polygon {
  if (convex1 == null) {
    throw new TypeError("Geometry.basicMinkowskiSum: convex1 is null.");
  }
  if (convex2 == null) {
    throw new TypeError("Geometry.basicMinkowskiSum: convex2 is null.");
  }
  const p1v = convex1.getVertices();
  const p2v = convex2.getVertices();

  if (convex1 instanceof Segment && convex2 instanceof Segment) {
    const s1 = p1v[0].to(p1v[1]);
    const s2 = p2v[0].to(p2v[1]);
    if (s1.cross(s2) <= Epsilon.E) {
      throw new Error("Geometry.basicMinkowskiSum: Colinear segments are not supported.");
    }
  }

  const c1 = p1v.length;
  const c2 = p2v.length;

  let i = 0, j = 0;
  const min = new Vector2(Number.MAX_VALUE, Number.MAX_VALUE);
  for (let k = 0; k < c1; k++) {
    const v = p1v[k];
    if (v.y < min.y) {
      min.set(v);
      i = k;
    } else if (v.y == min.y) {
      if (v.x < min.x) {
        min.set(v);
        i = k;
      }
    }
  }

  min.set(Number.MAX_VALUE, Number.MAX_VALUE);
  for (let k = 0; k < c2; k++) {
    const v = p2v[k];
    if (v.y < min.y) {
      min.set(v);
      j = k;
    } else if (v.y == min.y) {
      if (v.x < min.x) {
        min.set(v);
        j = k;
      }
    }
  }

  const n1 = c1 + i;
  const n2 = c2 + j;
  const sum = [];
  for (; i < n1 || j < n2;) {
    const v1s = p1v[i % c1];
    const v1e = p1v[(i + 1) % c1];

    const v2s = p2v[j % c2];
    const v2e = p2v[(j + 1) % c2];

    const v = v1s.sum(v2s);
    sum.push(v);

    const e1 = v1s.to(v1e);
    const e2 = v2s.to(v2e);

    let a3 = e1.cross(e2);
    if (Math.abs(a3) <= Epsilon.E) {
      a3 = 0.0;
    }
    if (a3 > 0) {
      i++;
    } else if (a3 < 0) {
      j++;
    } else {
      i++;
      j++;
    }
  }
  return new Polygon(...sum);
}

/**
 * Performs the Minkowski Sum of the given {@link Polygon} and {@link Circle}.
 * 
 * Use the count parameter to specify the number of vertices to use per round corner.
 * 
 * If the given polygon has <i>n</i> number of vertices, the returned polygon will have 
 * <i>n * 2 + n * count</i> number of vertices.
 * 
 * This method is O(n) where n is the number of vertices in the given polygon.
 * @param polygon The polygon
 * @param circle The circle to add to the polygon
 * @param count The number of vertices to add for each rounded corner
 * @returns The {@link Polygon}
 * @throws `TypeError` if polygon is null
 * @throws `TypeError` if circle is null
 * @throws `RangeError` if count <= 0
 */
function minkowskiSum(circle: Circle, polygon: Polygon, count: number): Polygon;
/**
 * Performs the Minkowski Sum of the given {@link Polygon} and {@link Circle}.
 * 
 * Use the count parameter to specify the number of vertices to use per round corner.
 * 
 * If the given polygon has <i>n</i> number of vertices, the returned polygon will have 
 * <i>n * 2 + n * count</i> number of vertices.
 * 
 * This method is O(n) where n is the number of vertices in the given polygon.
 * @param polygon The polygon
 * @param circle The circle to add to the polygon
 * @param count The number of vertices to add for each rounded corner
 * @returns The {@link Polygon}
 * @throws `TypeError` if polygon is null
 * @throws `TypeError` if circle is null
 * @throws `RangeError` if count <= 0
 */
function minkowskiSum(polygon: Polygon, circle: Circle, count: number): Polygon;
/**
 * Returns a new polygon that has been radially expanded.  This is equivalent to the Minkowski sum of
 * a circle, of the given radius, and the given polygon.
 * 
 * Use the count parameter to specify the number of vertices to use per round corner.
 * 
 * If the given polygon has <i>n</i> number of vertices, the returned polygon will have 
 * <i>n * 2 + n * count</i> number of vertices.
 * 
 * This method is O(n) where n is the number of vertices in the given polygon.
 * @param polygon The polygon to expand radially
 * @param radius The radial expansion
 * @param count The number of vertices to add for each rounded corner
 * @returns The {@link Polygon}
 * @throws `TypeError` if polygon is null
 * @throws `RangeError` if radius <= 0
 * @throws `RangeError` if count <= 0
 */
function minkowskiSum(polygon: Polygon, radius: number, count: number): Polygon;
function minkowskiSum(shape1: Circle | Polygon, shape2: Circle | Polygon | number, count: number): Polygon {
  if (shape1 instanceof Circle) {
    return minkowskiSum(shape2 as Polygon, shape1 as Circle, count);
  }
  if (shape2 instanceof Circle) {
    if (shape2 == null) {
      throw new TypeError("Geometry.minkowskiSum: circle is null.");
    }
    return minkowskiSum(shape1, shape2.radius, count);
  }
  const polygon = shape1 as Polygon;
  const radius = shape2 as number;
  if (polygon == null) {
    throw new TypeError("Geometry.minkowskiSum: polygon is null.");
  }
  if (radius <= 0) {
    throw new RangeError("Geometry.minkowskiSum: radius must be positive.");
  }
  if (count <= 0) {
    throw new RangeError("Geometry.minkowskiSum: count must be positive.");
  }
  const vertices = polygon.vertices;
  const normals = polygon.normals;
  const len = vertices.length;

  const nVerts = new Array<Vector2>(len * 2 + len * count);
  let j = 0;
  for (let i = 0; i < len; i++) {
    const v1 = vertices[i];
    const v2 = vertices[i + 1 == len ? 0 : i + 1];
    const normal = normals[i];
    const nv1 = normal.product(radius).add(v1);
    const nv2 = normal.product(radius).add(v2);

    let cv1 = null;
    if (i == 0) {
      const tn = normals[len - 1];
      cv1 = v1.to(tn.product(radius).add(v1));
    } else {
      cv1 = v1.to(nVerts[j - 1]);
    }
    const cv2 = v1.to(nv1);
    const theta = cv1.getAngleBetween(cv2);
    const pin = theta / (count + 1);

    const c = Math.cos(pin);
    const s = Math.sin(pin);
    let t = 0;

    let sTheta = Vector2.X_AXIS.getAngleBetween(normals[i - 1 < 0 ? len - 1 : i - 1]);
    if (sTheta < 0) {
      sTheta += TWO_PI;
    }

    let x = radius * Math.cos(sTheta);
    let y = radius * Math.sin(sTheta);

    for (let k = 0; k < count; k++) {
      t = x;
      x = c * x - s * y;
      y = s * t + c * y;
      nVerts[j++] = new Vector2(x, y).add(v1);
    }

    nVerts[j++] = nv1;
    nVerts[j++] = nv2;
  }

  return new Polygon(...nVerts);
}

/**
 * Returns a scaled version of the given Shape.
 * 
 * Shape can be {@link Circle}, {@link Capsule}, {@link Ellipse}, {@link HalfEllipse}, {@link Slice},
 * {@link Polygon}, or {@link Segment}.
 * @param shape The shape
 * @param scale The scale
 * @returns The shape
 * @throws `TypeError` if the shape is null
 * @throws `RangeError` if the scale is not positive
 */
function scale<E extends AbstractShape>(shape: E, scale: number): E {
  if (shape == null) {
    throw new TypeError("Geometry.scale: shape is null.");
  }
  if (scale <= 0) {
    throw new RangeError("Geometry.scale: scale must be positive.");
  }
  if (shape instanceof Circle) {
    return new Circle(shape.radius * scale) as unknown as E;
  }
  if (shape instanceof Capsule) {
    return new Capsule(shape.getLength() * scale, shape.getCapRadius() * 2.0 * scale) as unknown as E;
  }
  if (shape instanceof Ellipse) {
    return new Ellipse(shape.getWidth() * scale, shape.getHeight() * scale) as unknown as E;
  }
  if (shape instanceof HalfEllipse) {
    return new HalfEllipse(shape.getWidth() * scale, shape.getHeight() * scale) as unknown as E;
  }
  if (shape instanceof Slice) {
    return new Slice(shape.getSliceRadius() * scale, shape.getTheta()) as unknown as E;
  }
  if (shape instanceof Polygon) {
    const oVertices = shape.vertices;
    const len = oVertices.length;

    const vertices = new Array<Vector2>(len);
    const center = shape.center;
    for (let i = 0; i < len; i++) {
      vertices[i] = center.to(oVertices[i]).multiply(scale).add(center);
    }
    return new Polygon(...vertices) as unknown as E;
  }
  if (shape instanceof Segment) {
    const length = shape.getLength() * scale * 0.5;
    const n = shape.vertices[0].to(shape.vertices[1]);
    n.normalize();
    n.multiply(length);
    return new Segment(shape.center.sum(n.x, n.y), shape.center.difference(n.x, n.y)) as unknown as E;
  }
}

/**
 * Creates a list of {@link Link}s for the given vertices.
 * 
 * If the closed parameter is true, an extra link is created joining the last and first
 * vertices in the list.
 * @param vertices The poly-line vertices
 * @param closed true if the shape should be enclosed
 * @returns A list of {@link Link}s for the given vertices
 * @throws `TypeError` if vertices is null or an element of the vertex list is null
 * @throws `RangeError` if vertices.length < 2
 */
function createLinks(vertices: Vector2[], closed: boolean): Link[] {
  if (vertices == null)
    throw new TypeError('Geometry.createLinks: vertices is null.')
  const len = vertices.length;

  if (len < 2)
    throw new RangeError('Geometry.createLinks: vertices.length must be greater than or equal to 2.');

  const links = new Array<Link>();
  for (let i = 0; i < len - 1; i++) {
    const p1 = vertices[i];
    const p2 = vertices[i + 1];

    if (p1 == null)
      throw new TypeError('Geometry.createLinks: vertices[' + i + '] is null.');

    if (p2 == null)
      throw new TypeError('Geometry.createLinks: vertices[' + (i + 1) + '] is null.');

    const link = new Link(p1.copy(), p2.copy());
    if (i > 0) {
      const prev = links[i - 1];
      link.setPrevious(prev);
    }
    links.push(link);
  }

  if (closed) {
    const p1 = vertices[0].copy();
    const p2 = vertices[len - 1].copy();
    const link = new Link(p2, p1);
    const prev = links[links.length - 1];
    const next = links[0];
    link.setPrevious(prev);
    link.setNext(next);
    links.push(link);
  }

  return links;
}

/**
 * Returns the intersection {@link Polygon} for the given {@link Polygon}s or returns null if there's no intersection.
 * 
 * The basic premise of the algorithm is to track which polygon's edge is on the outside and when they intersect. This
 * allows the algorithm to be O(n+m) complexity (linear time) by iterating the edges of each polygon until all intersections
 * have been found. See the linked paper for more details.
 * 
 * NOTE: This algorithm returns null for all scenarios where the two {@link Polygon}s have touching edges or touching vertices.
 * The primary reason for this is to improve the robustness of the algorithm, but also to ensure the output is always
 * non-degenerate.
 * @param p1 The first {@link Polygon}
 * @param tx1 The first {@link Polygon}'s {@link Transform}
 * @param p2 The second {@link Polygon}
 * @param tx2 The second {@link Polygon}'s {@link Transform}
 * @returns The intersection {@link Polygon} or null if there's no intersection
 */
function getIntersection(p1: Polygon, tx1: Transform, p2: Polygon, tx2: Transform): Polygon {
  let firstIntersectionI = -1;
  let firstIntersectionP = -1;
  let firstIntersectionQ = -1;

  const result = new Array<Vector2>();

  const pn = p1.vertices.length;
  const qn = p2.vertices.length;

  let pi = 0;
  let qi = 0;

  let p = tx1.getTransformed(p1.vertices[0]);
  let q = tx2.getTransformed(p2.vertices[0]);

  let p0 = tx1.getTransformed(p1.vertices[p1.vertices.length - 1]);
  let q0 = tx2.getTransformed(p2.vertices[p2.vertices.length - 1]);

  let pv = p0.to(p);
  let qv = q0.to(q);

  let insideP = false;
  let insideQ = false;

  const n = 2 * (pn + qn);
  for (let i = 0; i < n; i++) {
    let intersection = Segment.getSegmentIntersection(p0, p, q0, q, false);
    if (intersection != null) {

      if (pi == firstIntersectionP &&
        qi == firstIntersectionQ &&
        (i - 1) != firstIntersectionI) {
        return new Polygon(...result);
      }

      if (firstIntersectionP == -1) {
        firstIntersectionI = i;
        firstIntersectionP = pi;
        firstIntersectionQ = qi;
      }

      result.push(intersection);

      insideP = Segment.getLocation(p, q0, q) >= 0;
      insideQ = !insideP;
    }

    if (qv.cross(pv) >= 0) {
      const ploc = Segment.getLocation(p, q0, q);
      if (ploc >= 0) {
        if (insideQ) {
          result.push(q);
        }

        qi = qi + 1 == qn ? 0 : qi + 1;
        q0.set(q);
        q = tx2.getTransformed(p2.vertices[qi]);
        qv.set(q).subtract(q0);
      } else {
        if (insideP) {
          result.push(p);
        }

        pi = pi + 1 == pn ? 0 : pi + 1;
        p0.set(p);
        p = tx1.getTransformed(p1.vertices[pi]);
        pv.set(p).subtract(p0);
      }
    } else {
      const ploc = Segment.getLocation(q, p0, p);
      if (ploc >= 0) {
        if (insideP) {
          result.push(p);
        }
        pi = pi + 1 == pn ? 0 : pi + 1;
        p0.set(p);
        p = tx1.getTransformed(p1.vertices[pi]);
        pv.set(p).subtract(p0);
      } else {
        if (insideQ) {
          result.push(q);
        }
        qi = qi + 1 == qn ? 0 : qi + 1;
        q0.set(q);
        q = tx2.getTransformed(p2.vertices[qi]);
        qv.set(q).subtract(q0);
      }
    }
  }

  tx1.getTransformed(p1.vertices[0], p);
  tx2.getTransformed(p2.vertices[0], q);

  if (p2.contains(p, tx2, false)) {
    return p1;
  } else if (p1.contains(q, tx1, false)) {
    return p2;
  } else {
    return null;
  }
}

export {
  getWinding,
  reverseWinding,
  getAverageCenter,
  getAreaWeightedCenter,
  getRotationRadius,
  getCounterClockwiseEdgeNormals,
  createCircle,
  createPolygon,
  createPolygonAtOrigin,
  createUnitCirclePolygon,
  createSquare,
  createRectangle,
  createTriangle,
  createTriangleAtOrigin,
  createRightTriangle,
  createEquilateralTriangle,
  createIsoscelesTriangle,
  createSegment,
  createSegmentAtOrigin,
  createHorizontalSegment,
  createVerticalSegment,
  createCapsule,
  createSlice,
  createSliceAtOrigin,
  createEllipse,
  createHalfEllipse,
  createHalfEllipseAtOrigin,
  createPolygonalCircle,
  createPolygonalSlice,
  createPolygonalSliceAtOrigin,
  createPolygonalEllipse,
  createPolygonalHalfEllipse,
  createPolygonalHalfEllipseAtOrigin,
  createPolygonalCapsule,
  cleanse,
  flipAlongTheXAxis,
  flipAlongTheYAxis,
  flip,
  basicMinkowskiSum,
  minkowskiSum,
  scale,
  createLinks,
  getIntersection,
};