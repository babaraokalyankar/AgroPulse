export const generateHistoryPDF = (history: any[]) => {
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
      <title>AgroPulse - Prediction History Report</title>
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
        
        .summary {
          background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
          border: 2px solid #10b981;
          border-radius: 12px;
          padding: 25px;
          margin-bottom: 30px;
          text-align: center;
        }
        
        .summary h2 {
          color: #065f46;
          font-size: 24px;
          margin-bottom: 15px;
        }
        
        .summary-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-top: 20px;
        }
        
        .stat-card {
          background: white;
          padding: 15px;
          border-radius: 8px;
          border: 1px solid #10b981;
        }
        
        .stat-value {
          font-size: 24px;
          font-weight: 700;
          color: #10b981;
        }
        
        .stat-label {
          font-size: 12px;
          color: #065f46;
          margin-top: 5px;
        }
        
        .history-item {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 25px;
          margin-bottom: 20px;
          break-inside: avoid;
        }
        
        .history-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 2px solid #10b981;
        }
        
        .history-title {
          font-size: 18px;
          font-weight: 600;
          color: #1f2937;
        }
        
        .history-date {
          font-size: 14px;
          color: #6b7280;
        }
        
        .results-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
          margin-bottom: 20px;
        }
        
        .result-card {
          background: white;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          padding: 20px;
          text-align: center;
        }
        
        .result-card.disease {
          border-color: #10b981;
          background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
        }
        
        .result-card.soil {
          border-color: #3b82f6;
          background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
        }
        
        .result-icon {
          font-size: 32px;
          margin-bottom: 10px;
        }
        
        .result-title {
          font-size: 14px;
          font-weight: 500;
          color: #6b7280;
          margin-bottom: 8px;
        }
        
        .result-value {
          font-size: 20px;
          font-weight: 700;
          margin-bottom: 5px;
        }
        
        .result-subtitle {
          font-size: 12px;
          color: #9ca3af;
        }
        
        .parameters {
          background: #f1f5f9;
          border-radius: 8px;
          padding: 15px;
        }
        
        .parameters h4 {
          font-size: 14px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 10px;
        }
        
        .parameters-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
          font-size: 12px;
          color: #6b7280;
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
        
        @media print {
          body { 
            padding: 0;
            background: white;
          }
          .container {
            box-shadow: none;
            border-radius: 0;
          }
          .history-item { 
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
            <h1>AgroPulse Prediction History</h1>
            <p>Complete Agricultural Analysis Timeline</p>
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
          <div class="summary">
            <h2>📊 History Summary</h2>
            <p>Total predictions analyzed: ${history.length}</p>
            <div class="summary-stats">
              <div class="stat-card">
                <div class="stat-value">${history.length}</div>
                <div class="stat-label">Total Analyses</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">${history.filter((h) => h.turmeric?.most_likely === "None").length}</div>
                <div class="stat-label">Healthy Crops</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">${Math.round(history.reduce((acc, h) => acc + (h.bacillus?.predicted_count || 0), 0) / history.length).toLocaleString()}</div>
                <div class="stat-label">Avg. Bacteria Count</div>
              </div>
            </div>
          </div>

          ${history
            .map(
              (item, index) => `
            <div class="history-item">
              <div class="history-header">
                <div class="history-title">Analysis #${history.length - index}</div>
                <div class="history-date">${new Date(item.timestamp).toLocaleDateString()} ${new Date(item.timestamp).toLocaleTimeString()}</div>
              </div>
              
              <div class="results-grid">
                <div class="result-card disease">
                  <div class="result-icon">🌱</div>
                  <div class="result-title">Crop Disease Status</div>
                  <div class="result-value" style="color: #065f46;">${item.turmeric?.most_likely || "N/A"}</div>
                  <div class="result-subtitle">
                    Confidence: ${
                      item.turmeric?.predictions?.find((p: any) => p.disease === item.turmeric.most_likely)?.probability
                        ? (
                            item.turmeric.predictions.find((p: any) => p.disease === item.turmeric.most_likely)
                              .probability * 100
                          ).toFixed(1) + "%"
                        : "N/A"
                    }
                  </div>
                </div>
                
                <div class="result-card soil">
                  <div class="result-icon">🔬</div>
                  <div class="result-title">Soil Health</div>
                  <div class="result-value" style="color: #1d4ed8;">${item.bacillus?.health_status || "N/A"}</div>
                  <div class="result-subtitle">${item.bacillus?.predicted_count?.toLocaleString() || "N/A"} CFU/g</div>
                </div>
              </div>
              
              <div class="parameters">
                <h4>Analysis Parameters</h4>
                <div class="parameters-grid">
                  <span>pH: ${item.formData?.soil_pH || "N/A"}</span>
                  <span>Temp: ${item.formData?.temperature || "N/A"}°C</span>
                  <span>Rainfall: ${item.formData?.rainfall || "N/A"}mm</span>
                  <span>Humidity: ${item.formData?.humidity || "N/A"}%</span>
                  <span>Moisture: ${item.formData?.soil_moisture || "N/A"}%</span>
                  <span>Irrigation: ${item.formData?.irrigation_type || "N/A"}</span>
                  <span>Fertilizer: ${item.formData?.fertilizer_type || "N/A"}</span>
                  <span>Season: ${item.formData?.season || "N/A"}</span>
                </div>
              </div>
            </div>
          `,
            )
            .join("")}
        </div>

        <div class="footer">
          <p class="company">AgroPulse Intelligence Platform</p>
          <p>This history report was generated using advanced AI algorithms for agricultural analysis</p>
          <p>For technical support or consultation, contact our agricultural experts</p>
          <p style="margin-top: 20px; font-size: 12px; color: #9ca3af;">
            Report ID: AP-HIST-${Date.now()} | Version 2.1 | © 2024 AgroPulse Technologies
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
