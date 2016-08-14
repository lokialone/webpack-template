// require('./style/idnex.scss');
// require('./style/look.css');

module.exports = function () {
	var element = document.createElement('div');
	var img = document.createElement('img');
	var p = document.createElement('p');

	p.innerHTML = 'enhdddd';
	img.src = "../res/img/1.png";
	element.appendChild(img);
	element.appendChild(p);
	
	element.className = "redButton";
	return element;
}