/* Sample membership settings. Confirm plans, service rate, and shifts before launch. */
const MEMBERSHIP = {
  currency: "USD",
  hourlyCredit: 15,
  studioMinutesPerServiceHour: 60,
  plans: [
    { id: "open-studio", name: "Open Studio", price: 80, description: "A steady place to work on your own projects.", features: ["Shared studio access", "Community kiln firings", "Member gatherings"] },
    { id: "studio-plus", name: "Studio Plus", price: 140, description: "More time and support for a growing practice.", features: ["Extended studio access", "Community kiln firings", "Monthly technique session"] },
  ],
  shifts: [
    { id: "kiln-care", name: "Kiln care", hours: 2, description: "Help prepare shelves and keep the kiln area tidy." },
    { id: "glaze-library", name: "Glaze library", hours: 2, description: "Organize glaze tests and refresh sample labels." },
    { id: "studio-reset", name: "Studio reset", hours: 3, description: "Reset shared tools and worktables for the week ahead." },
  ],
};
const MEMBERSHIP_STORAGE_KEY = "hearth-clay-memberships-demo-v1";
