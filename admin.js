function formatSubmittedDateTime(value) {
  if (!value) return 'Not available';
  const d = new Date(String(value).trim());
  if (!Number.isNaN(d.getTime())) {
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  }
  // Older records that cannot be parsed are shown as-is.
  return String(value).split(',')[0].trim();
}

/* =====================================================
   FOODCONNECT ADMIN
   NGO / TRUST VERIFICATION
===================================================== */


/* =====================================================
   ADMIN ROLE CHECK
===================================================== */

const adminRole =
    sessionStorage.getItem(
        "foodConnectRole"
    );


if (adminRole !== "admin") {

    window.location.href =
        "login.html";

}


/* =====================================================
   GET TRUST DATA
===================================================== */

function getTrustsForAdmin() {

    return JSON.parse(
        localStorage.getItem(
            "foodConnectTrusts"
        )
    ) || [];

}


/* =====================================================
   GET FOOD DATA
===================================================== */

function getFoodsForAdmin() {

    return JSON.parse(
        localStorage.getItem(
            "foodConnectFoods"
        )
    ) || [];

}


/* =====================================================
   LOAD ADMIN DATA
===================================================== */

function loadAdminData() {

    const trusts =
        getTrustsForAdmin();


    const foods =
        getFoodsForAdmin();


    let requestCount = 0;


    foods.forEach(
        function(food) {

            if (
                food.requests &&
                Array.isArray(food.requests)
            ) {

                requestCount +=
                    food.requests.length;

            }

        }
    );


    const donationCount =
        document.getElementById(
            "donationCount"
        );


    const requestCountElement =
        document.getElementById(
            "requestCount"
        );


    const ngoCount =
        document.getElementById(
            "ngoCount"
        );


    const userCount =
        document.getElementById(
            "userCount"
        );


    if (donationCount) {

        donationCount.textContent =
            foods.length;

    }


    if (requestCountElement) {

        requestCountElement.textContent =
            requestCount;

    }


    if (ngoCount) {

        ngoCount.textContent =
            trusts.length;

    }


    if (userCount) {

        userCount.textContent =
            "-";

    }


    loadNGOApplications(
        trusts
    );


    loadFoodRequests(
        foods
    );

}


/* =====================================================
   LOAD NGO APPLICATIONS
===================================================== */

