function loadContent() {
	$("#login-and-registration-container").load("/accounts/login .login-form");
}
function initiate() {
	var elem = document.getElementsByClassName("login-action");
	elem[0].addEventListener('click', loadContent);
}
addEventListener('load', initiate);