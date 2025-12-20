"use client";

import React, { useRef, useState } from "react";
import html2canvas from "html2canvas";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from "recharts";
import {
  ArrowUpRight,
  Wallet,
  Banknote,
  CreditCard,
  RefreshCw,
  DollarSign,
  TrendingUp,
  Users,
  Building2,
  CalendarCheck,
  ChevronDown,
  Download,
  Loader2,
} from "lucide-react";

// --- Mock Data ---
const chartData = [
  { name: "Jan", earning: 4000, expense: 2400 },
  { name: "Feb", earning: 3000, expense: 1398 },
  { name: "Mar", earning: 2000, expense: 8800 },
  { name: "Apr", earning: 2780, expense: 3908 },
  { name: "May", earning: 1890, expense: 4800 },
  { name: "Jun", earning: 2390, expense: 3800 },
  { name: "Jul", earning: 3490, expense: 4300 },
];

const transactions = [
  { icon: Wallet, title: "Wallet", subtitle: "Starbucks Coffee", amount: "-$74.00", color: "text-rose-500", bg: "bg-rose-50" },
  { icon: Banknote, title: "Bank Transfer", subtitle: "Monthly Salary", amount: "+$4,800.00", color: "text-emerald-600", bg: "bg-emerald-50" },
  { icon: DollarSign, title: "Paypal", subtitle: "Freelance Project", amount: "+$590.00", color: "text-emerald-600", bg: "bg-emerald-50" },
  { icon: CreditCard, title: "Mastercard", subtitle: "Uber Eats", amount: "-$23.50", color: "text-rose-500", bg: "bg-rose-50" },
  { icon: RefreshCw, title: "Transfer", subtitle: "Tax Refund", amount: "+$98.00", color: "text-emerald-600", bg: "bg-emerald-50" },
];

