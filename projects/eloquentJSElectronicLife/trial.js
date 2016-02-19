function Vector(x, y) {
  this.x = x;
  this.y = y;
}
Vector.prototype.plus = function(v) {
  return new Vector(this.x + v.x, this.y + v.y);
};

var directions = {
  "n":  new Vector( 0, -1),
  "ne": new Vector( 1, -1),
  "e":  new Vector( 1,  0),
  "se": new Vector( 1,  1),
  "s":  new Vector( 0,  1),
  "sw": new Vector(-1,  1),
  "w":  new Vector(-1,  0),
  "nw": new Vector(-1, -1)
};
var directionNames = "n ne e se s sw w nw".split(" ");


// The grid ----
function Grid(width, height) {
  this.space = new Array(width * height);
  this.width = width;
  this.height = height;
}
Grid.prototype.isInside = function(vec) {
  return vec.x >= 0 && vec.x < this.width &&
         vec.y >= 0 && vec.y < this.height;
};
Grid.prototype.get = function(vec) {
  return this.space[vec.x + this.width * vec.y];
};
Grid.prototype.set = function(vec, value) {
  return this.space[vec.x + this.width * vec.y] = value;
};
Grid.prototype.forEach = function(f, context) {
  for (var y = 0; y < this.height; y++) {
    for (var x = 0; x < this.width; x++) {
      var value = this.space[x + y * this.width];
      if (value != null)
        f.call(context, value, new Vector(x, y));
    }
  }
};


// Bouncing critter ---
function randomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function BouncingCritter() {
  this.direction = randomElement(directionNames);
};
BouncingCritter.prototype.act = function(view) {
  if (view.look(this.direction) != " ")
    this.direction = view.find(" ") || "s";
  return {type: "move", direction: this.direction};
};


// Plants ------
function Plant() {
  this.energy = 3 + Math.random() * 4;
}
Plant.prototype.act = function(view) {
  if (this.energy > 15) {
    var space = view.find(" ");
    if (space)
      return {type: "reproduce", direction: space};
  }
  if (this.energy < 20)
    return {type: "grow"};
};


// Plant eaters------
function PlantEater() {
  this.energy = 20;
}
PlantEater.prototype.act = function(view) {
  var space = view.find(" ");
  if (this.energy > 60 && space)
    return {type: "reproduce", direction: space};
  var plant = view.find("*");
  if (plant)
    return {type: "eat", direction: plant};
  if (space)
    return {type: "move", direction: space};
};


// Smart plant eaters ----
function SmartPlantEater() {
  this.energy = 20;
  this.numKids = 0;
  this.lastEat = 0;
  this.direction = randomElement(directionNames);
}
SmartPlantEater.prototype.act = function(view) {
  var space; // = view.find(" ");
  if (view.look(this.direction) == " ")
    space = this.direction;
  else {
    space = view.find(" ");
    this.direction = space || "s";
  }
  if (this.energy > 60 && space && this.numKids <= 5) {
    this.numKids++;
    this.lastEat++;
    return {type: "reproduce", direction: space};
  }
  var plant = view.find("*");
  if (plant && this.lastEat > 1) {
    this.direction = plant;
    this.lastEat = 0;
    return {type: "eat", direction: plant};
  }
  if (space) {
    this.lastEat++;
    return {type: "move", direction: space};
  }
};


// Predators! -------
function Tiger() {
  this.energy = 350;
  this.direction = randomElement(directionNames);
  this.lastEdible = 0;
}

Tiger.prototype.act = function(view) {
  if (this.lastEdible > 0)
    this.lastEdible--;
  var space;
  if (view.look(this.direction) == " ")
    space = this.direction;
  else {
    space = view.find(" ");
    this.direction = space || "s";
  }
  if (this.energy > 750 && space ) {
    this.numKids++;
    return {type: "reproduce", direction: space};
  }
  var herbivore = view.find("O");
  if (herbivore) {
    this.lastEdible += 2;
    if (this.lastEdible > 5) {
      this.lastEdible = 0;
      return {type: "eat", direction: herbivore};
    }
  }
  if (space) {
    return {type: "move", direction: space};
  }
};

// Wall "creature" ----
function Wall() {}


