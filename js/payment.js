// ── PAYMENT TAB TOGGLE ─────────────────────────────────
function showPayments(type) {
  const depositPayments = document.getElementById("depositPayments");
  const fullPayments = document.getElementById("fullPayments");
  const depositTab = document.getElementById("depositTab");
  const fullTab = document.getElementById("fullTab");

  if (type === "deposit") {
    depositPayments.style.display = "block";
    fullPayments.style.display = "none";
    depositTab.style.background = "var(--teal)";
    depositTab.style.color = "white";
    fullTab.style.background = "transparent";
    fullTab.style.color = "var(--text2)";
  } else {
    depositPayments.style.display = "none";
    fullPayments.style.display = "block";
    fullTab.style.background = "var(--teal)";
    fullTab.style.color = "white";
    depositTab.style.background = "transparent";
    depositTab.style.color = "var(--text2)";
  }
}

// Make sure Deposit is shown by default when page loads
document.addEventListener("DOMContentLoaded", function () {
  showPayments("deposit");
});

// Custom SweetAlert2 styling to match brand
const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
});

function payWithPaystack(amount, currency, description) {
  Swal.fire({
    title: "Payment Details",
    html: `
      <div style="text-align:left;">
        <div style="margin-bottom:18px;">
          <label style="color:var(--teal);font-size:.7rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;display:block;margin-bottom:6px;font-family:'Space Mono',monospace;">Email Address</label>
          <input type="email" id="swal-email" class="swal2-input" placeholder="your@email.com">
        </div>
        <div style="margin-bottom:18px;">
          <label style="color:var(--teal);font-size:.7rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;display:block;margin-bottom:6px;font-family:'Space Mono',monospace;">Full Name</label>
          <input type="text" id="swal-name" class="swal2-input" placeholder="John Doe">
        </div>
        <div style="background:rgba(0,168,200,0.08);padding:18px 20px;border-radius:14px;border:1px solid rgba(0,168,200,0.15);">
          <p style="margin:0 0 8px 0;font-family:'Bebas Neue',sans-serif;font-size:1rem;letter-spacing:.05em;color:var(--text);">Payment Summary</p>
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
            <span style="font-size:.82rem;color:var(--muted);">Amount</span>
            <strong style="color:var(--orange);font-size:1.1rem;font-family:'Bebas Neue',sans-serif;letter-spacing:.03em;">${currency} ${amount.toLocaleString()}</strong>
          </div>
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <span style="font-size:.82rem;color:var(--muted);">Programme</span>
            <span style="font-size:.8rem;color:var(--text2);">${description}</span>
          </div>
        </div>
      </div>
    `,
    icon: "info",
    showCancelButton: true,
    confirmButtonColor: "#00A8C8",
    cancelButtonColor: "#d33",
    confirmButtonText: "Pay Now",
    cancelButtonText: "Cancel",
    background: "var(--bg)",
    color: "var(--text2)",
    customClass: {
      popup: 'swal-popup-custom',
      confirmButton: 'swal-btn-confirm',
      cancelButton: 'swal-btn-cancel',
    },
    preConfirm: () => {
      const email = document.getElementById("swal-email").value;
      const name = document.getElementById("swal-name").value;

      if (!email || !email.includes("@")) {
        Swal.showValidationMessage("Please enter a valid email");
        return false;
      }

      return { email, name };
    },
  }).then((result) => {
    if (result.isConfirmed) {
      const { email, name } = result.value;

      const handler = PaystackPop.setup({
        key: "pk_test_e3e9b8f7ea32e096e2e0c47058096c6c6c6b7052",
        email: email,
        amount: amount * 100,
        currency: currency,
        ref: "SVFA-" + Math.floor(Math.random() * 1000000000 + 1),
        metadata: {
          custom_fields: [
            {
              display_name: "Customer Name",
              variable_name: "customer_name",
              value: name,
            },
            {
              display_name: "Description",
              variable_name: "description",
              value: description,
            },
          ],
        },
        callback: function (response) {
          Swal.fire({
            title: "Payment Successful!",
            html: `<div style="text-align:center;">
                    <p style="font-size:.85rem;color:var(--muted);margin-bottom:12px;">Your spot is secured. We'll send a confirmation email shortly.</p>
                    <div style="background:rgba(0,168,200,0.08);padding:14px 18px;border-radius:12px;border:1px solid rgba(0,168,200,0.15);display:inline-block;">
                      <span style="font-size:.72rem;color:var(--muted);text-transform:uppercase;letter-spacing:.08em;font-family:'Space Mono',monospace;">Reference</span><br>
                      <strong style="color:var(--teal);font-family:'Space Mono',monospace;font-size:.85rem;">${response.reference}</strong>
                    </div>
                  </div>`,
            icon: "success",
            confirmButtonColor: "#00A8C8",
            background: "var(--bg)",
            color: "var(--text)",
            customClass: { popup: 'swal-popup-custom' },
          });
        },
        onClose: function () {
          Swal.fire({
            title: "Need Help?",
            html: '<p style="font-size:.85rem;color:var(--muted);line-height:1.6;">Our team is ready to help you complete your payment. Choose how you\'d like to reach us.</p>',
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#25D366",
            cancelButtonColor: "#00A8C8",
            confirmButtonText: "WhatsApp Support",
            cancelButtonText: "Email Support",
            background: "var(--bg)",
            color: "var(--text)",
            customClass: { popup: 'swal-popup-custom' },
          }).then((result) => {
            if (result.isConfirmed) {
              window.open("https://wa.me/233244997316", "_blank");
            } else {
              window.location.href = "mailto:info@sacredfootballclub.com";
            }
          });
        },
      });
      handler.openIframe();
    }
  });
}

