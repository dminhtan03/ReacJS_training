import { Header, Sidebar } from "@/components/Layout";
import { ThemeContext } from "@/context/ThemeContext";
import React, { useState, useContext, useEffect } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  avatar?: string;
  isActive?: boolean;
}

const ManageUsersPage: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { theme } = useContext(ThemeContext);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'create' | 'edit' | 'delete'>('create');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: '',
    department: '',
    accountType: 'USER'
  });
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  const [submitLoading, setSubmitLoading] = useState(false);
  const usersPerPage = 10;

  // Fetch users from API
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://689c2efc58a27b18087d282f.mockapi.io/api/v1/users/signup');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter users based on search term and status
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && user.isActive !== false) ||
                         (filterStatus === 'inactive' && user.isActive === false);
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handleSelectUser = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === currentUsers.length && currentUsers.length > 0) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(currentUsers.map(user => user.id));
    }
  };

  const handleCreateUser = () => {
    setModalType('create');
    setSelectedUser(null);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      phoneNumber: '',
      department: '',
      accountType: 'USER'
    });
    setFormErrors({});
    setShowModal(true);
  };

  const handleEditUser = (user: User) => {
    setModalType('edit');
    setSelectedUser(user);
    // Split name into firstName and lastName if possible
    const nameParts = (user.name || '').split(' ');
    setFormData({
      firstName: nameParts[0] || '',
      lastName: nameParts.slice(1).join(' ') || '',
      email: user.email || '',
      password: '', // Don't pre-fill password for security
      phoneNumber: '', // Add phoneNumber to User interface if available
      department: '', // Add department to User interface if available
      accountType: 'USER' // Add accountType to User interface if available
    });
    setFormErrors({});
    setShowModal(true);
  };

  const handleDeleteUser = (user: User) => {
    setModalType('delete');
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleBulkDelete = () => {
    if (selectedUsers.length > 0) {
      setModalType('delete');
      setShowModal(true);
    }
  };

  // Validate form data
  const validateForm = () => {
    const errors: {[key: string]: string} = {};

    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.password.trim()) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (!formData.phoneNumber.trim()) {
      errors.phoneNumber = 'Phone number is required';
    } else if (!/^[0-9+\-\s()]+$/.test(formData.phoneNumber)) {
      errors.phoneNumber = 'Please enter a valid phone number';
    }

    if (!formData.department.trim()) {
      errors.department = 'Department is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Create user API call
  const createUser = async (userData: any) => {
    try {
      const response = await fetch('https://689c2efc58a27b18087d282f.mockapi.io/api/v1/users/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...userData,
          createdAt: Math.floor(Date.now() / 1000), // Unix timestamp
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create user: ${response.statusText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  };

  // Update user API call (if needed)
  const updateUser = async (userId: string, userData: any) => {
    try {
      const response = await fetch(`https://689c2efc58a27b18087d282f.mockapi.io/api/v1/users/signup/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error(`Failed to update user: ${response.statusText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  };

  // Delete API functions
  const deleteUser = async (userId: string) => {
    try {
      const response = await fetch(`https://689c2efc58a27b18087d282f.mockapi.io/api/v1/users/signup/${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Failed to delete user: ${response.statusText}`);
      }

      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      return false;
    }
  };

  const bulkDeleteUsers = async (userIds: string[]) => {
    try {
      const deletePromises = userIds.map(id => deleteUser(id));
      const results = await Promise.allSettled(deletePromises);
      
      const successCount = results.filter(result => result.status === 'fulfilled' && result.value === true).length;
      const failCount = userIds.length - successCount;

      return { successCount, failCount };
    } catch (error) {
      console.error('Error in bulk delete:', error);
      return { successCount: 0, failCount: userIds.length };
    }
  };

  const confirmAction = async () => {
    if (modalType === 'delete') {
      setDeleteLoading(true);
      
      try {
        if (selectedUser) {
          const success = await deleteUser(selectedUser.id);
          if (success) {
            setUsers(prev => prev.filter(user => user.id !== selectedUser.id));
          }
        } else {
          const { successCount } = await bulkDeleteUsers(selectedUsers);
          if (successCount > 0) {
            await fetchUsers();
            setSelectedUsers([]);
          }
        }
      } catch (error) {
        console.error('Delete operation failed:', error);
      } finally {
        setDeleteLoading(false);
        setShowModal(false);
      }
    } else if (modalType === 'create' || modalType === 'edit') {
      if (!validateForm()) {
        return;
      }

      setSubmitLoading(true);
      
      try {
        if (modalType === 'create') {
          await createUser(formData);
        } else if (modalType === 'edit' && selectedUser) {
          await updateUser(selectedUser.id, formData);
        }
        
        // Refresh users list
        await fetchUsers();
        setShowModal(false);
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          phoneNumber: '',
          department: '',
          accountType: 'USER'
        });
        setFormErrors({});
      } catch (error) {
        console.error('Form submission failed:', error);
        // You could show an error message to the user here
      } finally {
        setSubmitLoading(false);
      }
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 dark:from-gray-950 dark:via-blue-950/30 dark:to-indigo-950/20">
      <Header />
      <div className="flex min-h-[calc(100vh-64px)]">
        {/* Sidebar */}
        <div
          className={`fixed inset-y-0 left-0 z-40 transform ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 md:static md:flex transition-all duration-300 ease-out backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-r border-gray-200/50 dark:border-gray-700/50`}
        >
          <Sidebar />
        </div>

        {/* Overlay cho mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 md:hidden transition-all duration-300"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <div className="flex-grow p-4 md:p-8 overflow-hidden">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Enhanced Header with Stats */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 rounded-3xl blur-xl"></div>
              <div className="relative backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 rounded-3xl p-8 shadow-xl border border-gray-200/50 dark:border-gray-700/50">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="space-y-2">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-700 to-purple-700 dark:from-white dark:via-blue-300 dark:to-purple-300 bg-clip-text text-transparent">
                      User Management
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">
                      Manage and monitor user accounts with advanced controls
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-4">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-2xl shadow-lg">
                      <div className="text-2xl font-bold">{users.length}</div>
                      <div className="text-blue-100 text-sm">Total Users</div>
                    </div>
                   
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Action Bar */}
            <div className="backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-6">
              <div className="flex flex-col xl:flex-row gap-6 items-stretch xl:items-center">
                {/* Search and Filter Section */}
                <div className="flex flex-1 flex-col sm:flex-row gap-4">
                  <div className="relative flex-1 max-w-md">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      placeholder="Search users by name or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300/60 dark:border-gray-600/60 rounded-xl bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/60 transition-all duration-200 placeholder-gray-400"
                    />
                  </div>
                  
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 flex-wrap">
                  <button
                    onClick={handleCreateUser}
                    className="group px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add User
                  </button>
                  {selectedUsers.length > 0 && (
                    <button
                      onClick={handleBulkDelete}
                      className="group px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete Selected ({selectedUsers.length})
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Enhanced Users Table */}
            <div className="backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
              {loading ? (
                <div className="flex flex-col justify-center items-center py-20">
                  <div className="relative">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 opacity-20 blur-xl animate-pulse"></div>
                  </div>
                  <div className="mt-6 text-lg font-medium text-gray-700 dark:text-gray-300">Loading users...</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Please wait while we fetch the data</div>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200/50 dark:divide-gray-700/50">
                      <thead className="bg-gradient-to-r from-gray-50/80 to-blue-50/40 dark:from-gray-900/80 dark:to-blue-900/40">
                        <tr>
                          <th className="px-6 py-4 text-left">
                            <input
                              type="checkbox"
                              checked={selectedUsers.length === currentUsers.length && currentUsers.length > 0}
                              onChange={handleSelectAll}
                              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2 transition-all duration-200"
                            />
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                            User Information
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                            Contact
                          </th>
                          
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200/30 dark:divide-gray-700/30">
                        {currentUsers.map((user, index) => (
                          <tr 
                            key={user.id} 
                            className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/30 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 transition-all duration-200 transform hover:scale-[1.01]"
                          >
                            <td className="px-6 py-4">
                              <input
                                type="checkbox"
                                checked={selectedUsers.includes(user.id)}
                                onChange={() => handleSelectUser(user.id)}
                                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2 transition-all duration-200"
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center group">
                                <div className="relative h-12 w-12 rounded-full overflow-hidden shadow-lg ring-2 ring-white dark:ring-gray-700 group-hover:ring-blue-300 dark:group-hover:ring-blue-600 transition-all duration-200">
                                  {user.avatar ? (
                                    <img className="h-12 w-12 rounded-full object-cover" src={user.avatar} alt="" />
                                  ) : (
                                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center">
                                      <span className="text-lg font-bold text-white">
                                        {user.name?.charAt(0)?.toUpperCase() || 'U'}
                                      </span>
                                    </div>
                                  )}
                                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent"></div>
                                </div>
                                <div className="ml-4">
                                  <div className="text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                                    {user.name || 'Unnamed User'}
                                  </div>
                                  <div className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                                    #{user.id}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                {user.email}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                Primary email
                              </div>
                            </td>
                           
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-3">
                                <button
                                  onClick={() => handleEditUser(user)}
                                  className="group px-3 py-2 text-blue-600 hover:text-white hover:bg-blue-600 dark:text-blue-400 dark:hover:text-white dark:hover:bg-blue-500 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md"
                                >
                                  <svg className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                </button>
                                <button
                                  onClick={() => handleDeleteUser(user)}
                                  className="group px-3 py-2 text-red-600 hover:text-white hover:bg-red-600 dark:text-red-400 dark:hover:text-white dark:hover:bg-red-500 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md"
                                >
                                  <svg className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Enhanced Pagination */}
                  {totalPages > 1 && (
                    <div className="px-6 py-6 border-t border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-gray-50/30 to-blue-50/20 dark:from-gray-900/30 dark:to-blue-900/20">
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                          Showing <span className="font-bold text-blue-600 dark:text-blue-400">{indexOfFirstUser + 1}</span> to{' '}
                          <span className="font-bold text-blue-600 dark:text-blue-400">{Math.min(indexOfLastUser, filteredUsers.length)}</span> of{' '}
                          <span className="font-bold text-blue-600 dark:text-blue-400">{filteredUsers.length}</span> users
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="px-4 py-2 border border-gray-300/60 dark:border-gray-600/60 rounded-xl text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/80 dark:hover:bg-gray-700/80 backdrop-blur-sm transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                          </button>
                          
                          <div className="flex space-x-1">
                            {Array.from({ length: totalPages }, (_, i) => i + 1)
                              .filter(page => 
                                page === 1 || 
                                page === totalPages || 
                                Math.abs(page - currentPage) <= 2
                              )
                              .map((page, index, array) => (
                                <React.Fragment key={page}>
                                  {index > 0 && array[index - 1] !== page - 1 && (
                                    <span className="px-3 py-2 text-gray-500">...</span>
                                  )}
                                  <button
                                    onClick={() => setCurrentPage(page)}
                                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md ${
                                      currentPage === page
                                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-blue-200 dark:shadow-blue-900/50'
                                        : 'border border-gray-300/60 dark:border-gray-600/60 hover:bg-white/80 dark:hover:bg-gray-700/80 backdrop-blur-sm'
                                    }`}
                                  >
                                    {page}
                                  </button>
                                </React.Fragment>
                              ))}
                          </div>

                          <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 border border-gray-300/60 dark:border-gray-600/60 rounded-xl text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/80 dark:hover:bg-gray-700/80 backdrop-blur-sm transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all duration-300">
          <div className="relative max-w-md w-full transform transition-all duration-300 scale-100">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20 rounded-2xl blur-xl"></div>
            <div className="relative backdrop-blur-xl bg-white/90 dark:bg-gray-800/90 rounded-2xl p-8 shadow-2xl border border-gray-200/50 dark:border-gray-700/50">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {modalType === 'create' && (
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Create New User
                    </span>
                  )}
                  {modalType === 'edit' && (
                    <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                      Edit User
                    </span>
                  )}
                  {modalType === 'delete' && (
                    <span className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                      Confirm Deletion
                    </span>
                  )}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  disabled={deleteLoading || submitLoading}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 disabled:opacity-50"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {modalType === 'delete' ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-center w-16 h-16 mx-auto bg-gradient-to-br from-red-100 to-orange-100 dark:from-red-900/30 dark:to-orange-900/30 rounded-full">
                    <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      {selectedUser 
                        ? `Delete "${selectedUser.name}"?`
                        : `Delete ${selectedUsers.length} selected users?`
                      }
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      This action cannot be undone. All user data will be permanently removed from the system.
                    </p>
                  </div>

                  {selectedUser && (
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 border-l-4 border-red-500">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center">
                          <span className="text-white font-bold">
                            {selectedUser.name?.charAt(0)?.toUpperCase() || 'U'}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-gray-100">{selectedUser.name}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{selectedUser.email}</div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-4">
                    <button
                      onClick={() => setShowModal(false)}
                      disabled={deleteLoading}
                      className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={confirmAction}
                      disabled={deleteLoading}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 shadow-lg hover:shadow-xl font-medium"
                    >
                      {deleteLoading && (
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      )}
                      {deleteLoading ? 'Deleting...' : 'Delete Forever'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <form onSubmit={(e) => { e.preventDefault(); confirmAction(); }} className="space-y-4">
                    {/* First Name & Last Name Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          First Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border rounded-xl bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/60 transition-all duration-200 ${
                            formErrors.firstName 
                              ? 'border-red-500 focus:ring-red-500/40 focus:border-red-500/60' 
                              : 'border-gray-300/60 dark:border-gray-600/60'
                          }`}
                          placeholder="Enter first name"
                        />
                        {formErrors.firstName && (
                          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.firstName}</p>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Last Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border rounded-xl bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/60 transition-all duration-200 ${
                            formErrors.lastName 
                              ? 'border-red-500 focus:ring-red-500/40 focus:border-red-500/60' 
                              : 'border-gray-300/60 dark:border-gray-600/60'
                          }`}
                          placeholder="Enter last name"
                        />
                        {formErrors.lastName && (
                          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.lastName}</p>
                        )}
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-xl bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/60 transition-all duration-200 ${
                          formErrors.email 
                            ? 'border-red-500 focus:ring-red-500/40 focus:border-red-500/60' 
                            : 'border-gray-300/60 dark:border-gray-600/60'
                        }`}
                        placeholder="Enter email address"
                      />
                      {formErrors.email && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.email}</p>
                      )}
                    </div>

                    {/* Password */}
                    <div>
                      <label htmlFor="password" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Password <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-xl bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/60 transition-all duration-200 ${
                          formErrors.password 
                            ? 'border-red-500 focus:ring-red-500/40 focus:border-red-500/60' 
                            : 'border-gray-300/60 dark:border-gray-600/60'
                        }`}
                        placeholder="Enter password (min. 6 characters)"
                      />
                      {formErrors.password && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.password}</p>
                      )}
                    </div>

                    {/* Phone Number & Department Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="phoneNumber" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Phone Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          id="phoneNumber"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border rounded-xl bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/60 transition-all duration-200 ${
                            formErrors.phoneNumber 
                              ? 'border-red-500 focus:ring-red-500/40 focus:border-red-500/60' 
                              : 'border-gray-300/60 dark:border-gray-600/60'
                          }`}
                          placeholder="Enter phone number"
                        />
                        {formErrors.phoneNumber && (
                          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.phoneNumber}</p>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor="department" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Department <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="department"
                          name="department"
                          value={formData.department}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border rounded-xl bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/60 transition-all duration-200 ${
                            formErrors.department 
                              ? 'border-red-500 focus:ring-red-500/40 focus:border-red-500/60' 
                              : 'border-gray-300/60 dark:border-gray-600/60'
                          }`}
                          placeholder="Enter department"
                        />
                        {formErrors.department && (
                          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.department}</p>
                        )}
                      </div>
                    </div>

                    {/* Account Type */}
                    <div>
                      <label htmlFor="accountType" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Account Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="accountType"
                        name="accountType"
                        value={formData.accountType}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300/60 dark:border-gray-600/60 rounded-xl bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/60 transition-all duration-200"
                      >
                        <option value="USER">User</option>
                        <option value="ADMIN">Admin</option>
                      </select>
                    </div>
                  </form>
                  
                  <div className="flex gap-4 pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      disabled={submitLoading}
                      className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={confirmAction}
                      disabled={submitLoading}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl font-medium flex items-center justify-center gap-2"
                    >
                      {submitLoading && (
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      )}
                      {submitLoading 
                        ? (modalType === 'create' ? 'Creating...' : 'Saving...') 
                        : (modalType === 'create' ? 'Create User' : 'Save Changes')
                      }
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsersPage;