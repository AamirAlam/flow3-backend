export interface User {
  id: string;
  email: string;
  password: string;
}

export interface WorkflowSkeleton {
  id: string;
  userId: string;
  name: string;
  description: string;
  firstApiEndpoint: string;
  secondApiEndpoint: string;
  createdAt: Date;
}

export interface WorkflowExecution {
  id: string;
  skeletonId: string;
  userId: string;
  status: 'RUNNING' | 'COMPLETED' | 'FAILED';
  firstWorkerResult?: any;
  secondWorkerResult?: any;
  error?: string;
  startedAt: Date;
  completedAt?: Date;
}