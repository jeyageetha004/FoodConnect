/* =====================================================
   FOODCONNECT
   FOOD + TRUST / NGO + DELIVERY SYSTEM
===================================================== */


/* =========================
   FOOD DATA
========================= */

let foods =
    JSON.parse(
        localStorage.getItem("foodConnectFoods")
    ) || [];


/* =========================
   TRUST DATA
========================= */

let trusts =
    JSON.parse(
        localStorage.getItem("foodConnectTrusts")
    ) || [];


/* =========================
   DELIVERY STATUS
========================= */

const statuses = [

    "Request Received",

    "Request Accepted",

    "Food Packing",

    "Out for Delivery",

    "Delivered"

];


/* =========================
   SAVE FOOD DATA
========================= */

function saveFoods() {

    localStorage.setItem(
        "foodConnectFoods",
        JSON.stringify(foods)
    );

}


/* =========================
   SAVE TRUST DATA
========================= */

function saveTrusts() {

    localStorage.setItem(
        "foodConnectTrusts",
        JSON.stringify(trusts)
    );

}


/* =========================
   GET QUANTITY
========================= */

function getQuantity(food) {

    return Number(
        food.remainingQuantity
    );

}


/* =====================================================
   DONATE FOOD
===================================================== */

document
    .getElementById("donateForm")
    .addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const donorName =
                document
                    .getElementById("donorName")
                    .value
                    .trim();


            const foodName =
                document
                    .getElementById("foodName")
                    .value
                    .trim();


            const quantity =
                Number(
                    document
                        .getElementById("foodQuantity")
                        .value
                );


            const location =
                document
                    .getElementById("donorLocation")
                    .value
                    .trim();


            const contact =
                document
                    .getElementById("donorContact")
                    .value
                    .trim();


            if (
                !/^[0-9]{10}$/.test(contact)
            ) {

                document
                    .getElementById("donateMessage")
                    .textContent =
                    "Please enter a valid 10 digit phone number.";

                return;

            }


            if (
                isNaN(quantity) ||
                quantity <= 0
            ) {

                document
                    .getElementById("donateMessage")
                    .textContent =
                    "Please enter a valid food quantity.";

                return;

            }


            const newFood = {

                id: Date.now(),

                donorName: donorName,

                foodName: foodName,

                quantity: quantity,

                remainingQuantity: quantity,

                location: location,

                donorContact: contact,

                requests: []

            };


            foods.push(newFood);

            saveFoods();


            document
                .getElementById("donateMessage")
                .textContent =
                "Food donated successfully!";


            this.reset();

            displayFoods();


            setTimeout(
                function() {

                    document
                        .getElementById("request")
                        .scrollIntoView({
                            behavior: "smooth"
                        });

                },
                700
            );

        }
    );


/* =====================================================
   DISPLAY AVAILABLE FOOD
===================================================== */

function displayFoods(searchText = "") {

    const container =
        document.getElementById(
            "foodContainer"
        );


    container.innerHTML = "";


    const filteredFoods =
        foods.filter(
            function(food) {

                return food.foodName
                    .toLowerCase()
                    .includes(
                        searchText.toLowerCase()
                    );

            }
        );


    if (
        filteredFoods.length === 0
    ) {

        container.innerHTML =
            "<p>No food available.</p>";

        return;

    }


    filteredFoods.forEach(
        function(food) {

            const card =
                document.createElement("div");


            card.className =
                "food-card";


            const remaining =
                getQuantity(food);


            let requestButton = "";


            if (remaining > 0) {

                requestButton = `

                    <button
                        onclick="openRequestForm(${food.id})">

                        Request Food

                    </button>

                `;

            }

            else {

                requestButton = `

                    <button disabled>

                        Food Fully Requested

                    </button>

                `;

            }


            card.innerHTML = `

                <h3>
                    ${food.foodName}
                </h3>

                <p>
                    <strong>Donor:</strong>
                    ${food.donorName}
                </p>

                <p>
                    <strong>Available Quantity:</strong>
                    ${remaining}
                </p>

                <p>
                    <strong>Location:</strong>
                    ${food.location}
                </p>

                ${requestButton}

            `;


            container.appendChild(card);

        }
    );

}


