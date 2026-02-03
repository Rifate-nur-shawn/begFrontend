"use client";

import { useState } from "react";
import { useAdminUsers } from "@/lib/api/users-hooks";
import { UserFilter } from "@/types/admin-types";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Users,
  Loader2,
  RefreshCw,
  Shield,
  User,
  Mail,
  Phone,
} from "lucide-react";
import clsx from "clsx";

export default function AdminUsersPage() {
  const [filter, setFilter] = useState<UserFilter>({
    page: 1,
    limit: 20,
  });

  const [searchInput, setSearchInput] = useState("");
  const { users, meta, isLoading, isError, mutate } = useAdminUsers(filter);

  const handleSearch = () => {
    setFilter((prev) => ({ ...prev, search: searchInput, page: 1 }));
  };

  const goToPage = (newPage: number) => {
    if (newPage >= 1 && newPage <= meta.totalPages) {
      setFilter((prev) => ({ ...prev, page: newPage }));
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display">Users</h1>
          <p className="text-neutral-500 text-sm mt-1">
            Manage registered users and administrators
          </p>
        </div>
        <button
          onClick={() => mutate()}
          className="px-4 py-2 border border-neutral-200 rounded-sm hover:bg-neutral-50 transition-colors flex items-center gap-2"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 border border-neutral-200 rounded-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-sm">
              <Users size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-medium">{meta.total}</p>
              <p className="text-xs text-neutral-500">Total Users</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 border border-neutral-200 rounded-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-50 rounded-sm">
              <User size={20} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-medium">
                {users.filter((u) => u.role === "customer").length}
              </p>
              <p className="text-xs text-neutral-500">Customers</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 border border-neutral-200 rounded-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-50 rounded-sm">
              <Shield size={20} className="text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-medium">
                {users.filter((u) => u.role === "admin").length}
              </p>
              <p className="text-xs text-neutral-500">Admins</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 border border-neutral-200 rounded-sm mb-6">
        <div className="flex gap-4 items-center">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-neutral-900"
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-neutral-900 text-white rounded-sm text-sm hover:bg-neutral-800 transition-colors"
          >
            Search
          </button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-neutral-400" size={32} />
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="bg-red-50 text-red-600 p-4 rounded-sm text-center">
          Failed to load users. Please try again.
        </div>
      )}

      {/* Users Grid */}
      {!isLoading && !isError && (
        <>
          {users.length === 0 ? (
            <div className="bg-white border border-neutral-200 rounded-sm p-12 text-center">
              <Users size={48} className="mx-auto text-neutral-200 mb-4" />
              <p className="text-neutral-500">No users found</p>
            </div>
          ) : (
            <div className="bg-white border border-neutral-200 rounded-sm overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-neutral-50 border-b border-neutral-200">
                    <th className="text-left p-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="text-left p-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="text-left p-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="text-left p-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Joined
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-neutral-50 transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center overflow-hidden">
                            {user.avatar ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={user.avatar}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <User size={20} className="text-neutral-400" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">
                              {user.firstName || user.lastName
                                ? `${user.firstName} ${user.lastName}`.trim()
                                : "No name"}
                            </p>
                            <p className="text-xs text-neutral-500 font-mono">
                              {user.id.slice(0, 8)}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <Mail size={14} className="text-neutral-400" />
                            <span>{user.email}</span>
                          </div>
                          {user.phone && (
                            <div className="flex items-center gap-2 text-sm text-neutral-500">
                              <Phone size={14} className="text-neutral-400" />
                              <span>{user.phone}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <span
                          className={clsx(
                            "px-2 py-1 rounded-full text-xs font-medium",
                            user.role === "admin"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-blue-100 text-blue-800"
                          )}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-neutral-600">
                        {formatDate(user.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {meta.totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-neutral-500">
                Showing {(meta.page - 1) * meta.limit + 1} -{" "}
                {Math.min(meta.page * meta.limit, meta.total)} of {meta.total}{" "}
                users
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => goToPage(meta.page - 1)}
                  disabled={meta.page === 1}
                  className="p-2 border border-neutral-200 rounded-sm hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="text-sm px-3">
                  Page {meta.page} of {meta.totalPages}
                </span>
                <button
                  onClick={() => goToPage(meta.page + 1)}
                  disabled={meta.page === meta.totalPages}
                  className="p-2 border border-neutral-200 rounded-sm hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