function elementFromChar(legend, ch) {
  if (ch == " ")
    return null;
  var element = new legend[ch]();
  element.originChar = ch;
  return element;
}
function charFromElement(element) {
  if (element == null)
    return " ";
  else
    return element.originChar;
}

function World(map, legend) {
  var grid = new Grid(map[0].length, map.length);
  this.grid = grid;
  this.legend = legend;

  map.forEach(function(line, y) {
    for (var x = 0; x < line.length; x++)
      grid.set(new Vector(x, y), elementFromChar(legend, line[x]));
  });
}

World.prototype.draw = function(gameBoard) {
  for (var y = 0; y < this.grid.height; y++) {
    for (var x = 0; x < this.grid.width; x++) {
      var element = this.grid.get (new Vector(x, y));
      if (element) 
        gameBoard.find("#" + y + "-" + x).attr("occupied", attrFromChar(this.legend, charFromElement(element)));
      else
        gameBoard.find("#" + y + "-" + x).attr("occupied", "none");
    }
  }
};
function attrFromChar(legend, char) {
  return legend[char].toString().split("(")[0].split(" ")[1];
}

World.prototype.toString = function() {
  var output = "";
  for (var y = 0; y < this.grid.height; y++) {
    for (var x = 0; x < this.grid.width; x++) {
      var element = this.grid.get (new Vector(x, y));
      output += charFromElement(element);
    }
    output += "\n";
  }
  return output;
};

World.prototype.turn = function() {
  var acted = [];
  this.grid.forEach(function(critter, vector) {
    if (critter.act && acted.indexOf(critter) == -1) {
      acted.push(critter);
      this.letAct(critter, vector);
    }
  }, this);
};

World.prototype.letAct = function(critter, vector) {
  var action = critter.act(new View(this, vector));
  if (action && action.type == "move") {
    var dest = this.checkDestination(action, vector);
    if (dest && this.grid.get(dest) == null) {
      this.grid.set(vector, null);
      this.grid.set(dest, critter);
    }
  }
};

World.prototype.checkDestination = function(action, vector) {
  if (directions.hasOwnProperty(action.direction)) {
    var dest = vector.plus(directions[action.direction]);
    if (this.grid.isInside(dest))
      return dest;
  }
};


function View(world, vector) {
  this.world = world;
  this.vector = vector;
}
View.prototype.look = function(dir) {
  var target = this.vector.plus(directions[dir]);
  if (this.world.grid.isInside(target))
    return charFromElement(this.world.grid.get(target));
  else
    return "#";
};
View.prototype.findAll = function(ch) {
  var found = [];
  for (var dir in directions)
    if (this.look(dir) == ch)
      found.push(dir);
  return found;
};
View.prototype.find = function(ch) {
  var found = this.findAll(ch);
  if (found.length == 0) return null;
  return randomElement(found);
};

function dirPlus(dir, n) {
  var index = directionNames.indexOf(dir);
  return directionNames[(index + n + 8) % 8];
}

function WallFollower() {
  this.dir = "s";
}
WallFollower.prototype.act = function(view) {
  var start = this.dir;
  if (view.look(dirPlus(this.dir, -3)) != " ")
    start = this.dir = dirPlus(this.dir, -2);
  while (view.look(this.dir) != " ") {
    this.dir = dirPlus(this.dir, 1);
    if (this.dir == start) break;
  }
  return {type: "move", direction: this.dir};
};



function LifelikeWorld(map, legend) {
  World.call(this, map, legend);
}
LifelikeWorld.prototype = Object.create(World.prototype);

var actionTypes = Object.create(null);

LifelikeWorld.prototype.letAct = function(critter, vector) {
  var action = critter.act(new View(this, vector));
  var handled = action &&
    action.type in actionTypes &&
    actionTypes[action.type].call(this, critter,
        vector, action);
  if (!handled) {
    critter.energy -= 0.2;
    if (critter.energy <= 0)
      this.grid.set(vector, null);
  }
};


actionTypes.grow = function(critter) {
  critter.energy += 0.5;
  return true;
};

