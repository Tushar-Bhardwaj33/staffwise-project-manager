import { Annotation } from "@langchain/langgraph";

export const AdminAgentState = Annotation.Root({
 query: Annotation<string>(),
 projectId: Annotation<string | undefined>({ default: () => undefined }),
 employeeIdentifier: Annotation<number | undefined>({ default: () => undefined }),
 projectContext: Annotation<ProjectContext | undefined>({ default: () => undefined }),
 employeeContext: Annotation<EmployeeContext | undefined>({ default: () => undefined }),
 employeeProjects: Annotation<EmployeeProjects | undefined>({ default: () => undefined }),
 currentUser: Annotation<CurrentUser | undefined>({ default: () => undefined }),
 history: Annotation<BaseMessage[]>({
 reducer: (existing, update) => existing.concat(update),
 default: () => [],
 }),
 response: Annotation<string | undefined>({ default: () => undefined }),
});
