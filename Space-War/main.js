!function(){"use strict";function t(t,e){t instanceof HTMLCanvasElement?this.canvas=t:this.canvas=document.querySelector(t),this.context=this.canvas.getContext("2d",e),this.width=this.canvas.width,this.height=this.canvas.height}t.prototype.size=function(t,e){this.width=t,this.height=e;const o=this.canvas,i=this.context,s=window.devicePixelRatio;return s>1?(o.style.width=t+"px",o.style.height=e+"px",o.width=t*s,o.height=e*s,i.setTransform(s,0,0,s,0,0)):(o.width=t,o.height=e),this},t.prototype.clear=function(t){const e=this.context;return t?e.clearRect(t.x,t.y,t.width,t.height):e.clearRect(0,0,this.canvas.width,this.canvas.height),this},t.prototype.style=function(t){const e=this.context;if(t.fill&&(e.fillStyle=t.fill),t.shadow){const o=t.shadow.split(" ");e.shadowOffsetX=parseInt(o[0],10),e.shadowOffsetY=parseInt(o[1],10),e.shadowBlur=parseInt(o[2],10),e.shadowColor=o[3]}return t.stroke&&(e.strokeStyle=t.stroke),t.cap&&(e.lineCap=t.cap),t.join&&(e.lineJoin=t.join),t.thickness&&(e.lineWidth=t.thickness),t.miterLimit&&(e.miterLimit=t.miterLimit),t.alpha&&(e.globalAlpha=t.alpha),t.composite&&(e.globalCompositeOperation=t.composite),this},t.prototype.image=function(t){const e=this.context,o=new Image;return o.onload=function(){t.width&&t.height?e.drawImage(o,t.x,t.y,t.width,t.height):e.drawImage(o,t.x,t.y)},o.src=t.src,this},t.prototype.text=function(t){const e=this.context;return e.save(),this.style(t),t.font&&(e.font=t.font),t.align&&(e.textAlign=t.align),t.baseline&&(e.textBaseline=t.baseline),t.direction&&(e.direction=t.direction),t.stroke?e.strokeText(t.text,t.x,t.y):e.fillText(t.text,t.x,t.y),e.restore(),this},t.prototype.line=function(t){const e=this.context;return e.save(),this.style(t),e.beginPath(),e.moveTo(t.x1,t.y1),e.lineTo(t.x2,t.y2),e.closePath(),e.stroke(),e.restore(),this},t.prototype.rect=function(t){const e=this.context;e.save(),this.style(t);const o=void 0!==t.degree?t.degree*Math.PI/180:null;if(o){const i=t.x+t.width/2,s=t.y+t.height/2;e.translate(i,s),e.rotate(o),e.translate(-i,-s)}return e.beginPath(),e.rect(t.x,t.y,t.width,t.height),e.closePath(),t.fill&&e.fill(),t.stroke&&e.stroke(),e.restore(),this},t.prototype.circle=function(t){const e=this.context;return e.save(),this.style(t),e.beginPath(),e.arc(t.x,t.y,t.r,0,2*Math.PI),e.closePath(),t.fill&&e.fill(),t.stroke&&e.stroke(),e.restore(),this},t.prototype.arc=function(t){const e=this.context;return e.save(),this.style(t),e.beginPath(),e.arc(t.x,t.y,t.r,t.start,t.stop),e.closePath(),t.fill&&e.fill(),t.stroke&&e.stroke(),e.restore(),this},t.prototype.polygon=function(t){const e=this.context;e.save(),this.style(t);const o=void 0!==t.degree?t.degree*Math.PI/180:0;e.translate(t.x,t.y),e.rotate(o),e.beginPath(),e.moveTo(t.size*Math.cos(0),t.size*Math.sin(0));for(let o=1;o<=t.sides;++o)e.lineTo(t.size*Math.cos(2*o*Math.PI/t.sides),t.size*Math.sin(2*o*Math.PI/t.sides));return e.closePath(),t.fill&&e.fill(),t.stroke&&e.stroke(),e.restore(),this},t.prototype.path=function(t){const e=this.context;return e.save(),this.style(t),e.beginPath(),t.path.split(" ").forEach(function(t){const o=t.split(",");"m"===o[0]||"M"===o[0]?e.moveTo(o[1],o[2]):"l"===o[0]||"L"===o[0]?e.lineTo(o[1],o[2]):"q"!==o[0]&&"Q"!==o[0]||e.quadraticCurveTo(o[1],o[2],o[3],o[4])}),e.closePath(),t.fill&&e.fill(),t.stroke&&e.stroke(),e.restore(),this},t.prototype.conic_gradient=function(t){const e=this.context.createConicGradient(t.degree*Math.PI/180,t.x,t.y);return t.stops.split(" ").forEach(function(t){const o=t.split(",");e.addColorStop(parseFloat(o[0]),o[1])}),e},t.prototype.linear_gradient=function(t){const e=this.context.createLinearGradient(t.x1,t.y1,t.x2,t.y2);return t.stops.split(" ").forEach(function(t){const o=t.split(",");e.addColorStop(parseFloat(o[0]),o[1])}),e},t.prototype.radial_gradient=function(t){const e=this.context.createRadialGradient(t.x1,t.y1,t.r1,t.x2,t.y2,t.r2);return t.stops.split(" ").forEach(function(t){const o=t.split(",");e.addColorStop(parseFloat(o[0]),o[1])}),e},t.prototype.toDataURL=function(t){const e=(t=t||{}).type||"image/png",o=t.quality||1;return this.canvas.toDataURL(e,o)},t.prototype.toBlob=function(t,e){const o=(t=t||{}).type||"image/png",i=t.quality||1;return this.canvas.toBlob(e,o,i)},window.Palette=t}();

