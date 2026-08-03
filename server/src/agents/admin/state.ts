import { Annotation } from "@langchain/langgraph";

export const AdminAgentState = Annotation.Root({
  query: Annotation<string>(),
  projectId: Annotation<string | undefined>(),
  employeeIdentifier: Annotation<string | undefined>(),
  projectContext: Annotation<any>(),
  employeeContext: Annotation<any>(),
  employeeProjects: Annotation<any>(),
  currentUser: Annotation<any>(),
  history: Annotation<any[]>(),
  response: Annotation<string | undefined>(),
});