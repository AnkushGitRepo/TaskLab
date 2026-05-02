import { useEffect } from 'react';
import useProjectStore from '../store/projectStore';

/**
 * @desc    Projects hook
 * @usage   const { projects, createProject } = useProjects();
 */
const useProjects = () => {
  const store = useProjectStore();

  useEffect(() => {
    store.fetchProjects();
  }, []);

  return {
    projects: store.projects,
    loading: store.loading,
    error: store.error,
    fetchProjects: store.fetchProjects,
    createProject: store.createProject,
    updateProject: store.updateProject,
    deleteProject: store.deleteProject,
  };
};

export default useProjects;
