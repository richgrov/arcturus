// @refresh reload
import { Suspense } from "solid-js";
import { FileRoutes } from "solid-start";
import {
  Body,
  ErrorBoundary,
  Head,
  Html,
  Meta,
  Routes,
  Scripts,
} from "solid-start";
import "./root.css";

export default function Root() {
  return (
    <Html lang="en" class="h-full">
      <Head>
        <Meta charset="utf-8" />
        <Meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Body class="h-full text-foreground dark:text-foreground-dark bg-background dark:bg-background-dark">
        <Suspense>
          <ErrorBoundary>
            <Routes>
              <FileRoutes />
            </Routes>
          </ErrorBoundary>
        </Suspense>
        <Scripts />
      </Body>
    </Html>
  );
}
