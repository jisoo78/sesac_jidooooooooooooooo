import React, { useState } from 'react';
import { 
  CheckCircle, 
  Mail, 
  Search,
  Filter,
  MoreVertical
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn, formatDate } from '../lib/utils';
import { Alert } from '../types';

const MOCK_ALERTS: Alert[] = [
  {
    id: 'AL-1092',
    plantId: '태안',
    generatorId: 'G-태안-3',
    assetId: 'asm-3',
    type: 'anomaly',
    severity: 'caution',
    message: 'BAC 베어링 온도 급격한 상승 감지 (Threshold 70°C 초과)',
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    status: 'unconfirmed',
    channels: {
      email: 'success',
      slack: 'success'
    }
  },
  {
    id: 'AL-1091',
    plantId: '서인천',
    generatorId: 'G-서인천-1',
    assetId: 'asm-1',
    type: 'threshold',
    severity: 'caution',
    message: 'MAC A Vib_Y 진동 레벨 주의 임계치 도달 (0.45 mm/s)',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    status: 'confirmed',
    processedBy: '정비B팀 이현우',
    memo: '현장 확인 결과 특이사항 없음. 지속 모니터링 예정.',
    channels: {
      email: 'success',
      slack: 'failed'
    }
  },
  {
    id: 'AL-1090',
    plantId: '태안',
    generatorId: 'G-태안-2',
    assetId: 'asm-2',
    type: 'anomaly',
    severity: 'normal',
    message: '이상 탐지 스코어 정상 범위 복귀',
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    status: 'resolved',
    channels: {
      email: 'success',
      slack: 'success'
    }
  }
];

const AlertView = () => {
  const [alerts, setAlerts] = useState<Alert[]>(MOCK_ALERTS);
  const [filter, setFilter] = useState<'all' | 'unconfirmed'>('all');

  const totalCount = alerts.length;
  const unconfirmedCount = alerts.filter(a => a.status === 'unconfirmed').length;

  const filteredAlerts = alerts.filter(a => {
    if (filter === 'unconfirmed') return a.status === 'unconfirmed';
    return true;
  });

  return (
    <div className="space-y-6 h-full flex flex-col pt-2">
      {/* Control Bar */}
      <div className="flex items-center justify-between bg-card border border-border p-4 rounded-xl shadow-sm">
        <div className="flex items-center gap-2">
          {[
            { id: 'all', label: `전체 보기 (${totalCount})` },
            { id: 'unconfirmed', label: `미확인 대상 (${unconfirmedCount})` }
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id as any)}
              className={cn(
                "px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                filter === f.id ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "text-text-dim hover:bg-muted hover:text-text-main"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-2 bg-muted border border-border rounded-lg">
            <Search className="w-3.5 h-3.5 text-text-dim" />
            <input type="text" placeholder="알람 ID 검색" className="bg-transparent border-none outline-none text-[11px] text-text-main w-32 placeholder:text-text-dim/50 font-bold" />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-[11px] font-black uppercase tracking-widest shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all">
            <Filter className="w-3.5 h-3.5" />
            상세 필터
          </button>
        </div>
      </div>

      {/* Alert List */}
      <div className="bg-card border border-border rounded-xl overflow-hidden flex-1 shadow-sm transition-colors">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-muted border-b border-border">
              <th className="px-6 py-4 text-[10px] font-black text-text-dim uppercase tracking-widest">ID</th>
              <th className="px-6 py-4 text-[10px] font-black text-text-dim uppercase tracking-widest">발생 시각</th>
              <th className="px-6 py-4 text-[10px] font-black text-text-dim uppercase tracking-widest">설비 위치</th>
              <th className="px-6 py-4 text-[10px] font-black text-text-dim uppercase tracking-widest w-1/3">알람 내용</th>
              <th className="px-6 py-4 text-[10px] font-black text-text-dim uppercase tracking-widest">이메일 발송</th>
              <th className="px-6 py-4 text-[10px] font-black text-text-dim uppercase tracking-widest text-right">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredAlerts.map((alert) => (
              <tr key={alert.id} className="hover:bg-muted/50 transition-colors group">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <span className="text-text-main text-xs font-mono font-black tracking-tighter">{alert.id}</span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex flex-col">
                    <span className="text-text-main text-xs font-bold font-mono">{formatDate(alert.timestamp).split(' ')[1]}</span>
                    <span className="text-text-dim text-[10px] font-medium">{formatDate(alert.timestamp).split(' ')[0]}</span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex flex-col">
                    <span className="text-text-main text-[11px] font-black">{alert.plantId}</span>
                    <span className="text-text-dim text-[10px] font-medium uppercase">{alert.generatorId}</span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <p className="text-text-main text-xs leading-relaxed font-medium">{alert.message}</p>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3 opacity-80">
                    <Mail className={cn("w-4 h-4", alert.channels.email === 'success' ? "text-green-500" : "text-red-500")} />
                  </div>
                </td>
                <td className="px-6 py-5 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {alert.status === 'unconfirmed' ? (
                      <button className="bg-blue-600/10 text-blue-600 dark:text-blue-400 border border-blue-600/20 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider hover:bg-blue-600 hover:text-white transition-all">
                        확인 처리
                      </button>
                    ) : (
                      <span className="text-green-600 dark:text-green-500 text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5" /> 조치 완료
                      </span>
                    )}
                    <button className="p-2 text-text-dim hover:text-text-main transition-colors bg-muted/30 rounded-lg">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default AlertView;
