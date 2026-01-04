{/*
import { type JSX } from "react";

export function Card({
  className,
  title,
  children,
  href,
}: {
  className?: string;
  title: string;
  children: React.ReactNode;
  href: string;
}): JSX.Element {
  return (
    <a
      className={className}
      href={`${href}?utm_source=create-turbo&utm_medium=basic&utm_campaign=create-turbo"`}
      rel="noopener noreferrer"
      target="_blank"
    >
      <h2>
        {title} <span>-&gt;</span>
      </h2>
      <p>{children}</p>
    </a>
  );
}
*/}
import React from "react";

interface CardProps {
  className?: string;
  title?: string;
  href?: string;
  children: React.ReactNode;
}

export function Card({ className, title, href, children }: CardProps): React.ReactElement {
  if (title && href) {
    return (
      <a
        className={className}
        href={`${href}?utm_source=create-turbo&utm_medium=basic&utm_campaign=create-turbo`}
        rel="noopener noreferrer"
        target="_blank"
      >
        <h2>{title} <span>-&gt;</span></h2>
        <p>{children}</p>
      </a>
    );
  }

  return <div className={className}>{children}</div>;
}