// --- Sub-Components ---
const StatCard = ({ icon: Icon, label, value, trend, colorClass }: any) => (
  <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all">
    <div className="flex items-center gap-4">
      <div className={`p-4 rounded-2xl ${colorClass}`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-400">{label}</p>
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        {trend && (
          <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5 mt-1">
            <ArrowUpRight size={14}/> {trend}
          </span>
        )}
      </div>
    </div>
  </div>
);

export default function FinancePage() {
  const [isDownloading, setIsDownloading] = useState(false);
  const dashboardRef = useRef<HTMLDivElement>(null);

  // --- Screenshot Logic ---
  const downloadReport = async () => {
    if (!dashboardRef.current) return;
    setIsDownloading(true);

    try {
      const canvas = await html2canvas(dashboardRef.current, {
        scale: 2, // High resolution
        useCORS: true,
        backgroundColor: "#FAFBFF",
        logging: false,
      });

      const image = canvas.toDataURL("image/png", 1.0);
      const link = document.createElement("a");
      link.href = image;
      link.download = `Finance-Report-${new Date().toLocaleDateString()}.png`;
      link.click();
    } catch (err) {
      console.error("Capture failed:", err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <main 
      ref={dashboardRef}
      className="flex-1 bg-[#FAFBFF] min-h-screen p-6 md:p-10 text-gray-900"
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-gray-900">Finance Dashboard</h1>
          <p className="text-gray-500 font-medium mt-1">Real-time analytics and transaction history.</p>
        </div>
        
        <div className="flex gap-3" data-html2canvas-ignore>
          <button className="flex items-center gap-2 bg-white border border-gray-200 px-5 py-3 rounded-2xl font-bold text-sm hover:bg-gray-50 transition shadow-sm">
            Monthly <ChevronDown size={18} />
          </button>
          <button 
            onClick={downloadReport}
            disabled={isDownloading}
            className="flex items-center gap-2 bg-[#0E766E] text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-[#0A5D57] transition shadow-xl shadow-[#0E766E]/20 disabled:opacity-70"
          >
            {isDownloading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Download size={18} />
            )}
            {isDownloading ? "Generating..." : "Download Report"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* Left Side: Stats and Charts */}
        <div className="xl:col-span-3 space-y-8">
          
          {/* Top Row: Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard icon={CalendarCheck} label="Reservations" value="1,240" trend="+12.5%" colorClass="bg-purple-100 text-purple-600" />
            <StatCard icon={Users} label="New Users" value="852" trend="+8.2%" colorClass="bg-blue-100 text-blue-600" />
            <StatCard icon={Building2} label="Facilities" value="42" colorClass="bg-rose-100 text-rose-600" />
            <StatCard icon={TrendingUp} label="Total Profit" value="$84,120" trend="+18%" colorClass="bg-emerald-100 text-emerald-600" />
          </div>

          {/* Middle Row: Revenue Chart */}
          <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold text-gray-800">Revenue Stream</h2>
              <div className="flex gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#0E766E]" />
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-tighter">Earnings</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#f59e0b]" />
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-tighter">Expenses</span>
                </div>
              </div>
            </div>
            
            <div className="h-[380px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} barGap={12}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94A3B8', fontSize: 13, fontWeight: 600}} 
                    dy={10}
                  />
                  <YAxis hide />
                  <Tooltip 
                    cursor={{fill: '#F8FAFC'}} 
                    contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'}}
                  />
                  <Bar dataKey="earning" fill="#0E766E" radius={[10, 10, 10, 10]} barSize={20} />
                  <Bar dataKey="expense" fill="#f59e0b" radius={[10, 10, 10, 10]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bottom Row: Balance and Goal */}
          <div className="grid md:grid-cols-2 gap-8">
             <div className="bg-[#0E766E] rounded-[2.5rem] p-10 text-white relative overflow-hidden flex flex-col justify-between min-h-[250px]">
                <div className="relative z-10">
                  <p className="opacity-70 font-medium mb-1">Total Account Balance</p>
                  <h3 className="text-5xl font-black">$142,582.00</h3>
                </div>
                <div className="relative z-10 flex gap-4" data-html2canvas-ignore>
                  <button className="bg-white text-[#0E766E] px-8 py-3 rounded-2xl font-bold hover:bg-gray-100 transition">
                    Withdraw
                  </button>
                  <button className="bg-white/20 backdrop-blur-md border border-white/30 px-8 py-3 rounded-2xl font-bold hover:bg-white/30 transition">
                    Invest
                  </button>
                </div>
                <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
             </div>

             <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-gray-400 font-bold text-sm uppercase mb-1">Monthly Goal</p>
                  <h3 className="text-4xl font-black text-gray-900">$10,000</h3>
                  <p className="text-emerald-600 font-bold text-sm mt-2 flex items-center gap-1">
                    <TrendingUp size={16}/> 68% Completed
                  </p>
                </div>
                <div className="relative">
                  <PieChart width={140} height={140}>
                    <Pie
                      data={[{ value: 68 }, { value: 32 }]}
                      innerRadius={45}
                      outerRadius={60}
                      paddingAngle={8}
                      dataKey="value"
                      startAngle={90}
                      endAngle={450}
                    >
                      <Cell fill="#0E766E" stroke="none" />
                      <Cell fill="#F1F5F9" stroke="none" />
                    </Pie>
                  </PieChart>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-black text-[#0E766E]">68%</span>
                  </div>
                </div>
             </div>
          </div>
        </div>

        {/* Right Side: Transactions */}
        <div className="xl:col-span-1">
          <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm h-full">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-2xl font-black text-gray-900">Activity</h2>
              <button className="text-[#0E766E] text-xs font-black uppercase tracking-widest hover:underline" data-html2canvas-ignore>
                History
              </button>
            </div>
            
            <div className="space-y-8">
              {transactions.map((t, i) => (
                <div key={i} className="flex items-center justify-between group cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 ${t.bg} rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 shadow-sm`}>
                      <t.icon className={`w-7 h-7 ${t.color}`} />
                    </div>
                    <div>
                      <p className="text-gray-900 font-bold text-sm">{t.title}</p>
                      <p className="text-gray-400 font-medium text-xs">{t.subtitle}</p>
                    </div>
                  </div>
                  <span className={`font-bold text-sm ${t.color}`}>{t.amount}</span>
                </div>
              ))}
            </div>

            <div className="mt-12 p-8 bg-gray-50 rounded-[2rem] border border-dashed border-gray-200 text-center">
               <p className="text-xs text-gray-400 font-bold leading-relaxed px-4">
                 Tired of manual tracking? Enable <span className="text-[#0E766E]">Auto-Sync</span> for your bank accounts.
               </p>
               <button className="w-full mt-6 bg-gray-900 text-white py-4 rounded-2xl font-bold text-sm hover:bg-black transition shadow-lg" data-html2canvas-ignore>
                 Connect Now
               </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}