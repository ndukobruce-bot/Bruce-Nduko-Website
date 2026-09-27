// Maps a project slug to the code-snippets.ts filename shown on its case
// study page — picked for thematic fit (Allama's SMS parser, the billing
// engine's invoice route, this site's own status checker), not a claim
// that this is literal code from that repo.
export const projectCodeFilename: Record<string, string> = {
  allama: "mpesa_parser.py",
  studysphere: "rank_matches.py",
  leveragex: "passport_summary.py",
  ledger: "worker_pool.rs",
  hali: "rank_matches.py",
  "a-inya": "verified_jobs_by_month.sql",
  "tija-billing-engine": "invoices.ts",
  "tijalabs-site": "status-check.ts",
};
