import React, {
  Suspense,
  useState,
  unstable_useTransition as useTransition
} from "react";

import { wrapPromise } from "./utils";

function fetchTime() {
  return wrapPromise(
    new Promise((resolve) => {
      setTimeout(() => {
        resolve({ time: new Date().toLocaleString() });
      }, 1000);
    })
  );
}

function Clock({ resource }) {
  const { time } = resource.read();
  return <h3>{time}</h3>;
}

function Button({ onClick, children }) {
  const [startTransition, isPending] = useTransition({
    timeoutMs: 2000
  });

  const btnOnClick = () => {
    startTransition(() => {
      onClick();
    });
  };

  return (
    <>
      <button disabled={isPending} onClick={btnOnClick}>
        {children}
      </button>
      <span>{isPending && " loading"}</span>
    </>
  );
}

export default function App() {
  const [time, setTime] = useState(fetchTime());

  const load = () => {
    setTime(fetchTime());
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Button onClick={load}>加载</Button>
      <Clock resource={time} />
    </Suspense>
  );
}
