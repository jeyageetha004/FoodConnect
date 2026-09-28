/* =====================================================
   FOODCONNECT LOGIN
===================================================== */


/* =====================================================
   DEMO LOGIN DETAILS
===================================================== */

const adminUsername =
    "admin";


const adminPassword =
    "admin123";


const userUsername =
    "user";


const userPassword =
    "user123";


/* =====================================================
   LOGIN FORM
===================================================== */

document
    .getElementById("loginForm")
    .addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const username =
                document
                    .getElementById("username")
                    .value
                    .trim();


            const password =
                document
                    .getElementById("password")
                    .value
                    .trim();


            const message =
                document
                    .getElementById("loginMessage");


            message.textContent =
                "";


            /* =========================
               ADMIN LOGIN
            ========================= */

            if (
                username === adminUsername &&
                password === adminPassword
            ) {

                sessionStorage.setItem(
                    "foodConnectRole",
                    "admin"
                );


                window.location.href =
                    "admin.html";


                return;

            }


            /* =========================
               USER LOGIN
            ========================= */

            if (
                username === userUsername &&
                password === userPassword
            ) {

                sessionStorage.setItem(
                    "foodConnectRole",
                    "user"
                );


                window.location.href =
                    "index.html";


                return;

            }


            /* =========================
               INVALID LOGIN
            ========================= */

            message.textContent =
                "Invalid username or password.";

        }
    );