/* =========================
   SEARCH FOOD
========================= */

document
    .getElementById("searchFood")
    .addEventListener(
        "input",
        function() {

            displayFoods(
                this.value
            );

        }
    );


/* =====================================================
   OPEN REQUEST FORM
===================================================== */

function openRequestForm(foodId) {

    const food =
        foods.find(
            function(item) {

                return item.id === foodId;

            }
        );


    if (!food) return;


    const remaining =
        getQuantity(food);


    if (remaining <= 0) {

        alert(
            "Sorry, this food is no longer available."
        );

        return;

    }


    loadApprovedTrusts();


    document
        .getElementById("requestBox")
        .classList
        .remove("hidden");


    document
        .getElementById("selectedFoodId")
        .value =
        food.id;


    document
        .getElementById("selectedFoodText")
        .textContent =
        "You are requesting: " +
        food.foodName +
        " | Available: " +
        remaining;


    document
        .getElementById("quantityError")
        .textContent = "";


    document
        .getElementById("requestMessage")
        .textContent = "";


    document
        .getElementById("requestFormSection")
        .scrollIntoView({
            behavior: "smooth"
        });

}


/* =====================================================
   LOAD APPROVED TRUSTS
===================================================== */

function loadApprovedTrusts() {

    const select =
        document.getElementById(
            "selectedTrust"
        );


    if (!select) return;


    select.innerHTML = `

        <option value="">
            Select a Verified Trust / NGO
        </option>

    `;


    /*
       Refresh trust data from localStorage
       so newly approved trusts appear.
    */

    trusts =
        JSON.parse(
            localStorage.getItem("foodConnectTrusts")
        ) || [];


    const approvedTrusts =
        trusts.filter(
            function(trust) {

                return trust.status === "Approved";

            }
        );


    if (
        approvedTrusts.length === 0
    ) {

        const option =
            document.createElement("option");

        option.value = "";

        option.textContent =
            "No verified Trusts available";

        option.disabled = true;

        select.appendChild(option);

        return;

    }


    approvedTrusts.forEach(
        function(trust) {

            const option =
                document.createElement("option");

            option.value =
                trust.id;

            option.textContent =
                trust.name +
                " - " +
                trust.type;

            select.appendChild(option);

        }
    );

}


/* =====================================================
   REQUEST FOOD
===================================================== */

