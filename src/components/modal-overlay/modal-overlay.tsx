import styles from './modal-overlay.module.css';

type Props = {
  onClose: () => void;
};

export const ModalOverlay = ({ onClose }: Props): React.JSX.Element => {
  return <div className={styles.overlay} onClick={onClose} />;
};
