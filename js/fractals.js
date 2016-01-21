var id = 'bg-canvas',
    fviColor  = "#028DEA",
    white = "#FFFFFF";





//function inc(count) {return count + 1;}
//function dec(count) {return count - 1;}

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

function sierpinskiIterPointPicker(points) {
  var a = points[0],
      b = points[1],
      c = points[2],
      d = midpoint([a, b]),
      e = midpoint([b, c]),
      f = midpoint([c, a]);
  return [[a, d, f], [d, b, e], [f, e, c]];
}

function sierpinskiDrawPointPicker(points) {
  var a = points[0],
      b = points[1],
      c = points[2],
      d = midpoint([a, b]),
      e = midpoint([b, c]),
      f = midpoint([c, a]);
  return [d, e, f];
}

function strokeSierpinski$(ctx, points, color, bgColor, numIters) {
  function drawFunc (pts, clr) {
    strokeShape$(ctx, pts, clr);
  }
  fillShape$(ctx, points, bgColor);
  fractalIter$(ctx, points, color, drawFunc, sierpinskiDrawPointPicker, sierpinskiIterPointPicker, numIters);
}

function fillSierpinski$(ctx, points, color, bgColor, numIters) {
  function drawFunc (pts, clr) {
    fillShape$(ctx, pts, clr);
  }
  fillShape$(ctx, points, bgColor);
  fractalIter$(ctx, points, color, drawFunc, sierpinskiDrawPointPicker, sierpinskiIterPointPicker, numIters);
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

function sierpinskiFillOscillator$(ctx, points, color, bgColor, min, max){
  fractalAnimator$(ctx, points, color, bgColor, fillSierpinski$, oscillator(min, max), 0);
}

function sierpinskiStrokeOscillator$(ctx, points, color, bgColor, min, max){
  fractalAnimator$(ctx, points, color, bgColor, strokeSierpinski$, oscillator(min, max), 0);
}


function init() {
  var c   = document.getElementById(id),
      ctx = c.getContext('2d'),
      w   = c.width = window.innerWidth,
      h   = c.height = window.innerHeight,
      leftBase  = [0,h],
      midBase   = [w/2, 0],
      rightBase = [w, h],
      triangleBase = [leftBase, midBase, rightBase],
      randNum   = Math.random();
  if (randNum >= 0.75) {
    sierpinskiFillOscillator$(ctx, triangleBase, fviColor, white, 0, 4);
  } else if (randNum >= 0.5) {
    sierpinskiFillOscillator$(ctx, triangleBase, white, fviColor, 0, 4);
  } else if (randNum >= 0.25) {
    sierpinskiStrokeOscillator$(ctx, triangleBase, fviColor, white, 0, 4);
  } else {
    sierpinskiStrokeOscillator$(ctx, triangleBase, white, fviColor, 0, 6);
  }
}
