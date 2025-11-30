import { useEffect, useState } from "react";
import { codeToHtml } from "shiki";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  code: string;
  language?: string;
  className?: string;
}

export function CodeBlock({
  code,
  language = "typescript",
  className,
}: CodeBlockProps) {
  const [html, setHtml] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const highlight = async () => {
      try {
        const highlighted = await codeToHtml(code.trim(), {
          lang: language,
          themes: {
            light: "github-light",
            dark: "slack-dark",
          },
          defaultColor: false,
        });

        if (mounted) {
          setHtml(highlighted);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Failed to highlight code:", error);
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    highlight();

    return () => {
      mounted = false;
    };
  }, [code, language]);

  if (isLoading) {
    return (
      <pre
        className={cn(
          "bg-zinc-900 text-zinc-100 p-4 rounded-lg overflow-x-auto text-sm",
          className
        )}
      >
        <code>{code.trim()}</code>
      </pre>
    );
  }

  return (
    <>
      <style>{`
        .shiki,
        .shiki span {
          color: var(--shiki-light) !important;
          background-color: var(--shiki-light-bg) !important;
          font-style: var(--shiki-light-font-style) !important;
          font-weight: var(--shiki-light-font-weight) !important;
        }
        html.dark .shiki,
        html.dark .shiki span {
          color: var(--shiki-dark) !important;
          background-color: var(--shiki-dark-bg) !important;
          font-style: var(--shiki-dark-font-style) !important;
          font-weight: var(--shiki-dark-font-weight) !important;
        }
      `}</style>
      <div
        className={cn(
          "[&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_pre]:text-sm [&_pre]:border",
          "[&_pre]:bg-zinc-50 [&_pre]:dark:bg-[#1a1a1a]",
          "[&_pre]:border-zinc-200 [&_pre]:dark:border-zinc-800",
          "[&_.shiki_.line]:leading-relaxed",
          className
        )}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </>
  );
}
