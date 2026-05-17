import { useEffect, useState } from 'react';
import { Filter, Download, MoreVertical, ShieldCheck, AlertTriangle, Activity, Plus, Lock, X } from 'lucide-react';

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    fullName: '',
    mail: '',
    phone: '',
    roleName: 'CUSTOMER',
    status: 'ACTIVE',
  });

  const [pendingPartners, setPendingPartners] = useState<import('../../types/api').ApiPartner[]>([]);

  const loadData = async () => {
    setLoading(true);
    try {
      const list = await userService.getAdminUsers();
      setUsers(list.map(mapUser));
      const partners = await userService.getPendingPartners();
      setPendingPartners(partners);
      setErr(null);
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Không tải được dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredUsers = users.filter((user) => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Administrators') return user.role === 'ADMIN';
    if (activeTab === 'Readers') return user.role === 'CUSTOMER';
    if (activeTab === 'Partners') return user.role === 'PARTNER';
    return true;
  });

  const handleCreate = () => {
    setEditingId(null);
    setFormData({
      username: '',
      password: '',
      fullName: '',
      mail: '',
      phone: '',
      roleName: 'CUSTOMER',
      status: 'ACTIVE',
    });
    setIsModalOpen(true);
  };

  const handleEdit = (id: number) => {
    const row = users.find((u) => u.id === id);
    if (!row) return;
    setEditingId(id);
    setFormData({
      username: row.name, // Will be overridden if API returns raw username, but we do our best
      password: '',
      fullName: row.name,
      mail: row.email !== '—' ? row.email : '',
      phone: '',
      roleName: row.rawRole || 'CUSTOMER',
      status: row.status !== '—' ? row.status : 'ACTIVE',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username.trim() || (!editingId && !formData.password.trim())) {
      setErr('Vui lòng nhập Username và Password');
      return;
    }
    
    try {
      const payload = {
        ...formData,
        username: formData.username.trim(),
        password: formData.password.trim(),
        fullName: formData.fullName.trim(),
        mail: formData.mail.trim() || undefined,
        phone: formData.phone.trim() || undefined,
      };
      
      if (editingId) {
        if (!payload.password) delete (payload as any).password;
        await userService.updateAdminUser(editingId, payload);
      } else {
        await userService.createAdminUser(payload);
      }
      setIsModalOpen(false);
      await loadData();
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Lưu người dùng thất bại');
    }
  };

  const handleDelete = (id: number) => {
    const run = async () => {
      if (!window.confirm('Bạn muốn xóa người dùng này?')) return;
      await userService.deleteAdminUser(id);
      await loadData();
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
            {['All', 'Administrators', 'Readers', 'Partners', 'Partner Requests'].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`text-sm font-semibold pb-4 -mb-4 transition-colors ${
                  activeTab === tab ? 'text-[#4f46e5] border-b-2 border-[#4f46e5] font-bold' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {tab === 'All' ? 'All Users' : tab === 'Partner Requests' ? 'Yêu cầu đối tác' : tab}
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
                <th className="px-6 py-4">{activeTab === 'Partner Requests' ? 'Store Identity' : 'User Identity'}</th>
                <th className="px-6 py-4">{activeTab === 'Partner Requests' ? 'Status' : 'Role'}</th>
                <th className="px-6 py-4">{activeTab === 'Partner Requests' ? 'Address' : 'Created Date'}</th>
                <th className="px-6 py-4">{activeTab === 'Partner Requests' ? 'Description' : 'Status'}</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {activeTab === 'Partner Requests' ? (
                loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500 text-sm">
                      Đang tải…
                    </td>
                  </tr>
                ) : pendingPartners.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500 text-sm">
                      Không có yêu cầu đối tác nào.
                    </td>
                  </tr>
                ) : (
                  pendingPartners.map((partner) => (
                    <tr key={partner.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 text-xs font-bold text-slate-400">{partner.id}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold">
                            {partner.storeName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-[#1e1b4b]">{partner.storeName}</p>
                            <p className="text-xs text-slate-500">{partner.username || '—'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wider bg-yellow-50 text-yellow-600">
                          {partner.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{partner.address || '—'}</td>
                      <td className="px-6 py-4">
                        <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                          {partner.description || '—'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-1">
                          <button
                            type="button"
                            onClick={async () => {
                              if (!window.confirm('Phê duyệt yêu cầu này?')) return;
                              try {
                                await userService.approvePartner(partner.id);
                                loadData();
                              } catch (e) {
                                setErr(e instanceof Error ? e.message : 'Duyệt thất bại');
                              }
                            }}
                            className="px-4 py-1.5 bg-[#4f46e5] text-white rounded-lg text-xs font-bold hover:bg-[#4338ca] transition-colors"
                          >
                            Phê duyệt
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )
              ) : (
                loading ? (
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
                )
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

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-xl font-serif font-bold text-[#1e1b4b]">
                {editingId ? 'Cập nhật người dùng' : 'Thêm người dùng mới'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              <form id="user-form" onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Username *</label>
                    <input 
                      required 
                      type="text" 
                      value={formData.username}
                      onChange={(e) => setFormData({...formData, username: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5] outline-none transition-all" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">
                      Password {editingId ? '(Bỏ trống nếu không đổi)' : '*'}
                    </label>
                    <input 
                      required={!editingId}
                      type="password" 
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5] outline-none transition-all" 
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Họ và tên</label>
                    <input 
                      type="text" 
                      value={formData.fullName}
                      onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5] outline-none transition-all" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Email</label>
                    <input 
                      type="email" 
                      value={formData.mail}
                      onChange={(e) => setFormData({...formData, mail: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5] outline-none transition-all" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Số điện thoại</label>
                    <input 
                      type="text" 
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5] outline-none transition-all" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Vai trò</label>
                    <select 
                      value={formData.roleName}
                      onChange={(e) => setFormData({...formData, roleName: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5] outline-none transition-all"
                    >
                      <option value="CUSTOMER">Người dùng (Customer)</option>
                      <option value="PARTNER">Đối tác (Partner)</option>
                      <option value="ADMIN">Quản trị viên (Admin)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Trạng thái</label>
                    <select 
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5] outline-none transition-all"
                    >
                      <option value="ACTIVE">Hoạt động (ACTIVE)</option>
                      <option value="LOCKED">Đã khóa (LOCKED)</option>
                    </select>
                  </div>
                </div>
              </form>
            </div>
            
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button 
                type="button" 
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-200 transition-colors"
              >
                Hủy
              </button>
              <button 
                type="submit" 
                form="user-form"
                className="px-6 py-2.5 bg-[#1e1b4b] text-white rounded-xl text-sm font-bold hover:bg-[#312e81] transition-colors shadow-lg"
              >
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
