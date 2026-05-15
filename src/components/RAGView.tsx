import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Lightbulb, 
  Activity, 
  History, 
  FileText,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Clock,
  ClipboardList,
  Target,
  ArrowDownToLine,
  Search
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

const MOCK_REPORTS = [
  {
    id: 'AL-1092',
    title: 'BAC 베어링 온도 이상 심층 분석',
    asset: 'BAC Gland Seal 모터',
    status: 'High',
    time: '2024-04-30 08:30:12',
    score: '78%',
    summary: 'NDE 베어링 온도가 임계치에 근접. 윤활 계통 장애 판단.'
  },
  {
    id: 'AL-1095',
    title: 'MAC A 진동 패턴 특이사항 분석',
    asset: 'Main Air Compressor A',
    status: 'Medium',
    time: '2024-04-30 07:15:44',
    score: '52%',
    summary: '커플링 정렬 불량 가능성 제기. 진동 Peak 1 영역 상승.'
  },
  {
    id: 'AL-1101',
    title: 'VHP 오일 누유 감지 및 압력 변화',
    asset: 'VHP Hydraulic Unit',
    status: 'Critical',
    time: '2024-04-30 09:12:05',
    score: '92%',
    summary: '유압 공급 라인 압력 급락 감지. 즉각적인 현장 점검 필요.'
  }
];

