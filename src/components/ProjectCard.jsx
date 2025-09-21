"use client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { MoreVertical, Pencil, Trash2, ChevronDown } from "lucide-react";
import { fetchProjects, deleteProject } from "@/redux/projects/ProjectSlice";
import { fetchTasks } from "@/redux/task/TaskSlice";
import { statusStyles } from "@/data/projects";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import Link from "next/link";
import AddProject from "./addProject";
import { FiFolder } from "react-icons/fi";

export default function ProjectCard() {
  const dispatch = useDispatch();
  const router = useRouter();

  // Projects slice
  const {
    items: projects,
    loading,
    error,
  } = useSelector((state) => state.projects);

  // Tasks slice
  const {
    items: tasks,
    loading: taskLoading,
    error: taskError,
  } = useSelector((state) => state.tasks);

  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [openMenu, setOpenMenu] = useState(null);
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [expandedProjects, setExpandedProjects] = useState({}); // Store expanded states

  const statusOptions = ["All", "Active", "At Risk", "Planning"];

  // Fetch projects & tasks
  useEffect(() => {
    dispatch(fetchProjects());
    dispatch(fetchTasks());
  }, [dispatch]);

  const filteredProjects = projects.filter((project) => {
    const matchesFilter = filter === "All" || project.status === filter;
    const matchesSearch =
      (project.name?.toLowerCase() || "").includes(
        searchTerm?.toLowerCase() || ""
      ) ||
      (project.description?.toLowerCase() || "").includes(
        searchTerm?.toLowerCase() || ""
      );
    return matchesFilter && matchesSearch;
  });

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Do you really want to delete project ${id}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await dispatch(deleteProject(id)).unwrap();
        toast.success(`Project ${id} deleted successfully!`);
      } catch (err) {
        toast.error(err.message || "Failed to delete project.");
      }
    }
    setOpenMenu(null);
  };

  const toggleAddProjectPopup = () => {
    setIsAddProjectOpen(!isAddProjectOpen);
  };

  const handleAddProject = async () => {
    setIsAddProjectOpen(false);
    await dispatch(fetchProjects()); // Refresh projects after adding
    router.refresh(); // Auto-reload the page
  };

  const toggleExpand = (projectId) => {
    setExpandedProjects((prev) => ({
      ...prev,
      [projectId]: !prev[projectId],
    }));
  };

  return (
    <main>
      <div className="mx-auto">
        {/* Filters + Search + Add Project */}
        <div className="bg-white rounded-md shadow-sm p-4 mb-8 mt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Desktop Filter Buttons */}
          <div className="hidden sm:flex flex-wrap gap-2">
            {statusOptions.map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`flex px-4 py-2.5 rounded-lg cursor-pointer text-sm font-medium transition-all items-center border ${filter === status
                  ? status === "Active"
                    ? "bg-green-50 text-green-700 border-green-200 shadow-sm"
                    : status === "At Risk"
                      ? "bg-yellow-50 text-yellow-700 border-yellow-200 shadow-sm"
                      : status === "Planning"
                        ? "bg-blue-50 text-blue-700 border-blue-200 shadow-sm"
                        : "bg-blue-50 text-blue-700 border-blue-200 shadow-sm"
                  : "bg-white text-gray-600 hover:bg-gray-50 border-gray-200 hover:border-gray-300"
                  }`}
              >
                {status !== "All" && (
                  <span
                    className={`w-2 h-2 rounded-full mr-2 ${status === "Active"
                      ? "bg-green-500"
                      : status === "At Risk"
                        ? "bg-yellow-500"
                        : status === "Planning"
                          ? "bg-blue-500"
                          : "bg-gray-400"
                      }`}
                  ></span>
                )}
                {status === "All" ? "All Projects" : status}
              </button>
            ))}
          </div>

          {/* Mobile Dropdown */}
          <div className="relative sm:hidden w-full">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex justify-between items-center w-full px-4 py-2.5 rounded-lg text-sm font-medium 
             bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 shadow-sm transition-all cursor-pointer duration-200"
            >
              {filter === "All" ? "All Projects" : filter}
              <ChevronDown size={16} className={`text-gray-500 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isDropdownOpen && (
              <div className="absolute mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-200 z-10 overflow-hidden">
                {statusOptions.map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      setFilter(status);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-all hover:bg-gray-50 ${filter === status
                      ? "bg-blue-50 text-blue-700 border-l-2 border-blue-500"
                      : "text-gray-700"
                      }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Search + Add Button */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search projects..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 
                text-gray-900 placeholder-gray-400 bg-white
                focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none text-sm transition-all duration-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-gray-400 absolute left-3 top-3"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <button
              onClick={toggleAddProjectPopup}
              className="bg-blue-600 hover:bg-blue-700 cursor-pointer text-white w-full sm:w-auto px-5 py-2.5 rounded-lg transition-all duration-200 flex items-center justify-center shadow-sm hover:shadow-md font-medium text-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              Add Project
            </button>
          </div>
        </div>

        {/* Loading State */}
        {(loading || taskLoading) && (
          <div className="bg-white rounded-md shadow-sm p-12 text-center">
            <p className="text-gray-600">Loading projects</p>
          </div>
        )}

        {/* Error State */}
        {(error || taskError) && (
          <div className="bg-red-100 text-red-700 p-4 rounded-md text-center">
            <p>Error fetching data: {error || taskError}</p>
          </div>
        )}

        {/* Projects Grid */}
        {!loading && !taskLoading && !error && !taskError && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => {
              // Filter tasks by projectId
              const projectTasks = tasks.filter(
                (task) => task.projectId === project.id
              );

              // Team size → unique users
              const assignedUsers = new Set();
              projectTasks.forEach((t) =>
                t.assignedUserIds?.forEach((u) => assignedUsers.add(u))
              );
              const teamSize = assignedUsers.size;

              // Tasks stats
              const totalTasks = projectTasks.length;
              const tasksCompleted = projectTasks.filter(
                (t) => t.status === "Completed"
              ).length;
              const progress = totalTasks
                ? Math.round((tasksCompleted / totalTasks) * 100)
                : 0;

              const isExpanded = expandedProjects[project.id] || false;
              const visibleTasks = isExpanded
                ? projectTasks
                : projectTasks.slice(0, 1);

              return (
                <div
                  key={project.id}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 overflow-hidden"
                >
                  <div
                    className={`h-1 bg-gradient-to-r ${statusStyles[project.status]?.bar ||
                      "from-gray-400 to-gray-600"
                      }`}
                  ></div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h2 className="text-lg font-semibold text-gray-800">
                        {project.name}
                      </h2>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`text-xs px-3 py-1 rounded-full font-medium ${statusStyles[project.status]?.badge ||
                            "bg-gray-100 text-gray-600"
                            } flex items-center`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full mr-2 ${statusStyles[project.status]?.dot || "bg-gray-400"
                              }`}
                          ></span>
                          {project.status}
                        </span>
                        <div className="relative">
                          <button
                            onClick={() =>
                              setOpenMenu(
                                openMenu === project.id ? null : project.id
                              )
                            }
                            className="py-2 cursor-pointer text-gray-700 rounded-lg transition-all"
                          >
                            <MoreVertical size={18} />
                          </button>
                          {openMenu === project.id && (
                            <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded-lg shadow-lg z-10 overflow-hidden">
                              <Link href={`/edit-project/${project.id}`}>
                                <button
                                  className="w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                                  onClick={() => setOpenMenu(null)}
                                >
                                  <Pencil size={14} /> Edit
                                </button>
                              </Link>
                              <div className="border-t border-gray-100"></div>
                              <button
                                onClick={() => handleDelete(project.id)}
                                className="w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                              >
                                <Trash2 size={14} /> Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-6 text-sm">
                      {project.description}
                    </p>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <Info
                        label="Budget"
                        value={`$${project.budget?.toLocaleString() || "0"}`}
                      />
                      <Info
                        label="Deadline"
                        value={
                          project.deadline
                            ? new Date(project.deadline).toLocaleDateString()
                            : "N/A"
                        }
                      />
                      <Info label="Team Size" value={teamSize} />
                      <Info
                        label="Tasks"
                        value={`${tasksCompleted}/${totalTasks}`}
                      />
                    </div>
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-sm font-medium text-gray-700">
                          Progress
                        </p>
                        <p className="text-sm font-semibold text-gray-800">
                          {progress}%
                        </p>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className={`h-2.5 rounded-full bg-gradient-to-r ${statusStyles[project.status]?.bar ||
                            "from-gray-400 to-gray-600"
                            }`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Project Tasks
                      </p>
                      {projectTasks.length > 0 ? (
                        <>
                          <ul className="space-y-1">
                            {visibleTasks.map((task, idx) => (
                              <li
                                key={`${project.id}-${task.id || idx}`}
                                className="flex justify-between items-center text-sm bg-gray-50 p-2 rounded-md"
                              >
                                <span className="font-medium text-gray-800">
                                  {task.name}
                                </span>
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${task.status === "Completed"
                                    ? "bg-green-100 text-green-700"
                                    : task.status === "InProgress"
                                      ? "bg-yellow-100 text-yellow-700"
                                      : task.status === "NotStarted"
                                        ? "bg-blue-100 text-blue-700"
                                        : "bg-gray-100 text-gray-600"
                                    }`}
                                >
                                  {task.status}
                                </span>
                              </li>
                            ))}
                          </ul>
                          {projectTasks.length > 1 && (
                            <button
                              onClick={() => toggleExpand(project.id)}
                              className="mt-2 text-xs text-blue-600 hover:underline"
                            >
                              {isExpanded ? "See Less" : "See More"}
                            </button>
                          )}
                        </>
                      ) : (
                        <p className="text-sm text-gray-500">
                          No tasks assigned to this project.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!loading &&
          !taskLoading &&
          !error &&
          !taskError &&
          filteredProjects.length === 0 && (
            <div className="bg-white rounded-md shadow-sm p-12 text-center">
              <h3 className="text-xl font-medium text-gray-700 mb-2">
                No projects found
              </h3>
              <p className="text-gray-500">
                Try adjusting your search or filter to find what you're looking
                for.
              </p>
            </div>
          )}

        {/* Add Project Popup */}
        {isAddProjectOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="relative w-full max-w-4xl xl:max-w-6xl max-h-[95vh] bg-white shadow-2xl overflow-hidden">
              {/* Header Section */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4 text-white">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg shadow-sm">
                      <FiFolder className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Create New Project</h2>
                      <p className="text-blue-100 text-sm">Add a new project</p>
                    </div>
                  </div>
                  <button
                    onClick={toggleAddProjectPopup}
                    className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all duration-200 backdrop-blur-sm"
                  >
                    <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-6 max-h-[calc(95vh-100px)] overflow-y-auto custom-scrollbar">
                <AddProject
                  onProjectAdd={handleAddProject}
                  onCancel={toggleAddProjectPopup}
                  dispatch={dispatch}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-semibold text-gray-800">{value}</p>
    </div>
  );
}