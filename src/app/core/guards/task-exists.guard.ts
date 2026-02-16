import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { BoardService, NotificationService } from '../services';

export const taskExistsGuard: CanActivateFn = (route) => {
  const boardService = inject(BoardService);
  const router = inject(Router);
  const notification = inject(NotificationService);
  
  const boardId = Number(route.paramMap.get('id'));
  const taskId = route.paramMap.get('taskId');
  
  if (taskId) {
    const task = boardService.getTaskById(boardId, taskId);
    if (!task) {
      notification.error('Task not found');
      router.navigate(['/board', boardId], { replaceUrl: true });
      return false;
    }
  }
  return true;
};