// Add custom styles for SweetAlert2
const style = document.createElement("style");
style.textContent = `
.swal-popup-custom {
  border-radius: 20px !important;
  border: 1px solid var(--border) !important;
  background: var(--bg) !important;
  box-shadow: 0 24px 60px rgba(0,0,0,0.5) !important;
}
.swal2-popup {
  background: var(--bg) !important;
  border: 1px solid var(--border) !important;
  border-radius: 20px !important;
  box-shadow: 0 24px 60px rgba(0,0,0,0.5) !important;
}
.swal2-input {
  background: var(--input-bg) !important;
  border: 1px solid var(--border) !important;
  color: var(--text) !important;
  border-radius: 12px !important;
  padding: 12px 14px !important;
  font-family: 'Outfit', sans-serif !important;
  font-size: 0.85rem !important;
  transition: border-color 0.2s !important;
}
.swal2-input:focus {
  border-color: var(--teal) !important;
  box-shadow: 0 0 0 3px rgba(0,168,200,0.15) !important;
}
.swal2-input::placeholder {
  color: var(--muted) !important;
  opacity: 0.6 !important;
}
.swal2-title {
  color: var(--text) !important;
  font-family: 'Bebas Neue', sans-serif !important;
  font-size: 1.5rem !important;
  letter-spacing: 0.05em !important;
}
.swal2-html-container {
  color: var(--text2) !important;
  font-family: 'Outfit', sans-serif !important;
}
.swal2-icon {
  border-color: var(--teal) !important;
  color: var(--teal) !important;
}
.swal2-icon.swal2-info {
  border-color: var(--teal) !important;
  color: var(--teal) !important;
}
.swal2-icon.swal2-success {
  border-color: #4caf50 !important;
}
.swal2-icon.swal2-success .swal2-success-ring {
  border-color: rgba(76,175,80,0.3) !important;
}
.swal2-icon.swal2-success [class^=swal2-success-line] {
  background-color: #4caf50 !important;
}
.swal2-icon.swal2-question {
  border-color: var(--orange) !important;
  color: var(--orange) !important;
}
.swal-btn-confirm,
.swal2-confirm {
  border-radius: 100px !important;
  font-weight: 700 !important;
  font-size: 0.8rem !important;
  letter-spacing: 0.08em !important;
  text-transform: uppercase !important;
  padding: 12px 28px !important;
  font-family: 'Outfit', sans-serif !important;
  transition: transform 0.15s, box-shadow 0.15s !important;
}
.swal-btn-confirm:hover,
.swal2-confirm:hover {
  transform: translateY(-1px) !important;
  box-shadow: 0 4px 16px rgba(0,168,200,0.3) !important;
}
.swal-btn-cancel,
.swal2-cancel {
  border-radius: 100px !important;
  font-weight: 600 !important;
  font-size: 0.8rem !important;
  letter-spacing: 0.06em !important;
  text-transform: uppercase !important;
  padding: 12px 28px !important;
  font-family: 'Outfit', sans-serif !important;
  background: transparent !important;
  border: 1px solid var(--border) !important;
  color: var(--text2) !important;
}
.swal-btn-cancel:hover,
.swal2-cancel:hover {
  background: rgba(255,255,255,0.05) !important;
  border-color: var(--muted) !important;
}
.swal2-actions {
  gap: 12px !important;
}
.swal2-validation-message {
  background: rgba(211,51,51,0.1) !important;
  color: #ff6b6b !important;
  border: none !important;
  border-radius: 10px !important;
  font-size: 0.8rem !important;
}
[data-theme="light"] .swal2-popup,
[data-theme="light"] .swal-popup-custom {
  background: #fff !important;
  border-color: #e0e0e0 !important;
  box-shadow: 0 24px 60px rgba(0,0,0,0.12) !important;
}
[data-theme="light"] .swal2-input {
  background: #f5f5f5 !important;
  border-color: #ddd !important;
  color: #1a1a1a !important;
}
`;
document.head.appendChild(style);

