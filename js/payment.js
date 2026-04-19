// ── SHARED PAYMENT CONFIG ──────────────────────────────
var WEEKS_OPTIONS = '\
  <option value="1">1 Week (7 days)</option>\
  <option value="2">2 Weeks (14 days)</option>\
  <option value="3">3 Weeks (21 days)</option>\
  <option value="4">4 Weeks (28 days)</option>\
  <option value="5">5 Weeks (35 days)</option>\
  <option value="6">6 Weeks (42 days)</option>\
  <option value="7">7 Weeks (49 days)</option>\
  <option value="8">8 Weeks (56 days)</option>\
  <option value="11">Full Season (77 days)</option>';

var PAYTYPE_OPTIONS = '\
  <option value="deposit">50% Deposit</option>\
  <option value="full">Full Payment</option>\
  <option value="balance">Balance Payment</option>';

function calcPayment(dailyRate, weeks, payType) {
  var days = weeks * 7;
  var total = dailyRate * days;
  if (payType === "full") return total;
  return Math.round(total * 0.5);
}

// ── LOCAL PAYMENTS (GHS) ───────────────────────────────
function openPaystackPayment() {
  Swal.fire({
    title: "Pay in GHS",
    html: '\
      <div style="text-align:left;">\
        <div style="margin-bottom:14px;">\
          <label style="color:var(--teal);font-size:.7rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;display:block;margin-bottom:6px;font-family:\'Space Mono\',monospace;">Number of Weeks *</label>\
          <select id="ps-weeks" class="swal2-input" style="padding:10px 14px;width:100%;box-sizing:border-box;">' + WEEKS_OPTIONS + '</select>\
        </div>\
        <div style="margin-bottom:14px;">\
          <label style="color:var(--teal);font-size:.7rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;display:block;margin-bottom:6px;font-family:\'Space Mono\',monospace;">Payment Type *</label>\
          <select id="ps-paytype" class="swal2-input" style="padding:10px 14px;width:100%;box-sizing:border-box;">' + PAYTYPE_OPTIONS + '</select>\
        </div>\
        <div style="background:rgba(108,228,210,0.08);padding:14px 18px;border-radius:12px;border:1px solid rgba(108,228,210,0.15);margin-top:16px;">\
          <p style="margin:0;font-family:\'Bebas Neue\',sans-serif;font-size:.85rem;letter-spacing:.05em;color:var(--text);">Daily Rate: <strong style="color:var(--teal);">GHS 700/day</strong></p>\
          <p style="margin:4px 0 0;font-size:.75rem;color:var(--muted);" id="ps-info">50% deposit \u00b7 Mobile Money, Card or Bank Transfer</p>\
        </div>\
      </div>',
    icon: "info",
    showCancelButton: true,
    confirmButtonColor: "#00A8C8",
    confirmButtonText: "Proceed to Checkout",
    cancelButtonText: "Cancel",
    background: "var(--bg)",
    color: "var(--text2)",
    customClass: { popup: 'swal-popup-custom' },
    didOpen: function() {
      var payEl = document.getElementById("ps-paytype");
      payEl.addEventListener("change", function() {
        var label = this.value === "deposit" ? "50% deposit" : this.value === "balance" ? "Balance (50%)" : "Full payment";
        document.getElementById("ps-info").textContent = label + " \u00b7 Mobile Money, Card or Bank Transfer";
      });
    },
    preConfirm: function() {
      var weeks = parseInt(document.getElementById("ps-weeks").value) || 1;
      var payType = document.getElementById("ps-paytype").value;
      var amount = calcPayment(700, weeks, payType);
      var payLabel = payType === "deposit" ? "50% Deposit" : payType === "balance" ? "Balance" : "Full Payment";
      var desc = "Local Rate, " + weeks + (weeks === 1 ? " week" : " weeks") + ", " + payLabel;
      return { amount: amount, description: desc };
    }
  }).then(function(result) {
    if (result.isConfirmed) {
      payWithPaystack(result.value.amount, "GHS", result.value.description);
    }
  });
}

