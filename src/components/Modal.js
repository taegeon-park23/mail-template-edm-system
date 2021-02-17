import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

class Modal extends React.Component {
  constructor(props) {
    super(props);
    // props : visible, className, children, onClose, maskClosable, closable
    this.state = {
      width: 800,
      height: 600
    };
  }
  onMaskClick = (event) => {
    if (event.target === event.currentTarget) {
      this.props.onClose(event);
    }
  };
  render() {
    return (
      <>
        <ModalWrapper
          onClick={this.props.maskClosable ? this.onMaskClick : null}
          visible={this.props.visible}
        >
          <ModalInner className="mx-auto modal-inner">
            {this.props.closable && (
              <CloseButton
                className="btn btn-dark"
                onClick={this.props.onClose}
              >
                <span role="img" aria-label="close">✖️</span>
              </CloseButton>
            )}
            <ModalChildren>
               {this.props.children}
            </ModalChildren>
          </ModalInner>
        </ModalWrapper>
      </>
    );
  }
}
Modal.defaultProps = {
  visible: false,
  closable: true,
  maskClosable: true
};

Modal.propTypes = {
  visible: PropTypes.bool
};

const ModalWrapper = styled.div`
  box-sizing: border-box;
  display: ${(props) => (props.visible ? "block" : "none")};
  position: fixed;
  top: 10%;
  right: 0;
  left: 0;
  z-index: 1000;
  overflow-y: auto;
  outline: 0;
`;

const ModalInner = styled.div`
  box-sizing: border-box;
  position: relative;
  box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.5);
  background-color: #fff;
  border-radius: 10px;
  min-width: 360px;
  min-height: 360px;
  width: 800px;
  /* height: 600px; */
  max-width: 1000px;
  min-height: 600px;
  max-height: 800px;
  overflow-y: auto;
  /* width: 360px; */
  /* max-height: 40vw; */
  /* overflow-y: scroll; */
  /* max-width: 480px; */
  /* transform: translateY(0%); */
  /* margin: 0 auto; */
  padding: 15px 15px;
  z-index: 1001;
`;

const ModalChildren = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CloseButton = styled.button`
  display: block;
  margin-left: auto;
  margin-bottom: 20px;
  width: 30px;
  height: 30px;
  padding: 0px;
`;
export default Modal;
