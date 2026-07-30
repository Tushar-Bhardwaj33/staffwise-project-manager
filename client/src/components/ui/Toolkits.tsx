import { defineToolkit } from "@assistant-ui/react";
import { Spinner } from "./Spinner";

export const staffwiseToolkit = defineToolkit({
  list_projects: {
    type: "backend",
    render: ({ status }) => {
      if (status.type === "running") {
        return (
          <div className="flex items-center gap-3 p-4 bg-blue-50/50 text-blue-700 rounded-xl border border-blue-100/50 shadow-sm my-2">
            <Spinner size="sm" />
            <span className="text-sm font-medium">Fetching project roster...</span>
          </div>
        );
      }
      return null;
    },
  },
  list_employees: {
    type: "backend",
    render: ({ status }) => {
      if (status.type === "running") {
        return (
          <div className="flex items-center gap-3 p-4 bg-purple-50/50 text-purple-700 rounded-xl border border-purple-100/50 shadow-sm my-2">
            <Spinner size="sm" />
            <span className="text-sm font-medium">Searching staff directory...</span>
          </div>
        );
      }
      return null;
    },
  },
  list_teams: {
    type: "backend",
    render: ({ status }) => {
      if (status.type === "running") {
        return (
          <div className="flex items-center gap-3 p-4 bg-emerald-50/50 text-emerald-700 rounded-xl border border-emerald-100/50 shadow-sm my-2">
            <Spinner size="sm" />
            <span className="text-sm font-medium">Retrieving team structure...</span>
          </div>
        );
      }
      return null;
    },
  },
  get_project_details: {
    type: "backend",
    render: ({ status }) => {
      if (status.type === "running") {
        return (
          <div className="flex items-center gap-3 p-4 bg-indigo-50/50 text-indigo-700 rounded-xl border border-indigo-100/50 shadow-sm my-2">
            <Spinner size="sm" />
            <span className="text-sm font-medium">Loading detailed project specs...</span>
          </div>
        );
      }
      return null;
    },
  },
  find_employee: {
    type: "backend",
    render: ({ status, args: _args }) => {
      if (status.type === "running") {
        return (
          <div className="flex items-center gap-3 p-4 bg-orange-50/50 text-orange-700 rounded-xl border border-orange-100/50 shadow-sm my-2">
            <Spinner size="sm" />
            <span className="text-sm font-medium">
              Looking up employee profile...
            </span>
          </div>
        );
      }
      return null;
    },
  },
});
