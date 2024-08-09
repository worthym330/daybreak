import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment, useRef } from "react";
import { BsExclamation } from "react-icons/bs";

const ConfirmationModal = (props: any) => {
  const {
    title = "Are you sure?",
    description = "Are you sure you want to remove this item from your cart?",
    confirmationButtonText = "OK",
    open,
    setOpen,
    onDelete,
  } = props;

  const cancelButtonRef = useRef(null);

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto flex items-center justify-center"
        initialFocus={cancelButtonRef}
        onClose={setOpen}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />
        </Transition.Child>

        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          enterTo="opacity-100 translate-y-0 sm:scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 translate-y-0 sm:scale-100"
          leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        >
          <Dialog.Panel className="relative bg-white rounded-lg shadow-xl sm:w-full sm:max-w-xl">
            <div className="p-6 sm:p-12 flex items-center justify-center flex-col">
              <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 mx-auto border-4 border-red-600 rounded-full">
                <BsExclamation
                  className="w-10 h-10 text-red-600"
                  aria-hidden="true"
                />
              </div>
              <div className="mt-6 text-center flex-grow sm:mt-8 ">
                <Dialog.Title
                  as="h3"
                  className="text-4xl font-medium leading-6 text-gray-900"
                >
                  {title}
                </Dialog.Title>
                <div className="mt-4">
                  <p className="text-lg">{description}</p>
                </div>
              </div>
              <div className="mt-6 sm:mt-8 flex gap-2">
                <button
                  type="button"
                  className="inline-flex justify-center w-full px-4 py-2 text-base font-medium text-gray-700 bg-[#ffe8d8] border border-gray-300 rounded-2xl shadow-sm sm:mt-0 sm:w-auto sm:text-lg"
                  onClick={() => {
                    setOpen(false);
                  }}
                  ref={cancelButtonRef}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className={`inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white border border-transparent rounded-2xl shadow-sm  sm:ml-3 sm:w-auto sm:text-lg bg-[#fe6a06] hover:bg-[#fe6a06] focus:ring-red-500`}
                  onClick={() => {
                    setOpen(false);
                    onDelete && onDelete();
                  }}
                >
                  {confirmationButtonText}
                </button>
              </div>
            </div>
          </Dialog.Panel>
        </Transition.Child>
      </Dialog>
    </Transition.Root>
  );
};

export default ConfirmationModal;
