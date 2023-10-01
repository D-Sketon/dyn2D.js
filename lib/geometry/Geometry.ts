import { Epsilon } from "../Epsilon";
import { Vector2 } from "./Vector2";

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

function getRotationRadius(center: Vector2, ...vertices: Vector2[]): number {
  if (vertices == null) return 0;
  if (center == null) {
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

function getCounterClockwiseEdgeNormals(...vertices: Vector2[]): Vector2[] | null {
  if(vertices == null) return null;
  const len = vertices.length;
  if(len == 0) return null;
  const normals = new Array<Vector2>(len);
  for(let i = 0; i < len; i++) {
    const v1 = vertices[i];
    const v2 = vertices[(i + 1) % len];
    const n = v1.to(v2).left();
    n.normalize();
    normals[i] = n;
  }
  return normals;
}

export {
  getWinding,
  reverseWinding,
  getAverageCenter,
  getAreaWeightedCenter,
  getRotationRadius,
  getCounterClockwiseEdgeNormals,
};