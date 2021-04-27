const g = 9.80665;   
const scale = 100;   

var m, M;            
var rm, rM;          
var am = 0, aM = 0;  
var ym, yM;         
var Vm = 0, VM = 0;  
var h;               
var l;              
var t;              
var k;        

var stop;            
var X;        
var Y;        
var Z;

var menuGroup = [];        
var menuTextGroup = [];   
var dataTextGroup = [];    
var menuh;                  

function setup() {
  createCanvas(800, 500, WEBGL);  
  frameRate(60);                  
  
  button1 = createButton('start new ');  
  button1.position(10, height - 40);
  button1.mousePressed(restart);
  button2 = createButton('stop/start');  
  button2.position(10, height - 70);
  button2.mousePressed(stopstart);

  menuGroup[0] = createSlider(-1000, 1000, 0);  
  menuGroup[1] = createSlider(-1000, 1000, -300);
  menuGroup[2] = createSlider(-2000, 2000, 0);
  menuGroup[3] = createInput(10);  
  menuGroup[4] = createInput(5);
  menuGroup[5] = createInput(0.3);
  menuGroup[6] = createInput(0.2);
  menuGroup[7] = createInput(11);
  menuGroup[8] = createInput(7.5);
  menuGroup[9] = createInput(0.7);
  
  menuTextGroup[0] = createElement('h6', 'X');    
  menuTextGroup[1] = createElement('h6', 'Y');
  menuTextGroup[2] = createElement('h6', 'Z');
  menuTextGroup[3] = createElement('h6', 'M kg');
  menuTextGroup[4] = createElement('h6', 'm kg');
  menuTextGroup[5] = createElement('h6', 'rM m');
  menuTextGroup[6] = createElement('h6', 'rm m');
  menuTextGroup[7] = createElement('h6', 'l m');
  menuTextGroup[8] = createElement('h6', 'h m');
  menuTextGroup[9] = createElement('h6', 'k');
  
  dataTextGroup[0] = createElement('h6', 'hm = ');  
  dataTextGroup[1] = createElement('h6', 'hM = ');
  dataTextGroup[2] = createElement('h6', 'Vm = ');
  dataTextGroup[3] = createElement('h6', 'VM = ');
  dataTextGroup[4] = createElement('h6', 'am = ');
  dataTextGroup[5] = createElement('h6', 'aM = ');
  dataTextGroup[6] = createElement('h6', 't  = ');
  
  for (let i = 0; i < 10; i++) {       
    menuh = map(i, 0, 6, 10, 160);
    menuGroup[i].position(10, menuh);
    menuGroup[i].style('width', '80px');
    menuTextGroup[i].position(100, menuh - 20);
  }
  
  for (let i = 0; i < 7; i++) {        
    menuh = map(i, 0, 6, 280, 400);
    dataTextGroup[i].position(10, menuh - 20);
  }
  
  t = 0;        
  Vm = VM = 0;
  k = parseFloat(menuGroup[9].value());    
  if(k > 1) { k = 1;  menuGroup[9].value(k); } 
  else if(k < 0) { k = 0;  menuGroup[9].value(k); }
  M = parseFloat(menuGroup[3].value());
  m = parseFloat(menuGroup[4].value());
  rM = scale * parseFloat(menuGroup[5].value());
  rm = scale * parseFloat(menuGroup[6].value());  
  
  if (parseFloat(menuGroup[7].value() - PI/4) < parseFloat(menuGroup[8].value()))
  { menuGroup[7].value(parseFloat(menuGroup[8].value()) + PI/4); }
  h = scale * menuGroup[8].value();
  l = scale * (menuGroup[7].value() - HALF_PI);
  
  
  ym = l/2;
  yM = ym;
  stop = true;  
}

