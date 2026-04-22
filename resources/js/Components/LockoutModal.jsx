import React from 'react';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import { ShieldAlert, Clock, Calendar, Lock } from 'lucide-react';

export default function LockoutModal({ show, onClose, lockoutData }) {
    if (!lockoutData) return null;

    return (
        <Modal show={show} onClose={onClose} maxWidth="md">
            <div className="p-0 overflow-hidden">
                {/* Header with high contrast */}
                <div className="bg-slate-950 p-8 text-center relative overflow-hidden">
                    {/* Abstract background elements */}
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-red-500/10 rounded-full blur-3xl"></div>
                    
                    <div className="relative z-10">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-red-500 to-indigo-600 p-0.5 shadow-2xl mb-6">
                            <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center">
                                <ShieldAlert className="w-10 h-10 text-red-500" />
                            </div>
                        </div>
                        <h2 className="text-3xl font-black text-white tracking-tight">Access Restricted</h2>
                        <p className="text-slate-400 font-medium mt-2">Security Enforcement Active</p>
                    </div>
                </div>

                {/* Content */}
                <div className="p-8 bg-white">
                    <div className="space-y-6">
                        <div className="p-4 bg-red-50 border border-red-100 rounded-2xl">
                            <p className="text-red-800 text-sm font-semibold text-center leading-relaxed">
                                {lockoutData.message}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                                <Clock className="w-5 h-5 text-slate-400 mx-auto mb-2" />
                                <span className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Time Remaining</span>
                                <span className="text-lg font-bold text-slate-900">{lockoutData.wait_text}</span>
                            </div>
                            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                                <Calendar className="w-5 h-5 text-slate-400 mx-auto mb-2" />
                                <span className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Unlocks At</span>
                                <span className="text-lg font-bold text-slate-900">
                                    {new Date(lockoutData.unlock_at).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-col items-center gap-4 text-center">
                            <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
                                <Lock className="w-3 h-3" />
                                <span>Policy: 1h Session / 12h Cooldown</span>
                            </div>
                            <p className="text-slate-500 text-xs leading-relaxed max-w-sm">
                                To maintain system integrity, administrative accounts are subject to mandatory rest periods. Access will be restored automatically at the time specified above.
                            </p>
                        </div>

                        <div className="pt-4">
                            <SecondaryButton 
                                onClick={onClose} 
                                className="w-full justify-center h-14 rounded-2xl font-black text-sm uppercase tracking-widest border-2 hover:bg-slate-50 transition-all"
                            >
                                I Understand
                            </SecondaryButton>
                        </div>
                    </div>
                </div>
                
                {/* Footer bar */}
                <div className="bg-slate-50 py-4 border-t border-slate-100 text-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Elevate Interiors Security Grid</p>
                </div>
            </div>
        </Modal>
    );
}