actionTypes.move = function(critter, vector, action) {
  var dest = this.checkDestination(action, vector);
  if (dest == null ||
      critter.energy <= 1 ||
      this.grid.get(dest) != null)
    return false;
  critter.energy -= 1;
  this.grid.set(vector, null);
  this.grid.set(dest, critter);
  return true;
};

actionTypes.eat = function(critter, vector, action) {
  var dest = this.checkDestination(action, vector);
  var atDest = dest != null && this.grid.get(dest);
  if (!atDest || atDest.energy == null)
    return false;
  critter.energy += atDest.energy;
  this.grid.set(dest, null);
  return true;
};

actionTypes.reproduce = function(critter, vector, action) {
  var baby = elementFromChar(this.legend, critter.originChar);
  var dest = this.checkDestination(action, vector);
  if (dest == null ||
      critter.energy <= 2 * baby.energy ||
      this.grid.get(dest) != null)
    return false;
  critter.energy -= 2 * baby.energy;
  this.grid.set(dest, baby);
  return true;
};


var world = new World([
  "############################",
  "#      #    #      o      ##",
  "#                          #",
  "#    ~     #####           #",
  "##         #   #    ##     #",
  "###           ##     #     #",
  "#           ###      #     #",
  "#   ####                   #",
  "#   ##       o             #",
  "# o  #         o       ### #",
  "#    #                     #",
  "############################"], {
  "#": Wall,
  "o": BouncingCritter,
  "~": WallFollower
});


var lifeLikeLegend = { 
  "#": Wall, 
  "O": SmartPlantEater, 
  "*": Plant
};

function makeBoard(world) {
  var board = $("<div class='gameBoard'>"),
      width = world.grid.width,
      height = world.grid.height;
  function makeCell(i, j) {
    return $("<div class='col-xs-1' id='" + i + "-" + j + "'>");
  }
  function makeRow(i) {
    var row = $("<div class='row' id='" + i + "'>");
    for (var j = 0; j < width; j++) {
      row.append(makeCell(i, j));
    }
    return row;
  }
  for (var i = 0; i < height; i++) {
    board.append(makeRow(i));
  }
  return board;
}

var valley = new LifelikeWorld(
    [
    "############################",
    "#####                 ######",
    "##   ***                **##",
    "#   *##**         **  O  *##",
    "#    ***     O    ##**    *#",
    "#       O         ##***    #",
    "#                 ##**     #",
    "#   O       #*             #",
    "#*          #**       O    #",
    "#***        ##**    O    **#",
    "##****     ###***       *###",
    "############################"],
    lifeLikeLegend
    );

var huntingGrounds = new LifelikeWorld(
      ["####################################################",
      "#                 ####         ****              ###",
      "#   *  @  ##                 ########       OO    ##",
      "#   *    ##        O O                 ****       *#",
      "#       ##*                        ##########     *#",
      "#      ##***  *         ****                     **#",
      "#* **  #  *  ***      #########                  **#",
      "#* **  #      *               #   *              **#",
      "#     ##              #   O   #  ***          ######",
      "#*            @       #       #   *        O  #    #",
      "#*                    #  ######                 ** #",
      "###          ****          ***                  ** #",
      "#       O                        @         O       #",
      "#   *     ##  ##  ##  ##               ###      *  #",
      "#   **         #              *       #####  O     #",
      "##  **  O   O  #  #    ***  ***        ###      ** #",
      "###               #   *****                    ****#",
      "####################################################"],
      {"#": Wall,
        "@": Tiger,
        "O": SmartPlantEater, // from previous exercise
        "*": Plant}
        );

function animateWorld(wrld, gameBoard, going) {
  setTimeout(function() {
    if (going) {
      wrld.turn();
      wrld.draw(gameBoard);
      console.log(wrld.toString());
      animateWorld(wrld, gameBoard, going);
    }
  }, 500);
}


function bootUp(world, container) {
  var gameBoard = makeBoard(world);
  var keepGoing = false;
  container.html(gameBoard);
  world.draw(gameBoard);
  $(document).ready(function() {
    animateWorld(world, gameBoard, keepGoing);
    $(document).click(function() {
      keepGoing = ! keepGoing;
      animateWorld(world, gameBoard, keepGoing);
    });
  });
}

bootUp(huntingGrounds, $(".container-fluid"));