document
    .getElementById("requestForm")
    .addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const foodId =
                Number(
                    document
                        .getElementById("selectedFoodId")
                        .value
                );


            const food =
                foods.find(
                    function(item) {

                        return item.id === foodId;

                    }
                );


            if (!food) return;


            /*
               Refresh trust data
            */

            trusts =
                JSON.parse(
                    localStorage.getItem(
                        "foodConnectTrusts"
                    )
                ) || [];


            const selectedTrustId =
                document
                    .getElementById("selectedTrust")
                    .value;


            if (!selectedTrustId) {

                document
                    .getElementById("requestMessage")
                    .textContent =
                    "Please select a verified Trust / NGO.";

                return;

            }


            const selectedTrust =
                trusts.find(
                    function(trust) {

                        return trust.id ===
                            selectedTrustId;

                    }
                );


            if (
                !selectedTrust ||
                selectedTrust.status !== "Approved"
            ) {

                document
                    .getElementById("requestMessage")
                    .textContent =
                    "Please select an approved Trust / NGO.";

                return;

            }


            const remaining =
                getQuantity(food);


            const requestedPeople =
                Number(
                    document
                        .getElementById("numberOfPeople")
                        .value
                );


            if (
                isNaN(requestedPeople) ||
                requestedPeople <= 0
            ) {

                document
                    .getElementById("quantityError")
                    .textContent =
                    "Please enter a valid quantity.";

                return;

            }


            if (
                requestedPeople > remaining
            ) {

                document
                    .getElementById("quantityError")
                    .textContent =
                    "Only " +
                    remaining +
                    " meals are available.";

                return;

            }


            const receiverContact =
                document
                    .getElementById("receiverContact")
                    .value
                    .trim();


            if (
                !/^[0-9]{10}$/.test(
                    receiverContact
                )
            ) {

                document
                    .getElementById("requestMessage")
                    .textContent =
                    "Please enter a valid 10 digit phone number.";

                return;

            }


            const receiverName =
                document
                    .getElementById("receiverName")
                    .value
                    .trim();


            const receiverLocation =
                document
                    .getElementById("receiverLocation")
                    .value
                    .trim();


            const newRequest = {

                id: Date.now(),

                name:
                    receiverName,

                people:
                    requestedPeople,

                location:
                    receiverLocation,

                contact:
                    receiverContact,

                status: 0,

                trustId:
                    selectedTrust.id,

                trustName:
                    selectedTrust.name,

                trustType:
                    selectedTrust.type,

                trustLocation:
                    selectedTrust.address

            };


            food.requests.push(
                newRequest
            );


            food.remainingQuantity =
                remaining -
                requestedPeople;


            saveFoods();


            document
                .getElementById("requestMessage")
                .textContent =
                "Food request submitted successfully through " +
                selectedTrust.name +
                ".";


            this.reset();


            displayFoods();


            showDonorDashboard();

            showReceiverDashboard();


            document
                .getElementById("selectedFoodText")
                .textContent =
                "Request successful! " +
                food.remainingQuantity +
                " meals remaining.";

        }
    );


/* =====================================================
   DONOR DASHBOARD
===================================================== */

function showDonorDashboard() {

    const donorName =
        document
            .getElementById("donorSearchName")
            .value
            .trim()
            .toLowerCase();


    const container =
        document.getElementById(
            "donorDashboardContainer"
        );


    container.innerHTML = "";


    if (!donorName) {

        container.innerHTML = `
            <p>
                Please enter your donor name.
            </p>
        `;

        return;

    }


    const myFoods =
        foods.filter(
            function(food) {

                return food.donorName
                    .toLowerCase() ===
                    donorName;

            }
        );


    if (
        myFoods.length === 0
    ) {

        container.innerHTML = `
            <p>
                No donations found for this name.
            </p>
        `;

        return;

    }


    myFoods.forEach(
        function(food) {

            const card =
                document.createElement("div");


            card.className =
                "dashboard-card";


            let requestsHTML = "";


            if (
                food.requests &&
                food.requests.length > 0
            ) {

                requestsHTML = `

                    <hr>

                    <h3>
                        Receiver Requests
                    </h3>

                `;


                food.requests.forEach(
                    function(request) {

                        requestsHTML += `

                            <div class="request-details">

                                <p>
                                    <strong>
                                        Receiver Name:
                                    </strong>
                                    ${request.name}
                                </p>

                                <p>
                                    <strong>
                                        Requested Quantity:
                                    </strong>
                                    ${request.people}
                                </p>

                                <p>
                                    <strong>
                                        Location:
                                    </strong>
                                    ${request.location}
                                </p>

                                <p>
                                    <strong>
                                        Contact:
                                    </strong>
                                    ${request.contact}
                                </p>

                                <div class="trust-details">

                                    <p>
                                        <strong>
                                            Verified Trust / NGO:
                                        </strong>
                                        ${request.trustName || "Not selected"}
                                    </p>

                                    <p>
                                        <strong>
                                            Trust Type:
                                        </strong>
                                        ${request.trustType || "-"}
                                    </p>

                                    <p>
                                        <strong>
                                            Trust Address:
                                        </strong>
                                        ${request.trustLocation || "-"}
                                    </p>

                                </div>

                                <div class="status-container">

                                    <div class="status-title">
                                        Delivery Status
                                    </div>

                                    ${createStatusHTML(
                                        request.status
                                    )}

                                    <div class="status-buttons">

                                        ${createStatusButtons(
                                            food.id,
                                            request.id,
                                            request.status
                                        )}

                                    </div>

                                </div>

                            </div>

                        `;

                    }
                );

            }

            else {

                requestsHTML = `

                    <p>

                        <strong>
                            Status:
                        </strong>

                        Waiting for receiver request

                    </p>

                `;

            }


            card.innerHTML = `

                <h2>
                    ${food.foodName}
                </h2>

                <p>
                    <strong>
                        Donated Quantity:
                    </strong>
                    ${food.quantity}
                </p>

                <p>
                    <strong>
                        Remaining Quantity:
                    </strong>
                    ${food.remainingQuantity}
                </p>

                <p>
                    <strong>
                        Location:
                    </strong>
                    ${food.location}
                </p>

                <p>
                    <strong>
                        Contact:
                    </strong>
                    ${food.donorContact}
                </p>

                ${requestsHTML}

            `;


            container.appendChild(card);

        }
    );

}