const RAGView = ({ initialReportId, onBack }: { initialReportId?: string | null, onBack?: () => void }) => {
  const [loading, setLoading] = useState(true);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(initialReportId || null);

  useEffect(() => {
    // If the prop changes, updated local state
    if (initialReportId) {
      setSelectedReportId(initialReportId);
    }
  }, [initialReportId]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const selectedReport = MOCK_REPORTS.find(r => r.id === selectedReportId);

  const renderSkeleton = () => (
    <div className="space-y-6">
      <div className="h-40 bg-card border border-border rounded-xl animate-pulse" />
      <div className="h-96 bg-card border border-border rounded-xl animate-pulse" />
    </div>
  );

  if (loading) return renderSkeleton();

  // List View
  if (!selectedReportId) {
    return (
      <div className="space-y-8 h-full flex flex-col pb-10 max-h-[calc(100vh-180px)]">
        <div className="flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-2xl font-black text-text-main tracking-tight uppercase">감지된 이상 징후 분석 리포트</h2>
            <p className="text-[10px] text-text-dim font-bold uppercase tracking-widest leading-none mt-2">Active Anomalies Detected by AI System</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-xl border border-border">
            <Search className="w-3.5 h-3.5 text-text-dim" />
            <span className="text-[10px] text-text-dim font-black uppercase tracking-widest">분석 이력 검색</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-border">
          {MOCK_REPORTS.map((report) => (
            <motion.div
              key={report.id}
              whileHover={{ y: -4 }}
              onClick={() => setSelectedReportId(report.id)}
              className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:border-blue-500/40 cursor-pointer transition-all flex flex-col gap-4 group"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter border",
                    report.status === 'Critical' ? "bg-red-500/10 text-red-500 border-red-500/20" : 
                    report.status === 'High' ? "bg-orange-500/10 text-orange-500 border-orange-500/20" : 
                    "bg-blue-500/10 text-blue-500 border-blue-500/20"
                  )}>
                    {report.status}
                  </span>
                  <span className="text-[10px] text-text-dim font-mono font-bold">{report.id}</span>
                </div>
                <div className="text-right">
                  <p className="text-xl font-black font-mono text-text-main leading-none">{report.score}</p>
                  <p className="text-[8px] text-text-dim font-bold uppercase tracking-tighter mt-1">Match Score</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-black text-text-main tracking-tight group-hover:text-blue-500 transition-colors">{report.title}</h3>
                <p className="text-[10px] text-text-dim font-bold uppercase mt-1 opacity-60 italic">{report.asset}</p>
              </div>

              <div className="bg-muted/50 p-3 rounded-xl border border-border/50">
                <p className="text-[11px] text-text-dim leading-relaxed line-clamp-2">{report.summary}</p>
              </div>

              <div className="mt-auto pt-2 flex items-center justify-between">
                <div className="flex items-center gap-2 text-[10px] text-text-dim font-bold">
                  <Clock className="w-3 h-3" />
                  {report.time}
                </div>
                <div className="w-8 h-8 rounded-lg bg-blue-500/5 flex items-center justify-center group-hover:bg-blue-500 transition-colors">
                  <ArrowDownToLine className="w-4 h-4 text-blue-500 group-hover:text-white rotate-[-90deg] transition-all" />
                </div>
              </div>
            </motion.div>
          ))}
          
          {/* Add empty placeholder for UX */}
          <div className="bg-muted hover:bg-muted/80 border-2 border-dashed border-border rounded-2xl p-6 flex flex-col items-center justify-center gap-2 opacity-50 transition-all cursor-not-allowed">
             <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center">
               <History className="w-5 h-5 text-text-dim" />
             </div>
             <p className="text-[10px] font-black uppercase tracking-widest">분석 이력 더보기</p>
          </div>
        </div>
      </div>
    );
  }

  // Detail View (Same as before but with back button)
  if (!selectedReport) return null;

  return (
    <div className="space-y-8 h-full flex flex-col pb-10 max-h-[calc(100vh-180px)]">
      {/* Report Summary Header */}
      <div className="bg-card border border-border rounded-2xl p-6 border-l-8 border-blue-500 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6 shrink-0">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => {
              if (onBack) {
                onBack();
              } else {
                setSelectedReportId(null);
              }
            }}
            className="bg-muted hover:bg-border p-3 rounded-xl transition-colors border border-border flex items-center justify-center"
            title={onBack ? "모니터링으로 돌아가기" : "목록으로 돌아가기"}
          >
            <History className="w-5 h-5 text-text-main rotate-180" />
          </button>
          <div className="bg-blue-500/10 p-4 rounded-2xl border border-blue-500/20 shadow-inner">
            <Activity className="w-8 h-8 text-blue-500" />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <p className="text-text-dim text-[10px] font-black uppercase tracking-widest opacity-70 leading-none">AI ANALYSIS REPORT</p>
              <span className="bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter border border-blue-500/10">Ref: {selectedReport.id}</span>
            </div>
            <h2 className="text-text-main font-black text-2xl tracking-tight">{selectedReport.title}</h2>
            <div className="flex items-center gap-4 mt-2">
              <span className="flex items-center gap-1.5 text-[10px] font-bold text-text-dim">
                <Clock className="w-3.5 h-3.5" />
                분석 일시: {selectedReport.time}
              </span>
              <span className="flex items-center gap-1.5 text-[10px] font-bold text-green-500">
                <CheckCircle2 className="w-3.5 h-3.5" />
                AI 신뢰성: High ({selectedReport.score})
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-muted border border-border rounded-xl text-[10px] text-text-dim font-black uppercase tracking-widest hover:text-text-main transition-all group">
            <ArrowDownToLine className="w-3.5 h-3.5" />
            PDF
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all">
            <RotateCcw className="w-3.5 h-3.5" />
            재분석
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-4 space-y-8 scrollbar-thin scrollbar-thumb-border">
        {/* Main Report Body */}
        <div className="grid grid-cols-12 gap-8">
          {/* Left Contents (2/3) */}
          <div className="col-span-12 lg:col-span-12 space-y-10">
            {/* 1. Executive Summary */}
            <section className="bg-card border border-border rounded-3xl p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6 border-b border-border pb-4">
                <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center border border-yellow-500/20">
                  <Lightbulb className="w-5 h-5 text-yellow-600" />
                </div>
                <h3 className="text-sm font-black text-text-main uppercase tracking-widest">1. 분석 요약 (EXECUTIVE SUMMARY)</h3>
              </div>
              <p className="text-[13px] text-text-main font-medium leading-relaxed mb-6">
                현재 <span className="font-black text-blue-600 underline underline-offset-4">BAC Gland Seal 모터</span>의 NDE(Non-Drive End) 베어링 온도가 임계치(80°C)에 근접하는 78.4°C를 기록하고 있습니다. 
                과거 베어링 교체 이력 및 유사 진동 패턴을 분석한 결과, 기계적 결함보다는 <span className="font-black text-red-500">윤활 계통의 일시적 장애</span>로 판단됩니다. 
                즉각적인 부하 조정 및 현장 급유 상태 점검이 필요합니다.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted p-4 rounded-2xl border border-border/50">
                  <p className="text-[10px] text-text-dim font-black uppercase mb-1 opacity-60">예상 원인</p>
                  <p className="text-xs font-bold text-text-main">윤활유 점도 저하 및 순환 불량</p>
                </div>
                <div className="bg-muted p-4 rounded-2xl border border-border/50">
                  <p className="text-[10px] text-text-dim font-black uppercase mb-1 opacity-60">권고 긴급도</p>
                  <p className="text-xs font-bold text-red-500 font-mono italic">HIGH / ACTION REQUIRED</p>
                </div>
              </div>
            </section>

            {/* 2. Root Cause Analysis (RAG Section) */}
            <section className="bg-card border border-border rounded-3xl p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6 border-b border-border pb-4">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                  <Target className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="text-sm font-black text-text-main uppercase tracking-widest">2. 근거 및 원인 분석 (ROOT CAUSE ANALYSIS)</h3>
              </div>
              <div className="space-y-6">
                <div className="flex gap-5">
                  <div className="shrink-0 w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center text-[10px] font-black text-blue-500 border border-blue-500/20">01</div>
                  <div className="space-y-2">
                    <h5 className="text-[12px] font-black text-text-main uppercase">과거 정비 사례 데이터 매칭 (Cross-Referencing)</h5>
                    <p className="text-[12px] text-text-dim leading-relaxed">
                      2023년 11월 <span className="bg-muted px-1.5 py-0.5 rounded text-blue-500 font-mono">#T-501</span> 호기에서 발생한 동일 증상 분석 결과, 
                      온도 상승 곡선의 기울기가 5°C/h로 일치함. 당시 원인은 <span className="font-bold text-text-main italic">'윤활유 필터 막힘'</span>으로 확인되었습니다.
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-text-dim italic">Source: Maintenance DB / Case_2023_Nov_Bearing</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-5">
                  <div className="shrink-0 w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center text-[10px] font-black text-blue-500 border border-blue-500/20">02</div>
                  <div className="space-y-2">
                    <h5 className="text-[12px] font-black text-text-main uppercase">진동 패턴 상관 분석 (Vibration Correlation)</h5>
                    <p className="text-[12px] text-text-dim leading-relaxed">
                      현재 XYZ 3축 진동 데이터에서 고주파 영역(Peak 2)의 에너지가 미세하게 상승 중입니다. 
                      이는 점진적인 마찰 증가를 의미하며, 완전한 고착 전 윤활막 형성이 실패하고 있는 증거입니다.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* 3. Maintenance Strategy */}
            <section className="bg-card border border-border rounded-3xl p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-8 border-b border-border pb-4">
                <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center border border-green-500/20">
                  <ClipboardList className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="text-sm font-black text-text-main uppercase tracking-widest">3. 권고 조치 전략 (STRATEGIC RECOMMENDATIONS)</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-5">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-4 h-1 bg-blue-500 rounded-full" />
                    <p className="text-[11px] font-black text-text-main uppercase tracking-widest opacity-60">단기 조치 (Immediate)</p>
                  </div>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3 text-[12px] text-text-dim">
                      <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                      발전기 부하율을 즉각 85% -&gt; 70%로 감발 운전
                    </li>
                    <li className="flex items-start gap-3 text-[12px] text-text-dim">
                      <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                      현장 윤활유 공급 압력(Lubrication Pressure) 수동 확인
                    </li>
                    <li className="flex items-start gap-3 text-[12px] text-text-dim">
                      <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                      냉각 팬(Cooling Fan) 작동 여부 및 청결 상태 점검
                    </li>
                  </ul>
                </div>
                <div className="space-y-5">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-4 h-1 bg-orange-500 rounded-full" />
                    <p className="text-[11px] font-black text-text-main uppercase tracking-widest opacity-60">장기 조치 (Long-term)</p>
                  </div>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3 text-[12px] text-text-dim">
                      <AlertTriangle className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                      차기 정지 시 베어링 하우징 내부 가스켓 정밀 교체
                    </li>
                    <li className="flex items-start gap-3 text-[12px] text-text-dim">
                      <AlertTriangle className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                      윤활유 계통 필터링 시스템 전면 개선 검토
                    </li>
                  </ul>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RAGView;
