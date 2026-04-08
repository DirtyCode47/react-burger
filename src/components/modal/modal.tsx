import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { CloseIcon } from '@krgaa/react-developer-burger-ui-components';

import styles from './modal.module.css';

type Props = {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
};

export const Modal = ({ title, children, onClose }: Props) => {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  return createPortal(
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <header className={styles.header}>
          <p className="text text_type_main-medium">{title}</p>
          <CloseIcon onClick={onClose} />
        </header>

        {children}
      </div>
    </div>,
    document.getElementById('root')!
  );
};