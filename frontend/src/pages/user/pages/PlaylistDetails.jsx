import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import usePlaylistStore from '@/store/playlistStore'
import { Skeleton } from '@/components/ui/skeleton'
import AddProblemsModal from '../components/AddProblemsModal'
import ProblemTable from '../components/ProblemTable'
import { PlusCircle } from 'lucide-react'
import { toast } from 'sonner'
import { playlistAPI } from '@/api/api'
import { Loader2 } from 'lucide-react'

const PlaylistDetails = () => {
  const { playlistId } = useParams()
  const { playlistDetails, loading, error, fetchPlaylistDetails } = usePlaylistStore()
  const [isRemoving, setIsRemoving] = useState(false)

  useEffect(() => {
    if (playlistId) {
      console.log("PlaylistDetails: Calling fetchPlaylistDetails(", playlistId, ")");
      fetchPlaylistDetails(playlistId)
    }
  }, [playlistId, fetchPlaylistDetails])

  useEffect(() => {
    console.log("PlaylistDetails: playlistDetails updated:", playlistDetails);
  }, [playlistDetails]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    )
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>
  }

  if (!playlistDetails) {
    return <div className="text-center text-muted-foreground">Playlist not found.</div>
  }

  const handleRemoveProblemFromPlaylist = async (problemId) => {
    setIsRemoving(true)
    try {
      await playlistAPI.removeProblemFromPlaylist(playlistDetails.id, [problemId])
      toast.success("Problem removed successfully.")
      fetchPlaylistDetails(playlistDetails.id)
    } catch (error) {
      toast.error("Failed to remove problem.")
    } finally {
      setIsRemoving(false)
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{playlistDetails.name}</h1>
          {playlistDetails.description && (
            <p className="text-muted-foreground">{playlistDetails.description}</p>
          )}
        </div>
        <AddProblemsModal playlistId={playlistId} onProblemsAdded={() => fetchPlaylistDetails(playlistId)} />
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Problems in Playlist {isRemoving && <Loader2 className="w-6 h-6 animate-spin inline-block ml-2" />}</h2>
        {playlistDetails.problems && playlistDetails.problems.length > 0 ? (
          <ProblemTable problems={playlistDetails.problems} onProblemRemove={handleRemoveProblemFromPlaylist} />
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
            <PlusCircle size={48} className="mb-2 text-green-500" />
            <span className="text-lg font-medium">No problems in this playlist yet. Add your first one!</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default PlaylistDetails