function payWithPaystack(amount, currency, description) {
  Swal.fire({
    title: "Payment Details",
    html: '\
      <div style="text-align:left;">\
        <div style="margin-bottom:18px;">\
          <label style="color:var(--teal);font-size:.7rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;display:block;margin-bottom:6px;font-family:\'Space Mono\',monospace;">Email Address</label>\
          <input type="email" id="swal-email" class="swal2-input" placeholder="your@email.com">\
        </div>\
        <div style="margin-bottom:18px;">\
          <label style="color:var(--teal);font-size:.7rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;display:block;margin-bottom:6px;font-family:\'Space Mono\',monospace;">Full Name</label>\
          <input type="text" id="swal-name" class="swal2-input" placeholder="John Doe">\
        </div>\
        <div style="background:rgba(0,168,200,0.08);padding:18px 20px;border-radius:14px;border:1px solid rgba(0,168,200,0.15);">\
          <p style="margin:0 0 8px 0;font-family:\'Bebas Neue\',sans-serif;font-size:1rem;letter-spacing:.05em;color:var(--text);">Payment Summary</p>\
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">\
            <span style="font-size:.82rem;color:var(--muted);">Amount</span>\
            <strong style="color:var(--orange);font-size:1.1rem;font-family:\'Bebas Neue\',sans-serif;letter-spacing:.03em;">' + currency + ' ' + amount.toLocaleString() + '</strong>\
          </div>\
          <div style="display:flex;justify-content:space-between;align-items:center;">\
            <span style="font-size:.82rem;color:var(--muted);">Programme</span>\
            <span style="font-size:.8rem;color:var(--text2);">' + description + '</span>\
          </div>\
        </div>\
      </div>',
    icon: "info",
    showCancelButton: true,
    confirmButtonColor: "#00A8C8",
    confirmButtonText: "Pay Now",
    cancelButtonText: "Cancel",
    background: "var(--bg)",
    color: "var(--text2)",
    customClass: { popup: 'swal-popup-custom' },
    preConfirm: function() {
      var email = document.getElementById("swal-email").value;
      var name = document.getElementById("swal-name").value;
      if (!email || !email.includes("@")) { Swal.showValidationMessage("Please enter a valid email"); return false; }
      if (!name.trim()) { Swal.showValidationMessage("Please enter your name"); return false; }
      return { email: email, name: name };
    },
  }).then(function(result) {
    if (result.isConfirmed) {
      var email = result.value.email;
      var name = result.value.name;
      var handler = PaystackPop.setup({
        key: "pk_test_e3e9b8f7ea32e096e2e0c47058096c6c6c6b7052",
        email: email,
        amount: amount * 100,
        currency: currency,
        ref: "SVFA-" + Math.floor(Math.random() * 1000000000 + 1),
        metadata: {
          custom_fields: [
            { display_name: "Customer Name", variable_name: "customer_name", value: name },
            { display_name: "Description", variable_name: "description", value: description }
          ]
        },
        callback: function(response) {
          Swal.fire({
            title: "Payment Successful!",
            html: '<div style="text-align:center;"><p style="font-size:.85rem;color:var(--muted);margin-bottom:12px;">Your spot is secured. We\'ll send a confirmation email shortly.</p><div style="background:rgba(0,168,200,0.08);padding:14px 18px;border-radius:12px;border:1px solid rgba(0,168,200,0.15);display:inline-block;"><span style="font-size:.72rem;color:var(--muted);text-transform:uppercase;letter-spacing:.08em;font-family:\'Space Mono\',monospace;">Reference</span><br><strong style="color:var(--teal);font-family:\'Space Mono\',monospace;font-size:.85rem;">' + response.reference + '</strong></div></div>',
            icon: "success",
            confirmButtonColor: "#00A8C8",
            background: "var(--bg)",
            color: "var(--text)",
            customClass: { popup: 'swal-popup-custom' },
          });
        },
        onClose: function() {
          Swal.fire({
            title: "Need Help?",
            html: '<p style="font-size:.85rem;color:var(--muted);line-height:1.6;">Our team is ready to help you complete your payment.</p>',
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#25D366",
            cancelButtonColor: "#00A8C8",
            confirmButtonText: "WhatsApp Support",
            cancelButtonText: "Email Support",
            background: "var(--bg)",
            color: "var(--text)",
            customClass: { popup: 'swal-popup-custom' },
          }).then(function(r) {
            if (r.isConfirmed) window.open("https://wa.me/233247012493", "_blank");
            else window.location.href = "mailto:info@sacredvisionfootballclub.com";
          });
        }
      });
      handler.openIframe();
    }
  });
}

// ── INTERNATIONAL PAYMENTS, LIVE EXCHANGE RATES ──────
// Fallback rates if API fails
var FX_TO_GHS = { USD: 11.1, GBP: 14.6, EUR: 12.8 };
var fxLastUpdated = "";