// game engine

const runtime = {
	running: false,
	paper: new Palette('#canvas', { alpha: false }),
	times: [],
	score: 0,
	controls: new Set(),
	player: null,
	enemies: new Set(),
	effects: new Set()
};

window.addEventListener('keydown', function (event) {
	if (event.isComposing || event.keyCode === 229) {
		return;
	}
	//console.log('keydown', event.key);
	if (!runtime.running && (event.key === 'f' || event.key === 'F')) {
		runtime_reset();
		runtime_start();
	} else {
		runtime.controls.add(event.key);
	}
});
window.addEventListener('keyup', function (event) {
	if (event.isComposing || event.keyCode === 229) {
		return;
	}
	//console.log('keyup', event.key);
	runtime.controls.delete(event.key);
});

var runtime_reset = function () {
	const is_running = runtime.running;
	if (is_running) {
		runtime_stop();
	}
	runtime.score = 0;
	runtime.controls.clear();
	runtime.player = {
		x: runtime.paper.width / 2,
		y: runtime.paper.height / 2,
		d: -90,
		size: 20,
		speed: 2
	};
	runtime.enemies.clear();
	runtime.effects.clear();
	if (is_running) {
		runtime_start();
	}
};

var runtime_start = function () {
	runtime.running = true;
	runtime.game_loop = setInterval(runtime_tick, 10);
	runtime.frame_request = requestAnimationFrame(runtime_render);
};

var runtime_stop = function () {
	runtime.running = false;
	clearInterval(runtime.game_loop);
	delete runtime.game_loop;
	cancelAnimationFrame(runtime.frame_request);
	delete runtime.frame_request;
	runtime.times = [];
};

