import { ElNotification } from 'element-plus'

export function notify(
  type: 'success' | 'error' | 'info' | 'warning',
  message: string,
  title = ''
) {
  ElNotification({
    title,
    message,
    type,
    position: 'top-right',
    duration: 2500,
  })
}