function fetchLiveRates() {
  // ExchangeRate-API, free tier, no API key needed for open endpoint
  fetch("https://open.er-api.com/v6/latest/USD")
    .then(function(res) { return res.json(); })
    .then(function(data) {
      if (data && data.result === "success" && data.rates) {
        if (data.rates.GHS) {
          FX_TO_GHS.USD = Math.round(data.rates.GHS * 100) / 100;
        }
        if (data.rates.GHS && data.rates.GBP) {
          FX_TO_GHS.GBP = Math.round((data.rates.GHS / data.rates.GBP) * 100) / 100;
        }
        if (data.rates.GHS && data.rates.EUR) {
          FX_TO_GHS.EUR = Math.round((data.rates.GHS / data.rates.EUR) * 100) / 100;
        }
        var now = new Date();
        fxLastUpdated = now.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) + " " + now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
      }
    })
    .catch(function() { /* use fallback rates */ });
}

// Fetch rates on page load
fetchLiveRates();

function toGHS(amount, currency) {
  return Math.round(amount * (FX_TO_GHS[currency] || 11.1));
}

function fxSymbol(currency) {
  return currency === "GBP" ? "\u00a3" : currency === "EUR" ? "\u20ac" : "$";
}

function openInternationalPayment() {
  Swal.fire({
    title: "International Payment",
    html: '\
      <div style="text-align:left;">\
        <div style="margin-bottom:14px;">\
          <label style="color:var(--orange);font-size:.7rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;display:block;margin-bottom:6px;font-family:\'Space Mono\',monospace;">Number of Weeks *</label>\
          <select id="intl-weeks" class="swal2-input" style="padding:10px 14px;width:100%;box-sizing:border-box;">' + WEEKS_OPTIONS + '</select>\
        </div>\
        <div style="margin-bottom:14px;">\
          <label style="color:var(--orange);font-size:.7rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;display:block;margin-bottom:6px;font-family:\'Space Mono\',monospace;">Payment Type *</label>\
          <select id="intl-paytype" class="swal2-input" style="padding:10px 14px;width:100%;box-sizing:border-box;">' + PAYTYPE_OPTIONS + '</select>\
        </div>\
        <div style="margin-bottom:14px;">\
          <label style="color:var(--orange);font-size:.7rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;display:block;margin-bottom:6px;font-family:\'Space Mono\',monospace;">Currency *</label>\
          <select id="intl-currency" class="swal2-input" style="padding:10px 14px;width:100%;box-sizing:border-box;">\
            <option value="USD">USD ($)</option>\
            <option value="GBP">GBP (\u00a3)</option>\
            <option value="EUR">EUR (\u20ac)</option>\
          </select>\
        </div>\
        <div style="background:rgba(255,165,0,0.08);padding:14px 18px;border-radius:12px;border:1px solid rgba(255,165,0,0.15);margin-top:16px;">\
          <p style="margin:0;font-family:\'Bebas Neue\',sans-serif;font-size:.85rem;letter-spacing:.05em;color:var(--text);">Daily Rate: <strong style="color:var(--orange);" id="intl-daily">$85/day</strong></p>\
          <p style="margin:4px 0 0;font-size:.75rem;color:var(--muted);" id="intl-info">50% deposit</p>\
          <p style="margin:6px 0 0;font-size:.7rem;color:var(--orange);" id="intl-ghs"></p>\
          <p style="margin:4px 0 0;font-size:.6rem;color:var(--muted);opacity:0.7;" id="intl-updated"></p>\
        </div>\
      </div>',
    icon: "info",
    showCancelButton: true,
    confirmButtonColor: "#FFA500",
    confirmButtonText: "Proceed to Checkout",
    cancelButtonText: "Cancel",
    background: "var(--bg)",
    color: "var(--text2)",
    customClass: { popup: 'swal-popup-custom' },
    didOpen: function() {
      var payEl = document.getElementById("intl-paytype");
      var curEl = document.getElementById("intl-currency");
      var weeksEl = document.getElementById("intl-weeks");
      function update() {
        var cur = curEl.value;
        var sym = fxSymbol(cur);
        var weeks = parseInt(weeksEl.value) || 1;
        var payType = payEl.value;
        var amount = calcPayment(85, weeks, payType);
        var ghsAmount = toGHS(amount, cur);
        document.getElementById("intl-daily").textContent = sym + "85/day";
        var label = payType === "deposit" ? "50% deposit" : payType === "balance" ? "Balance (50%)" : "Full payment";
        document.getElementById("intl-info").textContent = label + ", " + sym + amount.toLocaleString() + " " + cur;
        document.getElementById("intl-ghs").textContent = "Charged as GHS " + ghsAmount.toLocaleString() + " (1 " + cur + " \u2248 " + FX_TO_GHS[cur] + " GHS)";
        document.getElementById("intl-updated").textContent = fxLastUpdated ? "Live rate \u00b7 Updated " + fxLastUpdated : "Fallback rate \u00b7 Refreshing\u2026";
      }
      payEl.addEventListener("change", update);
      curEl.addEventListener("change", update);
      weeksEl.addEventListener("change", update);
      // Refresh rates when dialog opens
      fetchLiveRates();
      setTimeout(function() { update(); }, 2000);
      update();
    },
    preConfirm: function() {
      var weeks = parseInt(document.getElementById("intl-weeks").value) || 1;
      var payType = document.getElementById("intl-paytype").value;
      var currency = document.getElementById("intl-currency").value;
      var amount = calcPayment(85, weeks, payType);
      var ghsAmount = toGHS(amount, currency);
      var payLabel = payType === "deposit" ? "50% Deposit" : payType === "balance" ? "Balance" : "Full Payment";
      var desc = "International Rate, " + weeks + (weeks === 1 ? " week" : " weeks") + ", " + payLabel + " (" + fxSymbol(currency) + amount + " " + currency + ")";
      return { ghsAmount: ghsAmount, originalAmount: amount, currency: currency, description: desc };
    }
  }).then(function(result) {
    if (result.isConfirmed) {
      payWithPaystack(result.value.ghsAmount, "GHS", result.value.description);
    }
  });
}

