import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Users, Mail, Trash2, UserCheck, ShieldCheck, UserX, Plus } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { authService } from '@/services/authService'
import { orderService } from '@/services/orderService'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { formatPrice } from '@/lib/constants'
import type { UserProfile, UserRole } from '@/types'

const ROLE_LABELS: Record<UserRole, string> = {
  customer: 'Customer',
  staff: 'Staff',
  admin: 'Admin',
}

export function CRMDashboard() {
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null)
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteError, setInviteError] = useState<string | null>(null)
  const queryClient = useQueryClient()

  const { data: profiles, isLoading: profilesLoading } = useQuery({
    queryKey: ['admin', 'profiles'],
    queryFn: () => authService.getAllProfiles(),
  })

  const { data: invites, isLoading: invitesLoading } = useQuery({
    queryKey: ['admin', 'invites'],
    queryFn: () => authService.getPendingInvites(),
  })

  const { data: userOrders } = useQuery({
    queryKey: ['admin', 'orders', selectedUser?.id],
    queryFn: () => orderService.getUserOrders(selectedUser!.id),
    enabled: !!selectedUser,
  })

  const updateRoleMutation = useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: UserRole }) =>
      authService.updateProfileRole(userId, role),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'profiles'] }),
  })

  const inviteMutation = useMutation({
    mutationFn: (email: string) => authService.inviteStaff(email),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'invites'] })
      setShowInviteModal(false)
      setInviteEmail('')
    },
    onError: (err) => {
      setInviteError(err instanceof Error ? err.message : 'Failed to send invite')
    },
  })

  const revokeInviteMutation = useMutation({
    mutationFn: (id: string) => authService.revokeInvite(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'invites'] }),
  })

  const handleInvite = async () => {
    setInviteError(null)
    if (!inviteEmail.trim()) return
    inviteMutation.mutate(inviteEmail.trim())
  }

  return (
    <>
      <Helmet><title>CRM — Macramumu</title></Helmet>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif text-3xl text-bark-600">Customers</h1>
            <p className="font-sans text-sm text-sand-400 mt-1">
              Manage users and staff access
            </p>
          </div>
          <Button onClick={() => setShowInviteModal(true)} leftIcon={<Plus size={16} />}>
            Invite Staff
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total Users', value: profiles?.length ?? 0, icon: <Users size={18} /> },
            { label: 'Staff', value: profiles?.filter((p) => p.role === 'staff' || p.role === 'admin').length ?? 0, icon: <UserCheck size={18} /> },
            { label: 'Pending Invites', value: invites?.length ?? 0, icon: <Mail size={18} /> },
          ].map(({ label, value, icon }) => (
            <div key={label} className="bg-white rounded-2xl border border-sand-100 p-5">
              <div className="flex items-center gap-2 text-sand-400 mb-2">
                {icon}
                <span className="font-sans text-xs uppercase tracking-wide">{label}</span>
              </div>
              <p className="font-serif text-2xl text-bark-600">{value}</p>
            </div>
          ))}
        </div>

        {/* Pending invites */}
        {(invites?.length ?? 0) > 0 && (
          <div className="mb-8">
            <h2 className="font-sans text-sm font-medium text-bark-500 uppercase tracking-wide mb-3">
              Pending Invites
            </h2>
            <div className="bg-white rounded-2xl border border-sand-100 overflow-hidden">
              {invitesLoading ? (
                <div className="p-4 text-center font-sans text-sm text-sand-400">Loading...</div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-sand-100">
                      <th className="text-left px-4 py-3 font-sans text-xs uppercase tracking-wide text-sand-400">Email</th>
                      <th className="text-left px-4 py-3 font-sans text-xs uppercase tracking-wide text-sand-400 hidden sm:table-cell">Invited</th>
                      <th className="text-right px-4 py-3 font-sans text-xs uppercase tracking-wide text-sand-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invites?.map((invite) => (
                      <tr key={invite.id} className="border-b border-sand-50">
                        <td className="px-4 py-3 font-sans text-sm text-bark-600">{invite.email}</td>
                        <td className="px-4 py-3 font-sans text-sm text-sand-400 hidden sm:table-cell">
                          {new Date(invite.invitedAt).toLocaleDateString('en-GB')}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => revokeInviteMutation.mutate(invite.id)}
                            className="p-1.5 rounded-lg text-sand-400 hover:text-red-400 hover:bg-red-50 transition-colors"
                            aria-label="Revoke invite"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* Users table */}
        <div className="bg-white rounded-2xl border border-sand-100 overflow-hidden">
          {profilesLoading ? (
            <div className="flex flex-col gap-3 p-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-14 bg-cream-200 rounded-xl animate-pulse" aria-hidden="true" />
              ))}
            </div>
          ) : (
            <table className="w-full" aria-label="Users table">
              <thead>
                <tr className="border-b border-sand-100">
                  <th className="text-left px-4 py-3 font-sans text-xs uppercase tracking-wide text-sand-400">User</th>
                  <th className="text-left px-4 py-3 font-sans text-xs uppercase tracking-wide text-sand-400 hidden sm:table-cell">Joined</th>
                  <th className="text-left px-4 py-3 font-sans text-xs uppercase tracking-wide text-sand-400">Role</th>
                  <th className="text-right px-4 py-3 font-sans text-xs uppercase tracking-wide text-sand-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {profiles?.map((profile) => (
                  <tr
                    key={profile.id}
                    className="border-b border-sand-50 hover:bg-cream-50 transition-colors cursor-pointer"
                    onClick={() => setSelectedUser(profile)}
                  >
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-sans text-sm text-bark-600 font-medium">
                          {profile.fullName ?? '—'}
                        </p>
                        <p className="font-sans text-xs text-sand-400">{profile.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className="font-sans text-sm text-sand-400">
                        {new Date(profile.createdAt).toLocaleDateString('en-GB')}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={
                        profile.role === 'admin' ? 'new' :
                        profile.role === 'staff' ? 'default' : 'soldout'
                      }>
                        {profile.role === 'admin' && <ShieldCheck size={10} className="inline mr-1" />}
                        {ROLE_LABELS[profile.role]}
                      </Badge>
                    </td>
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        {profile.role !== 'admin' && (
                          <button
                            onClick={() => updateRoleMutation.mutate({
                              userId: profile.id,
                              role: profile.role === 'staff' ? 'customer' : 'staff',
                            })}
                            className="p-1.5 rounded-lg text-sand-400 hover:text-bark-500 hover:bg-sand-100 transition-colors"
                            aria-label={profile.role === 'staff' ? 'Remove staff role' : 'Make staff'}
                            title={profile.role === 'staff' ? 'Remove staff' : 'Make staff'}
                          >
                            {profile.role === 'staff' ? <UserX size={14} /> : <UserCheck size={14} />}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {profiles?.length === 0 && (
            <div className="text-center py-12">
              <p className="font-sans text-sm text-sand-400">No users yet.</p>
            </div>
          )}
        </div>
      </div>

      {/* User detail modal */}
      <Modal
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        title={selectedUser?.fullName ?? selectedUser?.email ?? 'User'}
        size="lg"
      >
        {selectedUser && (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-cream-50 rounded-xl p-4">
                <p className="font-sans text-xs text-sand-400 uppercase tracking-wide mb-1">Email</p>
                <p className="font-sans text-sm text-bark-600">{selectedUser.email}</p>
              </div>
              <div className="bg-cream-50 rounded-xl p-4">
                <p className="font-sans text-xs text-sand-400 uppercase tracking-wide mb-1">Role</p>
                <p className="font-sans text-sm text-bark-600 capitalize">{selectedUser.role}</p>
              </div>
              <div className="bg-cream-50 rounded-xl p-4">
                <p className="font-sans text-xs text-sand-400 uppercase tracking-wide mb-1">Joined</p>
                <p className="font-sans text-sm text-bark-600">
                  {new Date(selectedUser.createdAt).toLocaleDateString('en-GB')}
                </p>
              </div>
              <div className="bg-cream-50 rounded-xl p-4">
                <p className="font-sans text-xs text-sand-400 uppercase tracking-wide mb-1">Orders</p>
                <p className="font-sans text-sm text-bark-600">{userOrders?.length ?? '—'}</p>
              </div>
            </div>

            {(userOrders?.length ?? 0) > 0 && (
              <div>
                <p className="font-sans text-sm font-medium text-bark-500 mb-2">Order History</p>
                <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
                  {userOrders?.map((order) => (
                    <div key={order.id} className="flex items-center justify-between bg-cream-50 rounded-xl px-4 py-3">
                      <div>
                        <p className="font-sans text-xs text-sand-400 font-mono">
                          #{order.id.slice(0, 8).toUpperCase()}
                        </p>
                        <p className="font-sans text-xs text-sand-400">
                          {new Date(order.createdAt).toLocaleDateString('en-GB')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-sans text-sm font-medium text-bark-600">
                          {formatPrice(order.total)}
                        </p>
                        <Badge variant={
                          order.status === 'paid' || order.status === 'delivered' ? 'new' :
                          order.status === 'cancelled' || order.status === 'refunded' ? 'soldout' :
                          'default'
                        }>
                          {order.status.replace(/_/g, ' ')}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Invite staff modal */}
      <Modal
        isOpen={showInviteModal}
        onClose={() => { setShowInviteModal(false); setInviteEmail(''); setInviteError(null) }}
        title="Invite Staff Member"
      >
        <div className="flex flex-col gap-4">
          <p className="font-sans text-sm text-sand-400">
            Enter the email address of the person you want to invite. They'll need to sign up with this email to get staff access.
          </p>

          {inviteError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 font-sans" role="alert">
              {inviteError}
            </div>
          )}

          <Input
            label="Email address"
            type="email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            placeholder="staff@example.com"
          />

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => { setShowInviteModal(false); setInviteEmail(''); setInviteError(null) }}
              fullWidth
            >
              Cancel
            </Button>
            <Button
              onClick={handleInvite}
              isLoading={inviteMutation.isPending}
              fullWidth
            >
              Send Invite
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