/* =====================================================
   DELIVERY STATUS HTML
===================================================== */

function createStatusHTML(
    currentStatus
) {

    let html = `
        <div class="status-tracking">
    `;


    statuses.forEach(
        function(status, index) {

            const activeClass =
                index <= currentStatus
                    ? "active"
                    : "";


            const tick =
                index <= currentStatus
                    ? "✓"
                    : "";


            html += `

                <div
                    class="status-item ${activeClass}">

                    <div class="status-circle">
                        ${tick}
                    </div>

                    <div class="status-label">
                        ${status}
                    </div>

                </div>

            `;

        }
    );


    html += `
        </div>
    `;


    return html;

}


/* =====================================================
   STATUS BUTTONS
===================================================== */

function createStatusButtons(
    foodId,
    requestId,
    currentStatus
) {

    let html = "";


    if (currentStatus < 1) {

        html += `

            <button
                onclick="updateStatus(
                    ${foodId},
                    ${requestId},
                    1
                )">

                Accept Request

            </button>

        `;

    }


    if (
        currentStatus >= 1 &&
        currentStatus < 2
    ) {

        html += `

            <button
                onclick="updateStatus(
                    ${foodId},
                    ${requestId},
                    2
                )">

                Food Packing

            </button>

        `;

    }


    if (
        currentStatus >= 2 &&
        currentStatus < 3
    ) {

        html += `

            <button
                onclick="updateStatus(
                    ${foodId},
                    ${requestId},
                    3
                )">

                Out for Delivery

            </button>

        `;

    }


    if (
        currentStatus >= 3 &&
        currentStatus < 4
    ) {

        html += `

            <button
                onclick="updateStatus(
                    ${foodId},
                    ${requestId},
                    4
                )">

                Mark as Delivered

            </button>

        `;

    }


    return html;

}


/* =====================================================
   UPDATE DELIVERY STATUS
===================================================== */

function updateStatus(
    foodId,
    requestId,
    newStatus
) {

    const food =
        foods.find(
            function(item) {

                return item.id === foodId;

            }
        );


    if (!food) return;


    const request =
        food.requests.find(
            function(item) {

                return item.id === requestId;

            }
        );


    if (!request) return;


    request.status =
        newStatus;


    saveFoods();


    displayFoods();

    showDonorDashboard();

    showReceiverDashboard();


    alert(
        "Delivery status updated to: " +
        statuses[newStatus]
    );

}


/* =====================================================
   RECEIVER DASHBOARD
===================================================== */

