"use client";

import SettingsForm from "@/components/SettingsForm";
import {
  useGetAuthUserQuery,
  useUpdateTenantSettingsMutation,
} from "@/state/api";
import React from "react";

const TenantSettings = () => {
  const { data: authUser, isLoading, error } = useGetAuthUserQuery();
  console.log("Auth User Data:", authUser);
  const [updateTenant] = useUpdateTenantSettingsMutation();

  if (isLoading) return <>Loading...</>;
  if (error || !authUser || !authUser.userInfo) {
    console.error("Error or missing user data:", { error, authUser });
    return <>Error loading user data</>;
  }

  const initialData = {
    name: authUser.userInfo.name,
    email: authUser.userInfo.email,
    phoneNumber: authUser.userInfo.phoneNumber,
  };

  const handleSubmit = async (data: typeof initialData) => {
    if (!authUser?.cognitoInfo?.userId) return;
    await updateTenant({
      cognitoId: authUser.cognitoInfo.userId,
      ...data,
    });
  };

  return (
    <SettingsForm
      initialData={initialData}
      onSubmit={handleSubmit}
      userType="tenant"
    />
  );
};

export default TenantSettings;
