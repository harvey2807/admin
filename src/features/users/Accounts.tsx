import React, { useEffect, useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  getPaginationRowModel,
  getFilteredRowModel,
} from '@tanstack/react-table';
import '../../styles/Accounts.css';
import { accountController } from '../users/AccountController';

// Cập nhật Interface khớp với Model Java
interface User {
  id: string; // Chuyển sang string cho MongoDB ID
  username: string;
  fullname: string;
  sdt: string;
  mail: string;
  role: 'ADMIN' | 'USER';
  isActive: 'ACTIVE' | 'INACTIVE';
  avatarUrl?: string;
  createdAt?: string;
}

const columnHelper = createColumnHelper<User>();

const Accounts: React.FC = () => {
  const [globalFilter, setGlobalFilter] = useState('');
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // --- FIX TÊN CÁC STATE ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Định nghĩa cột
  const columns = [
    columnHelper.accessor('id', { header: 'ID', meta: { className: 'w-id' } }),
    columnHelper.accessor('username', { 
        header: 'Username',
        meta: { className: 'w-user' },
        cell: info => <strong>{info.getValue()}</strong>
    }),
    columnHelper.accessor('fullname', { 
        header: 'Fullname',
        meta: { className: 'w-name' },
        cell: info => <strong>{info.getValue()}</strong>
    }),
    columnHelper.accessor('sdt', { header: 'Phone' , enableGlobalFilter: false, meta: { className: 'w-phone' }}),
    columnHelper.accessor('mail', { header: 'Email', enableGlobalFilter: false, meta: { className: 'w-mail' } }),
    columnHelper.accessor('role', { header: 'Role' , enableGlobalFilter: false, meta: { className: 'w-role' } }),
    columnHelper.accessor('isActive', { 
        header: 'Status', 
        enableGlobalFilter: false,
        meta: { className: 'w-status' },
        cell: info => {
            const value = info.getValue();
            const isActive = value === "ACTIVE"; 
            return (
                <span className={`status-badge ${isActive ? 'status-active' : 'status-locked'}`}>
                    {isActive ? 'Active' : 'Locked'}
                </span>
            );
        }
      }),
    columnHelper.display({
      id: 'actions',
      header: 'Thao tác',
      meta: { className: 'w-actions' },
      cell: (info) => (
        <div style={{ display: 'flex', gap: '5px' }}>
          <button className="btn btn-edit" onClick={() => handleOpenEditModal(info.row.original)}>Sửa</button>
          <button className="btn btn-delete" onClick={() => handleDelete(String(info.row.original.id))}>Xóa</button>
        </div>
      ),
    }),
  ];

  // --- HÀM XỬ LÝ XÓA ---
  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tài khoản này?')) {
      try {
        await accountController.deleteUser(id);
        alert("Xóa thành công!");
        fetchUsers(); 
      } catch (error) {
        alert("Xóa thất bại!");
      }
    }
  };

  // --- HÀM XỬ LÝ POPUP SỬA ---
  const handleOpenEditModal = (user: User) => {
    setEditingUser({ ...user });
    setPreviewUrl(user.avatarUrl || null); // Hiển thị ảnh cũ nếu có
    setSelectedFile(null); // Reset file đã chọn
    setIsModalOpen(true);
  };

  // --- XỬ LÝ FILE ẢNH ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file)); // Tạo link preview tạm thời
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      const formData = new FormData();
      // Đóng gói JSON User vào FormData cho Spring Boot @RequestPart
      formData.append('user', new Blob([JSON.stringify(editingUser)], { type: 'application/json' }));
      
      if (selectedFile) {
        formData.append('file', selectedFile);
      }

      await accountController.updateUser(editingUser.id, formData);
      alert("Cập nhật thành công!");
      setIsModalOpen(false);
      fetchUsers();
    } catch (error) {
      alert("Cập nhật thất bại!");
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const result = await accountController.getUsers();
      setData(result);
    } catch (error) {
      alert("Không thể tải dữ liệu!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const table = useReactTable({
    data,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: { pagination: { pageSize: 5 } },
  });

  return (
    <div className="accounts-page">
      <div className="table-header-actions">
        <h1 className="title-header">Quản lý tài khoản</h1>
      </div>
      <div className="search">
        <input
          value={globalFilter ?? ''}
          onChange={e => setGlobalFilter(e.target.value)}
          className="search-input"
          placeholder="Search ..."
        />
      </div>
      <div className="table-wrapper">
        <table className="admin-table">
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id} className={(header.column.columnDef.meta as any)?.className}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {loading ? (
                <tr><td colSpan={columns.length} style={{textAlign: 'center'}}>Đang tải dữ liệu...</td></tr>
            ) : (
                table.getRowModel().rows.map(row => (
                <tr key={row.id}>
                    {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className={(cell.column.columnDef.meta as any)?.className}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                    ))}
                </tr>
                ))
            )}
          </tbody>
        </table>

        <div className="pagination">
          <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="btn">Trở lại</button>
          <span>Trang {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}</span>
          <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="btn">Tiếp</button>
        </div>
      </div>

      {isModalOpen && editingUser && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Chỉnh sửa người dùng</h2>
            <form onSubmit={handleUpdateUser}>
              
              <div className="avatar-upload-section">
                <div className="avatar-preview">
                  {previewUrl ? (
                    <img src={previewUrl} alt="Avatar" />
                  ) : (
                    <div className="avatar-placeholder">No Image</div>
                  )}
                </div>
                <input type="file" accept="image/*" onChange={handleFileChange} id="avatar-input" hidden />
                <label htmlFor="avatar-input" className="btn-upload-label">Thay đổi ảnh đại diện</label>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>Họ tên</label>
                  <input 
                    type="text" 
                    value={editingUser.fullname} 
                    onChange={(e) => setEditingUser({...editingUser, fullname: e.target.value})}
                    required 
                  />
                </div>

                <div className="form-group">
                  <label>Số điện thoại</label>
                  <input 
                    type="text" 
                    value={editingUser.sdt} 
                    onChange={(e) => setEditingUser({...editingUser, sdt: e.target.value})}
                    required 
                  />
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input 
                    type="email" 
                    value={editingUser.mail} 
                    onChange={(e) => setEditingUser({...editingUser, mail: e.target.value})}
                    required 
                  />
                </div>

                <div className="form-group">
                  <label>Tên đăng nhập (ID)</label>
                  <input type="text" value={editingUser.username} disabled style={{background: '#f1f5f9'}} />
                </div>

                <div className="form-group">
                  <label>Quyền hạn (Role)</label>
                  <select 
                    value={editingUser.role} 
                    onChange={(e) => setEditingUser({...editingUser, role: e.target.value as any})}
                  >
                    <option value="USER">USER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Trạng thái</label>
                  <select 
                    value={editingUser.isActive} 
                    onChange={(e) => setEditingUser({...editingUser, isActive: e.target.value as any})}
                  >
                    <option value="ACTIVE">Hoạt động (ACTIVE)</option>
                    <option value="INACTIVE">Bị khóa (INACTIVE)</option>
                  </select>
                </div>
              </div>

              {editingUser.createdAt && (
                <div className="created-at-info">
                  Ngày tạo: {new Date(editingUser.createdAt).toLocaleString()}
                </div>
              )}

              <div className="modal-actions">
                <button type="button" className="btn btn-cancel" onClick={() => setIsModalOpen(false)}>Hủy</button>
                <button type="submit" className="btn btn-edit">Lưu thay đổi</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Accounts;