// ── SWEETALERT2 CUSTOM STYLES ──────────────────────────
var style = document.createElement("style");
style.textContent = "\
.swal-popup-custom { border-radius: 20px !important; border: 1px solid var(--border) !important; background: var(--bg) !important; box-shadow: 0 24px 60px rgba(0,0,0,0.5) !important; }\
.swal2-popup { background: var(--bg) !important; border: 1px solid var(--border) !important; border-radius: 20px !important; box-shadow: 0 24px 60px rgba(0,0,0,0.5) !important; }\
.swal2-input { background: var(--input-bg) !important; border: 1px solid var(--border) !important; color: var(--text) !important; border-radius: 12px !important; padding: 12px 14px !important; font-family: 'Outfit', sans-serif !important; font-size: 0.85rem !important; transition: border-color 0.2s !important; }\
select.swal2-input { height: auto !important; padding: 12px 14px !important; line-height: 1.4 !important; overflow: visible !important; text-overflow: ellipsis !important; -webkit-appearance: none !important; appearance: none !important; background-image: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\") !important; background-repeat: no-repeat !important; background-position: right 14px center !important; padding-right: 36px !important; }\
.swal2-input:focus { border-color: var(--teal) !important; box-shadow: 0 0 0 3px rgba(0,168,200,0.15) !important; }\
.swal2-input::placeholder { color: var(--muted) !important; opacity: 0.6 !important; }\
.swal2-title { color: var(--text) !important; font-family: 'Bebas Neue', sans-serif !important; font-size: 1.5rem !important; letter-spacing: 0.05em !important; }\
.swal2-html-container { color: var(--text2) !important; font-family: 'Outfit', sans-serif !important; }\
.swal2-icon { border-color: var(--teal) !important; color: var(--teal) !important; }\
.swal2-icon.swal2-info { border-color: var(--teal) !important; color: var(--teal) !important; }\
.swal2-icon.swal2-success { border-color: #4caf50 !important; }\
.swal2-icon.swal2-success .swal2-success-ring { border-color: rgba(76,175,80,0.3) !important; }\
.swal2-icon.swal2-success [class^=swal2-success-line] { background-color: #4caf50 !important; }\
.swal2-icon.swal2-question { border-color: var(--orange) !important; color: var(--orange) !important; }\
.swal-btn-confirm, .swal2-confirm { border-radius: 100px !important; font-weight: 700 !important; font-size: 0.8rem !important; letter-spacing: 0.08em !important; text-transform: uppercase !important; padding: 12px 28px !important; font-family: 'Outfit', sans-serif !important; transition: transform 0.15s, box-shadow 0.15s !important; }\
.swal-btn-confirm:hover, .swal2-confirm:hover { transform: translateY(-1px) !important; box-shadow: 0 4px 16px rgba(0,168,200,0.3) !important; }\
.swal-btn-cancel, .swal2-cancel { border-radius: 100px !important; font-weight: 600 !important; font-size: 0.8rem !important; letter-spacing: 0.06em !important; text-transform: uppercase !important; padding: 12px 28px !important; font-family: 'Outfit', sans-serif !important; background: transparent !important; border: 1px solid var(--border) !important; color: var(--text2) !important; }\
.swal-btn-cancel:hover, .swal2-cancel:hover { background: rgba(255,255,255,0.05) !important; border-color: var(--muted) !important; }\
.swal2-actions { gap: 12px !important; }\
.swal2-validation-message { background: rgba(211,51,51,0.1) !important; color: #ff6b6b !important; border: none !important; border-radius: 10px !important; font-size: 0.8rem !important; }\
[data-theme='light'] .swal2-popup, [data-theme='light'] .swal-popup-custom { background: #fff !important; border-color: #e0e0e0 !important; box-shadow: 0 24px 60px rgba(0,0,0,0.12) !important; }\
[data-theme='light'] .swal2-input { background: #f5f5f5 !important; border-color: #ddd !important; color: #1a1a1a !important; }";
document.head.appendChild(style);

