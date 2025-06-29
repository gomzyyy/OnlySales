// // utils/generateBalanceSheetHTML.ts
// import {
//   Asset,
//   Liability,
//   Owner,
// } from "../../../types";

// export interface BalanceSheetHTMLProps {
//   year: number;
//   owner: Owner;
//   assets: Asset[];
//   liabilities: Liability[];
// }

// // ──────────────────────────────────────────────────────────────
// export const generateBalanceSheetHTML = ({
//   year,
//   owner,
//   assets,
//   liabilities,
// }: BalanceSheetHTMLProps) => {
//   /* ───── helpers ───── */
//   const inr = (n: number) =>
//     "₹" + n.toLocaleString("en-IN", { minimumFractionDigits: 2 });

//   const groupBy = <T extends { category: string }>(
//     list: T[],
//   ): Record<string, T[]> =>
//     list.reduce((acc, item) => {
//       acc[item.category] = acc[item.category] || [];
//       acc[item.category].push(item);
//       return acc;
//     }, {} as Record<string, T[]>);

//   /* ───── numbers for totals ───── */
//   const assetGroups = groupBy(assets);
//   const liabilityGroups = groupBy(liabilities);

//   const totalAssets = assets.reduce(
//     (sum, a) => sum + (a.currentValue ?? a.value),
//     0,
//   );
//   const totalLiabilities = liabilities.reduce(
//     (sum, l) => sum + (l.remainingBalance ?? l.amount),
//     0,
//   );
//   const ownerEquity = owner.equity ?? 0;

//   /* ───── HTML builders ───── */
//   const assetRows = (rows: Asset[]) =>
//     rows
//       .map(
//         (a, idx) => `
//         <tr>
//           <td>${idx + 1}</td>
//           <td>${a.name}</td>
//           <td>${a.assetType}</td>
//           <td>${a.tangible ? "Tangible" : "Intangible"}</td>
//           <td>${inr(a.currentValue ?? a.value)}</td>
//           <td>${a.status ?? "--"}</td>
//         </tr>`,
//       )
//       .join("");

//   const liabilityRows = (rows: Liability[]) =>
//     rows
//       .map(
//         (l, idx) => `
//         <tr>
//           <td>${idx + 1}</td>
//           <td>${l.name}</td>
//           <td>${l.type}</td>
//           <td>${l.dueDate ? new Date(l.dueDate).toLocaleDateString() : "--"}</td>
//           <td>${inr(l.remainingBalance ?? l.amount)}</td>
//           <td>${l.status ?? "--"}</td>
//         </tr>`,
//       )
//       .join("");

//   const assetSection = Object.keys(assetGroups)
//     .map(
//       (cat) => `
//       <tr class="subhead"><td colspan="6">Assets – ${cat}</td></tr>
//       ${assetRows(assetGroups[cat])}`,
//     )
//     .join("");

//   const liabilitySection = Object.keys(liabilityGroups)
//     .map(
//       (cat) => `
//       <tr class="subhead"><td colspan="6">Liabilities – ${cat}</td></tr>
//       ${liabilityRows(liabilityGroups[cat])}`,
//     )
//     .join("");

//   /* ───── final html ───── */
//   return `
//   <html>
//     <head>
//       <style>
//         body   { font-family: "Segoe UI", Tahoma, Verdana, sans-serif; padding:30px; color:#333; }
//         h1     { margin:0; font-size:28px; text-align:center; }
//         h2     { margin-top:4px; font-size:15px; text-align:center; color:#666; }
//         table  { width:100%; border-collapse:collapse; margin-top:24px; }
//         th,td  { border:1px solid #ccc; padding:8px 10px; font-size:13px; text-align:left; }
//         th     { background:#f9f9f9; }
//         .subhead td { background:#f1f1f1; font-weight:bold; }
//         .total-row td { background:#fcfcfc; font-weight:bold; }
//         .note  { margin-top:28px; font-size:12px; color:#555; }
//       </style>
//     </head>
//     <body>
//       <h1>Balance Sheet</h1>
//       <h2>As at 31 March ${year}</h2>

//       <p><strong>Business:</strong> ${owner.businessName}</p>
//       <p><strong>Address:</strong> ${owner.businessAddress ?? "--"}</p>
//       <p><strong>Prepared By:</strong> ${owner.name}</p>

//       <table>
//         <thead>
//           <tr>
//             <th>#</th><th>Description</th><th>Type</th><th>Class</th><th>Amount (INR)</th><th>Status</th>
//           </tr>
//         </thead>
//         <tbody>
//           ${assetSection}
//           <tr class="total-row"><td colspan="4">Total Assets</td><td colspan="2">${inr(
//             totalAssets,
//           )}</td></tr>

//           ${liabilitySection}
//           <tr class="total-row"><td colspan="4">Total Liabilities</td><td colspan="2">${inr(
//             totalLiabilities,
//           )}</td></tr>

//           <tr class="subhead"><td colspan="6">Owner's Equity</td></tr>
//           <tr><td>–</td><td colspan="3">Capital &amp; Reserves</td><td colspan="2">${inr(
//             ownerEquity,
//           )}</td></tr>

//           <tr class="total-row"><td colspan="4">Liabilities + Equity</td><td colspan="2">${inr(
//             totalLiabilities + ownerEquity,
//           )}</td></tr>
//         </tbody>
//       </table>

//       <p class="note">
//         Figures are accrual‑based and expressed in Indian Rupees.
//         Depreciation and appreciation have been factored into
//         <em>Current Value</em> where provided.
//       </p>
//     </body>
//   </html>`;
// };
