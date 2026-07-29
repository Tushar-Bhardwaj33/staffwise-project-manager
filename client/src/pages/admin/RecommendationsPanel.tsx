import { useState } from "react";
import { toast } from "react-toastify";
import { getProjectRecommendations, type ICandidateScore } from "../../services/project.service";
import { SkillTag } from "../../components/ui/SkillTag";
import { PageSpinner } from "../../components/ui/Spinner";
import { Sparkles } from "lucide-react";

export function RecommendationsPanel({ projectId }: { projectId: string }) {
  const [candidates, setCandidates] = useState<ICandidateScore[] | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const results = await getProjectRecommendations(projectId, 5);
      setCandidates(results);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to load AI suggestions");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-[#e3e8ee] rounded-xl overflow-hidden mt-6">
      <div className="bg-[#f8fafc] border-b border-[#e3e8ee] px-5 py-4 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-[#0f1419] flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            AI Recommendations
          </h3>
          <p className="text-sm text-[#5b6b79] mt-0.5">Top ranked employees for this project</p>
        </div>
        {!candidates && !loading && (
          <button
            onClick={fetchRecommendations}
            className="rounded-lg bg-purple-50 text-purple-700 px-4 py-2 text-sm font-semibold hover:bg-purple-100 transition-colors border border-purple-200"
          >
            Get AI suggestions
          </button>
        )}
      </div>

      {loading && (
        <div className="p-10 flex flex-col items-center justify-center">
          <PageSpinner />
          <p className="text-sm text-gray-500 mt-4 animate-pulse">Analyzing employee skills and availability...</p>
        </div>
      )}

      {candidates && (
        <div className="p-5">
          {candidates.length === 0 ? (
            <div className="text-center py-6 text-sm text-gray-500">
              No matching employees found.
            </div>
          ) : (
            <div className="space-y-4">
              {candidates.map((c, idx) => (
                <div key={c.employee.id} className="border border-gray-100 rounded-lg p-4 bg-gray-50 flex flex-col gap-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold text-lg">
                        #{idx + 1}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">{c.employee.name}</h4>
                        <p className="text-xs text-gray-500">ID: {c.employee.employeeId}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-black text-gray-900">{c.score.toFixed(2)}</div>
                      <div className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Score</div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      c.available ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}>
                      {c.available ? "Available" : "Busy"}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      c.preference === "interested" ? "bg-blue-100 text-blue-700" :
                      c.preference === "not-interested" ? "bg-orange-100 text-orange-700" :
                      "bg-gray-200 text-gray-700"
                    }`}>
                      {c.preference === "interested" ? "Interested" :
                       c.preference === "not-interested" ? "Not Interested" :
                       "No Preference"}
                    </span>
                  </div>

                  {c.matchedSkills.length > 0 && (
                    <div>
                      <div className="text-xs font-semibold text-gray-500 mb-1.5 uppercase">Matched Skills</div>
                      <div className="flex flex-wrap gap-1.5">
                        {c.matchedSkills.map(s => (
                          <SkillTag key={s} skill={s} />
                        ))}
                      </div>
                    </div>
                  )}

                  {c.explanation && (
                    <div className="mt-2 text-sm italic text-gray-700 border-l-2 border-purple-300 pl-3 py-1">
                      "{c.explanation}"
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
