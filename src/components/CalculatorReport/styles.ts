import styled, { createGlobalStyle } from 'styled-components'

export const PrintStyles = createGlobalStyle`
  @media print {
    @page { size: A4 portrait; margin: 14mm 16mm; }
    html, body, #root { background: #fff; color: #172b28; color-scheme: light; }
    body { margin: 0; min-height: 0; min-width: 0; }
    #root { display: block; width: 100%; min-height: 0; margin: 0; border: 0; }
  }
`

export const Report = styled.article`
  display: none;

  @media print {
    display: block;
    width: 100%;
    color: #172b28;
    background: #fff;
    font: 10pt/1.4 Arial, sans-serif;
    text-align: left;
    overflow-wrap: anywhere;
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;

    *, *::before, *::after { box-sizing: border-box; }
    h1, h2, p, dt, dd, th, td, span, strong { color: inherit; margin: 0; }
    header { display: flex; align-items: center; justify-content: space-between; gap: 8mm; border-bottom: 1.5pt solid #23765d; padding-bottom: 2mm; margin-bottom: 3mm; }
    .brand { display: flex; align-items: center; gap: 1mm; }
    .brand img { width: 14mm; height: 12mm; object-fit: contain; }
    .brand span { font-size: 24pt; letter-spacing: -1pt; }
    .document-label { max-width: 65mm; font-size: 9pt; color: #425d55; text-align: right; }
    h1, h2 { font-family: Arial, sans-serif; letter-spacing: normal; }
    h1 { font-size: 22pt; line-height: 1.15; margin-bottom: 2mm; }
    .intro { color: #425d55; margin-bottom: 3mm; }
    .issued-at { font-size: 8.5pt; color: #425d55; margin-bottom: 1mm; }
    .author { margin-bottom: 3mm; }
    h2 { font-size: 10pt; margin-bottom: 2mm; }
    section { break-inside: avoid; }
    dl { display: grid; gap: 4mm; margin: 0; }
    dt { font-size: 8.5pt; color: #425d55; margin-bottom: 1mm; }
    dd { font-size: 11pt; font-weight: 700; font-variant-numeric: tabular-nums; }
    .parameters { padding: 2mm 4mm; border: 0.6pt solid #becdc7; border-radius: 2mm; margin-bottom: 4mm; }
    .parameters dl { grid-template-columns: 1.5fr 1fr 1fr; }
    .results { margin-bottom: 3mm; }
    .total { border-left: 3pt solid #23765d; padding: 3mm 4mm; background: #edf5f0; margin-bottom: 3mm; }
    .total span { display: block; font-size: 9pt; margin-bottom: 1mm; }
    .total strong { display: block; font-size: 25pt; line-height: 1.15; font-variant-numeric: tabular-nums; }
    .results dl { grid-template-columns: 1fr 1fr; padding: 0 4mm; }
    table { width: 100%; border-collapse: collapse; font-size: 9pt; font-variant-numeric: tabular-nums; }
    caption { text-align: left; font-size: 12pt; font-weight: 700; padding-bottom: 2mm; }
    thead { display: table-header-group; }
    tr { break-inside: avoid; }
    th, td { font-size: 9pt; line-height: 1.2; padding: 0.5mm 3mm; border-bottom: 0.5pt solid #d8e1dd; text-align: right; }
    th:first-child { text-align: left; }
    tbody th { font-weight: 400; }
    thead th { background: #edf5f0; border-top: 0.6pt solid #becdc7; }
    footer { break-inside: avoid; margin-top: 3mm; padding-top: 2mm; border-top: 0.6pt solid #becdc7; font-size: 8pt; color: #425d55; }
    footer p { margin-top: 1mm; }
  }
`