var runtime_tick = function () {
	if (!runtime.running) {
		return;
	}
	const timestamp = performance.now();
	// player
	const player = runtime.player;
	const controls = runtime.controls;
	// drive-controls
	if (controls.has('ArrowUp')) {
		// forward
		player.x = player.x + player.speed * Math.cos(player.d * Math.PI / 180);
		player.y = player.y + player.speed * Math.sin(player.d * Math.PI / 180);
	} else if (controls.has('ArrowDown')) {
		// backward
		player.x = player.x - player.speed * Math.cos(player.d * Math.PI / 180);
		player.y = player.y - player.speed * Math.sin(player.d * Math.PI / 180);
	}
	if (controls.has('ArrowLeft')) {
		// turn left
		player.d -= player.speed;
	} else if (controls.has('ArrowRight')) {
		// turn right
		player.d += player.speed;
	}
	// direction-controls
	/*
	const pressing_w = controls.has('w') || controls.has('W');
	const pressing_a = controls.has('a') || controls.has('A');
	const pressing_s = controls.has('s') || controls.has('S');
	const pressing_d = controls.has('d') || controls.has('D');
	if (pressing_w && pressing_d) {
		// ne
		player.x += player.speed;
		player.y -= player.speed;
		player.d = -45;
	} else if (pressing_w && pressing_a) {
		// nw
		player.x -= player.speed;
		player.y -= player.speed;
		player.d = -135;
	} else if (pressing_s && pressing_d) {
		// se
		player.x += player.speed;
		player.y += player.speed;
		player.d = 45;
	} else if (pressing_s && pressing_a) {
		// sw
		player.x -= player.speed;
		player.y += player.speed;
		player.d = 135;
	} else if (pressing_w) {
		// n
		player.y -= player.speed;
		player.d = -90;
	} else if (pressing_a) {
		// w
		player.x -= player.speed;
		player.d = 180;
	} else if (pressing_s) {
		// s
		player.y += player.speed;
		player.d = 90;
	} else if (pressing_d) {
		// e
		player.x += player.speed;
		player.d = 0;
	}
	*/
	// boundaries check
	const gap = player.size / 2;
	if (player.x < gap) {
		player.x = gap;
	}
	if (player.y < gap) {
		player.y = gap;
	}
	if (player.x > runtime.paper.width - gap) {
		player.x = runtime.paper.width - gap;
	}
	if (player.y > runtime.paper.height - gap) {
		player.y = runtime.paper.height - gap;
	}
	// player collision detection
	runtime.enemies.forEach(function (enemy) {
		const distance = Math.hypot(player.x - enemy.x, player.y - enemy.y);
		if (distance - (player.size / 2) - (enemy.size / 2.5) <= 0) {
			runtime_stop();
			runtime.paper.text({
				text: 'GAME OVER',
				x: runtime.paper.width / 2,
				y: runtime.paper.height / 2,
				font: '60px Consolas, monospace',
				align: 'center',
				baseline: 'middle',
				fill: 'crimson'
			});
			runtime.paper.text({
				text: `SCORE: ${runtime.score}`,
				x: runtime.paper.width / 2,
				y: runtime.paper.height / 2 + 30 + 10,
				font: '14px Consolas, monospace',
				align: 'center',
				baseline: 'top',
				fill: 'crimson'
			});
			runtime.paper.text({
				text: 'Press F to retry',
				x: runtime.paper.width / 2,
				y: runtime.paper.height / 2 + 30 + 10 + 14 + 10,
				font: '14px Consolas, monospace',
				align: 'center',
				baseline: 'top',
				fill: 'crimson'
			});
		}
	});
	// skills
	if (controls.has(' ')) {
		const skill_1_cooldown = 50; // skill 1 cooldown in ms
		if (!player.skill_1_last || timestamp > player.skill_1_last + skill_1_cooldown) {
			player.skill_1_last = timestamp;
			runtime.effects.add({
				type: 'skill_1',
				x: player.x,
				y: player.y,
				d: player.d,
				size: 4,
				speed: 5
			});
		}
	}
	// effects AI
	runtime.effects.forEach(function (effect) {
		if (effect.type === 'skill_1') {
			effect.x = effect.x + effect.speed * Math.cos(effect.d * Math.PI / 180);
			effect.y = effect.y + effect.speed * Math.sin(effect.d * Math.PI / 180);
			if (effect.x < 0 || effect.y < 0 || effect.x > runtime.paper.width || effect.y > runtime.paper.height) {
				runtime.effects.delete(effect);
			}
		}
	});
	// enemies
	// enemies spawn
	const enemy_spawn_cooldown = 500;
	if (!runtime.enemy_spawn_last || timestamp > runtime.enemy_spawn_last + enemy_spawn_cooldown) {
		runtime.enemy_spawn_last = timestamp;
		let x, y;
		const side = Math.floor(Math.random() * 4);
		if (side === 0) {
			// north
			x = Math.floor(Math.random() * runtime.paper.width);
			y = 0;
		} else if (side === 1) {
			// east
			x = runtime.paper.width;
			y = Math.floor(Math.random() * runtime.paper.height);
		} else if (side === 2) {
			// south
			x = Math.floor(Math.random() * runtime.paper.width);
			y = runtime.paper.height;
		} else if (side === 3) {
			// west
			x = 0;
			y = Math.floor(Math.random() * runtime.paper.height);
		}
		runtime.enemies.add({
			x: x,
			y: y,
			d: 0,
			speed: 0.5,
			size: 20
		});
	}
	// enemies collision detection
	runtime.enemies.forEach(function (enemy) {
		runtime.effects.forEach(function (effect) {
			if ((effect.type === 'skill_1')) {
				//const distance = Math.sqrt(Math.pow(effect.x - enemy.x, 2) + Math.pow(effect.y - enemy.y, 2));
				const distance = Math.hypot(effect.x - enemy.x, effect.y - enemy.y);
				if (distance - (effect.size / 2) - (enemy.size / 2) <= 0) {
					runtime.score++;
					runtime.enemies.delete(enemy);
					runtime.effects.delete(effect);
				}
			}
		});
	});
	// enemies AI
	runtime.enemies.forEach(function (enemy) {
		enemy.d = Math.atan2(player.y - enemy.y, player.x - enemy.x) * (180 / Math.PI);
		enemy.x = enemy.x + enemy.speed * Math.cos(enemy.d * Math.PI / 180);
		enemy.y = enemy.y + enemy.speed * Math.sin(enemy.d * Math.PI / 180);
		if (enemy.x < 0 || enemy.y < 0 || enemy.x > runtime.paper.width || enemy.y > runtime.paper.height) {
			runtime.enemies.delete(enemy);
		}
	});
};