function showReceiverDashboard() {

    const receiverName =
        document
            .getElementById("receiverSearchName")
            .value
            .trim()
            .toLowerCase();


    const container =
        document.getElementById(
            "receiverDashboardContainer"
        );


    container.innerHTML = "";


    if (!receiverName) {

        container.innerHTML = `
            <p>
                Please enter your receiver name.
            </p>
        `;

        return;

    }


    const myRequests = [];


    foods.forEach(
        function(food) {

            if (food.requests) {

                food.requests.forEach(
                    function(request) {

                        if (
                            request.name
                                .toLowerCase() ===
                            receiverName
                        ) {

                            myRequests.push({

                                food: food,

                                request: request

                            });

                        }

                    }
                );

            }

        }
    );


    if (
        myRequests.length === 0
    ) {

        container.innerHTML = `

            <p>
                No food requests found
                for this name.
            </p>

        `;

        return;

    }


    myRequests.forEach(
        function(item) {

            const food =
                item.food;

            const request =
                item.request;


            const card =
                document.createElement("div");


            card.className =
                "dashboard-card";


            card.innerHTML = `

                <h2>
                    ${food.foodName}
                </h2>

                <p>
                    <strong>
                        Donor:
                    </strong>
                    ${food.donorName}
                </p>

                <p>
                    <strong>
                        Requested Quantity:
                    </strong>
                    ${request.people}
                </p>

                <p>
                    <strong>
                        Remaining Food:
                    </strong>
                    ${food.remainingQuantity}
                </p>

                <p>
                    <strong>
                        Donor Location:
                    </strong>
                    ${food.location}
                </p>

                <p>
                    <strong>
                        Your Location:
                    </strong>
                    ${request.location}
                </p>

                <p>
                    <strong>
                        Contact:
                    </strong>
                    ${request.contact}
                </p>


                <div class="trust-details">

                    <p>
                        <strong>
                            Verified Trust / NGO:
                        </strong>
                        ${request.trustName || "Not selected"}
                    </p>

                    <p>
                        <strong>
                            Trust Type:
                        </strong>
                        ${request.trustType || "-"}
                    </p>

                    <p>
                        <strong>
                            Trust Address:
                        </strong>
                        ${request.trustLocation || "-"}
                    </p>

                </div>


                <div class="status-container">

                    <div class="status-title">
                        Your Delivery Status
                    </div>

                    ${createStatusHTML(
                        request.status
                    )}

                </div>

            `;


            container.appendChild(card);

        }
    );

}


/* =====================================================
   TRUST / NGO REGISTRATION
   ACTUAL DOCUMENT STORAGE
===================================================== */

