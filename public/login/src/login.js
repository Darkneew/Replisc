$("#email").on("keydown", (e) => {
	if (e.keyCode == 13) {
		e.preventDefault();
		$("#password").focus();
	}
});

$("#email").focusout(e => {
	if ($("#email").val() !== "") {
		$("label[for='email']").css("opacity", "0");
	} else {
		$("label[for='email']").css("color", "gray");
		$("label[for='email']").css("opacity", "100");
	}
});

$("#email").focus(e => {
	$("label[for='email']").css("opacity", "100");
	$("label[for='email']").css("color", "white");
});

$("#password").focusout(e => {
	if ($("#password").val() !== "") {
		$("label[for='password']").css("opacity", "0");
	} else {
		$("label[for='password']").css("color", "gray");
		$("label[for='password']").css("opacity", "100");
	}
});

$("#password").focus(e => {
	$("label[for='password']").css("opacity", "100");
	$("label[for='password']").css("color", "white");
});