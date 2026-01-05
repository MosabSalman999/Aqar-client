"use client";

import StoreProvider from "@/state/redux";
import { Authenticator } from "@aws-amplify/ui-react";
import Auth from "./(auth)/authProvider";
import { ActivityLogPanel } from "@/components/ActivityLog";
import { Toaster } from "sonner";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <StoreProvider>
      <Authenticator.Provider>
        <Auth>
          {children}
          <ActivityLogPanel />
          <Toaster richColors position="top-right" />
        </Auth>
      </Authenticator.Provider>
    </StoreProvider>
  );
};

export default Providers;
