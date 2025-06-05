import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
import { problemAPI, playlistAPI } from '@/api/api'
import { toast } from 'sonner'
import { Loader2, Plus } from 'lucide-react'
import usePlaylistStore from '@/store/playlistStore'

const AddProblemsModal = ({ playlistId, onProblemsAdded }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [problems, setProblems] = useState([])
  const [loadingProblems, setLoadingProblems] = useState(true)
  const [selectedProblemIds, setSelectedProblemIds] = useState(new Set())
  const [isAdding, setIsAdding] = useState(false)

  useEffect(() => {
    if (isOpen) {
      const fetchProblems = async () => {
        setLoadingProblems(true)
        try {
          const response = await problemAPI.getAllProblems()
          if (response.data.success) {
            setProblems(response.data.data)
          } else {
            toast.error(response.data.message || "Failed to fetch problems")
          }
        } catch (error) {
          toast.error("An error occurred while fetching problems")
        } finally {
          setLoadingProblems(false)
        }
      }
      fetchProblems()
    }
  }, [isOpen])

  const handleCheckboxChange = (problemId, isChecked) => {
    setSelectedProblemIds(prev => {
      const newSet = new Set(prev)
      if (isChecked) {
        newSet.add(problemId)
      } else {
        newSet.delete(problemId)
      }
      return newSet
    })
  }

  const handleSelectAllChange = (isChecked) => {
    if (isChecked) {
      const allProblemIds = problems.map(problem => problem.id)
      setSelectedProblemIds(new Set(allProblemIds))
    } else {
      setSelectedProblemIds(new Set())
    }
  }

  const handleAddSelectedProblems = async () => {
    const problemIdsArray = Array.from(selectedProblemIds);

    if (problemIdsArray.length === 0) {
      toast.info("Please select at least one problem.")
      setIsOpen(false)
      return
    }

    setIsAdding(true)
    try {
      const response = await playlistAPI.addProblemToPlaylist(playlistId, problemIdsArray)

      if (response.data.success) {
        toast.success("Problems added to playlist successfully!")
        setSelectedProblemIds(new Set())
        setIsOpen(false)
        console.log("AddProblemsModal: Calling onProblemsAdded()");
        onProblemsAdded()
      } else {
        toast.error(response.data.message || "Failed to add problems to playlist")
      }
    } catch (error) {
      toast.error("An error occurred while adding problems")
    } finally {
      setIsAdding(false)
    }
  }

  const isAllSelected = problems.length > 0 && selectedProblemIds.size === problems.length
  const selectedCount = selectedProblemIds.size;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="default" size="sm" className="bg-green-600 hover:bg-green-700">
           <Plus className="w-4 h-4 mr-2" />
           Add Problems
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-center">Select Problems to Add</DialogTitle>
        </DialogHeader>
        <div className="max-h-[400px] overflow-y-auto">
          {loadingProblems ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading Problems...
            </div>
          ) : problems && problems.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={isAllSelected}
                      onCheckedChange={handleSelectAllChange}
                    />
                  </TableHead>
                  <TableHead>Title</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {problems.map(problem => (
                  <TableRow key={problem.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedProblemIds.has(problem.id)}
                        onCheckedChange={(isChecked) => handleCheckboxChange(problem.id, isChecked)}
                      />
                    </TableCell>
                    <TableCell>{problem.title}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground text-sm">
              No problems found to add.
            </div>
          )}
        </div>
        <DialogFooter>
          <Button
            onClick={handleAddSelectedProblems}
            disabled={selectedCount === 0 || isAdding}
            className="bg-green-600 hover:bg-green-700"
          >
            {isAdding ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Plus className="w-4 h-4 mr-2" />
            )}
            {isAdding ? 'Adding...' : `Add Selected Problems (${selectedCount})`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default AddProblemsModal 