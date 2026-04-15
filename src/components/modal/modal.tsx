import { CloseIcon } from '@krgaa/react-developer-burger-ui-components';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';

import { ModalOverlay } from '@components/modal-overlay/modal-overlay';

import styles from './modal.module.css';

type Props = {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
};

export const Modal = ({ title, children, onClose }: Props): React.JSX.Element => {
  useEffect((): (() => void) => {
    const handler = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handler);

    return (): void => {
      document.removeEventListener('keydown', handler);
    };
  }, [onClose]);

  const modalRoot = document.getElementById('modals'); // ✅ исправлено

  if (!modalRoot) {
    throw new Error('Modal root not found');
  }

  return createPortal(
    <div className={`${styles.root_style}`}>
      <ModalOverlay onClose={onClose} />

      <div className={styles.modal} onClick={(e): void => e.stopPropagation()}>
        <header className={styles.header}>
          <p className="text text_type_main-medium">{title}</p>
          <CloseIcon type="primary" onClick={onClose} />
        </header>

        {children}
      </div>
    </div>,
    modalRoot
  );
};
