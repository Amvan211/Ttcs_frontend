import { useEffect, useState } from 'react';
import { Filter, Download, MoreVertical, ShieldCheck, AlertTriangle, Activity, Plus, Lock } from 'lucide-react';

import { userService } from '../../services';
import type { ApiUser } from '../../types/api';

function normalizeRole(roleName: string | undefined): 'ADMIN' | 'PARTNER' | 'CUSTOMER' {
  const u = roleName?.toUpperCase() ?? '';
  if (u === 'ADMIN') return 'ADMIN';
  if (u === 'PARTNER') return 'PARTNER';
  return 'CUSTOMER';
}

function mapUser(u: ApiUser) {
  const displayName = (u.fullName && u.fullName.trim()) || u.username;
  const initials = displayName.charAt(0).toUpperCase();
  return {
    id: u.id,
    name: displayName,
    email: u.mail ?? '—',
    avatar: initials,
    role: normalizeRole(u.roleName),
    rawRole: u.roleName ?? '',
    status: u.status || '—',
    date: '—',
  };
}

export default function AdminUsers() {
  const [users, setUsers] = useState<ReturnType<typeof mapUser>[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('All');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const list = await userService.getAdminUsers();
        if (!cancelled) setUsers(list.map(mapUser));
      } catch (e) {
        if (!cancelled) setErr(e instanceof Error ? e.message : 'Không tải được người dùng');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredUsers = users.filter((user) => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Administrators') return user.role === 'ADMIN';
    if (activeTab === 'Readers') return user.role === 'CUSTOMER';
    if (activeTab === 'Partners') return user.role === 'PARTNER';
    return true;
  });

  const handleCreate = () => {
    const run = async () => {
      const username = window.prompt('Username');
      const password = window.prompt('Password');
      if (!username?.trim() || !password?.trim()) return;
      const created = await userService.createAdminUser({
        username: username.trim(),
        password: password.trim(),
        fullName: username.trim(),
        roleName: 'CUSTOMER',
        status: 'ACTIVE',
      });
      setUsers((prev) => [mapUser(created), ...prev]);
    };
    run().catch((e) => setErr(e instanceof Error ? e.message : 'Tạo người dùng thất bại'));
  };

  const handleEdit = (id: number) => {
    const run = async () => {
      const row = users.find((u) => u.id === id);
      if (!row) return;
      const nextStatus = window.prompt('Cập nhật trạng thái (ACTIVE/LOCKED)', row.status);
      if (!nextStatus?.trim()) return;
      const updated = await userService.updateAdminUser(id, { status: nextStatus.trim() });
      setUsers((prev) => prev.map((u) => (u.id === id ? mapUser(updated) : u)));
    };
    run().catch((e) => setErr(e instanceof Error ? e.message : 'Cập nhật người dùng thất bại'));
  };

  const handleDelete = (id: number) => {
    const run = async () => {
      if (!window.confirm('Bạn muốn xóa người dùng này?')) return;
      await userService.deleteAdminUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    };
    run().catch((e) => setErr(e instanceof Error ? e.message : 'Xóa người dùng thất bại'));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">DIRECTORY SYSTEM</p>
          <h1 className="text-3xl font-serif font-black text-[#1e1b4b]">User Management</h1>
          <p className="text-sm text-slate-500 mt-2 max-w-md">
            Quản lý người dùng và vai trò trong hệ thống (dữ liệu từ API).
          </p>
        </div>
        <button
          type="button"
          onClick={handleCreate}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#1e1b4b] text-white rounded-xl text-sm font-bold hover:bg-[#312e81] transition-colors shadow-lg shadow-[#1e1b4b]/20"
        >
          <Plus className="w-4 h-4" />
          Create New User
        </button>
      </div>

      {err && <div className="p-4 rounded-xl bg-red-50 text-red-700 border border-red-100 text-sm">{err}</div>}

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div className="flex gap-6">
            {['All', 'Administrators', 'Readers', 'Partners'].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`text-sm font-semibold pb-4 -mb-4 transition-colors ${
                  activeTab === tab ? 'text-[#4f46e5] border-b-2 border-[#4f46e5] font-bold' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {tab === 'All' ? 'All Users' : tab}
              </button>
            ))}
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <Filter className="w-4 h-4" />
              Filter
            </button>
            <button
              type="button"
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">User Identity</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Created Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500 text-sm">
                    Đang tải…
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500 text-sm">
                    Không có người dùng.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-xs font-bold text-slate-400">{user.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                            user.role === 'ADMIN'
                              ? 'bg-blue-100 text-blue-700'
                              : user.role === 'PARTNER'
                                ? 'bg-orange-100 text-orange-700'
                                : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {user.avatar}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[#1e1b4b]">{user.name}</p>
                          <p className="text-xs text-slate-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wider ${
                          user.role === 'ADMIN'
                            ? 'bg-blue-50 text-blue-600'
                            : user.role === 'PARTNER'
                              ? 'bg-orange-50 text-orange-600'
                              : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {user.rawRole || user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{user.date}</td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            String(user.status).toLowerCase().includes('active') ||
                            String(user.status).toLowerCase() === 'hoạt động'
                              ? 'bg-green-500'
                              : 'bg-slate-300'
                          }`}
                        />
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1">
                        <button type="button" onClick={() => handleEdit(user.id)} className="p-2 hover:bg-orange-50 rounded-lg transition-colors text-orange-500" title="Cập nhật trạng thái">
                          <Lock className="w-4 h-4" />
                        </button>
                        <button type="button" onClick={() => handleDelete(user.id)} className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-500" title="Xóa tài khoản">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-slate-100 flex justify-between items-center bg-slate-50/50">
          <span className="text-xs font-semibold text-slate-500">
            Showing {filteredUsers.length} of {users.length} users
          </span>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-serif font-bold text-[#1e1b4b] mb-1">Vitals & Security</h2>
        <p className="text-sm text-slate-500 mb-6">Real-time health telemetry of the user access layers.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#1e1b4b] p-6 rounded-2xl shadow-sm text-white relative overflow-hidden">
            <div className="absolute top-4 right-4">
              <ShieldCheck className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-sm font-bold text-blue-200 mb-2">Access Integrity</h3>
            <p className="text-xs text-blue-100/70 mb-6 max-w-[200px]">Dữ liệu người dùng được tải từ API bảo mật.</p>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-black">{users.length}</p>
              <p className="text-[10px] font-bold text-blue-300 uppercase tracking-wider">Users loaded</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">Privileged Access</h3>
                <p className="text-xs text-slate-500">Administrator accounts</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-black text-[#1e1b4b]">{users.filter((u) => u.role === 'ADMIN').length}</p>
            </div>
          </div>

          <div className="bg-[#fff1f2] p-6 rounded-2xl border border-red-100 shadow-sm">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">Risk Signals</h3>
                <p className="text-xs text-slate-500">Flagged suspicious behavior</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-red-600" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-black text-red-600">—</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center">
            <Activity className="w-6 h-6 text-slate-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">System Load Distribution</h3>
            <p className="text-xs text-slate-500 mt-2">Danh sách đồng bộ từ máy chủ.</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Sync Status</p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm font-bold text-slate-900">API</span>
          </div>
        </div>
      </div>
    </div>
  );
}