function loadNGOApplications(
    trusts
) {

    let container =
        document.getElementById(
            "ngoApplications"
        );


    /*
       If your admin.html uses
       adminTrustContainer instead,
       use that.
    */

    if (!container) {

        container =
            document.getElementById(
                "adminTrustContainer"
            );

    }


    if (!container) return;


    container.innerHTML = "";


    if (
        trusts.length === 0
    ) {

        container.innerHTML = `

            <div class="no-applications">

                <h3>
                    No NGO / Trust applications found
                </h3>

                <p>
                    New organization registrations
                    will appear here.
                </p>

            </div>

        `;

        return;

    }


    trusts.forEach(
        function(trust) {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "ngo-card admin-trust-card";


            let statusClass =
                "status-pending";


            if (
                trust.status === "Approved"
            ) {

                statusClass =
                    "status-approved";

            }


            if (
                trust.status === "Rejected"
            ) {

                statusClass =
                    "status-rejected";

            }


            let actionButtons = "";


            if (
                trust.status === "Pending"
            ) {

                actionButtons = `

                    <div class="admin-actions">

                        <button
                            class="approve-btn"
                            onclick="
                                approveTrust(
                                    '${trust.id}'
                                )
                            "
                        >

                            ✓ Approve Organization

                        </button>


                        <button
                            class="reject-btn"
                            onclick="
                                rejectTrust(
                                    '${trust.id}'
                                )
                            "
                        >

                            ✕ Reject Organization

                        </button>

                    </div>

                `;

            } else if (trust.status === "Approved") {
                actionButtons = `
                    <div class="approved-message">
                        ✓ This Trust / NGO has been approved and is visible to receivers.
                    </div>
                `;
            } else {
                actionButtons = `
                    <div class="rejected-message" style="background: #ffebee; color: #c62828; padding: 12px 15px; border-radius: 8px; font-size: 13px; font-weight: 600; margin-top: 15px;">
                        ✕ This Trust / NGO has been rejected.
                    </div>
                `;
            }


            card.innerHTML = `

                <div class="admin-trust-top">
                    
                    <div>
                        <h3>
                            ${trust.name}
                        </h3>
                        <div class="application-id">
                            Application ID: ${trust.id || Math.floor(Math.random() * 10000000000)}
                        </div>
                    </div>

                    <span
                        class="
                            status-badge
                            ${statusClass}
                        "
                    >
                        ${trust.status}
                    </span>

                </div>


                <div class="admin-trust-details">


                    <div class="admin-detail">

                        <strong>
                            Registration Number
                        </strong>

                        <span>
                            ${trust.registrationNumber || trust.regNo || ''}
                        </span>

                    </div>


                    <div class="admin-detail">

                        <strong>
                            Type
                        </strong>

                        <span>
                            ${trust.type}
                        </span>

                    </div>


                    <div class="admin-detail">

                        <strong>
                            Registration Year
                        </strong>

                        <span>
                            ${trust.year}
                        </span>

                    </div>


                    <div class="admin-detail">

                        <strong>
                            Contact Person
                        </strong>

                        <span>
                            ${trust.contactPerson}
                        </span>

                    </div>


                    <div class="admin-detail">

                        <strong>
                            Contact
                        </strong>

                        <span>
                            ${trust.contact}
                        </span>

                    </div>


                    <div class="admin-detail">

                        <strong>
                            Email
                        </strong>

                        <span>
                            ${trust.email}
                        </span>

                    </div>


                    <div class="admin-detail">

                        <strong>
                            Area of Service
                        </strong>

                        <span>
                            ${trust.support || trust.service || trust.areaOfService || "Not specified"}
                        </span>

                    </div>


                    <div class="admin-detail">

                        <strong>
                            Submitted
                        </strong>

                        <span>
                            ${formatSubmittedDateTime(trust.submittedAt)}
                        </span>

                    </div>


                    <div
                        class="admin-detail"
                        style="
                            grid-column: 1 / -1;
                        "
                    >

                        <strong>
                            Official Address
                        </strong>

                        <span>
                            ${trust.address}
                        </span>

                    </div>


                </div>


                <!-- =========================
                     DOCUMENTS
                ========================== -->

                <div class="admin-documents">

                    <h4>
                        Submitted Documents
                    </h4>


                    ${createDocumentHTML(
                        trust,
                        "registrationCertificate",
                        "Registration Certificate"
                    )}


                    ${createDocumentHTML(
                        trust,
                        "trustIdProof",
                        "Trust / NGO ID Proof"
                    )}


                    ${createDocumentHTML(
                        trust,
                        "addressProof",
                        "Address Proof"
                    )}

                </div>


                ${actionButtons}

            `;


            container.appendChild(
                card
            );

        }
    );

}


/* =====================================================
   CREATE DOCUMENT HTML
===================================================== */

function createDocumentHTML(
    trust,
    documentType,
    documentTitle
) {

    const documentData =
        trust.documents &&
        trust.documents[documentType];


    if (
        !documentData
    ) {

        return `

            <div class="document-item">

                <span class="document-name">
                    ${documentTitle} - Not uploaded
                </span>

            </div>

        `;

    }


    return `

        <div class="document-item">


            <span class="document-name">
                ${documentTitle} - ${documentData.name}
            </span>


            <button
                class="view-document-btn"
                onclick="
                    viewDocument(
                        '${trust.id}',
                        '${documentType}'
                    )
                "
            >

                View

            </button>

        </div>

    `;

}


/* =====================================================
   VIEW DOCUMENT
===================================================== */

