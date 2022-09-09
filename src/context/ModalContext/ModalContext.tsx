import React, { useRef, useContext, useState } from "react";
import { ErrorModal } from "./modals/ErrorModal/ErrorModal";
import { SuccessModal } from "./modals/SuccessModal/SuccessModal";
import { ModalTypes } from './modals/consts'

type ModalContextState = {
  showModal: (modal: IModal) => void;
  closeModal: () => void;
};

interface IModal {
  type: ModalTypes,
  props: any,
}

const ModalContext = React.createContext({});

const getModalComponent = (modal: IModal, onCancel: () => void) => {
  let Component;
  switch (modal.type) {
    case ModalTypes.success:
      Component = SuccessModal
      break;
    case ModalTypes.error: 
      Component = ErrorModal
      break
    default:
      Component = undefined
  }
  if(Component) {
    return <Component {...modal.props} onCancel={onCancel} />
  }
}

export const ModalContextProvider = ({ children }: { children: any }) => {
  const [shownModal, setShownModal] = useState<IModal | undefined>(undefined);

  const closeModal = () => {
    setShownModal(undefined)
  }

  const showModal = (modal: IModal) => {
    setShownModal(modal)
  }

  const modalToRender = shownModal ? getModalComponent(shownModal, closeModal) : undefined;


  const state = {
    showModal,
    closeModal
  }

  return (
    <ModalContext.Provider value={state}>
      {children}
      {modalToRender}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  return useContext(ModalContext) as ModalContextState;
};
