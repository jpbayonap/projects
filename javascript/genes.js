
var GOAL_RAD = 30;
var vector = function(x,y){
	this.x =x ;
	this.y = y;
	this.add = function(p){
		this.x = this.x+ p.x;
		this.y = this.y +p.y;
	};
	this.set = function(p){
		this.x = p.x;
		this.y = p.y;
	};
	this.rotate = function(theta){
		var px = this.x;
		var py = this.y;
		this.x = Math.cos(theta)*px + Math.sin(theta)*py;
		this.y = -Math.sin(theta)*px + Math.cos(theta)*py;

	}

	this.dist = function(p){
		return Math.sqrt((this.x- p.x)**2 +(this.y -p.y)**2);
	}
}

var goal = function(p){
	this.p =p ;
	this.draw = function(ctx){
		ctx.beginPath();
		ctx.arc(this.p.x,this.p.y, GOAL_RAD, 0, Math.PI);
		ctx.fillStyle = "#FF0000";
		ctx.fill()
	};




};



var V_SHIP  = 20;
var S_SIZE = 50 ;
var  genes = 23; 

var ship = function(p){
	this.p = p;
	this.v = new vector(0,-V_SHIP);
	this.alpha = 0;
	this.genes = [];
	this.index = 0;
	this.fitness = 0;
	for(var i =0 ; i<genes;i++){
		this.genes.push(Math.PI*Math.random()- Math.PI/2);
	}
	this.update = function(){
		if(this.index < genes){
		var d_theta = this.genes[this.index];
		this.alpha = this.alpha+ d_theta;
		this.v.rotate(d_theta);
		this.p.add(this.v);
		this.index += 1;
		};

	};
	this.draw = function(ctx){
		ctx.save();
		ctx.translate(this.p.x,this.p.y);
		ctx.rotate(this.alpha);
		ctx.beginPath();
		ctx.moveTo(-S_SIZE,S_SIZE);
		ctx.lineTo(S_SIZE,S_SIZE);
		ctx.lineTo(0,-S_SIZE);
		ctx.lineTo(-S_SIZE,S_SIZE);
		ctx.stroke();
		ctx.fillStyle = "#CCAA00";
		ctx.fill();
		ctx.restore();
	};

	this.goal_bool = function(goal){
		
			return this.p.dist(goal.p)< GOAL_RAD;
	};


	this.gene_fitness = function(goal){
		var dist = this.p.dist(goal.p)/(800*Math.sqrt(2));
		this.fitness = -dist +1;
		if(this.goal_bool(goal)){
			this.fitness*= 2;
		}
	};

	this.sons = function(s){
		var genes_ship =[];
		var sum_fitness = this.fitness + s.fitness;
		var barco = new ship(new vector(400,400));
		for(var i = 0; i<genes;i++){
			var d = sum_fitness*Math.random();
			if (d <this.fitness ){
				genes_ship.push(this.genes[i]);
			}
			else{
				genes_ship.push(s.genes[i]);
			};

		}
		barco.genes = genes_ship; 
		return barco ; 
	}
}

var FRAMES = 0;
var SHIPS = 100;
var generate = function(){
	this.goal =  new goal(new vector(400,0));
	this.ships = [];
	for (var i =0 ;i < SHIPS;i++){
		this.ships.push(new ship(new vector(400,400)));
	}
	this.update_ships= function(){
		if(FRAMES < genes){
		for ( var i in this.ships){
			this.ships[i].update();
		}
		FRAMES += 1;
	}else{

		this.next_generation();
		FRAMES = 0; 
	};

	};
	this.draw_ships = function(ctx){
		for( var i in this.ships){
			this.ships[i].draw(ctx);
		}
		this.goal.draw(ctx);
	};

	this.all_fitness = function(){
		for(var i =0 ; i< SHIPS ; i ++){
			this.ships[i].gene_fitness(this.goal);
		}
	};

	this.choose_father = function(){
		var father_fitness = 0;

		for (var i =0 ; i < SHIPS; i++)
			father_fitness += this.ships[i].fitness ;

		var d = father_fitness*Math.random();
		var  neighboor = 0;
		for(var i = 0; i < SHIPS;i++){
			if (neighboor <= d && d <= neighboor+ this.ships[i].fitness  ){
				return i;
			}
			neighboor += this.ships[i].fitness;
		}

	};

	this.next_generation = function(){
		var next_ships = [];
		this.all_fitness();
		for (var i =0 ; i< SHIPS;i++){
			var father = this.choose_father();
			var mother = this.choose_father();
			var son = this.ships[father].sons(this.ships[mother]);
			next_ships.push(son);
		};
		this.ships= next_ships ;

	}
}



var clear_screen = function(ctx){
	ctx.beginPath();
	ctx.fillStyle = "#FFFFFF";
	ctx.fillRect(0,0 ,800,800);

}