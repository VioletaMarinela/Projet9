import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import Icon from "../../components/Icon";
import "./style.scss";

const Modal = ({ opened, Content, children }) => {
  const [isOpened, setIsOpened] = useState(opened);

  useEffect(() => {
    setIsOpened(opened);
  }, [opened]);

  const handleClose = (e) => {
    if (e.target === e.currentTarget) {
      setIsOpened(false);
    }
  };
  return (
    <>
      {children({ isOpened, setIsOpened })}
      {isOpened && (
        <div className="modal" onClick={handleClose} role="dialog" aria-modal="true">
          <div className="content">
            {Content}
            <button
              type="button"
              data-testid="close-modal"
              onClick={() => setIsOpened(false)}
            >
              <Icon name="close" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

Modal.defaultProps = {
  opened: false,
}

Modal.propTypes = {
  opened: PropTypes.bool,
  Content: PropTypes.node.isRequired,
  children: PropTypes.func.isRequired,
}

export default Modal;
