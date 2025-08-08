import { toast } from 'react-hot-toast';
import CustomToast from '../components/common/Toast';

export const showToast = (message, type = 'success') => {
  const options = {
    duration: 3000,
    style: {
      background: 'transparent',
      boxShadow: 'none',
    },
  };

  const id = toast.custom((t) => (
    <CustomToast
      message={message}
      type={type}
      id={t.id}
    />
  ), options);
};