// ── REGISTRATION FORM MODAL ─────────────────────────
const registerModal = document.getElementById("registerModal");
if (registerModal) {
  registerModal.addEventListener("click", (e) => {
    if (e.target === registerModal) registerModal.classList.remove("active");
  });
  document.getElementById("registerForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const btn = document.getElementById("reg-submit-btn");
    const orig = btn.textContent;
    btn.textContent = "Sending\u2026";
    btn.disabled = true;

    const fname = document.getElementById("reg-fname").value.trim();
    const lname = document.getElementById("reg-lname").value.trim();
    const email = document.getElementById("reg-email").value.trim();
    const phone = document.getElementById("reg-phone").value.trim();
    const dob = document.getElementById("reg-dob").value;
    const nationality = document.getElementById("reg-nationality").value.trim();
    const position = document.getElementById("reg-position").value;
    const programme = document.getElementById("reg-programme").value;
    const startDate = document.getElementById("reg-start").value;
    const rate = document.getElementById("reg-rate").value;
    const parent = document.getElementById("reg-parent").value.trim();
    const medical = document.getElementById("reg-medical").value.trim();
    const extra = document.getElementById("reg-extra").value.trim();

    let msg = "NEW CAMP REGISTRATION \u2014 Sacred Vision FC Summer Camp 2026\n\n";
    msg += "Name: " + fname + " " + lname + "\n";
    msg += "Email: " + email + "\n";
    msg += "Phone: " + phone + "\n";
    msg += "Date of Birth: " + dob + "\n";
    msg += "Nationality: " + nationality + "\n";
    msg += "Position: " + position + "\n";
    msg += "Programme: " + programme + "\n";
    msg += "Start Date: " + startDate + "\n";
    msg += "Rate: " + rate + "\n";
    if (parent) msg += "Parent/Guardian: " + parent + "\n";
    if (medical) msg += "Medical Info: " + medical + "\n";
    if (extra) msg += "Additional Info: " + extra + "\n";

    // Send via email in the background
    const mailtoLink = "mailto:info@sacredfootballclub.com?subject=" +
      encodeURIComponent("New Camp Registration — " + fname + " " + lname) +
      "&body=" + encodeURIComponent(msg);

    setTimeout(function () {
      Swal.fire({
        title: "Registration Submitted!",
        html: '<p style="font-size:.85rem;color:var(--muted);line-height:1.6;">Your registration has been sent via WhatsApp. Our team will contact you within 24 hours to confirm your dates and send your deposit link.</p>',
        icon: "success",
        showCancelButton: true,
        confirmButtonColor: "#25D366",
        cancelButtonColor: "#00A8C8",
        confirmButtonText: "Open WhatsApp",
        cancelButtonText: "Send via Email",
        background: "var(--bg)",
        color: "var(--text)",
        customClass: { popup: 'swal-popup-custom' },
      }).then(function (result) {
        if (result.isConfirmed) {
          window.open("https://wa.me/233244997316?text=" + encodeURIComponent(msg), "_blank");
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          window.location.href = mailtoLink;
        }
      });
      btn.textContent = orig;
      btn.disabled = false;
      registerModal.classList.remove("active");
    }, 600);
  });

  // Auto-open register modal if ?register=1 in URL
  if (new URLSearchParams(window.location.search).get("register") === "1") {
    registerModal.classList.add("active");
  }
}

// ── REGISTRATION INTEREST FORM (inline form) ────────
const regForm = document.getElementById("regForm");
if (regForm) {
  regForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const btn = document.getElementById("regSubmit");
    const orig = btn.textContent;
    btn.textContent = "Sending\u2026";
    btn.disabled = true;
    const fields = this.querySelectorAll(".reg-input");
    let msg = "Hi, I'd like to register for SVFA Summer Camp 2026.\n\n";
    const labels = [
      "Name",
      "Email",
      "Phone",
      "Age",
      "Nationality",
      "Programme",
      "Start Date",
      "Rate",
      "Notes",
    ];
    fields.forEach((f, i) => {
      const val = f.value.trim();
      if (val && val !== "") msg += labels[i] + ": " + val + "\n";
    });
    setTimeout(() => {
      window.open(
        "https://wa.me/233244997316?text=" + encodeURIComponent(msg),
        "_blank",
      );
      btn.textContent = "\u2713 Sent to WhatsApp";
      setTimeout(() => {
        btn.textContent = orig;
        btn.disabled = false;
      }, 3000);
    }, 600);
  });
}
