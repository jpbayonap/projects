var ball = function(posx, posy,r){
    this.x = posx;
    this.y = posy;
    this.r = r;
    this.velx = 0;
    this.vely = 0;
    this.acx = 0;
    this.acy = 0;
    this.u = 1;
    this.draw = function(context){
      context.beginPath();
      context.arc(this.x,this.y,this.r,0, 2*Math.PI);
      context.fill();
    };
    this.set_velocity = function(vx,vy){
      this.velx = vx;
      this.vely= vy;
    }

    this.update = function(){
      this.velx += this.acx;
      this.vely += this.acy;
      this.x += this.velx;
      this.y += this.vely;
      if(this.y +this.r >= 700){
        this.y = 700- this.r;
        this.vely = -this.u*this.vely;
      };

      if(this.y -this.r <= 0){
        this.y = this.r;
        this.vely = -this.u*this.vely;
      };
      if(this.x +this.r >= 700){
            this.x = 700- this.r;
            this.velx = -this.u*this.velx;
          };
        if(this.x -this.r <= 0){
              this.x =  this.r;
              this.velx = -this.u*this.velx;
            };

    };
    this.apply_force = function(force){
      this.acx = force[0];
      this.acy = force[1];
    };
  };
