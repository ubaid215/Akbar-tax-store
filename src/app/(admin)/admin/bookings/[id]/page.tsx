'use client'

import { useParams, useRouter } from 'next/navigation'
import { AdminBookingManageContent } from '@/app/components/admin/bookings/AdminBookingManageContent'

export default function BookingDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const bookingId = typeof id === 'string' ? id : id?.[0] ?? ''

  if (!bookingId) {
    return <div className="text-[#6b7280]">Invalid booking</div>
  }

  return (
    <AdminBookingManageContent
      bookingId={bookingId}
      variant="page"
      onNavigateBack={() => router.push('/admin/bookings')}
      onUpdated={() => router.refresh()}
    />
  )
}
