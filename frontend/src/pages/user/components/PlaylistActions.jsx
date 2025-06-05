import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Plus, List, Clock } from 'lucide-react'
import usePlaylistStore from '@/store/playlistStore'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

const PlaylistActions = () => {
  const { createPlaylist, fetchPlaylists, playlists } = usePlaylistStore()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [playlistName, setPlaylistName] = useState('')
  const [playlistDescription, setPlaylistDescription] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (isViewDialogOpen) {
      fetchPlaylists()
    }
  }, [isViewDialogOpen, fetchPlaylists])

  const handleCreatePlaylist = async () => {
    if (!playlistName.trim()) {
      toast.error("Playlist name is required");
      return;
    }

    setIsCreating(true);
    try {
      const result = await createPlaylist({
        name: playlistName,
        description: playlistDescription
      });

      if (result.success) {
        toast.success("Playlist created successfully!");
        setIsCreateDialogOpen(false);
        setPlaylistName('');
        setPlaylistDescription('');
        // Refresh playlists after creating new one
        fetchPlaylists();
      } else {
        toast.error(result.error || "Failed to create playlist");
      }
    } catch (error) {
      toast.error("An error occurred while creating the playlist");
    } finally {
      setIsCreating(false);
    }
  };

  const handlePlaylistClick = (playlistId) => {
    navigate(`/playlist/${playlistId}`);
    setIsViewDialogOpen(false);
  };

  return (
    <div className="flex items-center gap-2">
      {/* Create Playlist Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="default" size="sm" className="h-9 bg-green-600 text-white hover:bg-green-700">
            <Plus className="w-4 h-4 mr-2" />
            Create Playlist
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Playlist</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={playlistName}
                onChange={(e) => setPlaylistName(e.target.value)}
                placeholder="Enter playlist name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={playlistDescription}
                onChange={(e) => setPlaylistDescription(e.target.value)}
                placeholder="Enter playlist description"
              />
            </div>
            <Button 
              onClick={handleCreatePlaylist} 
              disabled={isCreating}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {isCreating ? "Creating..." : "Create Playlist"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Playlists Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="default" size="sm" className="h-9 bg-green-600 text-white hover:bg-green-700">
            <List className="w-4 h-4 mr-2" />
            View Playlists
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-center">Your Playlists</DialogTitle>
          </DialogHeader>
          <div className="max-h-[400px] overflow-y-auto">
            {playlists && playlists.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">#</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="text-right">Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {playlists.map((playlist, index) => (
                    <TableRow key={playlist.id} onClick={() => handlePlaylistClick(playlist.id)} className="cursor-pointer hover:bg-accent/50">
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>
                        <div>{playlist.name}</div>
                        <div className="text-sm text-muted-foreground line-clamp-1">{playlist.description || 'No description'}</div>
                      </TableCell>
                      <TableCell className="text-right text-sm text-muted-foreground whitespace-nowrap">
                        {formatDistanceToNow(new Date(playlist.createdAt), { addSuffix: true })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-muted-foreground text-sm">
                No playlists found. Create your first playlist!
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default PlaylistActions 