export interface ITaskFormData {
  title: string;
  description: string;
  dueDate?: string;
  subtasks: { title: string; isCompleted?: boolean }[];
  status: string;
}

export interface ISelectOption {
  label: string;
  value: string;
}

export interface IDialogConfig {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

export interface INotification {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}
