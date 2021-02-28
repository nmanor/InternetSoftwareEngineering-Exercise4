let username;
$(() => {

    // code for about section loading
    $("#about-btn").on("click", function() {
        $("#main-content").load(`/about/${username}`);
    });

    // code for contact us section loading
    $("#contact-us-btn").on("click", function() {
        $("#main-content").load(`/contact-us/${username}`);
    });

    // code for login form
    $("#loginForm").on("click", async event => {
        event.preventDefault();
        let username_ = $("#username").val()
        let password_ = $("#password").val()
        if (username_.length > 0 && password_.length > 0) {
            // try to get the user data from the server
            let resp = await fetch("/login", {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify({ username: username_, password: password_ })
            });

            // if the user doesn't exist, show error message
            if (resp.status === 400) {
                $("#username-label").css('color', 'red');
                $("#password-label").css('color', 'red');
                return false;
            }

            // else, show the user his data
            resp.json().then(function(json) {
                // save the username in the client
                username = json.username;

                // change the main banner content
                $("#main-content").html(json.welcomeHTML);

                // update the navbar buttons
                json.buttonsList.forEach(li => $("#navbar-ul").append(li));

                // close the login modal
                $("#logInModal").modal('toggle');

                // change the login button to logout
                $("#login-button").text('Logout').on("click", function() {
                    location.assign("/");
                });

                // code for catalog section loading
                $("#catalog-btn").on("click", function() {
                    $("#main-content").load(`/catalog/${username}`);
                });

                // code for catalog section loading
                $("#users-btn").on("click", function() {
                    $("#main-content").load(`/users/${username}`);
                });

                // code for catalog section loading
                $("#branches-btn").on("click", function() {
                    $("#main-content").load(`/branches/${username}`);
                });
            });
        }
    });
});