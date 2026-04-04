export const toast = {
  success(message) {
    window.dispatchEvent(
      new CustomEvent('app-toast', {
        detail: { message, variant: 'success', title: 'Success' },
      }),
    )
  },
  info(message) {
    window.dispatchEvent(
      new CustomEvent('app-toast', {
        detail: { message, variant: 'info', title: 'Info' },
      }),
    )
  },
  danger(message) {
    window.dispatchEvent(
      new CustomEvent('app-toast', {
        detail: { message, variant: 'danger', title: 'Error' },
      }),
    )
  },
}
