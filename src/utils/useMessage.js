import { ElNotification, ElMessageBox } from 'element-plus';

export function useToast(message, type = 'success', duration = 3000) {
  return ElNotification({
    message,
    type,
    duration,
    dangerouslyUseHTMLString: true,
  });
}

export function useMessageBox(confirmType, content, type) {
  return ElMessageBox.confirm(content, confirmType, {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type,
    dangerouslyUseHTMLString: true,
  });
}

export function usePrompt(tip, value = '') {
  return ElMessageBox.prompt(tip, {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    inputValue: value,
  });
}
