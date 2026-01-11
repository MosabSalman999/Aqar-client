"use client";

import React, { useEffect } from "react";
import { Amplify } from "aws-amplify";

import {
  Authenticator,
  Radio,
  RadioGroupField,
  useAuthenticator,
  View,
} from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { usePathname, useRouter } from "next/navigation";

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID!,
      userPoolClientId: process.env.NEXT_PUBLIC_AWS_COGNITO_APP_CLIENT_ID!,
    },
  },
});

const components = {
  Header() {
    return (
      <View className="mt-4 mb-7 flex flex-col items-center">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-secondary-600 rounded-lg flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-2xl">ع</span>
          </div>
          <div className="flex flex-col">
            <div className="text-2xl font-bold tracking-wider flex items-center gap-2 text-primary-900">
              <span className="english-font">AQAR</span>
              <span className="text-sm text-secondary-600 arabic-font">عقار</span>
            </div>
          </div>
        </div>
        <p className="text-muted-foreground text-center">
          <span className="font-bold text-primary-800">Welcome!</span> Please sign in to continue
        </p>
      </View>
    );
  },
  SignIn: {
    Footer() {
      const { toSignUp } = useAuthenticator();
      return (
        <View className="text-center mt-4">
          <p className="text-muted-foreground">
            Don&apos;t have an account?{" "}
            <button
              onClick={toSignUp}
              className="text-secondary-600 hover:text-secondary-700 hover:underline bg-transparent border-none p-0 font-semibold"
            >
              Sign up here
            </button>
          </p>
        </View>
      );
    },
  },
  SignUp: {
    FormFields() {
      const { validationErrors } = useAuthenticator();

      return (
        <>
          <Authenticator.SignUp.FormFields />
          <RadioGroupField
            legend="Role"
            name="custom:role"
            errorMessage={validationErrors?.["custom:role"]}
            hasError={!!validationErrors?.["custom:role"]}
            isRequired
          >
            <Radio value="tenant">Tenant</Radio>
            <Radio value="manager">Manager</Radio>
          </RadioGroupField>
        </>
      );
    },

    Footer() {
      const { toSignIn } = useAuthenticator();
      return (
        <View className="text-center mt-4">
          <p className="text-muted-foreground">
            Already have an account?{" "}
            <button
              onClick={toSignIn}
              className="text-secondary-600 hover:text-secondary-700 hover:underline bg-transparent border-none p-0 font-semibold"
            >
              Sign in
            </button>
          </p>
        </View>
      );
    },
  },
};

const formFields = {
  signIn: {
    username: {
      placeholder: "Enter your Email",
      label: "Email",
      isRequired: true,
    },
    password: {
      placeholder: "Enter your password",
      label: "Password",
      isRequired: true,
    },
  },
  signUp: {
    username: {
      order: 1,
      placeholder: "Choose a username",
      label: "Username",
      isRequired: true,
    },
    email: {
      order: 2,
      placeholder: "Enter your email",
      label: "Email",
      isRequired: true,
    },
    password: {
      order: 3,
      placeholder: "Create a password",
      label: "Password",
      isRequired: true,
    },
    confirm_password: {
      order: 4,
      placeholder: "Confirm your password",
      label: "Confirm Password",
      isRequired: true,
    },
  },
};


const Auth = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuthenticator((context) => [context.user]);
  const router = useRouter();
  const pathname = usePathname();

  const isAuthPage = pathname.match(/^\/(signin|signup)$/);
  const isDashboardPage =
    pathname.startsWith("/managers") || pathname.startsWith("/tenants");

  // Redirect authenticated users away from auth pages
  useEffect(() => {
    if (user && isAuthPage) {
      router.push("/");
    }
  }, [user, isAuthPage, router]);

  // Allow access to public pages without authentication
  if (!isAuthPage && !isDashboardPage) {
    return <>{children}</>;
  }

  return (
    <div className="h-full flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <style jsx global>{`
        [data-amplify-authenticator] {
          --amplify-components-button-primary-background-color: var(--color-secondary-600);
          --amplify-components-button-primary-hover-background-color: var(--color-secondary-700);
          --amplify-components-button-primary-focus-background-color: var(--color-secondary-700);
          --amplify-components-button-primary-active-background-color: var(--color-secondary-800);
          --amplify-components-tabs-item-active-border-color: var(--color-secondary-600);
          --amplify-components-tabs-item-active-color: var(--color-secondary-600);
          --amplify-components-tabs-item-focus-color: var(--color-secondary-600);
          --amplify-components-tabs-item-hover-color: var(--color-secondary-500);
          --amplify-components-fieldcontrol-focus-border-color: var(--color-secondary-600);
          --amplify-components-authenticator-router-border-width: 0;
          --amplify-components-authenticator-router-box-shadow: 0 10px 40px -10px rgba(0, 0, 0, 0.15);
          --amplify-components-authenticator-container-width-max: 420px;
          --amplify-components-button-link-color: var(--color-secondary-600);
          --amplify-components-button-link-hover-color: var(--color-secondary-700);
        }
        [data-amplify-authenticator] [data-amplify-router] {
          border-radius: 16px;
          padding: 2rem;
          background: white;
        }
      `}</style>
      <Authenticator
        initialState={pathname.includes("signup") ? "signUp" : "signIn"}
        components={components}
        formFields={formFields}
      >
        {() => <>{children}</>}
      </Authenticator>
    </div>
  );
};

export default Auth;
