import { FC } from 'react'
import LoadingSpinner from './LoadingSpinner'

interface LoadingPageProps {
  message?: string
}

const LoadingPage: FC<LoadingPageProps> = ({ message = 'Loading...' }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-lg text-gray-600">{message}</p>
      </div>
    </div>
  )
}

export default LoadingPage