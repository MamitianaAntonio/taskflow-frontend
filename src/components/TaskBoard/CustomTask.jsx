import { faArrowRight, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

export default function CustomTask() {
  const [openPopup, setOpenPopup] = useState(false);

  return (
    <div className="w-full rounded-lg border border-(--border-color) bg-(--color-success)/90 p-4">
      <p className="text-[11px] font-semibold uppercase tracking-widest text-(--text-white) mb-3">
        Add Custom task
      </p>

      <div className="flex items-center justify-between">
        <p className="font-medium text-(--text-white) text-md">
          Ready to plan more complex task
        </p>

        <FontAwesomeIcon
          icon={faArrowRight}
          size="2x"
          className="text-(--text-white) hover:scale-140 animate-bounce transition-all"
          onClick={() => setOpenPopup(true)}
        />

        {openPopup && (
          <>
            <div
              className="fixed inset-0 bg-(--overlay)/40 z-40 transition-all duration-300 ease-in-out"
              onClick={() => setOpenPopup(false)}
            />
            <div
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50
                          bg-(--bg-secondary) rounded-lg p-6 w-[90vw] max-w-md shadow-xl
                          transition-all duration-300 ease-in-out"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg">Custom task</h3>
                <FontAwesomeIcon
                  icon={faX}
                  size="1x"
                  className="cursor-pointer"
                  onClick={() => setOpenPopup(false)}
                />
              </div>
              <p>Popup message</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
