(() => {
const STORAGE_KEY = MEMBERSHIP_STORAGE_KEY;
const $ = selector => document.querySelector(selector);
const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
const money = amount => new Intl.NumberFormat("en-US", { style: "currency", currency: MEMBERSHIP.currency, minimumFractionDigits: Number.isInteger(amount) ? 0 : 2, maximumFractionDigits: 2 }).format(amount);
const validShiftIds = new Set(MEMBERSHIP.shifts.map(shift => shift.id));
const validPlanIds = new Set(MEMBERSHIP.plans.map(plan => plan.id));
function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    return {
      name: typeof saved.name === "string" ? saved.name.slice(0, 80) : "",
      email: typeof saved.email === "string" ? saved.email.slice(0, 254) : "",
      shifts: saved.shifts && typeof saved.shifts === "object" ? Object.fromEntries(Object.entries(saved.shifts).filter(([id, status]) => validShiftIds.has(id) && ["scheduled", "recorded"].includes(status))) : {},
      plan: validPlanIds.has(saved.plan) ? saved.plan : MEMBERSHIP.plans[0].id,
      applyHours: saved.applyHours === true,
    };
  } catch { return { name: "", email: "", shifts: {}, plan: MEMBERSHIP.plans[0].id, applyHours: false }; }
}
let state = loadState();
function saveState() { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* storage unavailable */ } }
function recordedHours() { return MEMBERSHIP.shifts.reduce((total, shift) => total + (state.shifts[shift.id] === "recorded" ? shift.hours : 0), 0); }
function studioTime(hours) {
  const minutes = hours * MEMBERSHIP.studioMinutesPerServiceHour;
  if (minutes % 60 === 0) return `${minutes / 60} ${minutes === 60 ? "hour" : "hours"}`;
  return `${Number((minutes / 60).toFixed(2))} hours`;
}
function renderConversions() {
  $("#conversionRule").textContent = `Sample exchange: 1 service hour = ${money(MEMBERSHIP.hourlyCredit)} in dues credit OR ${studioTime(1)} of extra studio time.`;
  $("#conversionExamples").innerHTML = [1, 2, 4].map(hours => `<tr><th scope="row">${hours} ${hours === 1 ? "hour" : "hours"}</th><td>${money(hours * MEMBERSHIP.hourlyCredit)}</td><td>${studioTime(hours)}</td></tr>`).join("");
}
function renderPlans() {
  $("#planGrid").innerHTML = MEMBERSHIP.plans.map((plan, index) => `<article class="plan-card${index === 1 ? " plan-featured" : ""}">
    <p class="eyebrow">${index === 1 ? "Extended access" : "Essential access"}</p>
    <h3>${escapeHtml(plan.name)}</h3><p>${escapeHtml(plan.description)}</p>
    <p class="plan-price">${money(plan.price)} <span>/ month</span></p>
    <ul>${plan.features.map(feature => `<li>${escapeHtml(feature)}</li>`).join("")}</ul>
    <button class="btn ${index === 1 ? "btn-primary" : "btn-ghost"}" type="button" data-plan="${plan.id}">Choose ${escapeHtml(plan.name)}</button>
  </article>`).join("");
  $("#checkoutPlan").innerHTML = MEMBERSHIP.plans.map(plan => `<option value="${plan.id}">${escapeHtml(plan.name)} — ${money(plan.price)}/month</option>`).join("");
}
function renderMember() {
  $("#memberName").value = state.name;
  $("#memberEmail").value = state.email;
  $("#memberGreeting").textContent = state.name ? `${state.name}'s hours` : "Your hours";
  const hours = recordedHours();
  $("#earnedHours").textContent = hours;
  $("#hoursValue").textContent = money(hours * MEMBERSHIP.hourlyCredit);
  $("#studioHoursValue").textContent = studioTime(hours);
  const scheduled = MEMBERSHIP.shifts.filter(shift => state.shifts[shift.id] === "scheduled");
  $("#scheduledSummary").textContent = scheduled.length ? `${scheduled.length} service ${scheduled.length === 1 ? "shift" : "shifts"} signed up · ${scheduled.reduce((total, shift) => total + shift.hours, 0)} upcoming hours` : "No shifts signed up yet.";
}
function renderShifts() {
  $("#shiftGrid").innerHTML = MEMBERSHIP.shifts.map(shift => {
    const status = state.shifts[shift.id];
    const action = status === "recorded" ? `<span class="shift-done">Hours recorded</span>` : status === "scheduled" ? `<button class="btn btn-ghost" type="button" data-record="${shift.id}">Record completed shift</button><button class="link-btn" type="button" data-cancel="${shift.id}">Cancel signup</button>` : `<button class="btn btn-ghost" type="button" data-signup="${shift.id}">Sign up for ${shift.hours} hours</button>`;
    return `<article class="shift-card"><div class="shift-icon" aria-hidden="true">✳</div><div><p class="eyebrow">${shift.hours} service hours</p><h3>${escapeHtml(shift.name)}</h3><p>${escapeHtml(shift.description)}</p><div class="shift-actions">${action}</div></div></article>`;
  }).join("");
}
function renderCheckout() {
  $("#checkoutPlan").value = state.plan;
  $("#applyHours").checked = state.applyHours;
  $("#hourlyRate").textContent = money(MEMBERSHIP.hourlyCredit);
  const { plan, credit, hours } = checkoutEstimate();
  $("#planPrice").textContent = money(plan.price);
  $("#creditApplied").textContent = `−${money(credit)}`;
  $("#amountDue").textContent = money(plan.price - credit);
  $("#hoursUsed").textContent = `${Number((credit / MEMBERSHIP.hourlyCredit).toFixed(2))} of ${hours} recorded hours used in this estimate`;
  $("#checkoutPreview").hidden = true;
}
function checkoutEstimate() {
  const plan = MEMBERSHIP.plans.find(item => item.id === state.plan);
  const hours = recordedHours();
  const credit = state.applyHours ? Math.min(plan.price, hours * MEMBERSHIP.hourlyCredit) : 0;
  return { plan, hours, credit };
}
function render() { renderMember(); renderShifts(); renderCheckout(); saveState(); document.dispatchEvent(new Event("membership:updated")); }
$("#memberForm").addEventListener("submit", event => {
  event.preventDefault();
  if (!event.currentTarget.reportValidity()) return;
  state.name = $("#memberName").value.trim().slice(0, 80);
  state.email = $("#memberEmail").value.trim().slice(0, 254);
  if (!state.name || !state.email) return;
  $("#memberMessage").textContent = "Profile saved in this browser.";
  render();
});
$("#planGrid").addEventListener("click", event => {
  const button = event.target.closest("[data-plan]");
  if (!button) return;
  state.plan = button.dataset.plan;
  renderCheckout(); saveState();
  $("#membership-checkout").scrollIntoView({ behavior: "smooth" });
  $("#checkoutPlan").focus({ preventScroll: true });
});
$("#shiftGrid").addEventListener("click", event => {
  const button = event.target.closest("[data-signup], [data-record], [data-cancel]");
  if (!button) return;
  const id = button.dataset.signup || button.dataset.record || button.dataset.cancel;
  if (!validShiftIds.has(id)) return;
  if (!state.name || !state.email) {
    $("#shiftMessage").textContent = "Save your member profile before signing up for a shift.";
    $("#memberName").focus();
    return;
  }
  if (button.dataset.signup && !state.shifts[id]) { state.shifts[id] = "scheduled"; $("#shiftMessage").textContent = "Shift signup saved in this browser."; }
  if (button.dataset.record && state.shifts[id] === "scheduled") { state.shifts[id] = "recorded"; $("#shiftMessage").textContent = "Completed hours recorded for this preview. Studio approval is required in a live service."; }
  if (button.dataset.cancel && state.shifts[id] === "scheduled") { delete state.shifts[id]; $("#shiftMessage").textContent = "Shift signup canceled."; }
  render();
});
$("#checkoutPlan").addEventListener("change", event => { state.plan = event.target.value; renderCheckout(); saveState(); });
$("#applyHours").addEventListener("change", event => { state.applyHours = event.target.checked; renderCheckout(); saveState(); });
$("#checkoutMembership").addEventListener("click", () => {
  const { plan, hours, credit } = checkoutEstimate();
  const used = credit / MEMBERSHIP.hourlyCredit;
  const remaining = Math.max(0, hours - used);
  $("#previewSummary").textContent = `${plan.name}: ${money(plan.price)} − ${money(credit)} service credit = ${money(plan.price - credit)} due.`;
  $("#previewBalance").textContent = `${Number(used.toFixed(2))} hours applied; ${Number(remaining.toFixed(2))} hours remain available in this example.`;
  $("#checkoutMessage").textContent = credit ? "Sample credit applied below." : hours ? "Select “Apply available service hours” to see the credit in this sample checkout." : "Record a completed service shift above to try a checkout with credit.";
  $("#checkoutPreview").hidden = false;
});
renderPlans();
renderConversions();
render();

})();