function draw() {
  background(200);     
  lights();            
  pointLight(255, 255, 255, -400, -200, 50);  
                    
  camera(mouseX, mouseY*2, height / tan(PI/8), mouseX, height/2, 0, 0, 1, 0);
  
  X = menuGroup[0].value();  
  Y = menuGroup[1].value();  
  Z = menuGroup[2].value();
                             
  translate(X + width/2, Y + height/2, Z);
                             
  dataTextGroup[0].html('hm = ' + ((h-ym-rm)/scale) + ' m');
  dataTextGroup[1].html('hM = ' + ((h-yM-rM)/scale) + ' m');
  dataTextGroup[2].html('Vm = ' + -Vm  + ' m/s');
  dataTextGroup[3].html('VM = ' + -VM  + ' m/s');
  dataTextGroup[4].html('am = ' + -am  + ' m/s^2');
  dataTextGroup[5].html('aM = ' + -aM  + ' m/s^2');
  dataTextGroup[6].html('t = ' + t  + ' s');
  
  if(!stop)
  { 
    if(yM >= h - rM)   
    {                 
      VM *= -k;       
      yM = h - rM;    
    }
    if(ym >= h - rm)
    { 
      Vm *= -k;
      ym = h - rm;
    }
    
    if(yM + ym >= l)  
    {  
      aM = acceleration(m, M, g);  
      am = acceleration(M, m, g);
      if(Vm > 0 && M > m)  
      {
        ym = l - yM;       
        if(yM == h - rM && Vm < 2)   
        {   
          VM = Vm = 0;     
          am = aM = 0; 
          stop = true;     
        }
        else if(ym > 0)
        {
          Vm = -VM;
        }
      }
      if(VM > 0 && m > M)
      {
        yM = l - ym;
        if(ym == h - rm && VM < 2)
        { 
          VM = Vm = 0; 
          am = aM = 0; 
          stop = true;
        }
        else if(yM > 0)
        {
          VM = -Vm;
        }
      }
    }
    else      
    {
      am = g;
      aM = g;
    }
                                                    
    if (!stop)   
    {            
      Vm += accelerationDeltaSpeed(am, 1/60);
      VM += accelerationDeltaSpeed(aM, 1/60);
      ym += scale * deltaMovement(Vm, 1/60);
      yM += scale * deltaMovement(VM, 1/60);    
      t += 1/60;
    }
  }
  
  fill(100);
  noStroke();
  
  push();
  translate(0, h + 5, 0);
  rotateX(HALF_PI);   
  box(500, 500, 10);  
  pop();
  
  push();                
  translate(0, h+50, -250);
  for(let i = 0; i < h / 100 + 5; i++)
  {
    if(i%2==0) 
    {
      fill(255);
    }
    else
    {
      fill(10);
    }
    translate(0, -100, 0);
    plane(500, 100);
  }
  pop();
  
  push();  
  translate(0, 0, 0);
  rotateX(HALF_PI);
  cylinder(50, 500);
  pop();
  
  fill(200, 40, 40);  
  push();
  translate(50, ym, 0);
  sphere(rm);
  pop();
  push();
  translate(-50, yM, 0);
  sphere(rM);
  pop();
  
  stroke(0, 200, 100);  
  strokeWeight(4);
  if (yM > 0)           
  {                     
    arc(0, 0, 100, 100, -PI, -HALF_PI);
    line(-50, 0, 0, -50, yM, 0);
  }
  else
  {
    line(0, 0, 0, -50, yM, 0);
  }
  if (ym > 0)           
  {
    arc(0, 0, 100, 100, -HALF_PI, 0);
    line(50, 0, 0, 50, ym, 0);
  }
  else
  {
    line(0, 0, 0, 50, ym, 0);
  }
}

function restart()
{          
  t = 0;   
  Vm = VM = 0;
  k = parseFloat(menuGroup[9].value());
  if(k > 1) { k = 1;  menuGroup[9].value(k); } 
  else if(k < 0) { k = 0;  menuGroup[9].value(k); }
  M = parseFloat(menuGroup[3].value());
  m = parseFloat(menuGroup[4].value());
  rM = scale * parseFloat(menuGroup[5].value());
  rm = scale * parseFloat(menuGroup[6].value());
  if (parseFloat(menuGroup[7].value() - PI/4) < parseFloat(menuGroup[8].value()))
  { menuGroup[7].value(parseFloat(menuGroup[8].value()) + PI/4); }
  h = scale * menuGroup[8].value();
  l = scale * (menuGroup[7].value() - PI / 2);
  ym = l/2;
  yM = ym;
  stop = false;
}

function stopstart() 
{          
  stop = !stop;
}
function accelerationDeltaSpeed(t, a)
{          
  return a*t;
}
function deltaMovement(V, t)
{         
  return V*t;
}
function acceleration(m, M, g)
{          
  if (M == 0 && m == 0) { return 0; }
  return g * (M - m) / (M + m);
}