var runtime_render = function (timestamp) {
	if (!runtime.running) {
		return;
	}
	/*
	// frame rate limiter
	const delay = 33; // 30fps use 1000/30=33
	if (runtime.next_time && timestamp < runtime.next_time) {
		runtime.frame_request = requestAnimationFrame(runtime_render);
		return;
	}
	runtime.next_time = timestamp + delay;
	*/
	// calculate fps
	while (runtime.times.length > 0 && runtime.times[0] <= timestamp - 1000) {
		runtime.times.shift();
	}
	runtime.times.push(timestamp);
	// render frame
	const paper = runtime.paper;
	paper.clear();
	paper.rect({ x: 0, y: 0, width: paper.width, height: paper.height, fill: 'black' });
	runtime.effects.forEach(function (effect) {
		if (effect.type === 'skill_1') {
			paper.circle({ x: effect.x, y: effect.y, r: effect.size / 2, fill: 'white' });
		}
	});
	runtime.enemies.forEach(function (enemy) {
		//paper.circle({ x: enemy.x, y: enemy.y, r: enemy.size / 2, fill: 'white' });
		paper.rect({ x: enemy.x - enemy.size, y: enemy.y - enemy.size, width: enemy.size, height: enemy.size, fill: 'white', degree: enemy.d });
	});
	paper.polygon({
		x: runtime.player.x,
		y: runtime.player.y,
		sides: 3,
		size: runtime.player.size,
		degree: runtime.player.d,
		fill: 'white'
	});
	// print score
	paper.text({
		text: `SCORE: ${runtime.score}`,
		x: paper.width / 2,
		y: 10,
		font: '14px Consolas, monospace',
		align: 'center',
		baseline: 'top',
		fill: 'white'
	});
	// print help text
	paper.text({
		text: 'Use arrow keys to move and turn, and space to shoot.',
		x: paper.width / 2,
		y: paper.height - 10,
		font: '14px Consolas, monospace',
		align: 'center',
		baseline: 'bottom',
		fill: 'white'
	});
	// print fps
	paper.text({
		text: `FPS: ${runtime.times.length}`,
		x: paper.width - 10,
		y: 10,
		font: '14px Consolas, monospace',
		align: 'right',
		baseline: 'top',
		fill: 'white'
	});
	// loop
	if (runtime.running) {
		runtime.frame_request = requestAnimationFrame(runtime_render);
	}
};

runtime.paper.size(window.innerWidth, window.innerHeight);
window.addEventListener('resize', function () {
	runtime.paper.size(window.innerWidth, window.innerHeight);
});
runtime_reset();
runtime_start();
