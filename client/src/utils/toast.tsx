import { toast as toastifyToast } from 'react-toastify';
import { ToastCard } from '../components/ui/ToastCard';

export const toast = {
  success: (title: string, message?: string) => {
    toastifyToast(
      ({ closeToast }) => (
        <ToastCard type="success" title={title} message={message || ""} onClose={closeToast} />
      ),
      {
        style: { background: 'transparent', boxShadow: 'none', padding: 0 },
        closeButton: false,
        hideProgressBar: true,
      }
    );
  },
  error: (title: string, message?: string) => {
    toastifyToast(
      ({ closeToast }) => (
        <ToastCard type="error" title={title} message={message || ""} onClose={closeToast} />
      ),
      {
        style: { background: 'transparent', boxShadow: 'none', padding: 0 },
        closeButton: false,
        hideProgressBar: true,
      }
    );
  },
};
