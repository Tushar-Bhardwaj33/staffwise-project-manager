import { useEffect, useState } from "react";
import type { IProject } from "../types/project.type";
import type { IEmployeeReflection, IAdminValidation } from "../types/history.type";
import { getReflectionByEmployeeAndProject, getValidationsByEmployeeAndProject } from "../services/history.service";
import { Link } from "react-router-dom";
import { SkillTag } from "./ui/SkillTag";
import { ProjectTypeBadge } from "./ui/Badge";
import { useAuth } from "../context/useAuth";

interface Props {
  project: IProject;
}

export function HistoryCard({ project }: Props) {
  const { user } = useAuth();
  const [reflection, setReflection] = useState<IEmployeeReflection | null>(null);
  const [validations, setValidations] = useState<IAdminValidation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      getReflectionByEmployeeAndProject(user._id, project._id).catch(() => null),
      getValidationsByEmployeeAndProject(user._id, project._id).catch(() => []),
    ]).then(([r, v]) => {
      setReflection(r);
      setValidations(v);
    }).finally(() => setLoading(false));
  }, [user, project._id]);

  return (
    <div className="group flex flex-col bg-white border border-[#e3e8ee] rounded-xl overflow-hidden hover:shadow-md transition-all">
      <div className="p-5 flex-1">
        <div className="flex items-start justify-between mb-3">
          <Link
            to={`/projects/${project._id}`}
            className="font-semibold text-lg text-[#0f1419] hover:text-[#20beff] transition-colors line-clamp-1"
          >
            {project.title}
          </Link>
          <ProjectTypeBadge type={project.type} />
        </div>

        {loading ? (
          <div className="animate-pulse space-y-2 mt-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ) : reflection ? (
          <div className="mt-4">
            <h4 className="text-xs font-semibold text-gray-500 uppercase mb-1">What you built</h4>
            <p className="text-sm text-gray-700 line-clamp-2">{reflection.whatBuilt}</p>
            
            {validations.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Validated Skills</h4>
                <div className="flex flex-wrap gap-1.5">
                  {/* Take the first validation's skills for simplicity in the card view */}
                  {validations[0].skillValidation.slice(0, 4).map((s) => (
                    <SkillTag key={s} skill={s} />
                  ))}
                  {validations[0].skillValidation.length > 4 && (
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                      +{validations[0].skillValidation.length - 4} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="mt-4 p-3 bg-amber-50 rounded-lg text-amber-700 text-sm">
            You haven't submitted a reflection for this project yet.
            <Link to={`/projects/${project._id}`} className="block mt-1 font-semibold hover:underline">
              Submit reflection →
            </Link>
          </div>
        )}
      </div>

      <div className="bg-[#f8fafc] px-5 py-3 border-t border-[#e3e8ee] flex justify-between items-center mt-auto">
        <div className="text-xs text-[#5b6b79] font-medium">
          {new Date(project.startDate).toLocaleDateString()} -{" "}
          {new Date(project.endDate).toLocaleDateString()}
        </div>
        <Link
          to={`/projects/${project._id}`}
          className="text-sm font-semibold text-[#20beff] hover:text-[#0f9fdb]"
        >
          View project
        </Link>
      </div>
    </div>
  );
}
