import { useProblemStore } from '@/store/problemStore'
import React, { useEffect, useState, useMemo } from 'react'
import ProblemTable from '../components/ProblemTable'
import { Skeleton } from '@/components/ui/skeleton'
import DifficultyFilter from '../components/DifficultyFilter'
import { FileQuestion } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import PlaylistActions from '../components/PlaylistActions'

const ProblemSet = () => {
  const {problems, getAllProblems, isLoading} = useProblemStore()
  const [difficulty, setDifficulty] = useState('all')
  const [selectedTag, setSelectedTag] = useState('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        await getAllProblems()
      } catch (error) {
        console.error("Error fetching problems:", error)
      }
    }
    fetchProblems()
  }, [])

  useEffect(() => {
    console.log("Problems data updated:", problems)
  }, [problems])

  // Collect unique tags and their counts
  const tagCounts = useMemo(() => {
    const counts = {}
    if (problems) {
      problems.forEach(p => {
        (p.tags || []).forEach(tag => {
          counts[tag] = (counts[tag] || 0) + 1
        })
      })
    }
    return counts
  }, [problems])

  // Filter problems by search, difficulty, and tag
  const filteredProblems = useMemo(() => {
    return (problems || []).filter(p => {
      const matchesDifficulty = difficulty === 'all' || p.difficulty === difficulty
      const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase())
      const matchesTag = selectedTag === 'all' || (p.tags || []).includes(selectedTag)
      return matchesDifficulty && matchesSearch && matchesTag
    })
  }, [problems, difficulty, search, selectedTag])

  if (isLoading) {
    return (
      <div>
        <div className="flex items-center gap-3 mb-3">
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-36" />
        </div>
        <div className="rounded-xl border bg-background text-foreground shadow-sm overflow-x-auto">
          <div className="min-w-full">
            <div className="flex px-6 py-3 border-b">
              <Skeleton className="h-5 w-4 mr-4" />
              <Skeleton className="h-5 w-32 mr-4" />
              <Skeleton className="h-5 w-20 mr-4" />
              <Skeleton className="h-5 w-24 mr-4" />
              <Skeleton className="h-5 w-32 mr-4" />
              <Skeleton className="h-5 w-20" />
            </div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center px-6 py-4 border-b last:border-b-0">
                <Skeleton className="h-4 w-4 mr-4" />
                <Skeleton className="h-4 w-32 mr-4" />
                <Skeleton className="h-4 w-20 mr-4" />
                <Skeleton className="h-4 w-24 mr-4" />
                <Skeleton className="h-4 w-32 mr-4" />
                <Skeleton className="h-8 w-20" />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Tag bar */}
      <div className="flex flex-wrap gap-2 mb-4">
        <Badge
          variant={selectedTag === 'all' ? 'default' : 'secondary'}
          className={`cursor-pointer px-3 py-1 rounded-xl text-sm font-medium ${selectedTag === 'all' ? 'bg-green-600 text-white hover:bg-green-700' : ''}`}
          onClick={() => setSelectedTag('all')}
        >
          All Topics <span className="ml-1 text-xs">({problems?.length || 0})</span>
        </Badge>
        {Object.entries(tagCounts).map(([tag, count]) => (
          <Badge
            key={tag}
            variant={selectedTag === tag ? 'default' : 'secondary'}
            className={`cursor-pointer px-3 py-1 rounded-xl text-sm font-medium ${selectedTag === tag ? 'bg-green-600 text-white hover:bg-green-700' : ''}`}
            onClick={() => setSelectedTag(tag)}
          >
            {tag} <span className="ml-1 text-xs">({count})</span>
          </Badge>
        ))}
      </div>
      {/* Search/filter bar and table */}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-[63%]">
          <Input
            type="text"
            placeholder="Search problems..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="h-9 text-sm"
          />
        </div>
        <div style={{minWidth: 140}}>
          <DifficultyFilter value={difficulty} onChange={setDifficulty} className="h-9 text-sm" />
        </div>
        <PlaylistActions />
      </div>
      {filteredProblems && filteredProblems.length > 0 ? (
        <ProblemTable problems={filteredProblems} />
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center text-zinc-400">
          <FileQuestion size={48} className="mb-2 text-green-500" />
          <span className="text-lg font-medium">No problems found</span>
        </div>
      )}
    </div>
  )
}

export default ProblemSet