// ── REGISTRATION FORM MODAL ─────────────────────────
var registerModal = document.getElementById("registerModal");
if (registerModal) {
  registerModal.addEventListener("click", function(e) {
    if (e.target === registerModal) registerModal.classList.remove("active");
  });
  document.getElementById("registerForm").addEventListener("submit", function(e) {
    e.preventDefault();
    var btn = document.getElementById("reg-submit-btn");
    var orig = btn.textContent;
    btn.textContent = "Sending\u2026";
    btn.disabled = true;

    var fname = document.getElementById("reg-fname").value.trim();
    var lname = document.getElementById("reg-lname").value.trim();

    var formData = new FormData();
    formData.append("access_key", "34b15cce-97e2-47df-8ad6-cc13822b374f");
    formData.append("subject", "Camp Registration, " + fname + " " + lname);
    formData.append("from_name", "SVFA Website");
    formData.append("First Name", fname);
    formData.append("Last Name", lname);
    formData.append("Email", document.getElementById("reg-email").value.trim());
    formData.append("Phone", document.getElementById("reg-phone").value.trim());
    formData.append("Date of Birth", document.getElementById("reg-dob").value);
    formData.append("Nationality", document.getElementById("reg-nationality").value.trim());
    formData.append("Playing Position", document.getElementById("reg-position").value);
    formData.append("Number of Weeks", document.getElementById("reg-programme").value);
    formData.append("Preferred Start Date", document.getElementById("reg-start").value);
    formData.append("Rate Type", document.getElementById("reg-rate").value);
    formData.append("Parent/Guardian", document.getElementById("reg-parent").value.trim());
    formData.append("Medical Info", document.getElementById("reg-medical").value.trim());
    formData.append("Additional Info", document.getElementById("reg-extra").value.trim());

    fetch("https://api.web3forms.com/submit", { method: "POST", body: formData })
      .then(function(res) { return res.json(); })
      .then(function(data) {
        btn.textContent = orig;
        btn.disabled = false;
        if (data.success) {
          registerModal.classList.remove("active");
          document.getElementById("registerForm").reset();
          Swal.fire({
            title: "Registration Submitted!",
            html: '<p style="font-size:.85rem;color:var(--muted);line-height:1.6;">Thank you! Our team will contact you within 24 hours to confirm your dates and send payment instructions.</p>',
            icon: "success",
            confirmButtonColor: "#00b894",
            background: "var(--bg)",
            color: "var(--text)",
          });
        } else {
          Swal.fire({ icon: "error", title: "Submission Failed", text: data.message || "Please try again.", background: "var(--bg)", color: "var(--text)" });
        }
      })
      .catch(function() {
        btn.textContent = orig;
        btn.disabled = false;
        Swal.fire({ icon: "error", title: "Network Error", text: "Could not send. Please check your connection.", background: "var(--bg)", color: "var(--text)" });
      });
  });

  if (new URLSearchParams(window.location.search).get("register") === "1") {
    registerModal.classList.add("active");
  }
}

// Inline form was removed, all Register CTAs now open the single modal form (#registerModal).
