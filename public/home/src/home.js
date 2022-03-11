$("button").click(() => {
	console.log("Button clicked.");
});

$(document).ready(() => {
	sessionStorage.setItem('replisc-who', null); 

	let colors = ['blue', 'green', 'orange'];
	let color = colors[Math.floor(Math.random() * colors.length)];
	let src = `/resources/default-icon_${color}.png`
	$('#profilePicture').css('background-image', `url("${src}")`);
	let name = parse_cookie(document.cookie)['username'];
	$('#username').text(name);

	let socket = io();
	socket.on('msg', (sender, recipient, msg) => {
		if (!msg) {
			return;
		}
		if ((recipient == name && sender == sessionStorage.getItem('replisc-who')) || (recipient == sessionStorage.getItem('replisc-who') && sender == name)) {
			let entry = $('<div class="message"></div>');
			let user = $('<span class="username"></span>');
			user.text(sender);
			let container = $('<span class="content"></span>');
			container.text(msg);
			entry.append(user);
			entry.append($('<br/>'));
			entry.append(container);
			$('#messages').append(entry);
			$('#messages').scrollTop($('#messages')[0].scrollHeight);
		}
	});

	socket.on('loading', (sender, recipient) => {
		if ((recipient == name && sender == sessionStorage.getItem('replisc-who')) || (recipient == sessionStorage.getItem('replisc-who') && sender == name)) { 
			$('#messages').empty();
		}
	});

	$('.conversation').click((e) => {
		$('#messages').empty();
		let text = $(e.target).text();
		$('#who').text(`@${text}`); 
		sessionStorage.setItem('replisc-who', text); 
		load(name, sessionStorage.getItem('replisc-who'));
	});

	$('#msg').keyup((e) => {
		if (e.originalEvent.keyCode == 13) { 
			msg(name, sessionStorage.getItem('replisc-who'), $('#msg').val()); 
			$('#msg').val('');
		}
	});

	$('#find-conversation').keyup(e => {
		if ($(".conversation").length === 0) {
			
		}
		$(".conversation").each((index, element) => {
			let conversation = $(element);
			if (conversation.text().includes($("#find-conversation").val())) {
				conversation.css("display", "block");
			} else {
				conversation.css("display", "none");
			}
		});
	});

	$('#find-conversation').on("keyup", e => {
		if (e.keyCode === 13) {
			let who = $('#find-conversation').val();
			$('#find-conversation').val('');
			let conversation = $('<span class="conversation"></span>');
			conversation.text(who);
			$('#channels').append(conversation);
			$('#messages').empty();
			$('#who').text(`@${who}`); 
			sessionStorage.setItem('replisc-who', who); 
			load(name, sessionStorage.getItem('replisc-who'));
		}
	});
});

function parse_cookie(cookie) { 
	params = cookie.split(";");
	object = {};

	params.forEach(param => {
		if (param == "") { return; }

		let split_param = param.split("=");
		let key = split_param[0].trim();
		let value = split_param[1];

		object[key] = value;
	});

	return object;
}

function msg(sender, recipient, msg) {
	fetch('/api/msg', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			sender: sender,
			recipient: recipient,
			msg: msg,
		}),
	}).then(_ => _);
}

function load(sender, recipient) {
	fetch('/api/load', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			sender: sender,
			recipient: recipient,
		}),
	}).then(_ => _);
}