import React, { createContext, useContext, useReducer, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";

// Types
type PopupItem = {
  content: React.ReactNode;
  priority: number;
  bypass?: boolean;
};

type PopupState = {
  popupQueue: PopupItem[];
  currentPopup: PopupItem | null;
};

type ShowPopupAction = {
  type: "show_popup";
  popup: PopupItem;
};

type ClosePopupAction = {
  type: "close_popup";
};

type PopupAction = ShowPopupAction | ClosePopupAction;

type PopupContextType = {
  state: PopupState;
  dispatch: React.Dispatch<PopupAction>;
};

function popupReducer(state: PopupState, action: PopupAction): PopupState {
  // Helper: returns a new state with popup taken from queue if appropriate
  function setPopupFromQueue(s: PopupState): PopupState {
    const queue = [...s.popupQueue];
    let current = s.currentPopup;

    // If there is a current popup and there is a queued popup, compare priorities
    if (current?.content && queue.length > 0) {
      const nextPopup = queue[0];
      if (current.priority < nextPopup.priority) {
        // Replace current with next and put current back into queue front
        queue.shift();
        queue.unshift(current);
        current = nextPopup;
      }
    }

    // If there is no current popup, take the first in queue
    if ((!current?.content) && queue.length > 0) {
      current = queue[0];
      queue.shift();
    }

    return {
      ...s,
      popupQueue: queue,
      currentPopup: current ?? null,
    };
  }

  function addPopupToQueue(popup: PopupItem): PopupState {
    let newQueue = [...state.popupQueue];
    let newCurrent = state.currentPopup;

    if (popup.bypass) {
      // show immediately; if there is a current popup, put it back to front of queue
      if (newCurrent?.content) {
        newQueue = [newCurrent, ...newQueue];
      }
      // Treat bypass popup as highest priority shown immediately
      newCurrent = { ...popup, priority: 999 };
    } else {
      // insert popup after the last item with priority <= popup.priority
      let index = -1;
      for (let i = 0; i < newQueue.length; i++) {
        if (newQueue[i].priority > popup.priority) {
          break;
        }
        index = i;
      }
      newQueue.splice(index + 1, 0, popup);
    }

    return setPopupFromQueue({ popupQueue: newQueue, currentPopup: newCurrent });
  }

  function closePopup(): PopupState {
    let newCurrent = state.currentPopup;
    if (newCurrent?.content) {
      newCurrent = null;
    }
    return setPopupFromQueue({ ...state, currentPopup: newCurrent });
  }

  switch (action.type) {
    case "show_popup":
      return addPopupToQueue(action.popup);
    case "close_popup":
      return closePopup();
    default:
      return state;
  }
}

// -- Create Context --
const PopupContext = createContext<PopupContextType | undefined>(undefined);

// -- PopupContext Provider --
export const PopupContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(popupReducer, {
    popupQueue: [],
    currentPopup: null,
  } as PopupState);

  const overlayMouseDownInside = useRef(false);

  const handleOverlayMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement | null;
    if (target?.classList.contains("popup-overlay")) {
      overlayMouseDownInside.current = true;
    } else {
      overlayMouseDownInside.current = false;
    }
  };

  const handleOverlayMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement | null;
    if (overlayMouseDownInside.current && target?.classList.contains("popup-overlay")) {
      dispatch({ type: "close_popup" });
    }
    overlayMouseDownInside.current = false;
  };

  return (
    <PopupContext.Provider value={{ state, dispatch }}>
      <AnimatePresence>
        {state.currentPopup?.content && (
          <div
            onMouseDown={handleOverlayMouseDown}
            onMouseUp={handleOverlayMouseUp}
            className="absolute w-full h-full z-1000 flex items-center justify-center"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              exit={{ opacity: 0 }}
              style={{
                background:
                  "radial-gradient(50% 50% at 50% 50%, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 1) 100%)",
              }}
              className="absolute top-0 left-0 w-full h-full flex items-center justify-center"
            />

            <div className="absolute inset-0 flex items-center justify-center popup-overlay">
              {state.currentPopup?.content}
            </div>
          </div>
        )}
      </AnimatePresence>

      {children}
    </PopupContext.Provider>
  );
};

export function usePopup(): [
  (popup: React.ReactNode, priority?: number, bypass?: boolean) => void,
  (conditionFunction?: (current: PopupItem | null) => boolean) => void
] {
  const ctx = useContext(PopupContext);
  if (!ctx) throw new Error("usePopup must be used within a PopupProvider.");
  const { state, dispatch } = ctx;

  const showPopup = (popup: React.ReactNode, priority = 1, bypass = false) => {
    const item: PopupItem = { content: popup, priority, bypass };
    dispatch({
      type: "show_popup",
      popup: item,
    });
  };

  const closePopup = (conditionFunction?: (current: PopupItem | null) => boolean) => {
    if (conditionFunction && conditionFunction(state.currentPopup)) {
        dispatch({ type: "close_popup" });
    } else {
        dispatch({ type: "close_popup" });
    }
  };

  return [showPopup, closePopup];
}