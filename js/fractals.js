var id = 'bg-canvas',
    fviColor  = "#028DEA",
    white = "#FFFFFF";

// Helpful geometric functions
//
function segmentLength(line) {
  var a = line[0],
      b = line[1],
      ax = a[0],
      ay = a[1],
      bx = b[0],
      by = b[1],
      dx = Math.abs(ax - bx),
      dy = Math.abs(ay - by);
  return Math.sqrt(dx * dx + dy * dy);
}

function midpoint(line) {
  var a = line[0],
      b = line[1],
      ax = a[0],
      ay = a[1],
      bx = b[0],
      by = b[1],
      cx = (ax + bx)/2,
      cy = (ay + by)/2;
  return [cx, cy];
}

function thirdPoint(line) {
  //This function take a line [a, b], and returns the point exactly one third the way from a to b. To clarify, this point should be twice as close to a as it is to b.
  var a = line[0],
      b = line[1],
      ax = a[0],
      ay = a[1],
      bx = b[0],
      by = b[1],
      cx = (2 * ax + bx)/3,
      cy = (2 * ay + by)/3;
  return [cx, cy];
}

function addVectors(vec1, vec2) {
  var v1x = vec1[0],
      v1y = vec1[1],
      v2x = vec2[0],
      v2y = vec2[1],
      vx  = v1x + v2x,
      vy  = v1y + v2y,
      v   = [vx, vy];
  return v;
}

function getVector(p, q) {
  /* this function gets a vector from a line
   * segment (from p to q). The difference 
   * being that the vector starts at the 
   * origin. This means that you can use it 
   * to add vectors as you'd intuitively 
   * think about it.
   */
  var px = p[0],
      py = p[1],
      qx = q[0],
      qy = q[1];
  return [qx-px, qy-py];
}

function mulScalerVector(a, v) {
  /* this function is to multiply a scalar
   * by a vector.
   */
  var vx = v[0],
      vy = v[1];
  return [a * vx, a * vy];
}

// Helpful general shape drawing functions
//
function drawShape$(ctx, points) {
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for(var i=1; i<points.length; i++) {
    ctx.lineTo(points[i][0], points[i][1]);
  }
  ctx.closePath();
}

function fillShape$(ctx, points, color) {
  ctx.fillStyle = color;
  drawShape$(ctx, points);
  ctx.fill();
}

function strokeShape$(ctx, points, color) {
  ctx.strokeStyle = color;
  drawShape$(ctx, points);
  ctx.stroke();
}

// Fractal drawing functions
//
function fractalIter$(ctx, points, color, drawFunc, drawPointPicker, iterPointPicker, max) {
  function iter(pts, count) {
    if(count <= max) {
      var drawPts = drawPointPicker(pts),
          iterPts = iterPointPicker(pts);
      drawFunc(drawPts, color);
      for(var i=0; i<iterPts.length; i++) {
        iter(iterPts[i], count + 1);
      }
    } else {
      return;
    }
  }
  iter(points, 0);
}

function fractalAnimator$(ctx, points, color, bgColor, fractalArtist$, next, start, time) {
  time = time || 300;
  function iter(term) {
    var nextTerm = next(term);
    if(isFinite(nextTerm)) {
      setTimeout(function() {
        fractalArtist$(ctx, points, color, bgColor, nextTerm);
        iter(nextTerm);
      }, time);
    } else {return;}
  }
  iter(start)
}

function strokeFractal$(drawPointPicker, iterPointPicker) {
  return function(ctx, points, color, bgColor, numIters) {
    function drawFunc (pts, clr) {
      strokeShape$(ctx, pts, clr);
    }
    fillShape$(ctx, points, bgColor);
    fractalIter$(ctx, points, color, drawFunc, drawPointPicker, iterPointPicker, numIters);
  }
}

function fillFractal$(drawPointPicker, iterPointPicker) {
  return function(ctx, points, color, bgColor, numIters) {
    function drawFunc (pts, clr) {
      fillShape$(ctx, pts, clr);
    }
    fillShape$(ctx, points, bgColor);
    fractalIter$(ctx, points, color, drawFunc, drawPointPicker, iterPointPicker, numIters);
  }
}

function oscillator(min, max, up) {
  up = up || true;
  return function(current) {
    if (current >= max) {
      up = false;
      return current - 1;
    } else if (current <= min) {
      up = true;
      return current + 1;
    } else if (up) {
      return current + 1;
    } else {
      return current -1;
    }
  }
}

// Fractal specific functions
function sierpinskiDrawPointPicker(points) {
  var a = points[0],
      b = points[1],
      c = points[2],
      d = midpoint([a, b]),
      e = midpoint([b, c]),
      f = midpoint([c, a]);
  return [d, e, f];
}

