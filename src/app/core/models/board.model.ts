export interface ISubtask {
  title: string;
  isCompleted: boolean;
}

export interface ITask {
  title: string;
  description: string;
  status: string;
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
