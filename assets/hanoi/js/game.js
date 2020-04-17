/*
 * $Id: $
 *
 * Copyright (C) 2012 Stoyan Rachev (stoyanr@gmail.com)
 *
 * This program is free software; you can redistribute it and/or modify it
 * under the terms of the GNU General Public License as published by the
 * Free Software Foundation; either version 2, or (at your option) any
 * later version.
 *
 * This program is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * General Public License for more details.
 */

var NUM_TOWERS = 3;

var TOWER_WIDTH = 240;
var TOWER_HEIGHT = 280;
var TOWER_XWIDTH = 10;

var DISK_WIDTHS = [ 50, 80, 110, 140, 170, 200, 230 ] ;
var DISK_HEIGHT = 36;

var FONT_SIZE = 14;
var FONT_FACE = "Arial";

$(function() {
	new Game().init();
	$("#startOver").click(function() {
		new Game().init();;
	});
});

function Game() {
	this.numDisks = $("#numDisks").val();
	this.towers = [];
	this.disks = [];
	this.moves = 0;
}

Game.prototype.init = function() {
	this.clean();
	this.createTowers();
	this.createDisks();
	this.initTowers();
	this.initDisks();
	this.positionDisks();
	this.updateDraggableDisks();
}

Game.prototype.clean = function() {
	$("#game").empty();
	$("#images").empty();
	$("#moves").text(this.moves);
}

Game.prototype.createTowers = function() {
	for (var i = 0; i < NUM_TOWERS; i++) {
		var tower = new Tower(i, TOWER_WIDTH, TOWER_HEIGHT, TOWER_XWIDTH, $.proxy(this.handleDrop, this));
		this.towers.push(tower);
		$("#game").append(tower.createElement());
	}
	$("#images").append(tower.createImageElement());
}

Game.prototype.initTowers = function() {
	for (var i = 0; i < this.towers.length; i++) {
		this.towers[i].init();
	}
}

Game.prototype.createDisks = function() {
	for (var i = 0; i < this.numDisks; i++) {
		var disk = new Disk(i, DISK_WIDTHS[i], DISK_HEIGHT, FONT_SIZE, FONT_FACE, $.proxy(this.handleDrag, this));
		this.disks.push(disk);
		$("#game").append(disk.createElement());
		$("#images").append(disk.createImageElement());
	}
	for (var j = this.numDisks - 1; j >= 0; j--) {
		this.towers[0].addDisk(this.disks[j]);
		this.disks[j].setTower(this.towers[0]);
	}
}

Game.prototype.initDisks = function() {
	for (var i = 0; i < this.disks.length; i++) {
		this.disks[i].init();
	}
}

Game.prototype.positionDisks = function() {
	for (var i = 0; i < this.disks.length; i++) {
		this.disks[i].position();
	}
}

Game.prototype.updateDraggableDisks = function() {
	for (var i = 0; i < this.towers.length; i++) {
		this.towers[i].updateDraggableDisks();
	}
}

Game.prototype.handleDrag = function(event, ui) {
	this.getDisk($(event.target)).setDraggableRevert(true);
}

Game.prototype.handleDrop = function(event, ui) {
	var tower = this.getTower($(event.target));
	var disk = this.getDisk(ui.draggable);
	if (tower.getNum() != disk.getTower().getNum()) {
		this.moves++;
		$("#moves").text(this.moves);
		if (tower.canPlaceDisk(disk)) {
			disk.setDraggableRevert(false);
			tower.moveDisk(disk);
			disk.position();
			this.updateDraggableDisks();
			this.checkSolved();
		}
	}
}

Game.prototype.checkSolved = function() {
	for (var i = 1; i < this.towers.length; i++) {
		if (this.towers[i].getDisks().length == this.disks.length) {
			if (this.moves<=15) {
			alert("¡Felicidades! Lo has resuelto en " + this.moves + " movimientos. La siguiente letra es la R. Busca en la pesa de 50 kg, tiene un compartimento secreto con la pista para abrir la cuarta maleta.");
			}	else {
			alert("Bien hecho, aunque para obtener tu premio tienes que lograrlo en 15 movimientos. Vuelve a empezar.");
			}
			$("#startOver").click();
			break;
		}
	}
}

Game.prototype.getTower = function(elem) {
	return this.towers[getNum(elem)];
}

Game.prototype.getDisk = function(elem) {
	return this.disks[getNum(elem)];
}

function getNum(o) {
	return getLast(o.attr("id"));
}

function getLast(s) {
	return s.charAt(s.length - 1);
}
