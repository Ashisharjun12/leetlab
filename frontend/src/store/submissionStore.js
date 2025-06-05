import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { submissionAPI } from '@/api/api';

const useSubmissionStore = create(
  persist(
    (set, get) => ({
      solvedProblems: {},
      solvedProblemsByProblemId: {},

      // Get all solved problems
      getSolvedProblems: async () => {
        try {
          const response = await submissionAPI.getSolvedProblem();
          const solvedProblems = response.data.data.reduce((acc, submission) => {
            acc[submission.problemId] = true;
            return acc;
          }, {});
          
          set({ solvedProblems });
          return solvedProblems;
        } catch (error) {
          console.error('Error fetching solved problems:', error);
          return get().solvedProblems;
        }
      },

      // Get solved status for a specific problem
      getSolvedProblemById: async (problemId) => {
        try {
          // Check if we already have the data
          if (get().solvedProblemsByProblemId[problemId] !== undefined) {
            return get().solvedProblemsByProblemId[problemId];
          }

          const response = await submissionAPI.getSolvedByProblemId(problemId);
          const isSolved = response.data.data.length > 0;
          
          // Update both stores
          set((state) => ({
            solvedProblemsByProblemId: {
              ...state.solvedProblemsByProblemId,
              [problemId]: isSolved
            },
            solvedProblems: {
              ...state.solvedProblems,
              [problemId]: isSolved
            }
          }));

          return isSolved;
        } catch (error) {
          console.error(`Error checking solved status for problem ${problemId}:`, error);
          return false;
        }
      },

      // Check if a problem is solved (from cache)
      isProblemSolved: (problemId) => {
        return get().solvedProblems[problemId] || false;
      },

      // Clear solved problems data
      clearSolvedProblems: () => {
        set({ solvedProblems: {}, solvedProblemsByProblemId: {} });
      }
    }),
    {
      name: 'submission-storage', // unique name for localStorage
      partialize: (state) => ({ 
        solvedProblems: state.solvedProblems,
        solvedProblemsByProblemId: state.solvedProblemsByProblemId 
      })
    }
  )
);

export default useSubmissionStore;