document
    .getElementById("trustForm")
    .addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            const name =
                document
                    .getElementById("trustName")
                    .value
                    .trim();


            const registrationNumber =
                document
                    .getElementById(
                        "trustRegistrationNumber"
                    )
                    .value
                    .trim();


            const type =
                document
                    .getElementById("trustType")
                    .value;


            const year =
                document
                    .getElementById("trustYear")
                    .value;


            const address =
                document
                    .getElementById("trustAddress")
                    .value
                    .trim();


            const contactPerson =
                document
                    .getElementById(
                        "trustContactPerson"
                    )
                    .value
                    .trim();


            const contact =
                document
                    .getElementById("trustContact")
                    .value
                    .trim();


            const email =
                document
                    .getElementById("trustEmail")
                    .value
                    .trim();


            const support =
                document
                    .getElementById("trustSupport")
                    .value;


            /* =========================
               GET DOCUMENTS
            ========================= */

            const registrationCertificate =
                document
                    .getElementById(
                        "registrationCertificate"
                    )
                    .files[0];


            const trustIdProof =
                document
                    .getElementById(
                        "trustIdProof"
                    )
                    .files[0];


            const addressProof =
                document
                    .getElementById(
                        "trustAddressProof"
                    )
                    .files[0];


            /* =========================
               VALIDATE DOCUMENTS
            ========================= */

            if (
                !registrationCertificate ||
                !trustIdProof ||
                !addressProof
            ) {

                document
                    .getElementById("trustSuccess")
                    .textContent =
                    "Please upload all required documents.";

                return;

            }


            /* =========================
               VALIDATE CONTACT
            ========================= */

            if (
                !/^[0-9]{10}$/.test(contact)
            ) {

                document
                    .getElementById("trustSuccess")
                    .textContent =
                    "Please enter a valid 10 digit contact number.";

                return;

            }


            /* =========================
               READ FILE
            ========================= */

            function readFile(file) {

                return new Promise(
                    function(resolve, reject) {

                        const reader =
                            new FileReader();


                        reader.onload =
                            function() {

                                resolve({

                                    name:
                                        file.name,

                                    type:
                                        file.type,

                                    data:
                                        reader.result

                                });

                            };


                        reader.onerror =
                            function() {

                                reject(
                                    new Error(
                                        "Unable to read file"
                                    )
                                );

                            };


                        reader.readAsDataURL(file);

                    }
                );

            }


            try {

                const registrationCertificateData =
                    await readFile(
                        registrationCertificate
                    );


                const trustIdProofData =
                    await readFile(
                        trustIdProof
                    );


                const addressProofData =
                    await readFile(
                        addressProof
                    );


                /* =========================
                   CREATE TRUST
                ========================= */

                const newTrust = {

                    id:
                        "TRUST-" +
                        Date.now(),

                    name:
                        name,

                    registrationNumber:
                        registrationNumber,

                    type:
                        type,

                    year:
                        year,

                    address:
                        address,

                    contactPerson:
                        contactPerson,

                    contact:
                        contact,

                    email:
                        email,

                    support:
                        support,

                    documents: {

                        registrationCertificate:
                            registrationCertificateData,

                        trustIdProof:
                            trustIdProofData,

                        addressProof:
                            addressProofData

                    },

                    status:
                        "Pending",

                    submittedAt:
                        new Date().toLocaleString()

                };


                trusts.push(
                    newTrust
                );


                saveTrusts();


                document
                    .getElementById("trustSuccess")
                    .textContent =
                    "Trust submitted successfully. Waiting for admin verification.";


                this.reset();


                displayTrusts();

            }

            catch (error) {

                console.error(error);

                document
                    .getElementById("trustSuccess")
                    .textContent =
                    "Error uploading documents. Please try again.";

            }

        }
    );


/* =====================================================
   DISPLAY VERIFIED TRUSTS
===================================================== */

function displayTrusts() {

    const container =
        document.getElementById(
            "trustContainer"
        );


    if (!container) return;


    container.innerHTML = "";


    trusts =
        JSON.parse(
            localStorage.getItem("foodConnectTrusts")
        ) || [];


    const approvedTrusts =
        trusts.filter(
            function(trust) {

                return trust.status === "Approved";

            }
        );


    if (
        approvedTrusts.length === 0
    ) {

        container.innerHTML = `

            <p>
                No verified Trust / NGO available yet.
            </p>

        `;

        return;

    }


    approvedTrusts.forEach(
        function(trust) {

            const card =
                document.createElement("div");


            card.className =
                "trust-card";


            card.innerHTML = `

                <div class="trust-badge">
                    VERIFIED PARTNER
                </div>

                <h3>
                    ${trust.name}
                </h3>

                <p>
                    <strong>
                        Type:
                    </strong>
                    ${trust.type}
                </p>

                <p>
                    <strong>
                        Registration No:
                    </strong>
                    ${trust.registrationNumber}
                </p>

                <p>
                    <strong>
                        Service:
                    </strong>
                    ${trust.support}
                </p>

                <p>
                    <strong>
                        Address:
                    </strong>
                    ${trust.address}
                </p>

                <p>
                    <strong>
                        Contact:
                    </strong>
                    ${trust.contact}
                </p>

            `;


            container.appendChild(
                card
            );

        }
    );

}


/* =====================================================
   INITIAL DISPLAY
===================================================== */

displayFoods();

displayTrusts();

loadApprovedTrusts();