import React from "react";
import { Tailwind } from "@react-email/tailwind";

type ITailwindConfigProps = {
  children?: React.ReactNode;
}

export function TailwindConfig({ children }: ITailwindConfigProps) {
  return (
    <Tailwind config={{
      theme: {
        extend: {
          colors: {
            foodiary: {
              green: '#64a30d',
              gray: {
                600: "#a1a1a1aa"
              }
            }
          }
        }
      }
    }}>{children}</Tailwind>
  )
}
