// workers/src/counties.js
// Canonical list of 67 PA counties. Must match js/counties.js exactly.
export const PA_COUNTIES = [
  "Adams", "Allegheny", "Armstrong", "Beaver", "Bedford",
  "Berks", "Blair", "Bradford", "Bucks", "Butler",
  "Cambria", "Cameron", "Carbon", "Centre", "Chester",
  "Clarion", "Clearfield", "Clinton", "Columbia", "Crawford",
  "Cumberland", "Dauphin", "Delaware", "Elk", "Erie",
  "Fayette", "Forest", "Franklin", "Fulton", "Greene",
  "Huntingdon", "Indiana", "Jefferson", "Juniata", "Lackawanna",
  "Lancaster", "Lawrence", "Lebanon", "Lehigh", "Luzerne",
  "Lycoming", "McKean", "Mercer", "Mifflin", "Monroe",
  "Montgomery", "Montour", "Northampton", "Northumberland", "Perry",
  "Philadelphia", "Pike", "Potter", "Schuylkill", "Snyder",
  "Somerset", "Sullivan", "Susquehanna", "Tioga", "Union",
  "Venango", "Warren", "Washington", "Wayne", "Westmoreland",
  "Wyoming", "York"
];

export const PA_COUNTIES_SET = new Set(PA_COUNTIES);
