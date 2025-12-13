import { useEffect } from "react";

interface StaticRedirectProps {
  to: string;
}

export const StaticRedirect = ({ to }: StaticRedirectProps) => {
  useEffect(() => {
    window.location.replace(to);
  }, [to]);

  return null;
};
