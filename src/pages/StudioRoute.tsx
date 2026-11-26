import { Navigate, useParams } from 'react-router-dom'
import { studioPieceBySlug } from '../data/studio'
import { StudioPiecePage } from './StudioPiecePage'

export function StudioRoute() {
  const { slug } = useParams()
  const piece = studioPieceBySlug(slug)
  if (!piece) return <Navigate to="/" replace />
  return <StudioPiecePage piece={piece} />
}
