import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, TrendingUp, TrendingDown, DollarSign, Calendar } from "lucide-react";
import jsPDF from "jspdf";
import { saveAs } from "file-saver";

// Dummy report data
const reports = [
  {
    title: "P&L Statement",
    description: "Comprehensive profit and loss analysis",
    period: "Last 30 days",
    profit: "+₹45,230",
    isProfit: true,
  },
  {
    title: "Trade History",
    description: "Detailed transaction records",
    period: "Last 7 days",
    trades: "127 trades",
  },
  {
    title: "Portfolio Performance",
    description: "Overall portfolio analysis",
    period: "Last 90 days",
    profit: "-₹2,150",
    isProfit: false,
  },
];

// ✅ CSV Export
const exportToCSV = () => {
  const headers = ["Title,Description,Period,Profit/Trades"];
  const rows = reports.map((r) =>
    `${r.title},${r.description},${r.period},${r.profit || r.trades || "-"}`
  );
  const csvString = [headers, ...rows].join("\n");
  const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
  saveAs(blob, "reports.csv");
};

// ✅ PDF Export
const exportToPDF = () => {
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text("Trading Reports", 14, 20);

  reports.forEach((r, index) => {
    const y = 40 + index * 30;
    doc.setFontSize(12);
    doc.text(`Title: ${r.title}`, 14, y);
    doc.text(`Description: ${r.description}`, 14, y + 8);
    doc.text(`Period: ${r.period}`, 14, y + 16);
    doc.text(`Value: ${r.profit || r.trades || "-"}`, 14, y + 24);
  });

  doc.save("reports.pdf");
};

const Reports: React.FC = () => {
  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Reports</h1>
          <p className="text-muted-foreground">
            View detailed trading reports and analytics
          </p>
        </div>

        <div className="flex gap-2">
          <Button onClick={exportToCSV}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button onClick={exportToPDF}>
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Report Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {reports.map((report, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{report.title}</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {report.profit && (
                  <span
                    className={report.isProfit ? "text-green-600" : "text-red-600"}
                  >
                    {report.profit}
                  </span>
                )}
                {report.trades && <span>{report.trades}</span>}
              </div>
              <p className="text-xs text-muted-foreground">{report.description}</p>
              <div className="flex items-center justify-between mt-4">
                <span className="text-xs text-muted-foreground">
                  {report.period}
                </span>
                <Button variant="outline" size="sm" onClick={exportToCSV}>
                  <Download className="h-3 w-3 mr-1" />
                  Export
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Profit</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">₹1,23,456</div>
            <p className="text-xs text-muted-foreground">+12.5% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Loss</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">₹23,456</div>
            <p className="text-xs text-muted-foreground">-3.2% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78.3%</div>
            <p className="text-xs text-muted-foreground">+2.1% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Days</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Reports;
