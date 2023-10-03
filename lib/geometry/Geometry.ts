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

export const TWO_PI = Math.PI * 2;
export const INV_3 = 1 / 3;
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
      throw new Error("Geometry.getCounterClockwiseEdgeNormals: vertices[" + i + "]");
    };
    const v2 = vertices[(i + 1) % len];
    if (v2 == null) {
      throw new Error("Geometry.getCounterClockwiseEdgeNormals: vertices[" + ((i + 1) % len) + "]");
    };
    const n = v1.to(v2).left();
    n.normalize();
    normals[i] = n;
  }
  return normals;
}

function createCircle(radius: number): Circle {
  return new Circle(radius);
}

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

function createPolygonAtOrigin(...vertices: Vector2[]): Polygon {
  const polygon = createPolygon(...vertices);
  const center = polygon.getCenter();
  polygon.translate(-center.x, -center.y);
  return polygon;
}

function createUnitCirclePolygon(count: number, radius: number, theta?: number): Polygon {
  if (theta === void 0) theta = 0.0;
  return createPolygonalCircle(count, radius, theta);
}

function createSquare(size: number): Rectangle {
  if (size <= 0) {
    throw new Error('Geometry.createSquare: size must be positive.');
  }
  return new Rectangle(size, size);
}

function createRectangle(width: number, height: number): Rectangle {
  return new Rectangle(width, height);
}

function createTriangle(p1: Vector2, p2: Vector2, p3: Vector2): Triangle {
  if (p1 == null) {
    throw new Error('Geometry.createTriangle: p1 is null.');
  }
  if (p2 == null) {
    throw new Error('Geometry.createTriangle: p2 is null.');
  }
  if (p3 == null) {
    throw new Error('Geometry.createTriangle: p3 is null.');
  }
  return new Triangle(p1.copy(), p2.copy(), p3.copy());
}

function createTriangleAtOrigin(p1: Vector2, p2: Vector2, p3: Vector2): Triangle {
  const triangle = createTriangle(p1, p2, p3);
  const center = triangle.getCenter();
  triangle.translate(-center.x, -center.y);
  return triangle;
}