async function viewDocument(trustId, documentType) {
  const trusts = getTrustsForAdmin();
  const trust = trusts.find(item => String(item.id) === String(trustId));
  if (!trust) { alert('Organization information not found.'); return; }

  const documentData = trust.documents && trust.documents[documentType];
  if (!documentData) { alert('Document not available.'); return; }

  const titleMap = {
    registrationCertificate: 'Registration Certificate',
    trustIdProof: 'Organization ID Proof',
    addressProof: 'Address Proof'
  };
  const title = titleMap[documentType] || 'Organization Document';

  // Create the viewer immediately in the current admin page. This avoids
  // Chrome popup blocking and works reliably when the project is opened via file://.
  let modal = document.getElementById('fc-document-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'fc-document-modal';
    modal.innerHTML = `
      <div class="fc-doc-backdrop"></div>
      <div class="fc-doc-dialog" role="dialog" aria-modal="true" aria-label="Document viewer">
        <div class="fc-doc-toolbar">
          <strong id="fc-doc-title"></strong>
          <button type="button" id="fc-doc-close" class="fc-doc-close">Close</button>
        </div>
        <div id="fc-doc-body" class="fc-doc-body"></div>
      </div>`;
    document.body.appendChild(modal);
    modal.querySelector('.fc-doc-backdrop').addEventListener('click', closeDocumentViewer);
    modal.querySelector('#fc-doc-close').addEventListener('click', closeDocumentViewer);
  }

  modal.style.display = 'flex';
  modal.querySelector('#fc-doc-title').textContent = title + ' — ' + (documentData.name || 'PDF');
  const body = modal.querySelector('#fc-doc-body');
  body.innerHTML = '<div style="padding:40px;text-align:center;font-family:Arial,sans-serif">Loading document...</div>';

  try {
    let url = '';

    // Current records: PDF Blob stored in IndexedDB.
    if (documentData.dbKey && typeof getOrganizationDocument === 'function') {
      const stored = await getOrganizationDocument(documentData.dbKey);
      if (stored && stored.blob) {
        url = URL.createObjectURL(stored.blob);
      }
    }

    // Backward compatibility for any older record that stored a data URL.
    if (!url && documentData.data && String(documentData.data).startsWith('data:')) {
      url = documentData.data;
    }

    if (!url) {
      body.innerHTML = `
        <div style="padding:40px;text-align:center;font-family:Arial,sans-serif">
          <h3 style="margin-bottom:10px">Document could not be loaded</h3>
          <p style="color:#666">The file is listed for this organization, but its stored PDF data is unavailable in this browser.</p>
          <p style="color:#666">Please register the organization again from this same project folder and upload the PDF files.</p>
        </div>`;
      return;
    }

    body.innerHTML = `
      <iframe src="${url}" title="${escapeHtmlForAdmin(title)}" style="width:100%;height:100%;border:0;background:#fff"></iframe>
      <div style="position:absolute;right:20px;bottom:18px;z-index:3">
        <a href="${url}" target="_blank" rel="noopener" class="fc-doc-open-link">Open PDF in new tab</a>
      </div>`;

    const iframe = body.querySelector('iframe');
    iframe.addEventListener('load', () => {
      modal.dataset.objectUrl = url;
    }, { once: true });
  } catch (error) {
    console.error('Document preview failed:', error);
    body.innerHTML = '<div style="padding:40px;text-align:center;font-family:Arial,sans-serif"><h3>Unable to open this PDF</h3><p>Please try again or re-register the organization.</p></div>';
  }
}