function cantorDrawPointPicker(points) {
  /*   a  b  c  d
   *
   *   e  f  g  h
   *
   *   i  j  k  l
   *
   *   m  n  o  p
   */
  var a = points[0],
      d = points[1],
      p = points[2],
      m = points[3],
      b = thirdPoint([a, d]),
      c = thirdPoint([d, a]),
      e = thirdPoint([a, m]),
      i = thirdPoint([m, a]),
      n = thirdPoint([m, p]),
      o = thirdPoint([p, m]),
      l = thirdPoint([p, d]),
      h = thirdPoint([d, p]),
      f = thirdPoint([e, h]),
      g = thirdPoint([h, e]),
      j = thirdPoint([i, l]),
      k = thirdPoint([l, i]);
  return [b, c, g, h, l, k, o, n, j, i, e, f];
}

//function kochChevronDrawPointPicker(points) {
//  function chevronMaker(pts){
//    // given a chevron (for this explanation we
//    // will consider it to be facing upward), 
//    // it returns the 3 new points on the left of the
//    // chevron that coincides with the Koch curve.
//    // So if you want the right side, just put the
//    // points in backward.
//    var lftPt = pts[0],
//        topPt = pts[1],
//        ritPt = pts[2],

function sierpinskiIterPointPicker(points) {
  var a = points[0],
      b = points[1],
      c = points[2],
      d = midpoint([a, b]),
      e = midpoint([b, c]),
      f = midpoint([c, a]);
  return [[a, d, f], [d, b, e], [f, e, c]];
}

function cantorIterPointPicker(points) {
  /*   a  b  c  d
   *
   *   e  f  g  h
   *
   *   i  j  k  l
   *
   *   m  n  o  p
   */
  var a = points[0],
      d = points[1],
      p = points[2],
      m = points[3],
      b = thirdPoint([a, d]),
      c = thirdPoint([d, a]),
      e = thirdPoint([a, m]),
      i = thirdPoint([m, a]),
      n = thirdPoint([m, p]),
      o = thirdPoint([p, m]),
      l = thirdPoint([p, d]),
      h = thirdPoint([d, p]),
      f = thirdPoint([e, h]),
      g = thirdPoint([h, e]),
      j = thirdPoint([i, l]),
      k = thirdPoint([l, i]);
  return [[a, b, f, e], [c, d, h, g], [k, l, p, o], [i, j, n, m]];
}

var strokeSierpinski$ = strokeFractal$(sierpinskiDrawPointPicker, sierpinskiIterPointPicker);
var fillSierpinski$ = fillFractal$(sierpinskiDrawPointPicker, sierpinskiIterPointPicker);
var strokeCantor$ = strokeFractal$(cantorDrawPointPicker, cantorIterPointPicker);
var fillCantor$ = fillFractal$(cantorDrawPointPicker, cantorIterPointPicker);

function sierpinskiFillOscillator$(ctx, points, color, bgColor, min, max){
  fractalAnimator$(ctx, points, color, bgColor, fillSierpinski$, oscillator(min, max), 0);
}

function sierpinskiStrokeOscillator$(ctx, points, color, bgColor, min, max){
  fractalAnimator$(ctx, points, color, bgColor, strokeSierpinski$, oscillator(min, max), 0);
}

function cantorStrokeOscillator$(ctx, points, color, bgColor, min, max) {
  fractalAnimator$(ctx, points, color, bgColor, strokeCantor$, oscillator(min, max), 0);
}

function cantorFillOscillator$(ctx, points, color, bgColor, min, max) {
  fractalAnimator$(ctx, points, color, bgColor, strokeCantor$, oscillator(min, max), 0);
}

function init() {
  var c   = document.getElementById(id),
      ctx = c.getContext('2d'),
      w   = c.width = window.innerWidth,
      h   = c.height = window.innerHeight,
      leftBase  = [0,h],
      topLeft   = [0, 0],
      topRight  = [w, 0],
      botRight  = [w, h],
      botLeft   = [0, h],
      midBase   = [w/2, 0],
      rightBase = [w, h],
      rectBase = [topLeft, topRight, botRight, botLeft],
      triangleBase = [leftBase, midBase, rightBase],
      animations = [
        [sierpinskiFillOscillator$, triangleBase],
        [sierpinskiStrokeOscillator$, triangleBase],
        [cantorFillOscillator$, rectBase],
        [cantorStrokeOscillator$, rectBase]].sort(function() {return 0.5 - Math.random();}),
      colors = [white, fviColor].sort(function() {return 0.5 - Math.random();});
  anim = animations[0];
  anim[0](ctx, anim[1], colors[0], colors[1], 0, 4);
}
