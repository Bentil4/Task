export interface ISubtask {
  title: string;
  isCompleted: boolean;
}

export interface ITask {
  id: string;
  title: string;
  description: string;
  status: string;
  dueDate?: string;
  subtasks: ISubtask[];
}

export interface IColumn {
  name: string;
  tasks: ITask[];
}

export interface IBoard {
  id: number;
  name: string;
  columns?: IColumn[];
}
