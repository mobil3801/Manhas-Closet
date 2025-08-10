import { CalendarDaysIcon } from '@heroicons/react/24/outline'

const AttendancePage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Attendance Management</h1>
        <p className="mt-1 text-sm text-gray-500">Track employee attendance and working hours</p>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="text-center py-12">
          <CalendarDaysIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No attendance records</h3>
          <p className="mt-1 text-sm text-gray-500">Attendance tracking will appear here.</p>
        </div>
      </div>
    </div>
  )
}

export default AttendancePage