require('./style/idnex.scss');
require('./style/look.css');

module.exports = function () {
	var element = document.createElement('h1');
	element.innerHTML = "Hello world";
	element.className = "redButton";
	return element;
}