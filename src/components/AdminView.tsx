import React, { useState } from 'react';
import { 
  Users, 
  Mail, 
  Slack, 
  Shield, 
  Lock, 
  Activity, 
  Database, 
  AlertOctagon, 
  CheckCircle2,
  XCircle,
  Plus,
  Trash2,
  RefreshCw,
  Search,
  Key,
  X,
  UserPlus,
  Settings2,
  History
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { AdminEmail } from '../types';
import { MOCK_EMAILS } from '../constants';

const AdminView = () => {
  const [activeSubTab, setActiveSubTab] = useState<'users' | 'emails' | 'logs'>('emails');
  const [isRegistering, setIsRegistering] = useState(false);
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [viewingLog, setViewingLog] = useState<any>(null);
  const [logFilter, setLogFilter] = useState<string>('All');
  const [newReceiver, setNewReceiver] = useState({ name: '', email: '', plant: '태안' });
  const [newUser, setNewUser] = useState({ name: '', id: '', role: 'viewer', department: '' });

  const MOCK_LOGS = [
    { id: 'l1', time: '2026-05-06 10:45:12', name: '김관리', channel: 'Email', status: 'success', plant: '태안', source: '태안 #3 발전기', msg: '태안 화력 제1발전처 #3 발전기에서 진동 임계치 초과 경보가 발생했습니다. (Vib_Y: 4.8mm/s)' },
    { id: 'l2', time: '2026-05-06 10:45:13', name: '김관리', channel: 'Slack', status: 'success', plant: '태안', source: '태안 #3 발전기', msg: '[KOWEPO-ALERT] 태안 #3 발전기 이상 감지. 즉시 대시보드를 확인하십시오.' },
    { id: 'l3', time: '2026-05-06 09:12:05', name: '박운영', channel: 'Email', status: 'success', plant: '서인천', source: '서인천 #1 발전기', msg: '서인천 발전본부 #1 발전기 데이터 수집 주기 지연 알림.' },
    { id: 'l4', time: '2026-05-06 08:30:00', name: '최평택', channel: 'Email', status: 'success', plant: '평택', source: '평택 #2 발전기', msg: '[알람] 평택 발전본부 #2 기동 중 온도 상승폭 주의 레벨 도달.' },
    { id: 'l5', time: '2026-05-06 08:15:22', name: '박군산', channel: 'Slack', status: 'success', plant: '군산', source: '군산 복합 #1', msg: '군산 복합 #1 호기 출력 저하 알림. (Efficiency drops below 92%)' },
    { id: 'l6', time: '2026-05-06 07:45:00', name: '이마스터', channel: 'Email', status: 'failed', plant: 'System', source: 'System', msg: '일간 요약 보고서 발송 실패 (SMTP Connection Timeout)' },
  ];

  const filteredLogs = logFilter === 'All' ? MOCK_LOGS : MOCK_LOGS.filter(log => log.plant === logFilter);

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`신규 수신자 등록 완료: ${newReceiver.name} (${newReceiver.email})`);
    setIsRegistering(false);
    setNewReceiver({ name: '', email: '', plant: '태안' });
  };

  const handleCreateAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`계정 생성 완료: ${newUser.name} (ID: ${newUser.id})`);
    setIsCreatingAccount(false);
    setNewUser({ name: '', id: '', role: 'viewer', department: '' });
  };

  const Modal = ({ children, onClose, title, icon: Icon }: { children: React.ReactNode, onClose: () => void, title: string, icon: any }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-card border border-border rounded-3xl overflow-hidden shadow-2xl max-w-lg w-full relative"
      >
        <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-muted rounded-xl transition-all text-text-dim hover:text-text-main z-10">
          <X className="w-5 h-5" />
        </button>
        <div className="p-8 border-b border-border bg-muted/30">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-600/20 text-white">
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-text-main uppercase tracking-tight">{title}</h3>
              <p className="text-[10px] text-text-dim mt-1 font-bold uppercase tracking-widest opacity-60">ADMINISTRATIVE ACTION REQUIRED</p>
            </div>
          </div>
        </div>
        <div className="p-8">
          {children}
        </div>
      </motion.div>
    </div>
  );

  const renderRegistrationForm = () => (
    <Modal title="신규 수신자 등록" onClose={() => setIsRegistering(false)} icon={Plus}>
      <form onSubmit={handleRegisterSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-text-dim uppercase tracking-widest">수신자 성함</label>
            <input 
              type="text" required value={newReceiver.name}
              onChange={e => setNewReceiver({...newReceiver, name: e.target.value})}
              placeholder="성함 입력" 
              className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-sm text-text-main focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-bold"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-text-dim uppercase tracking-widest">이메일 주소</label>
            <input 
              type="email" required value={newReceiver.email}
              onChange={e => setNewReceiver({...newReceiver, email: e.target.value})}
              placeholder="example@kowepo.co.kr" 
              className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-sm text-text-main focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-mono"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-text-dim uppercase tracking-widest">담당 발전소</label>
            <select 
              value={newReceiver.plant}
              onChange={e => setNewReceiver({...newReceiver, plant: e.target.value})}
              className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-sm text-text-main focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-bold appearance-none cursor-pointer"
            >
              <option value="태안">태안 화력</option>
              <option value="서인천">서인천 발전</option>
              <option value="평택">평택 발전</option>
              <option value="군산">군산 발전</option>
              <option value="김포">김포 열병합</option>
            </select>
          </div>
        </div>
        <div className="flex gap-4 pt-2">
          <button type="button" onClick={() => setIsRegistering(false)} className="flex-1 px-6 py-4 bg-muted hover:bg-border text-text-dim font-black uppercase tracking-widest text-[10px] rounded-2xl transition-all border border-border/50">취소</button>
          <button type="submit" className="flex-[2] px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-xl shadow-blue-600/20 transition-all">등록 완료</button>
        </div>
      </form>
    </Modal>
  );

  const renderCreateAccountForm = () => (
    <Modal title="신규 계정 생성" onClose={() => setIsCreatingAccount(false)} icon={UserPlus}>
      <form onSubmit={handleCreateAccountSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-text-dim uppercase tracking-widest">사용자 성함</label>
            <input 
              type="text" required value={newUser.name}
              onChange={e => setNewUser({...newUser, name: e.target.value})}
              placeholder="이름 입력" 
              className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-sm text-text-main focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-bold"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-text-dim uppercase tracking-widest">사번 / 아이디</label>
            <input 
              type="text" required value={newUser.id}
              onChange={e => setNewUser({...newUser, id: e.target.value})}
              placeholder="ID 입력" 
              className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-sm text-text-main focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-mono"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-text-dim uppercase tracking-widest">직급/권한</label>
            <select 
              value={newUser.role}
              onChange={e => setNewUser({...newUser, role: e.target.value})}
              className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-sm text-text-main focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-bold appearance-none cursor-pointer"
            >
              <option value="viewer">VIEWER</option>
              <option value="manager">MANAGER</option>
              <option value="admin">ADMIN</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-text-dim uppercase tracking-widest">부서 명</label>
            <input 
              type="text" value={newUser.department}
              onChange={e => setNewUser({...newUser, department: e.target.value})}
              placeholder="부서 입력" 
              className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-sm text-text-main focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-bold"
            />
          </div>
        </div>
        <div className="flex gap-4 pt-2">
          <button type="button" onClick={() => setIsCreatingAccount(false)} className="flex-1 px-6 py-4 bg-muted hover:bg-border text-text-dim font-black uppercase tracking-widest text-[10px] rounded-2xl transition-all border border-border/50">취소</button>
          <button type="submit" className="flex-[2] px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-xl shadow-blue-600/20 transition-all">생성 완료</button>
        </div>
      </form>
    </Modal>
  );

  const renderEmailManager = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-text-main font-black text-lg tracking-tight">알림 수신자 관리</h3>
          <p className="text-[11px] text-text-dim mt-1 font-medium">이상 탐지 시 이메일 및 Slack 알림을 받을 관리자 명단입니다.</p>
        </div>
        <button 
          onClick={() => setIsRegistering(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-600/20 flex items-center gap-2 transition-all"
        >
          <Plus className="w-5 h-5" />
          신규 수신자 등록
        </button>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm transition-colors">
        <table className="w-full text-left">
          <thead className="bg-muted border-b border-border">
            <tr>
              <th className="px-6 py-5 text-[10px] font-black text-text-dim uppercase tracking-widest">이름/이메일</th>
              <th className="px-6 py-5 text-[10px] font-black text-text-dim uppercase tracking-widest">담당 발전소</th>
              <th className="px-6 py-5 text-[10px] font-black text-text-dim uppercase tracking-widest">채널 인증</th>
              <th className="px-6 py-5 text-[10px] font-black text-text-dim uppercase tracking-widest">상태</th>
              <th className="px-6 py-5 text-[10px] font-black text-text-dim uppercase tracking-widest text-right">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {MOCK_EMAILS.map((email) => (
              <tr key={email.id} className="hover:bg-muted/50 transition-colors">
                <td className="px-6 py-5">
                  <div className="flex flex-col">
                    <span className="text-text-main text-sm font-black">{email.name}</span>
                    <span className="text-text-dim text-[11px] font-mono">{email.email}</span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className="text-text-main text-[11px] font-bold">{email.plantId} <span className="text-text-dim opacity-50">({email.assetScope})</span></span>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-lg border border-border/50">
                      <Mail className={cn("w-4 h-4", email.isVerified ? "text-green-500" : "text-text-dim")} />
                      <span className="text-[10px] text-text-main font-black">{email.isVerified ? 'VERIFIED' : 'PENDING'}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className={cn(
                    "inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border shadow-sm",
                    email.isActive ? "text-green-600 bg-green-500/5 border-green-500/20" : "text-text-dim bg-muted border-border"
                  )}>
                    <div className={cn("w-2 h-2 rounded-full shadow-inner", email.isActive ? "bg-green-500 animate-pulse" : "bg-text-dim")} />
                    {email.isActive ? 'ACTIVE' : 'IDLE'}
                  </span>
                </td>
                <td className="px-6 py-5 text-right">
                  <button className="p-2 text-red-500/30 hover:text-red-500 transition-colors hover:bg-red-500/10 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderNotificationLogs = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h3 className="text-text-main font-black text-lg tracking-tight">알림 발송 이력 (Notification Logs)</h3>
          <p className="text-[11px] text-text-dim mt-1 font-medium font-mono text-blue-500/80">SYSTEM_ALERT_AUDIT_TRAIL v1.02</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex flex-col gap-1.5 min-w-[140px]">
             <label className="text-[9px] font-black text-text-dim uppercase tracking-widest pl-1">발전소 필터</label>
             <select 
               value={logFilter}
               onChange={(e) => setLogFilter(e.target.value)}
               className="bg-card border border-border rounded-xl px-3 py-2 text-[10px] font-black text-text-main uppercase tracking-widest focus:outline-none focus:ring-1 focus:ring-blue-500/50 appearance-none cursor-pointer"
             >
               <option value="All">ALL PLANTS</option>
               <option value="태안">TAEAN</option>
               <option value="서인천">WEST INCHEON</option>
               <option value="평택">PYEONGTAEK</option>
               <option value="군산">GUNSAN</option>
               <option value="김포">GIMPO</option>
               <option value="System">SYSTEM</option>
             </select>
          </div>
          <div className="flex gap-2">
            <button className="p-2.5 text-text-dim hover:text-text-main bg-card border border-border rounded-xl transition-all">
              <Search className="w-4 h-4" />
            </button>
            <button className="p-2.5 text-text-dim hover:text-text-main bg-card border border-border rounded-xl transition-all">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-muted border-b border-border">
            <tr>
              <th className="px-6 py-4 text-[10px] font-black text-text-dim uppercase tracking-widest">Timestamp</th>
              <th className="px-6 py-4 text-[10px] font-black text-text-dim uppercase tracking-widest">Recipient</th>
              <th className="px-6 py-4 text-[10px] font-black text-text-dim uppercase tracking-widest">Channel</th>
              <th className="px-6 py-4 text-[10px] font-black text-text-dim uppercase tracking-widest">Status</th>
              <th className="px-6 py-4 text-[10px] font-black text-text-dim uppercase tracking-widest">Trigger Source</th>
              <th className="px-6 py-4 text-[10px] font-black text-text-dim uppercase tracking-widest text-right">Content</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredLogs.map(log => (
              <tr key={log.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-6 py-4 font-mono text-[10px] text-text-dim">{log.time}</td>
                <td className="px-6 py-4">
                  <span className="text-text-main text-[11px] font-black">{log.name}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {log.channel === 'Email' ? <Mail className="w-3.5 h-3.5 text-blue-500" /> : <Slack className="w-3.5 h-3.5 text-purple-500" />}
                    <span className="text-[10px] font-bold text-text-dim">{log.channel}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-black tracking-widest border",
                    log.status === 'success' ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-red-500/10 text-red-500 border-red-500/20"
                  )}>
                    {log.status.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-text-main text-[10px] font-bold">{log.source}</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => setViewingLog(log)}
                    className="text-[9px] font-black uppercase tracking-widest text-blue-500 hover:text-blue-600 underline underline-offset-4 decoration-blue-500/30"
                  >
                    View Message
                  </button>
                </td>
              </tr>
            ))}
            {filteredLogs.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-20 text-center">
                  <div className="flex flex-col items-center gap-3 opacity-30">
                    <History className="w-10 h-10" />
                    <p className="text-xs font-black uppercase tracking-widest">No logs found for this filter</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderUserManager = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-text-main font-black text-lg tracking-tight">로그인 계정 관리</h3>
          <p className="text-[11px] text-text-dim mt-1 font-medium italic opacity-70">시스템 접속 권한을 가진 관리자 및 뷰어 계정입니다.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setActiveSubTab('logs')}
            className="bg-muted text-text-main border border-border px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-muted/80 shadow-sm transition-all flex items-center gap-2"
          >
            <History className="w-4 h-4" />
            Audit LOG
          </button>
          <button 
            onClick={() => setIsCreatingAccount(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-3 transition-all shadow-lg shadow-blue-600/20"
          >
            <Plus className="w-5 h-5" />
            계정 생성
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Admin Table */}
        <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm transition-colors border-t-8 border-t-blue-600">
          <div className="p-5 bg-muted/30 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20 shadow-inner"><Shield className="w-5 h-5 text-blue-500" /></div>
              <span className="text-xs font-black text-text-main uppercase tracking-widest">ADMINISTRATORS</span>
            </div>
            <span className="text-[10px] text-text-dim font-black uppercase tracking-tighter bg-muted px-2 py-1 rounded-lg border border-border/50">Total: 4</span>
          </div>
          <div className="divide-y divide-border">
            {[1, 2].map(i => (
              <div key={i} className="p-5 flex items-center justify-between hover:bg-muted/50 transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-600 text-sm font-black border border-blue-500/20 group-hover:scale-110 transition-transform">A</div>
                  <div>
                    <p className="text-sm font-black text-text-main tracking-tight">admin_kowepo_{i}</p>
                    <p className="text-[10px] text-text-dim font-medium uppercase tracking-tighter">최근 활동: {i}시간 전</p>
                  </div>
                </div>
                <div className="flex gap-2">
                   <button className="p-2.5 text-text-dim hover:text-blue-500 transition-colors bg-muted/50 rounded-xl border border-border/50"><Key className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Viewer Table */}
        <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm transition-colors border-t-8 border-t-text-dim/20">
          <div className="p-5 bg-muted/30 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
               <div className="p-2 bg-muted rounded-lg border border-border/10 shadow-inner"><Users className="w-5 h-5 text-text-dim" /></div>
              <span className="text-xs font-black text-text-main uppercase tracking-widest">VIEWERS (SITE ROLES)</span>
            </div>
            <span className="text-[10px] text-text-dim font-black uppercase tracking-tighter bg-muted px-2 py-1 rounded-lg border border-border/50">Total: 12</span>
          </div>
          <div className="divide-y divide-border">
            {[1, 2].map(i => (
              <div key={i} className="p-5 flex items-center justify-between hover:bg-muted/50 transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center text-text-dim text-sm font-black border border-border/50 group-hover:scale-110 transition-transform">V</div>
                  <div>
                    <p className="text-sm font-black text-text-main tracking-tight">viewer_plant_{i}</p>
                    <p className="text-[10px] text-text-dim font-medium uppercase tracking-tighter">현장 대형 모니터용 (ReadOnly)</p>
                  </div>
                </div>
                <button className="p-2.5 text-text-dim hover:text-red-500 transition-colors bg-muted/50 rounded-xl border border-border/50"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col gap-8">
      {/* Tab Navigation */}
      <div className="flex items-center gap-8 border-b border-border shadow-sm">
        {[
          { id: 'emails', icon: Mail, label: '알림 수신자 설정' },
          { id: 'users', icon: Shield, label: '계정/권한 관리' },
          { id: 'logs', icon: History, label: '알림 발송 이력' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as any)}
            className={cn(
              "flex items-center gap-2 pb-5 px-2 text-sm font-black uppercase tracking-widest transition-all relative",
              activeSubTab === tab.id ? "text-blue-500" : "text-text-dim hover:text-text-main"
            )}
          >
            <tab.icon className="w-4.5 h-4.5" />
            {tab.label}
            {activeSubTab === tab.id && (
              <motion.div layoutId="subTab" className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500 rounded-t-full" />
            )}
          </button>
        ))}
      </div>

      <motion.div
        key={activeSubTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1"
      >
        {activeSubTab === 'emails' && renderEmailManager()}
        {activeSubTab === 'users' && renderUserManager()}
        {activeSubTab === 'logs' && renderNotificationLogs()}
      </motion.div>

      <AnimatePresence>
        {isRegistering && renderRegistrationForm()}
        {isCreatingAccount && renderCreateAccountForm()}
        {viewingLog && (
          <Modal title="알림 상세 내용" onClose={() => setViewingLog(null)} icon={Mail}>
            <div className="space-y-6">
              <div className="p-4 bg-muted border border-border rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
                    {viewingLog.channel === 'Email' ? <Mail className="w-5 h-5" /> : <Slack className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-text-main uppercase tracking-widest">Message via {viewingLog.channel}</h4>
                    <p className="text-[10px] text-text-dim font-mono">{viewingLog.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[9px] text-text-dim font-black uppercase tracking-widest mb-1">To: {viewingLog.name}</p>
                  <p className="text-[9px] text-text-dim font-black uppercase tracking-widest">Source: {viewingLog.source}</p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-text-dim uppercase tracking-widest block">Message Payload</label>
                <div className="bg-muted border border-border rounded-2xl p-6 shadow-inner">
                   <p className="text-text-main text-sm font-medium leading-relaxed leading-relaxed whitespace-pre-wrap font-mono">
                     {viewingLog.msg}
                   </p>
                </div>
              </div>

              <div className="flex gap-4 pt-2">
                <button 
                  onClick={() => setViewingLog(null)}
                  className="w-full px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-xl shadow-blue-600/20 transition-all"
                >
                  확인 완료
                </button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminView;