function createRightTriangle(width: number, height: number, mirror?: boolean): Triangle {
  if (mirror === void 0) mirror = false;
  if (width <= 0) {
    throw new Error('Geometry.createRightTriangle: width must be positive.');
  }
  if (height <= 0) {
    throw new Error('Geometry.createRightTriangle: height must be positive.');
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

function createEquilateralTriangle(height: number): Triangle {
  if (height <= 0) {
    throw new Error('Geometry.createEquilateralTriangle: height must be positive.');
  }
  const a = 2.0 * height * INV_SQRT_3;
  return createIsoscelesTriangle(a, height);
}

function createIsoscelesTriangle(width: number, height: number): Triangle {
  if (width <= 0) {
    throw new Error('Geometry.createIsoscelesTriangle: width must be positive.');
  }
  if (height <= 0) {
    throw new Error('Geometry.createIsoscelesTriangle: height must be positive.');
  }
  const top = new Vector2(0.0, height);
  const left = new Vector2(-width * 0.5, 0.0);
  const right = new Vector2(width * 0.5, 0.0);
  const triangle = new Triangle(top, left, right);
  const center = triangle.getCenter();
  triangle.translate(-center.x, -center.y);
  return triangle;
}

function createSegment(end: Vector2): Segment;
function createSegment(p1: Vector2, p2: Vector2): Segment;
function createSegment(p1: Vector2, p2?: Vector2): Segment {
  if (p2 === void 0) return createSegment(new Vector2(), p1);
  if (p1 == null) {
    throw new Error('Geometry.createSegment: p1 is null.');
  }
  if (p2 == null) {
    throw new Error('Geometry.createSegment: p2 is null.');
  }
  return new Segment(p1.copy(), p2.copy());
}

function createSegmentAtOrigin(p1: Vector2, p2: Vector2): Segment {
  const segment = createSegment(p1, p2);
  const center = segment.getCenter();
  segment.translate(-center.x, -center.y);
  return segment;
}

function createHorizontalSegment(length: number): Segment {
  if (length <= 0) {
    throw new Error('Geometry.createHorizontalSegment: length must be positive.');
  }
  const start = new Vector2(-length * 0.5, 0.0);
  const end = new Vector2(length * 0.5, 0.0);
  return new Segment(start, end);
}

function createVerticalSegment(length: number): Segment {
  if (length <= 0) {
    throw new Error('Geometry.createHorizontalSegment: length must be positive.');
  }
  const start = new Vector2(0.0, -length * 0.5);
  const end = new Vector2(0.0, length * 0.5);
  return new Segment(start, end);
}

function createCapsule(width: number, height: number): Capsule {
  return new Capsule(width, height);
}

function createSlice(radius: number, theta: number): Slice {
  return new Slice(radius, theta);
}

function createSliceAtOrigin(radius: number, theta: number): Slice {
  const slice = new Slice(radius, theta);
  slice.translate(-slice.center.x, -slice.center.y);
  return slice;
}

function createEllipse(width: number, height: number): Ellipse {
  return new Ellipse(width, height);
}

function createHalfEllipse(width: number, height: number): HalfEllipse {
  return new HalfEllipse(width, height);
}

function createHalfEllipseAtOrigin(width: number, height: number): HalfEllipse {
  const half = new HalfEllipse(width, height);
  const c = half.getCenter();
  half.translate(-c.x, -c.y);
  return half;
}

function createPolygonalCircle(count: number, radius: number, theta?: number): Polygon {
  if (theta === void 0) theta = 0.0;
  if (count < 3) {
    throw new Error('Geometry.createPolygonalCircle: count must be greater than or equal to 3.');
  }
  if (radius <= 0) {
    throw new Error('Geometry.createPolygonalCircle: radius must be positive.');
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

function createPolygonalSlice(count: number, radius: number, theta: number): Polygon {
  if (count < 1) {
    throw new Error('Geometry.createPolygonalSlice: count must be greater than or equal to 1.');
  }
  if (radius <= 0) {
    throw new Error('Geometry.createPolygonalSlice: radius must be positive.');
  }
  if (theta <= 0) {
    throw new Error('Geometry.createPolygonalSlice: theta must be positive.');
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

function createPolygonalSliceAtOrigin(count: number, radius: number, theta: number): Polygon {
  const polygon = createPolygonalSlice(count, radius, theta);
  const center = polygon.getCenter();
  polygon.translate(-center.x, -center.y);
  return polygon;
}

function createPolygonalEllipse(count: number, width: number, height: number): Polygon {
  if (count < 4) {
    throw new Error('Geometry.createPolygonalEllipse: count must be greater than or equal to 4.');
  }
  if (width <= 0) {
    throw new Error('Geometry.createPolygonalEllipse: width must be positive.');
  }
  if (height <= 0) {
    throw new Error('Geometry.createPolygonalEllipse: height must be positive.');
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

function createPolygonalHalfEllipse(count: number, width: number, height: number): Polygon {
  if (count < 4) {
    throw new Error('Geometry.createPolygonalHalfEllipse: count must be greater than or equal to 4.');
  }
  if (width <= 0) {
    throw new Error('Geometry.createPolygonalHalfEllipse: width must be positive.');
  }
  if (height <= 0) {
    throw new Error('Geometry.createPolygonalHalfEllipse: height must be positive.');
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

function createPolygonalHalfEllipseAtOrigin(count: number, width: number, height: number): Polygon {
  const polygon = createPolygonalHalfEllipse(count, width, height);
  const center = polygon.getCenter();
  polygon.translate(-center.x, -center.y);
  return polygon;
}

function createPolygonalCapsule(count: number, width: number, height: number): Polygon {
  if (count < 1) {
    throw new Error('Geometry.createPolygonalCapsule: count must be greater than or equal to 1.');
  }
  if (width <= 0) {
    throw new Error('Geometry.createPolygonalCapsule: width must be positive.');
  }
  if (height <= 0) {
    throw new Error('Geometry.createPolygonalCapsule: height must be positive.');
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
      throw new Error("Geometry.cleanse: points[" + i + "] is null.");
    if (prev == null)
      throw new Error("Geometry.cleanse: points[" + n + "] is null.");
    if (next == null)
      throw new Error("Geometry.cleanse: points[" + m + "] is null.");
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

function flipAlongTheXAxis(polygon: Polygon, point?: Vector2): Polygon {
  return flip(polygon, Vector2.X_AXIS, point ?? null);
}

function flipAlongTheYAxis(polygon: Polygon, point?: Vector2): Polygon {
  return flip(polygon, Vector2.Y_AXIS, point ?? null);
}

function flip(polygon: Polygon, axis: Vector2, point?: Vector2): Polygon {
  if (polygon == null) {
    throw new Error("Geometry.flip: polygon is null.");
  }
  if (axis == null) {
    throw new Error("Geometry.flip: axis is null.");
  }
  if (axis.isZero()) {
    throw new Error("Geometry.flip: axis is zero.");
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

function basicMinkowskiSum<E extends Wound & Convex>(convex1: E, convex2: E): Polygon {
  if (convex1 == null) {
    throw new Error("Geometry.basicMinkowskiSum: convex1 is null.");
  }
  if (convex2 == null) {
    throw new Error("Geometry.basicMinkowskiSum: convex2 is null.");
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

function minkowskiSum(circle: Circle, polygon: Polygon, count: number): Polygon;
function minkowskiSum(polygon: Polygon, circle: Circle, count: number): Polygon;
function minkowskiSum(polygon: Polygon, radius: number, count: number): Polygon;
function minkowskiSum(shape1: Circle | Polygon, shape2: Circle | Polygon | number, count: number): Polygon {
  if (shape1 instanceof Circle) {
    return minkowskiSum(shape2 as Polygon, shape1 as Circle, count);
  }
  if (shape2 instanceof Circle) {
    if (shape2 == null) {
      throw new Error("Geometry.minkowskiSum: circle is null.");
    }
    return minkowskiSum(shape1, shape2.radius, count);
  }
  const polygon = shape1 as Polygon;
  const radius = shape2 as number;
  if (polygon == null) {
    throw new Error("Geometry.minkowskiSum: polygon is null.");
  }
  if (radius <= 0) {
    throw new Error("Geometry.minkowskiSum: radius must be positive.");
  }
  if (count <= 0) {
    throw new Error("Geometry.minkowskiSum: count must be positive.");
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

function scale<E extends AbstractShape>(shape: E, scale: number): E {
  if (shape == null) {
    throw new Error("Geometry.scale: shape is null.");
  }
  if (scale <= 0) {
    throw new Error("Geometry.scale: scale must be positive.");
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

function createLinks(vertices: Vector2[], closed: boolean): Link[] {
  if (vertices == null)
    throw new Error('Geometry.createLinks: vertices is null.')
  const len = vertices.length;

  if (len < 2)
    throw new Error('Geometry.createLinks: vertices.length must be greater than or equal to 2.');

  const links = new Array<Link>();
  for (let i = 0; i < len - 1; i++) {
    const p1 = vertices[i];
    const p2 = vertices[i + 1];

    if (p1 == null)
      throw new Error('Geometry.createLinks: vertices[' + i + '] is null.');

    if (p2 == null)
      throw new Error('Geometry.createLinks: vertices[' + (i + 1) + '] is null.');

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