import React, { createContext, useContext, useEffect, useState } from "react";

export const stateContext = createContext();

const getFreshContext = () => {
  if (localStorage.getItem("context") === null) {
    localStorage.setItem(
      "context",
      JSON.stringify({
        participantId: 0,
        timeTaken: 0,
        selectedOptions: [],
      })
    );
  }
  return JSON.parse(localStorage.getItem("context"));
};

export default function useStateContext() {
  const { context, setContext } = useContext(stateContext);

  useEffect(() => {
    localStorage.setItem("context", JSON.stringify(context));
  }, [context]);
  return {
    context,
    setContext: (obj) => {
      setContext({ ...context, ...obj });
    },
    resetContext: () => {
      localStorage.removeItem("context");
      setContext(getFreshContext);
    },
  };
}

export function ContextProvider(props) {
  const [context, setContext] = useState(getFreshContext);

  return (
    <stateContext.Provider value={{ context, setContext }}>
      {props.children}
    </stateContext.Provider>
  );
}