function escapeHtmlForAdmin(value) {
  return String(value || '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
}

function closeDocumentViewer() {
  const modal = document.getElementById('fc-document-modal');
  if (!modal) return;
  const url = modal.dataset.objectUrl;
  if (url && url.startsWith('blob:')) URL.revokeObjectURL(url);
  modal.dataset.objectUrl = '';
  modal.style.display = 'none';
  const body = modal.querySelector('#fc-doc-body');
  if (body) body.innerHTML = '';
}

/* =====================================================
   APPROVE TRUST
===================================================== */

function approveTrust(
    trustId
) {

    const trusts =
        getTrustsForAdmin();


    const trust =
        trusts.find(
            function(item) {

                return item.id === trustId;

            }
        );


    if (!trust) {

        return;

    }


    const confirmation =
        confirm(
            "Are you sure you want to approve " +
            trust.name +
            "?"
        );


    if (!confirmation) {

        return;

    }


    trust.status =
        "Approved";


    trust.verifiedAt =
        new Date().toLocaleString();


    localStorage.setItem(
        "foodConnectTrusts",
        JSON.stringify(trusts)
    );


    alert(
        trust.name +
        " has been approved successfully."
    );


    loadAdminData();

}


/* =====================================================
   REJECT TRUST
===================================================== */

function rejectTrust(
    trustId
) {

    const trusts =
        getTrustsForAdmin();


    const trust =
        trusts.find(
            function(item) {

                return item.id === trustId;

            }
        );


    if (!trust) {

        return;

    }


    const confirmation =
        confirm(
            "Are you sure you want to reject " +
            trust.name +
            "?"
        );


    if (!confirmation) {

        return;

    }


    trust.status =
        "Rejected";


    trust.rejectedAt =
        new Date().toLocaleString();


    localStorage.setItem(
        "foodConnectTrusts",
        JSON.stringify(trusts)
    );


    alert(
        trust.name +
        " has been rejected."
    );


    loadAdminData();

}


/* =====================================================
   LOAD FOOD REQUESTS
===================================================== */

function loadFoodRequests(
    foods
) {

    const container =
        document.getElementById(
            "adminFoodRequestContainer"
        );


    if (!container) {

        return;

    }


    container.innerHTML = "";


    let hasRequests = false;


    foods.forEach(
        function(food) {

            if (
                !food.requests ||
                food.requests.length === 0
            ) {

                return;

            }


            food.requests.forEach(
                function(request) {

                    hasRequests = true;


                    const card =
                        document.createElement(
                            "div"
                        );


                    card.className =
                        "admin-trust-card";


                    const statusText =
                        request.status === 0
                            ? "Pending"
                            : statusesForAdmin[
                                request.status
                            ];


                    let buttons = "";


                    if (
                        request.status === 0
                    ) {

                        buttons = `

                            <div class="admin-actions">

                                <button
                                    class="approve-btn"
                                    onclick="
                                        acceptFoodRequest(
                                            ${food.id},
                                            ${request.id}
                                        )
                                    "
                                >

                                    Accept Request

                                </button>


                                <button
                                    class="reject-btn"
                                    onclick="
                                        rejectFoodRequest(
                                            ${food.id},
                                            ${request.id}
                                        )
                                    "
                                >

                                    Reject Request

                                </button>

                            </div>

                        `;

                    }


                    card.innerHTML = `

                        <h3>
                            ${food.foodName}
                        </h3>


                        <p>
                            <strong>
                                Donor:
                            </strong>
                            ${food.donorName}
                        </p>


                        <p>
                            <strong>
                                Receiver:
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
                                Receiver Location:
                            </strong>
                            ${request.location}
                        </p>


                        <p>
                            <strong>
                                Contact:
                            </strong>
                            ${request.contact}
                        </p>


                        <p>
                            <strong>
                                Trust / NGO:
                            </strong>
                            ${request.trustName || "-"}
                        </p>


                        <p>
                            <strong>
                                Status:
                            </strong>
                            ${statusText}
                        </p>


                        ${buttons}

                    `;


                    container.appendChild(
                        card
                    );

                }
            );

        }
    );


    if (!hasRequests) {

        container.innerHTML = `

            <p>
                No food requests available.
            </p>

        `;

    }

}


/* =====================================================
   FOOD REQUEST STATUS
===================================================== */

const statusesForAdmin = [

    "Pending",

    "Request Accepted",

    "Food Packing",

    "Out for Delivery",

    "Delivered"

];


/* =====================================================
   ACCEPT FOOD REQUEST
===================================================== */

function acceptFoodRequest(
    foodId,
    requestId
) {

    const foods =
        getFoodsForAdmin();


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


    const confirmation =
        confirm(
            "Accept this food request?"
        );


    if (!confirmation) {

        return;

    }


    request.status =
        1;


    localStorage.setItem(
        "foodConnectFoods",
        JSON.stringify(foods)
    );


    alert(
        "Food request accepted successfully."
    );


    loadAdminData();

}


/* =====================================================
   REJECT FOOD REQUEST
===================================================== */

function rejectFoodRequest(
    foodId,
    requestId
) {

    const foods =
        getFoodsForAdmin();


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


    const confirmation =
        confirm(
            "Reject this food request?"
        );


    if (!confirmation) {

        return;

    }


    /*
       For this frontend demo,
       rejected requests use status -1.
    */

    request.status =
        -1;


    localStorage.setItem(
        "foodConnectFoods",
        JSON.stringify(foods)
    );


    alert(
        "Food request rejected."
    );


    loadAdminData();

}


/* =====================================================
   LOGOUT
===================================================== */

function logout() {

    sessionStorage.removeItem(
        "foodConnectRole"
    );


    window.location.href =
        "login.html";

}


/* =====================================================
   INITIAL LOAD
===================================================== */

loadAdminData();