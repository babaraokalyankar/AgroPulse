export const generateProfessionalPDF = (results: any) => {
  const { turmeric, bacillus, formData } = results

  // Create a new window for the PDF content
  const printWindow = window.open("", "_blank")

  if (!printWindow) {
    alert("Please allow popups to generate PDF report")
    return
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>AgroPulse - Agricultural Analysis Report</title>
      <meta charset="UTF-8">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          line-height: 1.6;
          color: #1f2937;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          padding: 20px;
        }
        
        .container {
          max-width: 800px;
          margin: 0 auto;
          background: white;
          border-radius: 16px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          overflow: hidden;
        }
        
        .header {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          padding: 40px 30px;
          text-align: center;
          position: relative;
        }
        
        .header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/><circle cx="50" cy="10" r="0.5" fill="white" opacity="0.05"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>') repeat;
          opacity: 0.1;
        }
        
        .header-content {
          position: relative;
          z-index: 1;
        }
        
        .logo {
          font-size: 48px;
          margin-bottom: 10px;
        }
        
        .header h1 {
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 8px;
          letter-spacing: -0.5px;
        }
        
        .header p {
          font-size: 16px;
          opacity: 0.9;
          font-weight: 400;
        }
        
        .timestamp {
          margin-top: 20px;
          padding: 12px 24px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 25px;
          display: inline-block;
          backdrop-filter: blur(10px);
          font-size: 14px;
        }
        
        .content {
          padding: 40px 30px;
        }
        
        .section {
          margin-bottom: 40px;
        }
        
        .section h2 {
          font-size: 24px;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 20px;
          padding-bottom: 10px;
          border-bottom: 3px solid #10b981;
          position: relative;
        }
        
        .section h2::before {
          content: '';
          position: absolute;
          bottom: -3px;
          left: 0;
          width: 60px;
          height: 3px;
          background: #059669;
        }
        
        .grid {
          display: grid;
          gap: 20px;
          margin: 20px 0;
        }
        
        .grid-2 { grid-template-columns: repeat(2, 1fr); }
        .grid-3 { grid-template-columns: repeat(3, 1fr); }
        .grid-4 { grid-template-columns: repeat(4, 1fr); }
        
        .card {
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 20px;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        
        .card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 4px;
          background: linear-gradient(90deg, #10b981, #059669);
        }
        
        .card h3 {
          font-size: 14px;
          font-weight: 500;
          color: #6b7280;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .card .value {
          font-size: 24px;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 4px;
        }
        
        .card .subtitle {
          font-size: 12px;
          color: #9ca3af;
          font-weight: 400;
        }
        
        .status-card {
          text-align: center;
          padding: 30px 20px;
        }
        
        .status-icon {
          font-size: 48px;
          margin-bottom: 16px;
          display: block;
        }
        
        .status-none { 
          background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
          border-color: #10b981;
          color: #065f46;
        }
        
        .status-mild { 
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
          border-color: #f59e0b;
          color: #92400e;
        }
        
        .status-moderate { 
          background: linear-gradient(135deg, #fed7aa 0%, #fdba74 100%);
          border-color: #f97316;
          color: #9a3412;
        }
        
        .status-severe { 
          background: linear-gradient(135deg, #fecaca 0%, #fca5a5 100%);
          border-color: #ef4444;
          color: #991b1b;
        }
        
        .predictions-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
          margin: 20px 0;
        }
        
        .prediction-item {
          background: white;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          padding: 16px;
          text-align: center;
        }
        
        .prediction-label {
          font-size: 14px;
          font-weight: 500;
          color: #374151;
          margin-bottom: 8px;
        }
        
        .prediction-value {
          font-size: 20px;
          font-weight: 700;
          color: #10b981;
        }
        
        .recommendations {
          background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
          border: 2px solid #10b981;
          border-radius: 12px;
          padding: 25px;
          margin: 20px 0;
        }
        
        .recommendations h3 {
          color: #065f46;
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .recommendations ul {
          list-style: none;
        }
        
        .recommendations li {
          margin: 12px 0;
          padding: 12px 16px;
          background: white;
          border-radius: 8px;
          color: #047857;
          font-weight: 500;
          border-left: 4px solid #10b981;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          position: relative;
        }
        
        .recommendations li::before {
          content: '✓';
          position: absolute;
          left: -12px;
          top: 50%;
          transform: translateY(-50%);
          background: #10b981;
          color: white;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: bold;
        }
        
        .parameters-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin: 25px 0;
        }
        
        .parameter-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          padding: 16px;
          text-align: center;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        
        .parameter-icon {
          font-size: 24px;
          margin-bottom: 8px;
          display: block;
        }
        
        .parameter-label {
          font-size: 12px;
          color: #6b7280;
          font-weight: 500;
          margin-bottom: 4px;
        }
        
        .parameter-value {
          font-size: 16px;
          font-weight: 600;
          color: #1f2937;
        }
        
        .footer {
          background: #f8fafc;
          padding: 30px;
          text-align: center;
          border-top: 1px solid #e5e7eb;
          margin-top: 40px;
        }
        
        .footer p {
          color: #6b7280;
          font-size: 14px;
          margin: 5px 0;
        }
        
        .footer .company {
          font-weight: 600;
          color: #10b981;
          font-size: 16px;
        }
        
        .divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, #e5e7eb, transparent);
          margin: 30px 0;
        }
        
        @media print {
          body { 
            padding: 0;
            background: white;
          }
          .container {
            box-shadow: none;
            border-radius: 0;
          }
          .section { 
            break-inside: avoid; 
          }
          .card {
            break-inside: avoid;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="header-content">
            <div class="logo">🌱</div>
            <h1>AgroPulse Intelligence Report</h1>
            <p>Professional Agricultural Analysis & Recommendations</p>
            <div class="timestamp">
              Generated on ${new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })} at ${new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>

        <div class="content">
          <div class="section">
            <h2>📋 Executive Summary</h2>
            <div class="grid grid-2">
              <div class="card status-card status-${turmeric.most_likely.toLowerCase()}">
                <span class="status-icon">${turmeric.most_likely === "None" ? "✅" : turmeric.most_likely === "Mild" ? "⚠️" : turmeric.most_likely === "Moderate" ? "🔶" : "🚨"}</span>
                <h3>Crop Disease Status</h3>
                <div class="value">${turmeric.most_likely}</div>
                <div class="subtitle">Primary Detection</div>
              </div>
              <div class="card status-card">
                <span class="status-icon">🔬</span>
                <h3>Soil Health Status</h3>
                <div class="value">${bacillus.health_status}</div>
                <div class="subtitle">${bacillus.predicted_count.toLocaleString()} CFU/g</div>
              </div>
            </div>
          </div>

          <div class="section">
            <h2>🔬 Detailed Analysis Results</h2>
            <div class="grid grid-3">
              <div class="card">
                <h3>Bacteria Count</h3>
                <div class="value">${bacillus.predicted_count.toLocaleString()}</div>
                <div class="subtitle">Colony Forming Units per gram</div>
              </div>
              <div class="card">
                <h3>Confidence Level</h3>
                <div class="value">${(bacillus.confidence * 100).toFixed(1)}%</div>
                <div class="subtitle">Prediction Accuracy</div>
              </div>
              <div class="card">
                <h3>Risk Assessment</h3>
                <div class="value">${turmeric.most_likely === "None" ? "Low" : turmeric.most_likely === "Mild" ? "Low-Medium" : turmeric.most_likely === "Moderate" ? "Medium-High" : "High"}</div>
                <div class="subtitle">Overall Risk Level</div>
              </div>
            </div>

            <h3 style="margin: 30px 0 15px 0; font-size: 18px; color: #374151;">Disease Probability Distribution</h3>
            <div class="predictions-grid">
              ${turmeric.predictions
                .map(
                  (pred: any) => `
                <div class="prediction-item">
                  <div class="prediction-label">${pred.disease}</div>
                  <div class="prediction-value">${(pred.probability * 100).toFixed(1)}%</div>
                </div>
              `,
                )
                .join("")}
            </div>
          </div>

          <div class="section">
            <h2>📊 Environmental Parameters</h2>
            <div class="parameters-grid">
              <div class="parameter-card">
                <span class="parameter-icon">🌡️</span>
                <div class="parameter-label">Soil pH</div>
                <div class="parameter-value">${formData.soil_pH}</div>
              </div>
              <div class="parameter-card">
                <span class="parameter-icon">🌡️</span>
                <div class="parameter-label">Temperature</div>
                <div class="parameter-value">${formData.temperature}°C</div>
              </div>
              <div class="parameter-card">
                <span class="parameter-icon">🌧️</span>
                <div class="parameter-label">Rainfall</div>
                <div class="parameter-value">${formData.rainfall}mm</div>
              </div>
              <div class="parameter-card">
                <span class="parameter-icon">💨</span>
                <div class="parameter-label">Humidity</div>
                <div class="parameter-value">${formData.humidity}%</div>
              </div>
              <div class="parameter-card">
                <span class="parameter-icon">💧</span>
                <div class="parameter-label">Soil Moisture</div>
                <div class="parameter-value">${formData.soil_moisture}%</div>
              </div>
              <div class="parameter-card">
                <span class="parameter-icon">🚿</span>
                <div class="parameter-label">Irrigation</div>
                <div class="parameter-value">${formData.irrigation_type}</div>
              </div>
              <div class="parameter-card">
                <span class="parameter-icon">🌱</span>
                <div class="parameter-label">Fertilizer</div>
                <div class="parameter-value">${formData.fertilizer_type}</div>
              </div>
              <div class="parameter-card">
                <span class="parameter-icon">☀️</span>
                <div class="parameter-label">Season</div>
                <div class="parameter-value">${formData.season}</div>
              </div>
            </div>
          </div>

          <div class="divider"></div>

          <div class="section">
            <h2>💡 Professional Recommendations</h2>
            
            <div class="recommendations">
              <h3>🌱 Crop Management Strategy</h3>
              <ul>
                ${turmeric.recommendation
                  .split("\n")
                  .filter((line: string) => line.trim())
                  .map(
                    (line: string) => `
                  <li>${line.trim()}</li>
                `,
                  )
                  .join("")}
              </ul>
            </div>

            <div class="recommendations">
              <h3>🔬 Soil Enhancement Protocol</h3>
              <ul>
                ${bacillus.recommendations
                  .map(
                    (rec: string) => `
                  <li>${rec}</li>
                `,
                  )
                  .join("")}
              </ul>
            </div>
          </div>

          <div class="section">
            <h2>📈 Next Steps & Monitoring</h2>
            <div class="card">
              <h3>Recommended Actions</h3>
              <div style="margin-top: 15px; color: #374151; line-height: 1.8;">
                <p><strong>Immediate (1-7 days):</strong> Implement critical recommendations based on disease status and soil conditions.</p>
                <p><strong>Short-term (1-4 weeks):</strong> Monitor crop response and adjust management practices accordingly.</p>
                <p><strong>Long-term (1-3 months):</strong> Evaluate overall improvement and conduct follow-up analysis.</p>
              </div>
            </div>
          </div>
        </div>

        <div class="footer">
          <p class="company">AgroPulse Intelligence Platform</p>
          <p>This report was generated using advanced AI algorithms for agricultural analysis</p>
          <p>For technical support or consultation, contact our agricultural experts</p>
          <p style="margin-top: 20px; font-size: 12px; color: #9ca3af;">
            Report ID: AP-${Date.now()} | Version 2.1 | © 2024 AgroPulse Technologies
          </p>
        </div>
      </div>
    </body>
    </html>
  `

  printWindow.document.write(htmlContent)
  printWindow.document.close()

  // Wait for content to load then print
  setTimeout(() => {
    printWindow.print()
  }, 1000)
}
