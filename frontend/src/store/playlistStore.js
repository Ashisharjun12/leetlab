import { create } from 'zustand'
import { playlistAPI } from '../api/api'

const usePlaylistStore = create((set) => ({
  playlists: [],
  loading: false,
  error: null,

  // Fetch all playlists
  fetchPlaylists: async () => {
    set({ loading: true, error: null })
    try {
      const response = await playlistAPI.getAllPlaylists()
      set({ playlists: response.data.playlist, loading: false })
    } catch (error) {
      set({ error: error.message, loading: false })
    }
  },

  // Create new playlist
  createPlaylist: async (playlistData) => {
    set({ loading: true, error: null })
    try {
      const response = await playlistAPI.createPlaylist(playlistData)
      if (response.data.success) {
        const newPlaylist = response.data.playlist
        set((state) => ({
          playlists: [...state.playlists, newPlaylist],
          loading: false
        }))
        return { success: true, playlist: newPlaylist }
      } else {
        throw new Error(response.data.message || 'Failed to create playlist')
      }
    } catch (error) {
      set({ error: error.message, loading: false })
      return { success: false, error: error.message }
    }
  },

  // Delete playlist
  deletePlaylist: async (playlistId) => {
    set({ loading: true, error: null })
    try {
      await playlistAPI.deletePlaylist(playlistId)
      set((state) => ({
        playlists: state.playlists.filter(p => p.id !== playlistId),
        loading: false
      }))
    } catch (error) {
      set({ error: error.message, loading: false })
    }
  },

  // Add problems to playlist
  addProblemsToPlaylist: async (playlistId, problemIds) => {
    set({ loading: true, error: null })
    try {
      await playlistAPI.addProblemToPlaylist(playlistId, problemIds)
      set({ loading: false })
      // Optionally refetch the specific playlist or update the problems within it in the store
    } catch (error) {
      set({ error: error.message, loading: false })
    }
  },

  // Remove problems from playlist
  removeProblemsFromPlaylist: async (playlistId, problemIds) => {
    set({ loading: true, error: null })
    try {
      await playlistAPI.removeProblemFromPlaylist(playlistId, problemIds)
      set({ loading: false })
      // Optionally refetch the specific playlist or update the problems within it in the store
    } catch (error) {
      set({ error: error.message, loading: false })
    }
  }
}))

export default usePlaylistStore 